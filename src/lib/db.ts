
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PortfolioItem } from '@/components/landing/Portfolio';
import type { Client } from '@/app/admin/clients/page';
import type { Project } from '@/app/admin/projects/page';
import type { Task } from '@/app/admin/tasks/page';

export async function getPortfolioItems(supabase: SupabaseClient): Promise<PortfolioItem[]> {
    const { data, error } = await supabase.from('portfolio_items').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching portfolio items:', error);
        return [];
    }
    return data as PortfolioItem[];
}

export async function getPortfolioItemBySlug(supabase: SupabaseClient, slug: string): Promise<PortfolioItem | null> {
    const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error) {
        console.error(`Error fetching portfolio item with slug ${slug}:`, error);
        return null;
    }
    return data as PortfolioItem;
}

export async function getPortfolioCategories(supabase: SupabaseClient) {
    const { data, error } = await supabase.from('portfolio_categories').select('*');
    if (error) {
        console.error('Error fetching portfolio categories:', error);
        return [];
    }
    return data;
}

export async function getPageContent(supabase: SupabaseClient, section: string) {
    const { data, error } = await supabase.from('page_content').select('content').eq('section', section).single();
    if (error) {
        console.error(`Error fetching page content for section ${section}:`, error);
        return null;
    }
    return data?.content || null;
}

export async function getTestimonials(supabase: SupabaseClient) {
    const { data, error } = await supabase.from('testimonials').select('*');
    if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
    return data;
}

export async function getClients(supabase: SupabaseClient): Promise<Client[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase.from('clients').select('*').eq('user_id', user.id);
    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    return data as Client[];
}

export async function getProjects(supabase: SupabaseClient): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', user.id);
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data as Project[];
}

export async function getTasks(supabase: SupabaseClient): Promise<Task[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
    return data as Task[];
}

export async function getDashboardData(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            activeProjectsCount: 0,
            pendingTasksCount: 0,
            newClientsCount: 0,
            overdueTasksCount: 0,
            upcomingDeadlines: [],
            activeProjects: [],
            recentClients: [],
        };
    }
    
    const [
        projectsRes,
        tasksRes,
        clientsRes,
    ] = await Promise.all([
        supabase.from('projects').select('*, client:clients(name, avatar)', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('tasks').select('*, project:projects(title)', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('clients').select('*, projects(*)', { count: 'exact' }).eq('user_id', user.id),
    ]);

    const activeProjects = (projectsRes.data || []).filter(p => p.status === 'in-progress');
    const pendingTasks = (tasksRes.data || []).filter(t => t.status !== 'done');
    const newClients = (clientsRes.data || []).filter(c => c.status === 'new');
    const overdueTasks = pendingTasks.filter(t => t.due_date && new Date(t.due_date) < new Date());

    return {
        activeProjectsCount: activeProjects.length,
        pendingTasksCount: pendingTasks.length,
        newClientsCount: newClients.length,
        overdueTasksCount: overdueTasks.length,
        upcomingDeadlines: tasksRes.data
            ?.filter(t => t.due_date && new Date(t.due_date) > new Date())
            .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
            .slice(0, 3)
            .map(t => ({...t, projectTitle: t.project?.title })) || [],
        activeProjects: activeProjects.slice(0, 3),
        recentClients: clientsRes.data?.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0,3) || [],
    };
}


export async function getNotifications(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
    return data;
}

export async function markNotificationsAsRead(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    
    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/admin');
    return { success: true };
}

export async function getReportsData(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
        const [
            totalBilledRes,
            projectsRes,
            clientsRes,
            tasksRes,
            incomeDataRes,
            workloadDataRes,
            clientLeaderboardRes
        ] = await Promise.all([
            supabase.rpc('get_total_billed', { p_user_id: user.id }),
            supabase.from('projects').select('status', { count: 'exact' }).eq('user_id', user.id),
            supabase.from('clients').select('id', { count: 'exact' }).eq('user_id', user.id),
            supabase.from('tasks').select('priority', { count: 'exact' }).eq('user_id', user.id),
            supabase.rpc('get_monthly_income', { p_user_id: user.id }),
            supabase.rpc('get_workload_by_category', { p_user_id: user.id }),
            supabase.rpc('get_client_leaderboard', { p_user_id: user.id })
        ]);

        const a = (res: any) => { if(res.error) throw res.error; return res.data };
        const totalBilled = a(totalBilledRes);
        const projects = a(projectsRes);
        const clients = a(clientsRes);
        const tasks = a(tasksRes);
        const incomeData = a(incomeDataRes);
        const workloadData = a(workloadDataRes);
        const clientLeaderboard = a(clientLeaderboardRes);

        const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
        const activeProjectsCount = projects.filter(p => p.status === 'in-progress').length;

        const projectStatusData = [
            { name: 'Completed', value: completedProjectsCount },
            { name: 'In Progress', value: activeProjectsCount },
            { name: 'Planning', value: projects.filter(p => p.status === 'planning').length }
        ];

        const taskPriorityData = [
            { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
            { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
            { name: 'Low', value: tasks.filter(t => t.priority === 'low').length }
        ];

        return {
            totalBilled,
            completedProjectsCount,
            totalClientsCount: clients.length,
            activeProjectsCount,
            incomeData,
            workloadData,
            clientLeaderboard,
            projectStatusData,
            taskPriorityData
        };
    } catch (error) {
        console.error('Failed to get reports data:', error);
        return null;
    }
}

import { createServerClient } from './supabase/server';
import type { PortfolioItem } from '@/components/landing/Portfolio';
import type { Client } from '@/app/admin/clients/page';
import type { Project } from '@/app/admin/projects/page';
import type { Task } from '@/app/admin/tasks/page';

// The createServerClient can be used in Server Components, Server Actions, and Route Handlers.
// It is not meant for Client Components.

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('portfolio_items').select('*');
    if (error) {
        console.error('Error fetching portfolio items:', error);
        return [];
    }
    return data as PortfolioItem[];
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
    const supabase = createServerClient();
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

export async function getPortfolioCategories() {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('portfolio_categories').select('*');
    if (error) {
        console.error('Error fetching portfolio categories:', error);
        return [];
    }
    return data;
}

export async function getPageContent(section: string) {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('page_content').select('content').eq('section', section).single();
    if (error) {
        console.error(`Error fetching page content for section ${section}:`, error);
        return null;
    }
    return data?.content || null;
}

export async function getTestimonials() {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('testimonials').select('*');
    if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
    return data;
}

export async function getClients(): Promise<Client[]> {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase.from('clients').select('*').eq('user_id', user.id);
    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    return data as Client[];
}

export async function getProjects(): Promise<Project[]> {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', user.id);
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data as Project[];
}

export async function getTasks(): Promise<Task[]> {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
    return data as Task[];
}

export async function getDashboardData() {
    const supabase = createServerClient();
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
        supabase.from('tasks').select('*', { count: 'exact' }).eq('user_id', user.id),
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
            .slice(0, 3) || [],
        activeProjects: activeProjects.slice(0, 3),
        recentClients: clientsRes.data?.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0,3) || [],
    };
}

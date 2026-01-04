

'use server'

import { createServerClient } from './supabase/server';
import { createAdminClient } from './supabase/admin';
import { subMonths, startOfToday } from 'date-fns';

// This is a server-only file. It uses the server client for Supabase.

// --- Notifications ---
export async function createNotification(notification: { user_id: string; type: string; title: string; description: string; link: string; }) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase.from('notifications').insert(notification);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Failed to create notification:', error);
        return { success: false };
    }
}

export async function getNotifications(userId: string) {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Failed to get notifications:', error);
        return [];
    }
}

export async function markNotificationsAsRead(notificationIds: number[]) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .in('id', notificationIds);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Failed to mark notifications as read:', error);
        return { success: false, error: error.message };
    }
}


// --- Portfolio Categories ---
export async function getPortfolioCategories() {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase
            .from('portfolio_categories')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Failed to get portfolio categories:", error);
        return [];
    }
}

export async function addPortfolioCategory(name: string) {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase
            .from('portfolio_categories')
            .insert({ name })
            .select('id')
            .single();
        if (error) throw error;
        return { success: true, id: data.id };
    } catch (error: any) {
        console.error('Failed to add portfolio category:', error);
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

export async function deletePortfolioCategory(id: number) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase.from('portfolio_categories').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to delete portfolio category ${id}:`, error);
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

// --- Generic Page Content ---
export async function getPageContent(section: string) {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase
            .from('page_content')
            .select('content')
            .eq('section', section)
            .single();
        if (error) return null; // Section might not exist yet, which is fine
        return data.content;
    } catch (error) {
        console.error(`Failed to get page content for section "${section}":`, error);
        return null;
    }
}

export async function updatePageContent(section: string, content: any) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase
            .from('page_content')
            .upsert({ section, content }, { onConflict: 'section' });
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to update page content for section "${section}":`, error);
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

// --- Testimonials ---
export async function getTestimonials() {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('testimonials').select('*');
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Failed to get testimonials:", error);
        return [];
    }
}

export async function updateTestimonial(id: number, testimonialData: any) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase
            .from('testimonials')
            .update({
                name: testimonialData.name,
                company: testimonialData.company,
                feedback: testimonialData.feedback
            })
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to update testimonial ${id}:`, error);
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

export async function addTestimonial(testimonialData: any) {
    const supabase = createServerClient();
     try {
        const { data, error } = await supabase
            .from('testimonials')
            .insert(testimonialData)
            .select('id')
            .single();
        if (error) throw error;
        return { success: true, id: data.id };
    } catch (error: any) {
        console.error('Failed to add testimonial:', error);
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

export async function removeTestimonial(id: number) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to remove testimonial ${id}:`, error);
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

// --- File Upload ---
export async function uploadFile(file: File, bucket = 'portfolio-assets') {
    const supabaseAdmin = createAdminClient();
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    try {
        const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(filename, file);
        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            throw new Error(`Supabase upload error: ${uploadError.message}`);
        }
        const { data } = createServerClient().storage.from(bucket).getPublicUrl(filename);
        return { path: data.publicUrl };
    } catch (error: any) {
        console.error("File upload failed:", error);
        return { error: error.message || 'File upload failed' };
    }
}

// --- Portfolio Items ---
export async function getPortfolioItems() {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('portfolio_items').select('*');
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Failed to get portfolio items:", error);
        return [];
    }
}

export async function getPortfolioItemBySlug(slug: string) {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error) return null;
        return data;
    } catch (error) {
        console.error(`Failed to get portfolio item with slug ${slug}:`, error);
        return null;
    }
}

export async function addPortfolioItem(values: any) {
    const supabase = createServerClient();
    try {
        const imageFile = values.imageFile as File;
        const screenshotFiles = values.screenshotFiles ? Array.from(values.screenshotFiles as FileList) : [];

        const imageResult = await uploadFile(imageFile, 'portfolio-assets');
        if (imageResult.error) throw new Error(`Main image upload failed: ${imageResult.error}`);
        const imageUrl = imageResult.path;

        const screenshotUrls = await Promise.all(
            screenshotFiles.map(async (file) => {
                const result = await uploadFile(file, 'portfolio-assets');
                if (result.error) throw new Error(`Screenshot upload failed: ${result.error}`);
                return result.path;
            })
        );
        
        const tags = values.tags.split(',').map((t:string) => t.trim());

        const { data, error } = await supabase
            .from('portfolio_items')
            .insert({
                title: values.title,
                slug: values.slug,
                description: values.description,
                fullDescription: values.fullDescription,
                image: imageUrl,
                link: values.link,
                category: values.category,
                tags: tags,
                screenshots: screenshotUrls,
                hint: ''
            })
            .select('id')
            .single();

        if (error) throw error;
        return { success: true, id: data.id };
    } catch (error: any) {
        console.error('Failed to add portfolio item:', error);
        if (error.message.includes('duplicate key value violates unique constraint "portfolio_items_slug_key"')) {
            return { success: false, error: 'This slug is already in use. Please choose a unique one.' };
        }
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

export async function updatePortfolioItem(id: number, values: any) {
    const supabase = createServerClient();
    try {
        const { data: currentData, error: fetchError } = await supabase
            .from('portfolio_items')
            .select('image, screenshots')
            .eq('id', id)
            .single();
        if (fetchError) throw fetchError;
        
        let imageUrl = currentData?.image;
        if (values.imageFile && values.imageFile.size > 0) {
            const imageResult = await uploadFile(values.imageFile as File, 'portfolio-assets');
            if (imageResult.error) throw new Error(`Main image upload failed: ${imageResult.error}`);
            imageUrl = imageResult.path;
        }

        let existingScreenshots = currentData?.screenshots || [];
        if (values.removedScreenshots && values.removedScreenshots.length > 0) {
            existingScreenshots = existingScreenshots.filter((s: string) => !values.removedScreenshots.includes(s));
        }

        if (values.screenshotFiles && (values.screenshotFiles as FileList).length > 0) {
            const newScreenshotUrls = await Promise.all(
                Array.from(values.screenshotFiles as FileList).map(async (file) => {
                    const result = await uploadFile(file, 'portfolio-assets');
                    if (result.error) throw new Error(`Screenshot upload failed: ${result.error}`);
                    return result.path;
                })
            );
            existingScreenshots = [...existingScreenshots, ...newScreenshotUrls];
        }
        
        const tags = values.tags.split(',').map((t: string) => t.trim());

        const { error } = await supabase
            .from('portfolio_items')
            .update({
                title: values.title,
                slug: values.slug,
                description: values.description,
                fullDescription: values.fullDescription,
                image: imageUrl,
                link: values.link,
                category: values.category,
                tags: tags,
                screenshots: existingScreenshots,
            })
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to update portfolio item ${id}:`, error);
        if (error.message.includes('duplicate key value violates unique constraint "portfolio_items_slug_key"')) {
            return { success: false, error: 'This slug is already in use. Please choose a unique one.' };
        }
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

export async function deletePortfolioItem(id: number) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to delete portfolio item ${id}:`, error);
        return { success: false, error: error.message || 'Database operation failed' };
    }
}

// --- Clients ---
export async function getClients() {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('clients').select('*').order('name', { ascending: true });
        if(error) throw error;
        return data || [];
    } catch (e) {
        console.error("Failed to get clients", e);
        return [];
    }
}

export async function addClient(formData: FormData, userId: string) {
    const supabase = createServerClient();
    const client = Object.fromEntries(formData.entries());
    try {
        const { data, error } = await supabase
            .from('clients')
            .insert({
                user_id: userId,
                name: client.name,
                email: client.email,
                avatar: `https://picsum.photos/seed/${encodeURIComponent(client.name as string)}/100/100`,
                status: client.status,
                company: client.company,
                phone: client.phone,
                address: client.address,
                notes: client.notes
            })
            .select('id')
            .single();

        if (error) throw error;

        await createNotification({
            user_id: userId,
            type: 'client',
            title: 'New Client Added',
            description: `You've added a new client: ${client.name}.`,
            link: `/admin/workspace/clients`
        });

        return { success: true, id: data.id };
    } catch (e: any) {
        console.error("Failed to add client", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

export async function updateClient(id: string, formData: FormData) {
    const supabase = createServerClient();
    const client = Object.fromEntries(formData.entries());
    try {
        const { error } = await supabase
            .from('clients')
            .update({
                name: client.name,
                email: client.email,
                status: client.status,
                company: client.company,
                phone: client.phone,
                address: client.address,
                notes: client.notes
            })
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to update client", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

export async function deleteClient(id: string) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete client", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

// --- Tasks ---
export async function getTasks() {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('tasks').select('*');
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Failed to get tasks", e);
        return [];
    }
}

export async function getTaskById(id: string) {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
        if(error) return null;
        return data;
    } catch (e) {
        console.error(`Failed to get task ${id}`, e);
        return null;
    }
}

export async function addTask(formData: FormData, userId: string) {
    const supabase = createServerClient();
    const task = Object.fromEntries(formData.entries());
    try {
        const tags = task.tags ? (task.tags as string).split(',').map((t: string) => t.trim()) : [];
        const client_id = task.client_id === 'none' || !task.client_id ? null : task.client_id;
        
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                user_id: userId,
                title: task.title,
                description: task.description,
                status: 'todo',
                priority: task.priority,
                due_date: task.due_date || null,
                client_id: client_id,
                tags: tags
            })
            .select('id')
            .single();

        if (error) throw error;
        return { success: true, id: data.id };
    } catch (e: any) {
        console.error("Failed to add task", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

export async function updateTask(id: string, values: { [key: string]: any }) {
    const supabase = createServerClient();
    try {
        const fieldsToUpdate: {[key: string]: any} = { ...values };
        if (fieldsToUpdate.tags && typeof fieldsToUpdate.tags === 'string') {
            fieldsToUpdate.tags = fieldsToUpdate.tags.split(',').map((t: string) => t.trim());
        }
        if (values.client_id === 'none') {
            fieldsToUpdate.client_id = null;
        }

        const { error } = await supabase.from('tasks').update(fieldsToUpdate).eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to update task", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}


export async function deleteTask(id: string) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete task", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

// --- Projects ---
export async function getProjects() {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Failed to get projects", e);
        return [];
    }
}

export async function addProject(values: any, userId: string) {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert({
                user_id: userId,
                title: values.title,
                description: values.description,
                status: 'planning',
                client_id: values.client_id,
                budget: values.budget,
                start_date: values.startDate.toISOString(),
                end_date: values.endDate.toISOString()
            })
            .select('id')
            .single();
        
        if(error) throw error;

        await createNotification({
            user_id: userId,
            type: 'project',
            title: 'New Project Started',
            description: `You've added a new project: ${values.title}.`,
            link: `/admin/workspace/projects`
        });

        return { success: true, id: data.id };
    } catch(e: any) {
        console.error("Failed to add project", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

export async function updateProject(id: number, values: any) {
    const supabase = createServerClient();
    try {
        const fieldsToUpdate: {[key: string]: any} = { ...values };

        if (fieldsToUpdate.startDate && fieldsToUpdate.startDate instanceof Date) {
            fieldsToUpdate.start_date = fieldsToUpdate.startDate.toISOString();
            delete fieldsToUpdate.startDate;
        }
         if (fieldsToUpdate.endDate && fieldsToUpdate.endDate instanceof Date) {
            fieldsToUpdate.end_date = fieldsToUpdate.endDate.toISOString();
            delete fieldsToUpdate.endDate;
        }

        const { error } = await supabase.from('projects').update(fieldsToUpdate).eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to update project", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

export async function deleteProject(id: number) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete project", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

// Meetings
export async function getMeetings() {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('meetings').select('*');
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Failed to get meetings", e);
        return [];
    }
}
export async function addMeeting(values: any) {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase
            .from('meetings')
            .insert({
                title: values.title,
                time: values.time.toISOString(),
                duration: values.duration,
                meetLink: `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`,
                client_id: values.client_id
            })
            .select('id')
            .single();
        
        if (error) throw error;
        return { success: true, id: data.id };
    } catch (e: any) {
        console.error("Failed to add meeting", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

export async function updateMeeting(id: number, values: any) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase
            .from('meetings')
            .update({
                title: values.title,
                time: values.time.toISOString(),
                client_id: values.client_id
            })
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to update meeting", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

export async function deleteMeeting(id: number) {
    const supabase = createServerClient();
    try {
        const { error } = await supabase.from('meetings').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete meeting", e);
        return { success: false, error: e.message || 'Database operation failed.' };
    }
}

// Dashboard and Reports
export async function getDashboardData() {
    const supabase = createServerClient();
    try {
        const today = startOfToday().toISOString();
        
        const { count: activeProjectsCount, error: activeProjectsError } = await supabase.from('projects').select('*', { count: 'exact', head: true }).neq('status', 'completed');
        const { count: pendingTasksCount, error: pendingTasksError } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).neq('status', 'done');
        const { count: newClientsCount, error: newClientsError } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'new');
        const { count: overdueTasksCount, error: overdueTasksError } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).lt('due_date', today).neq('status', 'done');
        
        if (activeProjectsError || pendingTasksError || newClientsError || overdueTasksError) {
            console.error({activeProjectsError, pendingTasksError, newClientsError, overdueTasksError});
            throw new Error('Failed to fetch counts');
        }

        const { data: upcomingDeadlines, error: deadlinesError } = await supabase
            .from('tasks')
            .select('id, title, due_date, projects(title)')
            .gte('due_date', today)
            .neq('status', 'done')
            .order('due_date', { ascending: true })
            .limit(5);

        const { data: activeProjects, error: projectsError } = await supabase
            .from('projects')
            .select('id, title, start_date, end_date, clients(id, name, company, avatar)')
            .eq('status', 'in-progress')
            .order('end_date', { ascending: true })
            .limit(5);
        
        const { data: recentClients, error: clientsError } = await supabase.from('clients').select('*').order('id', { ascending: false }).limit(5);
        
        if (deadlinesError || projectsError || clientsError) {
            console.error({deadlinesError, projectsError, clientsError});
            throw new Error('Failed to fetch list data');
        }

        return {
            activeProjectsCount: activeProjectsCount || 0,
            pendingTasksCount: pendingTasksCount || 0,
            newClientsCount: newClientsCount || 0,
            overdueTasksCount: overdueTasksCount || 0,
            upcomingDeadlines: (upcomingDeadlines || []).map((t: any) => ({...t, projectTitle: t.projects?.title})),
            activeProjects: (activeProjects || []).map((p: any) => ({...p, client: p.clients})),
            recentClients: recentClients || [],
        };
    } catch (error) {
        console.error("Failed to get dashboard data:", error);
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
}


export async function getReportsData() {
    const supabase = createServerClient();
    try {
        const { data: totalBilledData, error: totalBilledError } = await supabase.from('projects').select('budget').eq('status', 'completed');
        const { count: completedProjectsCount, error: completedProjectsError } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'completed');
        const { count: totalClientsCount, error: totalClientsError } = await supabase.from('clients').select('*', { count: 'exact', head: true });
        const { count: activeProjectsCount, error: activeProjectsError } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'in-progress');
        
        const sixMonthsAgo = subMonths(new Date(), 5);
        const { data: incomeDataRaw, error: incomeError } = await supabase
            .from('projects')
            .select('end_date, budget')
            .eq('status', 'completed')
            .gte('end_date', sixMonthsAgo.toISOString().slice(0, 7) + '-01');

        if (totalBilledError || completedProjectsError || totalClientsError || activeProjectsError || incomeError) {
            console.error({totalBilledError, completedProjectsError, totalClientsError, activeProjectsError, incomeError});
            throw new Error('Failed to fetch report data');
        }
        
        const totalBilled = totalBilledData?.reduce((sum, p) => sum + p.budget, 0) || 0;

        const monthlyIncome: {[key: string]: number} = {};
        (incomeDataRaw || []).forEach(d => {
            const month = d.end_date.slice(0, 7);
            monthlyIncome[month] = (monthlyIncome[month] || 0) + d.budget;
        });

        const incomeData = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const monthStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthName = date.toLocaleString('default', { month: 'short' });
            incomeData.push({ name: monthName, income: monthlyIncome[monthStr] || 0 });
        }
        
        const { data: workloadDataRaw, error: workloadError } = await supabase.from('portfolio_items').select('category');
        if(workloadError) throw workloadError;

        const workloadCounts = (workloadDataRaw || []).reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});
        
        const workloadData = [
            { name: 'Web', value: workloadCounts['Web'] || 0, fill: 'var(--chart-1)' },
            { name: 'Mobile', value: workloadCounts['Mobile'] || 0, fill: 'var(--chart-2)' },
            { name: 'Design', value: workloadCounts['Design'] || 0, fill: 'var(--chart-3)' },
        ];
        
        const { data: clientLeaderboard, error: leaderboardError } = await supabase
            .rpc('get_top_clients_by_value')
            .limit(5);

        if(leaderboardError) throw leaderboardError;


        return {
            totalBilled,
            completedProjectsCount: completedProjectsCount || 0,
            totalClientsCount: totalClientsCount || 0,
            activeProjectsCount: activeProjectsCount || 0,
            incomeData,
            workloadData,
            clientLeaderboard: (clientLeaderboard as any[] || []).map(c => ({id: c.client_id, name: c.client_name, company: c.client_company, totalValue: c.total_value})),
        };
    } catch (error) {
        console.error("Failed to get reports data:", error);
        return {
            totalBilled: 0,
            completedProjectsCount: 0,
            totalClientsCount: 0,
            activeProjectsCount: 0,
            incomeData: [],
            workloadData: [],
            clientLeaderboard: [],
        };
    }
}



'use server';

import {
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  updatePageContent,
  addTestimonial,
  updateTestimonial,
  removeTestimonial,
  uploadFile,
  addClient,
  updateClient,
  deleteClient,
  addTask,
  updateTask,
  deleteTask,
  addProject,
  updateProject,
  deleteProject,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  addPortfolioCategory,
  deletePortfolioCategory,
  markNotificationsAsRead,
} from './db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { createServerClient } from './supabase/server';
import { createAdminClient } from './supabase/admin';

const checkAuth = async () => {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('You must be logged in to perform this action.');
    }
    return user;
};


export async function handleAddWork(values: any) {
    await checkAuth();
    const result = await addPortfolioItem(values);
    if(result.success) {
        revalidatePath('/admin/portfolio/projects');
        revalidatePath('/');
        revalidatePath('/projects', 'layout');
    }
    return result;
}

export async function handleEditWork(id: number, values: any) {
    await checkAuth();
    const result = await updatePortfolioItem(id, values);
     if(result.success) {
        revalidatePath('/admin/portfolio/projects');
        revalidatePath('/');
        revalidatePath('/projects', 'layout');
    }
    return result;
}

export async function handleDeleteWork(id: number) {
    await checkAuth();
    const result = await deletePortfolioItem(id);
     if(result.success) {
        revalidatePath('/admin/portfolio/projects');
        revalidatePath('/');
        revalidatePath('/projects', 'layout');
    }
    return result;
}

export async function handlePageContentSave(section: string, formData: FormData) {
    await checkAuth();
    let content: any;

    if (section === 'about') {
        const avatarFile = formData.get('avatar') as File;
        let avatarUrl = formData.get('currentAvatar') as string;

        if (avatarFile && avatarFile.size > 0) {
            const result = await uploadFile(avatarFile, 'portfolio-assets');
            if (result.path) {
                avatarUrl = result.path;
            } else {
                return { success: false, error: result.error || 'File upload failed' };
            }
        }
        
        const skillsValue = formData.get('skills') as string | null;

        content = {
            title: formData.get('title'),
            description: formData.get('description'),
            skills: skillsValue ? skillsValue.split(',').map(s => s.trim()) : [],
            avatar: avatarUrl
        };
    } else {
       content = Object.fromEntries(formData.entries());
    }
    
    const result = await updatePageContent(section, content);
    if(result.success) {
        revalidatePath('/admin/portfolio/page-content');
        revalidatePath('/');
    }
    return result;
}

export async function handleProfileUpdate(prevState: any, formData: FormData) {
    const user = await checkAuth();
    
    const avatarFile = formData.get('avatar') as File;
    let avatarUrl = formData.get('currentAvatar') as string;

    if (avatarFile && avatarFile.size > 0) {
        const result = await uploadFile(avatarFile, 'portfolio-assets');
        if (result.path) {
            avatarUrl = result.path;
        } else {
            return { success: false, message: result.error || 'File upload failed' };
        }
    }
    
    const supabaseAdmin = createAdminClient();
    const { data: updatedUser, error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: { 
            full_name: formData.get('name'),
            avatar_url: avatarUrl,
            title: formData.get('title'),
            bio: formData.get('bio'),
          }
        }
    );

    if(metadataError) {
        console.error('Error updating user metadata:', metadataError);
        return { success: false, message: 'Failed to update profile metadata.' };
    }

    revalidatePath('/admin/core/settings');
    revalidatePath('/admin/layout');
    revalidatePath('/admin');
    return { success: true, message: 'Profile updated successfully!' };
}

export async function handleTestimonialSave(id: number, formData: FormData) {
    await checkAuth();
    const data = Object.fromEntries(formData.entries());
    const result = await updateTestimonial(id, data);
     if(result.success) {
        revalidatePath('/admin/portfolio/page-content');
        revalidatePath('/');
    }
    return result;
}

export async function handleAddTestimonial() {
    await checkAuth();
    const newTestimonial = { 
        name: 'New Testimonial', 
        company: 'Company', 
        feedback: 'Enter feedback here.', 
        avatar: `https://picsum.photos/seed/${Math.random()}/100/100` 
    };
    const result = await addTestimonial(newTestimonial);
    if(result.success) {
        revalidatePath('/admin/portfolio/page-content');
        revalidatePath('/');
    }
    return result;
}

export async function handleRemoveTestimonial(id: number) {
    await checkAuth();
    const result = await removeTestimonial(id);
    if(result.success) {
        revalidatePath('/admin/portfolio/page-content');
        revalidatePath('/');
    }
    return result;
}

export async function handleContactForm(prevState: any, formData: FormData) {
    console.log('Contact form submitted with:', Object.fromEntries(formData.entries()));
    // This is a placeholder. In a real app, you would use a service like Resend or Nodemailer
    return { success: true, message: "Thanks for reaching out. I'll get back to you soon." };
}


// Client Actions
export async function handleAddClient(formData: FormData) {
    const user = await checkAuth();
    const result = await addClient(formData, user.id);
    if (result.success) {
        revalidatePath('/admin/workspace/clients');
        revalidatePath('/admin/layout');
    }
    return result;
}

export async function handleUpdateClient(id: string, formData: FormData) {
    await checkAuth();
    const result = await updateClient(id, formData);
    if (result.success) {
        revalidatePath('/admin/workspace/clients');
    }
    return result;
}

export async function handleDeleteClient(id: string) {
    await checkAuth();
    const result = await deleteClient(id);
    if (result.success) {
        revalidatePath('/admin/workspace/clients');
    }
    return result;
}


// Task Actions
export async function handleAddTask(formData: FormData) {
    const user = await checkAuth();
    const result = await addTask(formData, user.id);
    if (result.success) {
        revalidatePath('/admin/workspace/tasks');
    }
    return result;
}

export async function handleUpdateTask(id: string, formData: FormData | { [key: string]: any }) {
    await checkAuth();
    const values = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;
    
    if (values.client_id === 'none') {
        values.client_id = null;
    }
    
    const result = await updateTask(id, values);
    if (result.success) {
        revalidatePath('/admin/workspace/tasks');
    }
    return result;
}


export async function handleDeleteTask(id: string) {
    await checkAuth();
    const result = await deleteTask(id);
    if (result.success) {
        revalidatePath('/admin/workspace/tasks');
    }
    return result;
}


// Portfolio Category Actions
export async function handleAddPortfolioCategory(formData: FormData) {
    await checkAuth();
    const name = formData.get('name') as string;
    if (!name || name.trim() === '') {
        return { success: false, error: 'Category name cannot be empty.' };
    }
    const result = await addPortfolioCategory(name);
    if (result.success) {
        revalidatePath('/admin/core/settings');
    }
    return result;
}

export async function handleDeletePortfolioCategory(id: number) {
    await checkAuth();
    const result = await deletePortfolioCategory(id);
    if (result.success) {
        revalidatePath('/admin/core/settings');
    }
    return result;
}

// Project Actions
export async function handleAddProject(values: any) {
    const user = await checkAuth();
    const result = await addProject(values, user.id);
    if (result.success) {
        revalidatePath('/admin/workspace/projects');
        revalidatePath('/admin/layout');
    }
    return result;
}

export async function handleUpdateProject(id: number, values: any) {
    await checkAuth();
    const result = await updateProject(id, values);
    if (result.success) {
        revalidatePath('/admin/workspace/projects');
    }
    return result;
}

export async function handleDeleteProject(id: number) {
    await checkAuth();
    const result = await deleteProject(id);
    if (result.success) {
        revalidatePath('/admin/workspace/projects');
    }
    return result;
}

// Meeting Actions
export async function handleAddMeeting(values: any) {
    await checkAuth();
    const result = await addMeeting(values);
    if (result.success) {
        revalidatePath('/admin/workspace/meeting-room');
    }
    return result;
}

export async function handleUpdateMeeting(id: number, values: any) {
    await checkAuth();
    const result = await updateMeeting(id, values);
    if (result.success) {
        revalidatePath('/admin/workspace/meeting-room');
    }
    return result;
}

export async function handleDeleteMeeting(id: number) {
    await checkAuth();
    const result = await deleteMeeting(id);
    if (result.success) {
        revalidatePath('/admin/workspace/meeting-room');
    }
    return result;
}


export async function testSupabaseConnection(url: string, key: string) {
    await checkAuth();
    try {
        if (!url || !key) {
            throw new Error('Supabase URL and Anon Key are required.');
        }

        const supabase = createClient(url, key, {
            auth: {
                persistSession: false
            }
        });
        
        const { error } = await supabase.from('clients').select('*').limit(1);
        
        if (error && error.message.includes("failed to fetch")) {
            throw new Error(`Connection failed. Is the URL correct and the server reachable? Details: ${error.message}`);
        }
        
        if (error && error.message.includes('invalid JWT')) {
            throw new Error(`Connection failed: Invalid Anon Key. Please check your key.`);
        }

        if(error) {
             throw new Error(`Connection test returned an error: ${error.message}`);
        }

        return { success: true };

    } catch (error: any) {
        console.error('Supabase connection test error:', error);
        return { success: false, error: error.message || 'An unknown error occurred.' };
    }
}

export async function login(formData: FormData) {
    const supabase = createServerClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login error:', error);
        return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/admin');
}

export async function logout() {
    const supabase = createServerClient();
    await supabase.auth.signOut();
    return redirect('/login');
}

export async function handleMarkNotificationsAsRead(notificationIds: number[]) {
    await checkAuth();
    const result = await markNotificationsAsRead(notificationIds);
    if (result.success) {
        revalidatePath('/admin/layout');
    }
    return result;
}

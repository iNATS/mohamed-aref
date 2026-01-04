
'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Project } from '@/app/admin/projects/page';
import type { Client } from '@/app/admin/clients/page';
import type { Task } from '@/app/admin/tasks/page';
import { cookies } from 'next/headers';
import { createAdminClient } from './supabase/admin';

export async function handleContactForm(prevState: any, formData: FormData) {
    await new Promise(res => setTimeout(res, 1000));
    console.log('Contact form submitted with:', Object.fromEntries(formData.entries()));
    // This is a placeholder. In a real app, you would integrate with an email service.
    return { success: true, message: "Thanks for reaching out. I'll get back to you soon." };
}

export async function login(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?message=${encodeURIComponent('Invalid email or password')}`);
  }
  
  redirect('/admin');
}

export async function logout() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  await supabase.auth.signOut();
  return redirect('/login');
}


export async function handleAddProject(values: Omit<Project, 'id'>) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase.from('projects').insert([
        { ...values, status: 'planning', user_id: user.id }
    ]);

    if (error) {
        console.error('Error adding project:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects');
    return { success: true };
}

export async function handleUpdateProject(id: number, values: Partial<Omit<Project, 'id' | 'user_id'>>) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase.from('projects')
        .update(values)
        .eq('id', id)
        .eq('user_id', user.id);
    
    if (error) {
        console.error('Error updating project:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    return { success: true };
}

export async function handleDeleteProject(id: number) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };
    
    const { error } = await supabase.from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting project:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    return { success: true };
}

export async function handleAddClient(values: Omit<Client, 'id' | 'user_id'>) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase.from('clients').insert([
        { ...values, user_id: user.id }
    ]);
    if (error) { return { success: false, error: error.message }; }
    revalidatePath('/admin/clients');
    return { success: true };
}

export async function handleUpdateClient(id: string, values: Partial<Omit<Client, 'id' | 'user_id'>>) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase.from('clients')
        .update(values)
        .eq('id', id)
        .eq('user_id', user.id);
    if (error) { return { success: false, error: error.message }; }
    revalidatePath('/admin/clients');
    return { success: true };
}

export async function handleDeleteClient(id: string) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };
    
    const { error } = await supabase.from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    if (error) { return { success: false, error: error.message }; }
    revalidatePath('/admin/clients');
    return { success: true };
}

export async function handleAddTask(values: Omit<Task, 'id' | 'user_id'>) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase.from('tasks').insert([
        { ...values, user_id: user.id }
    ]);
    if (error) { return { success: false, error: error.message }; }
    revalidatePath('/admin/tasks');
    return { success: true };
}

export async function handleUpdateTask(id: number, values: Partial<Omit<Task, 'id' | 'user_id'>>) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase.from('tasks')
        .update(values)
        .eq('id', id)
        .eq('user_id', user.id);
    if (error) { return { success: false, error: error.message }; }
    revalidatePath('/admin/tasks');
    return { success: true };
}

export async function handleDeleteTask(id: number) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };
    
    const { error } = await supabase.from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    if (error) { return { success: false, error: error.message }; }
    revalidatePath('/admin/tasks');
    return { success: true };
}


const uploadFile = async (file: File, bucket: string, path: string) => {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
        upsert: true,
    });

    if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
};

async function processPortfolioItem(values: any) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    
    const { imageFile, screenshotFiles, tags, removedScreenshots, ...rest } = values;

    const portfolioData: any = {
        ...rest,
        user_id: user.id,
        tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    };
    
    // Handle main image upload
    if (imageFile) {
        const imagePath = `public/${user.id}/${values.slug}-${imageFile.name}`;
        portfolioData.image = await uploadFile(imageFile, 'portfolio-images', imagePath);
    }
    
    // Handle screenshots upload
    const existingScreenshots = values.id ? 
        (await supabase.from('portfolio_items').select('screenshots').eq('id', values.id).single()).data?.screenshots || [] 
        : [];
        
    let finalScreenshots = existingScreenshots.filter((url: string) => !removedScreenshots?.includes(url));

    if (screenshotFiles && screenshotFiles.length > 0) {
        const screenshotUploads = Array.from(screenshotFiles).map(async (file: any) => {
            const screenshotPath = `public/${user.id}/${values.slug}-screenshots-${file.name}`;
            return uploadFile(file, 'portfolio-images', screenshotPath);
        });
        const newScreenshotUrls = await Promise.all(screenshotUploads);
        finalScreenshots = [...finalScreenshots, ...newScreenshotUrls];
    }
    portfolioData.screenshots = finalScreenshots;
    
    return portfolioData;
}


export async function handleAddPortfolioWork(values: any) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(cookieStore);
        const portfolioData = await processPortfolioItem(values);
        
        const { error } = await supabase.from('portfolio_items').insert([portfolioData]).select();
        
        if (error) throw error;
        revalidatePath('/admin/portfolio/projects');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function handleUpdatePortfolioWork(id: number, values: any) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(cookieStore);
        const portfolioData = await processPortfolioItem({ id, ...values });
        
        const { error } = await supabase.from('portfolio_items').update(portfolioData).eq('id', id);

        if (error) throw error;
        revalidatePath('/admin/portfolio/projects');
        revalidatePath(`/projects/${values.slug}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function handleDeletePortfolioWork(id: number) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(cookieStore);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Unauthorized');

        // Optional: remove files from storage
        const { data: item } = await supabase.from('portfolio_items').select('image, screenshots').eq('id', id).single();
        if (item) {
            const supabaseAdmin = createAdminClient();
            const filesToDelete = [];
            if(item.image) filesToDelete.push(item.image.split('/').slice(-2).join('/'));
            if(item.screenshots) filesToDelete.push(...item.screenshots.map(s => s.split('/').slice(-2).join('/')));
            if (filesToDelete.length > 0) {
               // await supabaseAdmin.storage.from('portfolio-images').remove(filesToDelete.map(f => `public/${user.id}/${f}`));
            }
        }
        
        const { error } = await supabase.from('portfolio_items').delete().eq('id', id);

        if (error) throw error;
        
        revalidatePath('/admin/portfolio/projects');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

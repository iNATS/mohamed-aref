'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Project, ProjectStatus } from '@/app/admin/projects/page';

export async function handleContactForm(prevState: any, formData: FormData) {
    await new Promise(res => setTimeout(res, 1000));
    console.log('Contact form submitted with:', Object.fromEntries(formData.entries()));
    // This is a placeholder. In a real app, you would integrate with an email service.
    return { success: true, message: "Thanks for reaching out. I'll get back to you soon." };
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
    return redirect(`/login?message=${encodeURIComponent('Invalid email or password')}`);
  }

  return redirect('/admin');
}

export async function logout() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  return redirect('/login');
}


// Generic project update function to be used by server actions
async function updateProjectStatus(id: number, status: ProjectStatus) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/admin/projects');
    return { success: true };
}


export async function handleAddProject(values: Omit<Project, 'id'>) {
    const supabase = createServerClient();
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

export async function handleUpdateProject(id: number, values: Partial<Omit<Project, 'id'>>) {
    const supabase = createServerClient();
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
    return { success: true };
}

export async function handleDeleteProject(id: number) {
    const supabase = createServerClient();
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
    return { success: true };
}
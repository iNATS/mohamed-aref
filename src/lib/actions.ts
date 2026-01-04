
'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Project } from '@/app/admin/projects/page';
import type { Client } from '@/app/admin/clients/page';
import type { Task } from '@/app/admin/tasks/page';
import { cookies } from 'next/headers';

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
  
  return redirect('/admin');
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

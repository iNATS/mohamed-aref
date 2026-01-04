'use server';

import { redirect } from 'next/navigation';

export async function handleContactForm(prevState: any, formData: FormData) {
    console.log('Contact form submitted with:', Object.fromEntries(formData.entries()));
    // This is a placeholder. In a real app, you would integrate with an email service.
    return { success: true, message: "Thanks for reaching out. I'll get back to you soon." };
}

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    // In a real app, you'd validate credentials here.
    if(email === 'admin@example.com') {
      return redirect('/admin');
    }
    return redirect('/login?message=Invalid credentials');
}

export async function logout() {
    return redirect('/login');
}

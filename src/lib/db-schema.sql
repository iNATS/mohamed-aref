
-- Drop existing tables and types to start fresh
DROP TABLE IF EXISTS "page_content", "portfolio_categories", "testimonials", "notifications", "tasks", "projects", "clients" CASCADE;
DROP TYPE IF EXISTS project_status, task_status, task_priority;

-- Re-create custom types
CREATE TYPE project_status AS ENUM ('planning', 'in-progress', 'completed');
CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Create clients table
CREATE TABLE clients (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    avatar TEXT,
    status TEXT,
    company TEXT,
    phone TEXT,
    address TEXT,
    notes TEXT,
    created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
    budget NUMERIC,
    start_date DATE,
    end_date DATE,
    created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    due_date DATE,
    created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Create portfolio_categories table
CREATE TABLE portfolio_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create portfolio_items table
CREATE TABLE portfolio_items (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    full_description TEXT,
    image TEXT,
    hint TEXT,
    tags TEXT[],
    category TEXT,
    link TEXT,
    screenshots TEXT[],
    created_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT,
    feedback TEXT,
    avatar TEXT
);

-- Create page_content table
CREATE TABLE page_content (
    id SERIAL PRIMARY KEY,
    section TEXT NOT NULL UNIQUE,
    content JSONB
);

-- Enable Row Level Security (RLS) for all user-specific tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can manage their own data
CREATE POLICY "Allow full access to own data" ON clients FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow full access to own data" ON projects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow full access to own data" ON tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow full access to own data" ON notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow full access to own data" ON testimonials FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user management of own portfolio items" ON portfolio_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Public data should be readable by everyone
CREATE POLICY "Allow public read access" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON portfolio_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON page_content FOR SELECT USING (true);


-- Create Storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Security Policies
CREATE POLICY "Allow public read access on portfolio images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'portfolio-images' );

CREATE POLICY "Allow authenticated users to upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'portfolio-images' AND auth.uid() = (storage.foldername(name))[1]::uuid );


-- Insert initial data
INSERT INTO portfolio_categories (name) VALUES ('Web'), ('Mobile'), ('Design') ON CONFLICT (name) DO NOTHING;

INSERT INTO page_content (section, content) VALUES
('hero', '{"title": "Creative Developer & Designer", "subtitle": "MOHAMED AREF", "description": "I build beautiful, functional, and accessible digital experiences.", "background": "orb"}'),
('about', '{"title": "Mohamed Aref", "description": "I am a passionate developer and designer with a knack for creating things that are both beautiful and useful.", "skills": ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "Tailwind CSS", "Figma", "UI/UX Design"], "avatar": "https://yt3.googleusercontent.com/ytc/AIdro_n8R-S22Q-23v_h_2k2l_v0w_zX_zX_zX_zX=s176-c-k-c0x00ffffff-no-rj"}'),
('process', '[{"icon": "MessageCircle", "title": "Discovery & Strategy", "description": "We start by discussing your goals, target audience, and project requirements to build a comprehensive strategy.", "color": "border-blue-500/30 text-blue-500"}, {"icon": "Lightbulb", "title": "Prototyping & Design", "description": "I create wireframes and high-fidelity mockups to visualize the user experience and interface.", "color": "border-purple-500/30 text-purple-500"}, {"icon": "PencilRuler", "title": "UI/UX Development", "description": "The approved designs are translated into a pixel-perfect, responsive, and interactive reality.", "color": "border-pink-500/30 text-pink-500"}, {"icon": "Code", "title": "Backend Engineering", "description": "I build the robust server-side logic, databases, and APIs that power your application.", "color": "border-orange-500/30 text-orange-500"}, {"icon": "Combine", "title": "Integration & Testing", "description": "All components are integrated and rigorously tested to ensure a seamless and bug-free experience.", "color": "border-yellow-500/30 text-yellow-500"}, {"icon": "Rocket", "title": "Deployment & Launch", "description": "Your application is deployed to a scalable infrastructure, ready to be shared with the world.", "color": "border-green-500/30 text-green-500"}]')
ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;


-- Database Functions for Analytics
CREATE OR REPLACE FUNCTION get_total_billed(p_user_id uuid)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (SELECT COALESCE(SUM(budget), 0) FROM projects WHERE user_id = p_user_id AND status = 'completed');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_monthly_income(p_user_id uuid)
RETURNS TABLE(name TEXT, income NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(DATE_TRUNC('month', end_date), 'Mon') AS name,
        COALESCE(SUM(budget), 0) AS income
    FROM projects
    WHERE user_id = p_user_id AND status = 'completed' AND end_date IS NOT NULL
    GROUP BY DATE_TRUNC('month', end_date)
    ORDER BY DATE_TRUNC('month', end_date);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_workload_by_category(p_user_id uuid)
RETURNS TABLE(name TEXT, value INT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(pi.category, 'Uncategorized') AS name,
        COUNT(*)::INT AS value
    FROM projects p
    JOIN portfolio_items pi ON p.title = pi.title -- Note: This is a simplification. A direct link would be better.
    WHERE p.user_id = p_user_id
    GROUP BY pi.category;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_client_leaderboard(p_user_id uuid)
RETURNS TABLE(id uuid, client_name TEXT, client_company TEXT, total_value NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name AS client_name,
        c.company AS client_company,
        COALESCE(SUM(p.budget), 0) AS total_value
    FROM clients c
    JOIN projects p ON c.id = p.client_id
    WHERE c.user_id = p_user_id
    GROUP BY c.id, c.name, c.company
    ORDER BY total_value DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "tasks" CASCADE;
DROP TABLE IF EXISTS "projects" CASCADE;
DROP TABLE IF EXISTS "clients" CASCADE;
DROP TABLE IF EXISTS "portfolio_items" CASCADE;
DROP TABLE IF EXISTS "portfolio_categories" CASCADE;
DROP TABLE IF EXISTS "page_content" CASCADE;
DROP TABLE IF EXISTS "testimonials" CASCADE;
DROP TABLE IF EXISTS "social_links" CASCADE;

-- Drop existing functions to ensure they are updated
DROP FUNCTION IF EXISTS get_total_billed(uuid);
DROP FUNCTION IF EXISTS get_monthly_income(uuid);
DROP FUNCTION IF EXISTS get_client_leaderboard(uuid);
DROP FUNCTION IF EXISTS get_workload_by_category(uuid);
DROP FUNCTION IF EXISTS handle_new_user();

-- Create portfolio categories table
CREATE TABLE "portfolio_categories" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

-- Create portfolio items table
CREATE TABLE "portfolio_items" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "image" TEXT,
    "hint" TEXT,
    "tags" TEXT[],
    "category" TEXT,
    "link" TEXT,
    "fullDescription" TEXT,
    "screenshots" TEXT[],
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create clients table
CREATE TABLE "clients" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES auth.users(id) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "avatar" TEXT,
    "status" TEXT,
    "company" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create projects table
CREATE TABLE "projects" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "client_id" UUID REFERENCES clients(id) ON DELETE SET NULL,
    "budget" REAL,
    "start_date" DATE,
    "end_date" DATE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tasks table
CREATE TABLE "tasks" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT,
    "due_date" DATE,
    "project_id" INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create notifications table
CREATE TABLE "notifications" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create page content table
CREATE TABLE "page_content" (
    "id" SERIAL PRIMARY KEY,
    "section" TEXT NOT NULL UNIQUE,
    "content" JSONB,
    "user_id" UUID REFERENCES auth.users(id) NOT NULL
);

-- Create testimonials table
CREATE TABLE "testimonials" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "feedback" TEXT,
    "avatar" TEXT,
    "user_id" UUID REFERENCES auth.users(id) NOT NULL
);

-- Create social links table
CREATE TABLE "social_links" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    "phone" TEXT,
    "whatsapp" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE "portfolio_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "page_content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "social_links" ENABLE ROW LEVEL SECURITY;

-- Policies for portfolio_items
CREATE POLICY "Public can read all portfolio items" ON "portfolio_items" FOR SELECT USING (true);
CREATE POLICY "Users can manage their own portfolio items" ON "portfolio_items" FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policies for clients
CREATE POLICY "Users can manage their own clients" ON "clients" FOR ALL USING (auth.uid() = user_id);

-- Policies for projects
CREATE POLICY "Users can manage their own projects" ON "projects" FOR ALL USING (auth.uid() = user_id);

-- Policies for tasks
CREATE POLICY "Users can manage their own tasks" ON "tasks" FOR ALL USING (auth.uid() = user_id);

-- Policies for notifications
CREATE POLICY "Users can manage their own notifications" ON "notifications" FOR ALL USING (auth.uid() = user_id);

-- Policies for portfolio_categories
-- This is public, editable only by admin/service_role
CREATE POLICY "Public can read categories" ON "portfolio_categories" FOR SELECT USING (true);

-- Policies for page_content
CREATE POLICY "Public can read page content" ON "page_content" FOR SELECT USING (true);
CREATE POLICY "Users can manage their own page content" ON "page_content" FOR ALL USING (auth.uid() = user_id);

-- Policies for testimonials
CREATE POLICY "Public can read testimonials" ON "testimonials" FOR SELECT USING (true);
CREATE POLICY "Users can manage their own testimonials" ON "testimonials" FOR ALL USING (auth.uid() = user_id);

-- Policies for social_links
CREATE POLICY "Public can read social links" ON "social_links" FOR SELECT USING (true);
CREATE POLICY "Users can manage their own social links" ON "social_links" FOR ALL USING (auth.uid() = user_id);

-- Function to handle new user setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.page_content (user_id, section, content)
  VALUES
    (NEW.id, 'hero', '{"title": "Creative Developer & Designer", "subtitle": "MOHAMED AREF", "description": "I build beautiful, functional, and accessible digital experiences.", "avatar": "", "background": "orb"}'),
    (NEW.id, 'about', '{"title": "Mohamed Aref", "description": "I am a passionate developer and designer with a knack for creating things that are both beautiful and useful.", "skills": ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "Tailwind CSS", "Figma", "UI/UX Design"], "avatar": "https://yt3.googleusercontent.com/ytc/AIdro_n8R-S22Q-23v_h_2k2l_v0w_zX_zX_zX_zX=s176-c-k-c0x00ffffff-no-rj"}'),
    (NEW.id, 'process', '[{"title": "Discovery & Strategy", "description": "We start by understanding your goals and mapping out a plan for success.", "icon": "MessageCircle"}, {"title": "Design & UX/UI", "description": "I craft intuitive and beautiful interfaces that your users will love.", "icon": "PencilRuler"}, {"title": "Development", "description": "Bringing designs to life with clean, efficient, and scalable code.", "icon": "Code"}, {"title": "Testing & QA", "description": "Rigorous testing to ensure a bug-free and smooth experience on all devices.", "icon": "Combine"}, {"title": "Launch & Optimization", "description": "Deploying the project and continuously monitoring for performance improvements.", "icon": "Rocket"}]');

  INSERT INTO public.testimonials (user_id, name, company, feedback, avatar)
  VALUES
    (NEW.id, 'Alice Johnson', 'TechCorp', 'Working with Mohamed was a fantastic experience. He delivered a high-quality product on time and was incredibly responsive to feedback.', 'https://i.pravatar.cc/100?u=alice'),
    (NEW.id, 'Bob Williams', 'Innovate Inc.', 'The final result exceeded our expectations. The design is modern, and the application is incredibly fast and intuitive. Highly recommended!', 'https://i.pravatar.cc/100?u=bob');

  INSERT INTO public.social_links (user_id, phone, whatsapp, facebook, instagram, twitter, linkedin)
  VALUES (NEW.id, 'tel:+1234567890', 'https://wa.me/1234567890', 'https://facebook.com', 'https://instagram.com', 'https://twitter.com', 'https://linkedin.com');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Insert some initial data
INSERT INTO "portfolio_categories" ("name") VALUES ('Web'), ('Mobile'), ('Design');

-- Report Functions

-- Function to get total billed amount for completed projects for a user
CREATE OR REPLACE FUNCTION get_total_billed(p_user_id UUID)
RETURNS REAL AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(budget), 0)
    FROM projects
    WHERE user_id = p_user_id AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get monthly income for a user
CREATE OR REPLACE FUNCTION get_monthly_income(p_user_id UUID)
RETURNS TABLE(name TEXT, income REAL) AS $$
BEGIN
  RETURN QUERY
    SELECT
      to_char(months.month, 'Mon') AS name,
      COALESCE(SUM(p.budget), 0)::REAL AS income
    FROM
      (SELECT date_trunc('month', generate_series(NOW() - INTERVAL '11 months', NOW(), '1 month')) AS month) AS months
    LEFT JOIN
      projects p ON date_trunc('month', p.end_date) = months.month AND p.user_id = p_user_id AND p.status = 'completed'
    GROUP BY
      months.month
    ORDER BY
      months.month;
END;
$$ LANGUAGE plpgsql;

-- Function to get client leaderboard by total project value
CREATE OR REPLACE FUNCTION get_client_leaderboard(p_user_id UUID)
RETURNS TABLE(client_id UUID, client_name TEXT, client_company TEXT, total_value REAL) AS $$
BEGIN
  RETURN QUERY
    SELECT
      c.id AS client_id,
      c.name AS client_name,
      c.company AS client_company,
      COALESCE(SUM(p.budget), 0)::REAL AS total_value
    FROM
      clients c
    LEFT JOIN
      projects p ON c.id = p.client_id
    WHERE
      c.user_id = p_user_id
    GROUP BY
      c.id
    ORDER BY
      total_value DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;


-- Function to get project count by portfolio category
CREATE OR REPLACE FUNCTION get_workload_by_category(p_user_id UUID)
RETURNS TABLE(name TEXT, value INT) AS $$
BEGIN
  RETURN QUERY
    SELECT
      pc.name,
      COUNT(pi.id)::INT AS value
    FROM
      portfolio_categories pc
    LEFT JOIN
      portfolio_items pi ON pc.name = pi.category AND pi.user_id = p_user_id
    GROUP BY
      pc.name
    ORDER BY
      value DESC;
END;
$$ LANGUAGE plpgsql;

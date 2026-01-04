-- Drop existing tables and types to start fresh
DROP TABLE IF EXISTS "public"."page_content" CASCADE;
DROP TABLE IF EXISTS "public"."testimonials" CASCADE;
DROP TABLE IF EXISTS "public"."portfolio_categories" CASCADE;
DROP TABLE IF EXISTS "public"."portfolio_items" CASCADE;
DROP TABLE IF EXISTS "public"."notifications" CASCADE;
DROP TABLE IF EXISTS "public"."tasks" CASCADE;
DROP TABLE IF EXISTS "public"."projects" CASCADE;
DROP TABLE IF EXISTS "public"."clients" CASCADE;
DROP TYPE IF EXISTS "public"."project_status";
DROP TYPE IF EXISTS "public"."task_priority";
DROP TYPE IF EXISTS "public"."task_status";
DROP TYPE IF EXISTS "public"."client_status";
DROP TYPE IF EXISTS "public"."notification_type";

-- Recreate types
CREATE TYPE "public"."project_status" AS ENUM ('planning', 'in-progress', 'completed');
CREATE TYPE "public"."task_priority" AS ENUM ('low', 'medium', 'high');
CREATE TYPE "public"."task_status" AS ENUM ('todo', 'in-progress', 'done');
CREATE TYPE "public"."client_status" AS ENUM ('new', 'active', 'archived');
CREATE TYPE "public"."notification_type" AS ENUM ('system', 'client', 'project', 'task_overdue', 'task_completed');

-- Create clients table
CREATE TABLE "public"."clients" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "name" character varying NOT NULL,
    "email" character varying NOT NULL,
    "avatar" text,
    "status" client_status NOT NULL DEFAULT 'new',
    "company" text,
    "phone" text,
    "address" text,
    "notes" text,
    "user_id" uuid NOT NULL DEFAULT auth.uid()
);
ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_pkey" PRIMARY KEY USING INDEX "clients_pkey";
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
CREATE POLICY "Enable all for users based on user_id" ON "public"."clients" FOR ALL USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- Create projects table
CREATE TABLE "public"."projects" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "title" text NOT NULL,
    "description" text,
    "status" project_status NOT NULL DEFAULT 'planning',
    "client_id" uuid,
    "budget" real,
    "start_date" date,
    "end_date" date,
    "user_id" uuid NOT NULL DEFAULT auth.uid()
);
ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."projects_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."projects_id_seq" OWNED BY "public"."projects"."id";
ALTER TABLE ONLY "public"."projects" ALTER COLUMN "id" SET DEFAULT nextval('public.projects_id_seq'::regclass);
CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_pkey" PRIMARY KEY USING INDEX "projects_pkey";
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
CREATE POLICY "Enable all for users based on user_id" ON "public"."projects" FOR ALL USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- Create tasks table
CREATE TABLE "public"."tasks" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "title" text NOT NULL,
    "project_id" bigint,
    "status" task_status NOT NULL DEFAULT 'todo',
    "priority" task_priority,
    "due_date" date,
    "user_id" uuid NOT NULL DEFAULT auth.uid()
);
ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."tasks_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."tasks_id_seq" OWNED BY "public"."tasks"."id";
ALTER TABLE ONLY "public"."tasks" ALTER COLUMN "id" SET DEFAULT nextval('public.tasks_id_seq'::regclass);
CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_pkey" PRIMARY KEY USING INDEX "tasks_pkey";
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
CREATE POLICY "Enable all for users based on user_id" ON "public"."tasks" FOR ALL USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- Create notifications table
CREATE TABLE "public"."notifications" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "user_id" uuid NOT NULL DEFAULT auth.uid(),
    "type" notification_type NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "link" text,
    "is_read" boolean NOT NULL DEFAULT false
);
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."notifications_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."notifications_id_seq" OWNED BY "public"."notifications"."id";
ALTER TABLE ONLY "public"."notifications" ALTER COLUMN "id" SET DEFAULT nextval('public.notifications_id_seq'::regclass);
CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY USING INDEX "notifications_pkey";
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
CREATE POLICY "Enable all for users based on user_id" ON "public"."notifications" FOR ALL USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- Create portfolio_categories table
CREATE TABLE "public"."portfolio_categories" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "user_id" uuid DEFAULT auth.uid() NOT NULL
);
ALTER TABLE "public"."portfolio_categories" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON "public"."portfolio_categories" FOR SELECT USING (true);
CREATE POLICY "Enable all for users based on user_id" ON "public"."portfolio_categories" FOR ALL USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE SEQUENCE "public"."portfolio_categories_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."portfolio_categories_id_seq" OWNED BY "public"."portfolio_categories"."id";
ALTER TABLE ONLY "public"."portfolio_categories" ALTER COLUMN "id" SET DEFAULT nextval('public.portfolio_categories_id_seq'::regclass);
ALTER TABLE "public"."portfolio_categories" ADD CONSTRAINT "portfolio_categories_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."portfolio_categories" ADD CONSTRAINT "portfolio_categories_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create portfolio_items table
CREATE TABLE "public"."portfolio_items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "title" text NOT NULL,
    "slug" text NOT NULL,
    "description" text,
    "image" text,
    "hint" text,
    "tags" text[],
    "category" text,
    "link" text,
    "fullDescription" text,
    "screenshots" text[],
    "user_id" uuid DEFAULT auth.uid() NOT NULL
);
ALTER TABLE "public"."portfolio_items" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all users" ON "public"."portfolio_items" FOR SELECT USING (true);
CREATE POLICY "Enable all for users based on user_id" ON "public"."portfolio_items" FOR ALL USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE SEQUENCE "public"."portfolio_items_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."portfolio_items_id_seq" OWNED BY "public"."portfolio_items"."id";
ALTER TABLE ONLY "public"."portfolio_items" ALTER COLUMN "id" SET DEFAULT nextval('public.portfolio_items_id_seq'::regclass);
CREATE UNIQUE INDEX portfolio_items_pkey ON public.portfolio_items USING btree (id);
CREATE UNIQUE INDEX portfolio_items_slug_key ON public.portfolio_items USING btree (slug);
ALTER TABLE "public"."portfolio_items" ADD CONSTRAINT "portfolio_items_pkey" PRIMARY KEY USING INDEX "portfolio_items_pkey";
ALTER TABLE "public"."portfolio_items" ADD CONSTRAINT "portfolio_items_slug_key" UNIQUE USING INDEX "portfolio_items_slug_key";
ALTER TABLE "public"."portfolio_items" ADD CONSTRAINT "portfolio_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create testimonials table
CREATE TABLE "public"."testimonials" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "name" text NOT NULL,
    "company" text,
    "feedback" text NOT NULL,
    "avatar" text,
    "user_id" uuid DEFAULT auth.uid() NOT NULL
);
ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all users" ON "public"."testimonials" FOR SELECT USING (true);
CREATE POLICY "Enable all for users based on user_id" ON "public"."testimonials" FOR ALL USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE SEQUENCE "public"."testimonials_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."testimonials_id_seq" OWNED BY "public"."testimonials"."id";
ALTER TABLE ONLY "public"."testimonials" ALTER COLUMN "id" SET DEFAULT nextval('public.testimonials_id_seq'::regclass);
ALTER TABLE "public"."testimonials" ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."testimonials" ADD CONSTRAINT "testimonials_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create page_content table
CREATE TABLE "public"."page_content" (
    "id" bigint NOT NULL,
    "section" text NOT NULL,
    "content" jsonb,
    "user_id" uuid DEFAULT auth.uid() NOT NULL
);
ALTER TABLE "public"."page_content" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all users" ON "public"."page_content" FOR SELECT USING (true);
CREATE POLICY "Enable all for users based on user_id" ON "public"."page_content" FOR ALL USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE SEQUENCE "public"."page_content_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."page_content_id_seq" OWNED BY "public"."page_content"."id";
ALTER TABLE ONLY "public"."page_content" ALTER COLUMN "id" SET DEFAULT nextval('public.page_content_id_seq'::regclass);
ALTER TABLE "public"."page_content" ADD CONSTRAINT "page_content_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."page_content" ADD CONSTRAINT "page_content_section_user_id_key" UNIQUE ("section", "user_id");
ALTER TABLE "public"."page_content" ADD CONSTRAINT "page_content_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop and recreate functions
DROP FUNCTION IF EXISTS "public"."get_total_billed"(p_user_id uuid);
DROP FUNCTION IF EXISTS "public"."get_monthly_income"(p_user_id uuid);
DROP FUNCTION IF EXISTS "public"."get_client_leaderboard"(p_user_id uuid);
DROP FUNCTION IF EXISTS "public"."get_workload_by_category"(p_user_id uuid);

CREATE OR REPLACE FUNCTION public.get_total_billed(p_user_id uuid)
RETURNS double precision
LANGUAGE sql
AS $$
    SELECT COALESCE(SUM(budget), 0)
    FROM projects
    WHERE user_id = p_user_id AND status = 'completed';
$$;

CREATE OR REPLACE FUNCTION public.get_monthly_income(p_user_id uuid)
RETURNS TABLE(name text, income double precision)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH months AS (
        SELECT generate_series(
            date_trunc('month', now()) - interval '5 months',
            date_trunc('month', now()),
            '1 month'::interval
        )::date AS month_start
    )
    SELECT
        to_char(m.month_start, 'Mon') AS name,
        COALESCE(sum(p.budget), 0)::double precision AS income
    FROM months m
    LEFT JOIN projects p ON date_trunc('month', p.end_date) = m.month_start
                        AND p.user_id = p_user_id
                        AND p.status = 'completed'
    GROUP BY m.month_start
    ORDER BY m.month_start;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_client_leaderboard(p_user_id uuid)
RETURNS TABLE(id uuid, client_name text, client_company text, total_value double precision)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.name AS client_name,
        c.company AS client_company,
        COALESCE(SUM(p.budget), 0)::double precision as total_value
    FROM clients c
    LEFT JOIN projects p ON c.id = p.client_id
    WHERE c.user_id = p_user_id
    GROUP BY c.id, c.name, c.company
    ORDER BY total_value DESC
    LIMIT 5;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_workload_by_category(p_user_id uuid)
RETURNS TABLE(name text, value integer)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pi.category AS name,
        count(*)::integer AS value
    FROM portfolio_items pi
    WHERE pi.user_id = p_user_id
    GROUP BY pi.category
    ORDER BY value DESC;
END;
$$;

-- Insert demo data
DO $$
DECLARE
    -- Variable to hold the user ID of the authenticated user
    -- This assumes you are running this script as the user you want to own the data.
    -- Replace with a specific user ID if needed.
    demo_user_id uuid := auth.uid();
    client1_id uuid;
    client2_id uuid;
    client3_id uuid;
    project1_id bigint;
    project2_id bigint;
    project3_id bigint;
BEGIN

    -- Portfolio Categories
    INSERT INTO "public"."portfolio_categories" ("name", "user_id") VALUES
    ('Web', demo_user_id),
    ('Mobile', demo_user_id),
    ('Design', demo_user_id);

    -- Portfolio Items
    INSERT INTO "public"."portfolio_items" ("user_id", "title", "slug", "description", "fullDescription", "image", "hint", "category", "tags", "link", "screenshots") VALUES
    (demo_user_id, 'E-commerce Platform', 'e-commerce-platform', 'A full-stack e-commerce solution with a custom CMS and payment integration.', 'Developed a robust e-commerce platform from the ground up, featuring a user-friendly interface, secure payment gateway integration with Stripe, and a powerful dashboard for managing products, orders, and customers. The frontend was built with Next.js and Tailwind CSS for a responsive and fast user experience.', 'https://picsum.photos/seed/1/600/400', 'online store', 'Web', '{"Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"}', '#', '{"https://picsum.photos/seed/101/600/400", "https://picsum.photos/seed/102/600/400", "https://picsum.photos/seed/103/600/400"}'),
    (demo_user_id, 'Creative Agency Portfolio', 'creative-agency-portfolio', 'A visually stunning portfolio website for a creative design agency.', 'Designed and developed a modern, animated portfolio for a design agency to showcase their work. Implemented with GSAP and Framer Motion for smooth animations and transitions. The site is fully responsive and optimized for performance.', 'https://picsum.photos/seed/2/600/400', 'design portfolio', 'Web', '{"React", "GSAP", "Framer Motion", "Figma"}', '#', '{"https://picsum.photos/seed/201/600/400", "https://picsum.photos/seed/202/600/400"}'),
    (demo_user_id, 'Task Management App', 'task-management-app', 'A cross-platform mobile app to help users organize their daily tasks.', 'Built a mobile application for iOS and Android using React Native. The app includes features like task prioritization, reminders, and collaboration. It syncs across devices and works offline, providing a seamless user experience.', 'https://picsum.photos/seed/3/600/400', 'mobile app', 'Mobile', '{"React Native", "Firebase", "SQLite"}', '#', '{"https://picsum.photos/seed/301/600/400", "https://picsum.photos/seed/302/600/400", "https://picsum.photos/seed/303/600/400"}'),
    (demo_user_id, 'Branding & UI Kit', 'branding-ui-kit', 'A complete branding package and UI kit for a tech startup.', 'Created a comprehensive brand identity, including logo, color palette, and typography. Designed a full UI kit in Figma with reusable components to ensure brand consistency across all digital products.', 'https://picsum.photos/seed/4/600/400', 'logo design', 'Design', '{"Figma", "UI/UX", "Branding"}', '#', '{"https://picsum.photos/seed/401/600/400"}');

    -- Page Content
    INSERT INTO "public"."page_content" ("user_id", "section", "content") VALUES
    (demo_user_id, 'hero', '{"title": "Creative Developer & Designer", "subtitle": "MOHAMED AREF", "description": "I build beautiful, functional, and accessible digital experiences.", "background": "orb"}'),
    (demo_user_id, 'about', '{"title": "Mohamed Aref", "description": "I am a passionate developer and designer with a knack for creating things that are both beautiful and useful.", "skills": ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "Tailwind CSS", "Figma", "UI/UX Design"], "avatar": "https://yt3.googleusercontent.com/ytc/AIdro_n8R-S22Q-23v_h_2k2l_v0w_zX_zX_zX_zX=s176-c-k-c0x00ffffff-no-rj"}'),
    (demo_user_id, 'process', '[
        {"icon": "MessageCircle", "title": "Discovery", "description": "We start with a conversation to understand your vision, goals, and requirements.", "color": "text-blue-500"},
        {"icon": "Lightbulb", "title": "Strategy", "description": "I develop a comprehensive plan, outlining the project scope, timeline, and key milestones.", "color": "text-yellow-500"},
        {"icon": "PencilRuler", "title": "Design", "description": "I create wireframes and high-fidelity mockups to visualize the user experience and interface.", "color": "text-pink-500"},
        {"icon": "Code", "title": "Development", "description": "I bring the designs to life with clean, efficient code, building a robust and scalable product.", "color": "text-green-500"},
        {"icon": "Combine", "title": "Testing", "description": "Thorough testing is conducted to ensure everything is working perfectly across all devices.", "color": "text-purple-500"},
        {"icon": "Rocket", "title": "Launch", "description": "After final approval, I deploy the project and hand over all the necessary assets and documentation.", "color": "text-red-500"}
    ]');

    -- Testimonials
    INSERT INTO "public"."testimonials" ("user_id", "name", "company", "feedback", "avatar") VALUES
    (demo_user_id, 'Alice Johnson', 'TechCorp', 'Working with Mohamed was a fantastic experience. He delivered a high-quality product on time and was incredibly responsive to feedback.', 'https://i.pravatar.cc/100?u=alice'),
    (demo_user_id, 'Bob Williams', 'Innovate Inc.', 'The final result exceeded our expectations. The design is modern, and the application is incredibly fast and intuitive. Highly recommended!', 'https://i.pravatar.cc/100?u=bob');

    -- Clients
    INSERT INTO "public"."clients" ("user_id", "name", "email", "avatar", "status", "company", "phone", "address", "notes") VALUES
    (demo_user_id, 'Innovate Inc.', 'contact@innovate.com', 'https://i.pravatar.cc/100?u=innovate', 'active', 'Innovate Inc.', '555-0101', '123 Tech Avenue, Silicon Valley', 'Leading tech startup.') RETURNING id INTO client1_id;
    INSERT INTO "public"."clients" ("user_id", "name", "email", "avatar", "status", "company", "phone", "address", "notes") VALUES
    (demo_user_id, 'Creative Solutions', 'hello@creative.co', 'https://i.pravatar.cc/100?u=creative', 'active', 'Creative Solutions LLC', '555-0102', '456 Design Drive, Arts District', 'Design agency.') RETURNING id INTO client2_id;
    INSERT INTO "public"."clients" ("user_id", "name", "email", "avatar", "status", "company", "phone", "address", "notes") VALUES
    (demo_user_id, 'Global Goods', 'support@globalgoods.com', 'https://i.pravatar.cc/100?u=global', 'new', 'Global Goods', '555-0103', '789 Market Street, Commerce City', 'New client.') RETURNING id INTO client3_id;

    -- Projects
    INSERT INTO "public"."projects" ("user_id", "title", "description", "status", "client_id", "budget", "start_date", "end_date") VALUES
    (demo_user_id, 'Website Redesign', 'Complete overhaul of the corporate website.', 'in-progress', client1_id, 25000, '2024-05-01', '2024-08-30') RETURNING id INTO project1_id;
    INSERT INTO "public"."projects" ("user_id", "title", "description", "status", "client_id", "budget", "start_date", "end_date") VALUES
    (demo_user_id, 'Mobile App Launch', 'New iOS and Android app for their services.', 'planning', client2_id, 45000, '2024-07-15', '2025-01-15') RETURNING id INTO project2_id;
    INSERT INTO "public"."projects" ("user_id", "title", "description", "status", "client_id", "budget", "start_date", "end_date") VALUES
    (demo_user_id, 'E-commerce Integration', 'Adding a shop to their existing website.', 'completed', client1_id, 15000, '2024-02-01', '2024-04-30') RETURNING id INTO project3_id;

    -- Tasks
    INSERT INTO "public"."tasks" ("user_id", "title", "project_id", "status", "priority", "due_date") VALUES
    (demo_user_id, 'Develop landing page', project1_id, 'in-progress', 'high', '2024-07-20'),
    (demo_user_id, 'Design UI mockups', project2_id, 'todo', 'high', '2024-08-01'),
    (demo_user_id, 'Setup database schema', project2_id, 'todo', 'medium', '2024-08-10'),
    (demo_user_id, 'Finalize payment gateway', project3_id, 'done', 'high', '2024-04-15'),
    (demo_user_id, 'Deploy to production', project3_id, 'done', 'medium', '2024-04-28');
    
    -- Notifications
    INSERT INTO "public"."notifications" ("user_id", "type", "title", "description", "link", "is_read") VALUES
    (demo_user_id, 'task_overdue', 'Task Overdue: Wireframes', 'The task "Create wireframes" was due yesterday.', '/admin/tasks', false),
    (demo_user_id, 'client', 'New Client Signed', 'You have a new client: Global Goods.', '/admin/clients', false),
    (demo_user_id, 'project', 'Project Completed', 'Project "E-commerce Integration" is now complete.', '/admin/projects', true);

END $$;

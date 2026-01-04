
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS "public"."testimonials" CASCADE;
DROP TABLE IF EXISTS "public"."portfolio_categories" CASCADE;
DROP TABLE IF EXISTS "public"."portfolio_items" CASCADE;
DROP TABLE IF EXISTS "public"."page_content" CASCADE;
DROP TABLE IF EXISTS "public"."tasks" CASCADE;
DROP TABLE IF EXISTS "public"."projects" CASCADE;
DROP TABLE IF EXISTS "public"."clients" CASCADE;
DROP TABLE IF EXISTS "public"."notifications" CASCADE;

-- 1. Clients Table
CREATE TABLE "public"."clients" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "name" character varying NOT NULL,
    "email" character varying NOT NULL,
    "avatar" character varying,
    "status" character varying DEFAULT 'new'::character varying,
    "user_id" uuid,
    "company" character varying,
    "phone" character varying,
    "address" text,
    "notes" text
);
ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_pkey" PRIMARY KEY USING INDEX "clients_pkey";
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Projects Table
CREATE TABLE "public"."projects" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "title" character varying,
    "description" text,
    "status" character varying,
    "client_id" uuid,
    "budget" real,
    "start_date" date,
    "end_date" date,
    "user_id" uuid
);
ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."projects_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE "public"."projects_id_seq" OWNED BY "public"."projects"."id";
ALTER TABLE ONLY "public"."projects" ALTER COLUMN "id" SET DEFAULT nextval('public.projects_id_seq'::regclass);
CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_pkey" PRIMARY KEY USING INDEX "projects_pkey";
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Tasks Table
CREATE TABLE "public"."tasks" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "title" character varying,
    "status" text,
    "priority" text,
    "due_date" date,
    "project_id" bigint,
    "user_id" uuid
);
ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."tasks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE "public"."tasks_id_seq" OWNED BY "public"."tasks"."id";
ALTER TABLE ONLY "public"."tasks" ALTER COLUMN "id" SET DEFAULT nextval('public.tasks_id_seq'::regclass);
CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_pkey" PRIMARY KEY USING INDEX "tasks_pkey";
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Notifications Table
CREATE TABLE "public"."notifications" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "user_id" uuid,
    "type" character varying,
    "title" character varying,
    "description" text,
    "link" text,
    "is_read" boolean DEFAULT false
);
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE "public"."notifications_id_seq" OWNED BY "public"."notifications"."id";
ALTER TABLE ONLY "public"."notifications" ALTER COLUMN "id" SET DEFAULT nextval('public.notifications_id_seq'::regclass);
CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY USING INDEX "notifications_pkey";
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. Portfolio Categories Table
CREATE TABLE "public"."portfolio_categories" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "user_id" uuid
);
ALTER TABLE "public"."portfolio_categories" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."portfolio_categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE "public"."portfolio_categories_id_seq" OWNED BY "public"."portfolio_categories"."id";
ALTER TABLE ONLY "public"."portfolio_categories" ALTER COLUMN "id" SET DEFAULT nextval('public.portfolio_categories_id_seq'::regclass);
CREATE UNIQUE INDEX portfolio_categories_name_key ON public.portfolio_categories USING btree (name);
CREATE UNIQUE INDEX portfolio_categories_pkey ON public.portfolio_categories USING btree (id);
ALTER TABLE "public"."portfolio_categories" ADD CONSTRAINT "portfolio_categories_pkey" PRIMARY KEY USING INDEX "portfolio_categories_pkey";
ALTER TABLE "public"."portfolio_categories" ADD CONSTRAINT "portfolio_categories_name_key" UNIQUE USING INDEX "portfolio_categories_name_key";
ALTER TABLE "public"."portfolio_categories" ADD CONSTRAINT "portfolio_categories_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. Portfolio Items Table
CREATE TABLE "public"."portfolio_items" (
    "id" bigint NOT NULL,
    "title" text,
    "description" text,
    "image" text,
    "tags" text[],
    "category" text,
    "link" text,
    "user_id" uuid,
    "slug" text NOT NULL,
    "fullDescription" text,
    "screenshots" text[],
    "hint" text
);
ALTER TABLE "public"."portfolio_items" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."portfolio_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE "public"."portfolio_items_id_seq" OWNED BY "public"."portfolio_items"."id";
ALTER TABLE ONLY "public"."portfolio_items" ALTER COLUMN "id" SET DEFAULT nextval('public.portfolio_items_id_seq'::regclass);
CREATE UNIQUE INDEX portfolio_items_pkey ON public.portfolio_items USING btree (id);
CREATE UNIQUE INDEX portfolio_items_slug_key ON public.portfolio_items USING btree (slug);
ALTER TABLE "public"."portfolio_items" ADD CONSTRAINT "portfolio_items_pkey" PRIMARY KEY USING INDEX "portfolio_items_pkey";
ALTER TABLE "public"."portfolio_items" ADD CONSTRAINT "portfolio_items_slug_key" UNIQUE USING INDEX "portfolio_items_slug_key";
ALTER TABLE "public"."portfolio_items" ADD CONSTRAINT "portfolio_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 7. Page Content Table
CREATE TABLE "public"."page_content" (
    "id" bigint NOT NULL,
    "section" text NOT NULL,
    "content" jsonb,
    "user_id" uuid
);
ALTER TABLE "public"."page_content" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."page_content_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE "public"."page_content_id_seq" OWNED BY "public"."page_content"."id";
ALTER TABLE ONLY "public"."page_content" ALTER COLUMN "id" SET DEFAULT nextval('public.page_content_id_seq'::regclass);
CREATE UNIQUE INDEX page_content_pkey ON public.page_content USING btree (id);
CREATE UNIQUE INDEX page_content_section_key ON public.page_content USING btree (section);
ALTER TABLE "public"."page_content" ADD CONSTRAINT "page_content_pkey" PRIMARY KEY USING INDEX "page_content_pkey";
ALTER TABLE "public"."page_content" ADD CONSTRAINT "page_content_section_key" UNIQUE USING INDEX "page_content_section_key";
ALTER TABLE "public"."page_content" ADD CONSTRAINT "page_content_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 8. Testimonials Table
CREATE TABLE "public"."testimonials" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "company" text,
    "feedback" text NOT NULL,
    "avatar" text,
    "user_id" uuid
);
ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE "public"."testimonials_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE "public"."testimonials_id_seq" OWNED BY "public"."testimonials"."id";
ALTER TABLE ONLY "public"."testimonials" ALTER COLUMN "id" SET DEFAULT nextval('public.testimonials_id_seq'::regclass);
CREATE UNIQUE INDEX testimonials_pkey ON public.testimonials USING btree (id);
ALTER TABLE "public"."testimonials" ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY USING INDEX "testimonials_pkey";
ALTER TABLE "public"."testimonials" ADD CONSTRAINT "testimonials_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


-- RLS POLICIES
-- Policies for 'clients'
CREATE POLICY "Enable read access for authenticated users" ON "public"."clients" FOR SELECT USING (auth.role() = 'authenticated'::text);
CREATE POLICY "Users can insert their own clients" ON "public"."clients" FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update their own clients" ON "public"."clients" FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users can delete their own clients" ON "public"."clients" FOR DELETE USING ((auth.uid() = user_id));

-- Policies for 'projects'
CREATE POLICY "Enable read access for authenticated users" ON "public"."projects" FOR SELECT USING (auth.role() = 'authenticated'::text);
CREATE POLICY "Users can insert their own projects" ON "public"."projects" FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update their own projects" ON "public"."projects" FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users can delete their own projects" ON "public"."projects" FOR DELETE USING ((auth.uid() = user_id));

-- Policies for 'tasks'
CREATE POLICY "Enable read access for authenticated users" ON "public"."tasks" FOR SELECT USING (auth.role() = 'authenticated'::text);
CREATE POLICY "Users can insert their own tasks" ON "public"."tasks" FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update their own tasks" ON "public"."tasks" FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users can delete their own tasks" ON "public"."tasks" FOR DELETE USING ((auth.uid() = user_id));

-- Policies for 'notifications'
CREATE POLICY "Enable read access for authenticated users" ON "public"."notifications" FOR SELECT USING (auth.role() = 'authenticated'::text);
CREATE POLICY "Users can insert their own notifications" ON "public"."notifications" FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING ((auth.uid() = user_id));

-- Policies for 'portfolio_categories'
CREATE POLICY "Enable read access for all users" ON "public"."portfolio_categories" FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."portfolio_categories" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for users based on user_id" ON "public"."portfolio_categories" FOR UPDATE TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Enable delete for users based on user_id" ON "public"."portfolio_categories" FOR DELETE TO authenticated USING ((auth.uid() = user_id));

-- Policies for 'portfolio_items'
CREATE POLICY "Enable read access for all users" ON "public"."portfolio_items" FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."portfolio_items" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for users based on user_id" ON "public"."portfolio_items" FOR UPDATE TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Enable delete for users based on user_id" ON "public"."portfolio_items" FOR DELETE TO authenticated USING ((auth.uid() = user_id));

-- Policies for 'page_content'
CREATE POLICY "Enable read access for all users" ON "public"."page_content" FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."page_content" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for users based on user_id" ON "public"."page_content" FOR UPDATE TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Enable delete for users based on user_id" ON "public"."page_content" FOR DELETE TO authenticated USING ((auth.uid() = user_id));

-- Policies for 'testimonials'
CREATE POLICY "Enable read access for all users" ON "public"."testimonials" FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."testimonials" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for users based on user_id" ON "public"."testimonials" FOR UPDATE TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Enable delete for users based on user_id" ON "public"."testimonials" FOR DELETE TO authenticated USING ((auth.uid() = user_id));


-- SEED DATA
-- Insert categories
INSERT INTO "public"."portfolio_categories" (name) VALUES
('Web'),
('Mobile'),
('Design');

-- Insert portfolio items
INSERT INTO "public"."portfolio_items" (title, slug, description, "fullDescription", image, hint, tags, category, link, screenshots) VALUES
('E-commerce Platform', 'e-commerce-platform', 'A robust and scalable online store built with Next.js and Stripe.', 'Developed a full-featured e-commerce platform from scratch, including product catalogs, a secure checkout process with Stripe integration, and a complete admin dashboard for managing orders and inventory. The focus was on performance and user experience.', 'https://picsum.photos/seed/ecom/600/400', 'online store', '{"Next.js","React","Stripe","Supabase"}', 'Web', '#', '{"https://picsum.photos/seed/ecom1/600/400", "https://picsum.photos/seed/ecom2/600/400", "https://picsum.photos/seed/ecom3/600/400"}'),
('Task Management App', 'task-management-app', 'A sleek and intuitive mobile app for managing daily tasks and projects.', 'Designed and built a cross-platform mobile application using React Native. The app features real-time data synchronization, offline support, and a clean, minimalist user interface to help users stay organized and productive on the go.', 'https://picsum.photos/seed/taskapp/600/400', 'mobile productivity', '{"React Native","TypeScript","Supabase","Zustand"}', 'Mobile', '#', '{"https://picsum.photos/seed/task1/400/800", "https://picsum.photos/seed/task2/400/800", "https://picsum.photos/seed/task3/400/800"}'),
('Branding & UI Kit', 'branding-ui-kit', 'A complete brand identity and component library for a new SaaS startup.', 'Created a comprehensive design system in Figma, including a logo, color palette, typography scale, and a full library of reusable UI components. This enabled the development team to build a consistent and polished product quickly.', 'https://picsum.photos/seed/design/600/400', 'design system', '{"Figma","UI/UX","Branding","Design System"}', 'Design', '#', '{"https://picsum.photos/seed/design1/600/400", "https://picsum.photos/seed/design2/600/400"}');

-- Insert page content
INSERT INTO "public"."page_content" (section, content) VALUES
('hero', '{"title": "", "subtitle": "Mohamed Aref", "background": "floatingLines", "description": "I build beautiful, functional, and accessible digital experiences. From slick web apps to performant mobile solutions, I bring ideas to life with code and creativity."}'),
('about', '{"title": "Mohamed Aref", "avatar": "https://yt3.googleusercontent.com/ytc/AIdro_n8R-S22Q-23v_h_2k2l_v0w_zX_zX_zX_zX=s176-c-k-c0x00ffffff-no-rj", "skills": ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "Tailwind CSS", "Figma", "UI/UX Design"], "description": "I am a passionate developer and designer with a knack for creating things that are both beautiful and useful. With a deep understanding of modern web technologies and a keen eye for detail, I enjoy turning complex problems into simple, elegant solutions. When I''m not coding, you''ll find me exploring new design trends or contributing to open-source projects."}'),
('process', '[
    {"icon": "Lightbulb", "color": "text-blue-500", "title": "Discovery & Strategy", "description": "We start by understanding your goals and mapping out a strategy for success."},
    {"icon": "PencilRuler", "color": "text-purple-500", "title": "UI/UX Design", "description": "I design intuitive and beautiful interfaces that your users will love to interact with."},
    {"icon": "Code", "color": "text-orange-500", "title": "Development", "description": "Bringing designs to life with clean, efficient, and scalable code."},
    {"icon": "Combine", "color": "text-green-500", "title": "Testing & QA", "description": "Rigorous testing to ensure everything is pixel-perfect and bug-free."},
    {"icon": "Rocket", "color": "text-pink-500", "title": "Deployment & Launch", "description": "Smooth deployment to the cloud, making your project available to the world."}
]');

-- Insert testimonials
INSERT INTO "public"."testimonials" (name, company, feedback, avatar) VALUES
('Alice Johnson', 'TechCorp', 'Working with Mohamed was a fantastic experience. He delivered a high-quality product on time and was incredibly responsive to feedback.', 'https://i.pravatar.cc/100?u=alice'),
('Bob Williams', 'Innovate Inc.', 'The final result exceeded our expectations. The design is modern, and the application is incredibly fast and intuitive. Highly recommended!', 'https://i.pravatar.cc/100?u=bob'),
('Charlie Brown', 'Creative Solutions', 'A true professional. He understood our vision perfectly and translated it into a beautiful and functional web application. We couldn''t be happier.', 'https://i.pravatar.cc/100?u=charlie');

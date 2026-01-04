
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS "meetings";
DROP TABLE IF EXISTS "projects";
DROP TABLE IF EXISTS "tasks";
DROP TABLE IF EXISTS "clients";
DROP TABLE IF EXISTS "testimonials";
DROP TABLE IF EXISTS "page_content";
DROP TABLE IF EXISTS "portfolio_items";
DROP TABLE IF EXISTS "portfolio_categories";


-- Create the portfolio_categories table
CREATE TABLE "portfolio_categories" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

-- Create the portfolio_items table
CREATE TABLE "portfolio_items" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "image" TEXT,
    "hint" TEXT,
    "tags" JSONB,
    "category" TEXT NOT NULL,
    "link" TEXT,
    "screenshots" JSONB
);

-- Create the page_content table
CREATE TABLE "page_content" (
    "id" SERIAL PRIMARY KEY,
    "section" TEXT NOT NULL UNIQUE,
    "content" JSONB NOT NULL
);

-- Create the testimonials table
CREATE TABLE "testimonials" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "avatar" TEXT
);

-- Create the clients table
CREATE TABLE "clients" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "avatar" TEXT,
    "status" TEXT CHECK(status IN ('active', 'archived', 'new')) NOT NULL DEFAULT 'new',
    "company" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT
);

-- Create the tasks table
CREATE TABLE "tasks" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT CHECK(status IN ('todo', 'in-progress', 'done')) NOT NULL DEFAULT 'todo',
    "priority" TEXT CHECK(priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'medium',
    "dueDate" TIMESTAMPTZ,
    "clientId" INTEGER,
    "tags" JSONB,
    FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE SET NULL
);

-- Create the projects table
CREATE TABLE "projects" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT CHECK(status IN ('planning', 'in-progress', 'completed')) NOT NULL DEFAULT 'planning',
  "clientId" INTEGER,
  "budget" REAL,
  "startDate" TIMESTAMPTZ NOT NULL,
  "endDate" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE SET NULL
);

-- Create the meetings table
CREATE TABLE "meetings" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "time" TIMESTAMPTZ NOT NULL,
    "duration" TEXT,
    "meetLink" TEXT,
    "clientId" INTEGER,
    FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL
);

-- Insert initial data into portfolio_categories
INSERT INTO "portfolio_categories" ("name") VALUES
('Web'),
('Mobile'),
('Design');

-- You can add INSERT statements for your other tables here
-- Example for adding a client:
-- INSERT INTO "clients" ("name", "email", "company", "status") VALUES ('John Doe', 'john.doe@example.com', 'Doe Inc.', 'active');


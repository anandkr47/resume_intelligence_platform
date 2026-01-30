-- PostgreSQL initialization script for Resume Intelligence Platform
-- This script is executed when the database container is first created

-- Create database if not exists (usually handled by POSTGRES_DB env var)
-- CREATE DATABASE resume_db;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'uploaded',
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    skills TEXT[],
    experience JSONB,
    education JSONB,
    parsed_data JSONB,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Job roles table
CREATE TABLE IF NOT EXISTS job_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    required_skills TEXT[],
    preferred_skills TEXT[],
    required_experience INTEGER,
    keywords TEXT[],
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Resume matches table
CREATE TABLE IF NOT EXISTS resume_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) NOT NULL,
    matched_skills TEXT[],
    missing_skills TEXT[],
    experience_match BOOLEAN DEFAULT FALSE,
    skill_score DECIMAL(5,2),
    keyword_score DECIMAL(5,2),
    experience_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(resume_id, role_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_status ON resumes(status);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at);
CREATE INDEX IF NOT EXISTS idx_resumes_email ON resumes(email);
CREATE INDEX IF NOT EXISTS idx_resumes_skills ON resumes USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_resumes_name_trgm ON resumes USING GIN(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_resume_matches_resume_id ON resume_matches(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_matches_role_id ON resume_matches(role_id);
CREATE INDEX IF NOT EXISTS idx_resume_matches_score ON resume_matches(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_resume_matches_created_at ON resume_matches(created_at);

CREATE INDEX IF NOT EXISTS idx_job_roles_title ON job_roles(title);
CREATE INDEX IF NOT EXISTS idx_job_roles_skills ON job_roles USING GIN(required_skills);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_roles_updated_at BEFORE UPDATE ON job_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample job roles
INSERT INTO job_roles (id, title, required_skills, preferred_skills, required_experience, keywords, location, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Software Engineer', 
     ARRAY['javascript', 'typescript', 'react', 'node'], 
     ARRAY['aws', 'docker', 'kubernetes'], 
     3, 
     ARRAY['software development', 'web development', 'api'],
     'Bhubaneswar',
     'Full-stack software engineer with experience in modern web technologies')
ON CONFLICT DO NOTHING;

INSERT INTO job_roles (id, title, required_skills, preferred_skills, required_experience, keywords, location, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Data Scientist', 
     ARRAY['python', 'machine learning', 'sql'], 
     ARRAY['tensorflow', 'pytorch', 'aws'], 
     2, 
     ARRAY['data analysis', 'ml', 'ai'],
     'Hyderabad',
     'Data scientist with expertise in machine learning and data analysis')
ON CONFLICT DO NOTHING;

INSERT INTO job_roles (id, title, required_skills, preferred_skills, required_experience, keywords, location, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'DevOps Engineer', 
     ARRAY['docker', 'kubernetes', 'ci/cd'], 
     ARRAY['aws', 'terraform', 'ansible'], 
     2, 
     ARRAY['devops', 'infrastructure', 'automation'],
     'Bhubaneswar',
     'DevOps engineer with experience in containerization and infrastructure automation')
ON CONFLICT DO NOTHING;

-- Views for common queries
CREATE OR REPLACE VIEW resume_summary AS
SELECT 
    r.id,
    r.file_name,
    r.name,
    r.email,
    r.status,
    array_length(r.skills, 1) as skill_count,
    jsonb_array_length(r.experience) as experience_count,
    jsonb_array_length(r.education) as education_count,
    COUNT(rm.id) as match_count,
    MAX(rm.match_score) as best_match_score,
    r.created_at
FROM resumes r
LEFT JOIN resume_matches rm ON r.id = rm.resume_id
GROUP BY r.id;

-- Grant permissions (adjust based on your user setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO resume_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO resume_user;

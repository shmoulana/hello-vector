-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a test connection to verify the extension is working
SELECT 1;
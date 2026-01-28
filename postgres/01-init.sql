-- Script de inicialização do banco PostgreSQL
-- Este script será executado automaticamente quando o container PostgreSQL iniciar

-- Extensões recomendadas para performance e funcionalidades extras
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Configurações de performance (opcional)
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Garantir que o usuário tenha permissões adequadas
GRANT ALL PRIVILEGES ON DATABASE furuksong2 TO postgres;

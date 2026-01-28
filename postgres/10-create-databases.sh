#!/bin/bash
set -e

# Função para criar banco de dados
create_database() {
    local db_name=$1
    echo "Creating database: $db_name"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE DATABASE $db_name;
        GRANT ALL PRIVILEGES ON DATABASE $db_name TO $POSTGRES_USER;
EOSQL
    echo "Database $db_name created successfully"
}

# Criar banco de dados furuksong2 se não existir
if psql -lqt | cut -d \| -f 1 | grep -qw furuksong2; then
    echo "Database furuksong2 already exists"
else
    create_database "furuksong2"
fi

echo "Database setup completed!"

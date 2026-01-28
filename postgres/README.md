# Furuksong2 Server - PostgreSQL Integration

O Furuksong2 Server agora utiliza **PostgreSQL** como banco de dados principal, removendo completamente a dependência do SQLite.

## 🐘 Configuração PostgreSQL

### Arquivos Principais

- `src/wire/postgresql/schema.ts` - Schema do banco de dados PostgreSQL
- `src/diplomat/db-postgres.ts` - Adaptador do banco de dados PostgreSQL
- `docker-compose.yml` - Apenas a aplicação Furuksong2 Server
- `docker-compose.postgres.yml` - PostgreSQL + PgAdmin (infraestrutura)
- `.env` - Variáveis de ambiente para PostgreSQL
- `drizzle.config.ts` - Configuração do Drizzle para PostgreSQL
- `postgres/01-init.sql` - Script de inicialização do PostgreSQL

### 📁 Estrutura de Arquivos

```
furuksong2-server/
└── postgres/                    # Scripts e configuração
    ├── 01-init.sql              # Script principal de inicialização
    ├── 10-create-databases.sh   # Script para criar bancos adicionais
    ├── docker-compose.yml       # Docker Compose da infraestrutura
    └── README-POSTGRES.md       # Este arquivo

/srv/postgres/                   # No servidor (destino final)
├── 01-init.sql
├── 10-create-databases.sh
├── docker-compose.yml
└── README-POSTGRES.md
```

### 🚀 Como Usar

#### Para Deploy Simples

1. **Copie seus arquivos para esta pasta:**
   ```bash
   cp /seu/caminho/para/scripts/* ./postgres/
   ```

2. **Inicie a infraestrutura PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

#### Para Sincronizar com /srv/postgres do Servidor

1. **No servidor, copie os arquivos do projeto para /srv/postgres:**
   ```bash
   cp -r /caminho/do/projeto/furuksong2-server/postgres/* /srv/postgres/
   ```

2. **Inicie os containers a partir de /srv/postgres:**
   ```bash
   cd /srv/postgres
   docker-compose up -d
   ```

#### Para Desenvolvimento Completo

```bash
# 1. Iniciar PostgreSQL + PgAdmin
docker-compose -f docker-compose.postgres.yml up -d

# 2. Iniciar Furuksong2 Server
docker-compose up -d

# Verificar logs
docker-compose logs -f
docker-compose -f docker-compose.postgres.yml logs -f

# Parar serviços
docker-compose down
docker-compose -f docker-compose.postgres.yml down
```

### 📊 Serviços

- **PostgreSQL**: localhost:5432
  - Database: furuksong2
  - User: postgres
  - Password: postgres

- **Furuksong2 Server**: http://localhost:3000
  - Health Check: http://localhost:3000/health

- **PgAdmin**: http://localhost:8080
  - Email: admin@furuksong2.com
  - Password: admin123

### 🗄️ Schema do Banco

O PostgreSQL contém as seguintes tabelas:

- `sounds` - Tabela de sons
- `categories` - Tabela de categorias
- `sounds_to_categories` - Relacionamento N:N entre sons e categorias
- `version` - Controle de versão do schema
- `rooms` - Tabela de salas

### 🔧 Migrações

```bash
# Gerar migrações
npm run db:generate

# Executar migrações
npm run db:migrate

# Studio Drizzle (interface visual)
npm run db:studio
```

### 🧪 Testes de Integração

```bash
# Verificar saúde da API
curl http://localhost:3000/health

# Listar categorias
curl http://localhost:3000/categories

# Criar categoria
curl -X POST -H "Content-Type: application/json" \
  -d '{"label":"Nova Categoria"}' \
  http://localhost:3000/category

# Listar salas
curl http://localhost:3000/rooms

# Criar sala
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Nova Sala"}' \
  http://localhost:3000/room
```

### 🐘 Vantagens do PostgreSQL

- ✅ **Performance superior** em consultas complexas
- ✅ **Transações ACID** completas
- ✅ **Melhor concorrência** com locking granular
- ✅ **Backup e restauração** robustos
- ✅ **Escalabilidade horizontal**
- ✅ **Tipagem forte** e validação de dados
- ✅ **Índices avançados** e full-text search
- ✅ **Extensões** e funções customizadas

### 🔒 Segurança

- Senhas do PostgreSQL estão no docker-compose (ambiente de desenvolvimento)
- Em produção, use secrets do Docker ou variáveis de ambiente seguras
- PgAdmin está exposto para desenvolvimento (remova em produção)

### 📝 Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/furuksong2
FIREBASE_PROJECT_ID=furuksong
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_STORAGE_BUCKET=furuksong.appspot.com
```

### 🛠️ Troubleshooting

```bash
# Verificar se PostgreSQL está rodando
docker-compose -f docker-compose.postgres.yml exec postgres pg_isready -U postgres -d furuksong2

# Acessar banco diretamente
docker-compose -f docker-compose.postgres.yml exec postgres psql -U postgres -d furuksong2

# Verificar tabelas
docker-compose -f docker-compose.postgres.yml exec postgres psql -U postgres -d furuksong2 -c "\dt"

# Logs específicos
docker-compose -f docker-compose.postgres.yml logs postgres
docker-compose logs furuksong2-server
```

## 🚀 Deploy em Produção

### Para Servidor (/srv/postgres)

```bash
# 1. Copiar arquivos para o servidor
cp -r /caminho/do/projeto/furuksong2-server/postgres/* /srv/postgres/

# 2. Copiar docker-compose da infra
cp /caminho/do/projeto/furuksong2-server/docker-compose.postgres.yml /srv/postgres/docker-compose.yml

# 3. Executar a partir de /srv/postgres
cd /srv/postgres
docker-compose up -d

# 4. Iniciar aplicação (separado)
cd /caminho/do/aplicacao
docker-compose up -d
```

### 📋 Scripts Disponíveis

#### `01-init.sql`
- Cria extensões necessárias (uuid-ossp, pg_stat_statements)
- Configura performance do PostgreSQL
- Garante permissões do usuário

#### `10-create-databases.sh`
- Verifica e cria bancos de dados adicionais
- Garante que o banco `furuksong2` exista

### 🔧 Customização

Você pode adicionar novos scripts na pasta `postgres/` seguindo a convenção de nomenclatura:
- `01-*.sql` - Scripts SQL executados em ordem numérica
- `10-*.sh` - Scripts shell executados após os SQL

## 🎯 Migração Concluída

O projeto foi **completamente migrado** para PostgreSQL com:

- ✅ Remoção total do SQLite e dependências
- ✅ Schema PostgreSQL equivalente e otimizado
- ✅ Docker Compose separado (infra + app)
- ✅ Scripts de migração automatizados
- ✅ Testes de integração validados
- ✅ Documentação completa
- ✅ Estrutura de deploy para produção

**O Furuksong2 Server agora roda exclusivamente com PostgreSQL!** 🚀

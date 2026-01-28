# Furuksong2 Server

Servidor backend do Furuksong2 - Uma aplicação para gerenciamento de sons, categorias e salas com PostgreSQL e WebSocket.

## 🚀 Tecnologias

- **Node.js** 20+ com TypeScript
- **PostgreSQL** 15 com Drizzle ORM
- **Express.js** para API REST
- **Socket.io** para WebSocket
- **Firebase** para storage de arquivos
- **Docker** para containerização

## 📁 Estrutura do Projeto

```
furuksong2-server/
├── src/
│   ├── adapters/           # Adaptadores de dados
│   ├── controllers/        # Controllers da API
│   ├── diplomat/           # Camada de dados e integrações
│   ├── models/            # Models e interfaces
│   ├── wire/              # Schemas e DTOs
│   └── service.ts         # Entry point da aplicação
├── postgres/              # Scripts e configuração PostgreSQL
├── drizzle-postgres/      # Migrações do banco
├── docker-compose.yml     # Aplicação Furuksong2
├── docker-compose.postgres.yml  # Infra PostgreSQL
└── README.md             # Este arquivo
```

## 🐘 Configuração PostgreSQL

O projeto utiliza PostgreSQL como banco de dados principal. Veja a documentação completa em `postgres/README.md`.

### Iniciar Infraestrutura

```bash
# Iniciar PostgreSQL + PgAdmin
docker-compose -f docker-compose.postgres.yml up -d

# Iniciar aplicação
docker-compose up -d
```

## 🔧 Setup Local

### 1. Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- PostgreSQL (opcional, pode usar container)

### 2. Instalação

```bash
# Clonar repositório
git clone <repositorio>
cd furuksong2-server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais
```

### 3. Banco de Dados

```bash
# Gerar migrações
npm run db:generate

# Executar migrações
npm run db:migrate

# (Opcional) Interface visual do Drizzle
npm run db:studio
```

### 4. Executar

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 📡 API Endpoints

### Categories
- `GET /categories` - Listar todas categorias
- `POST /category` - Criar nova categoria
- `DELETE /category/:id` - Deletar categoria

### Rooms
- `GET /rooms` - Listar todas salas
- `POST /room` - Criar nova sala
- `DELETE /room/:id` - Deletar sala

### Sounds
- `GET /sounds` - Listar todos sons
- `POST /sound` - Upload de novo som (multipart/form-data)

### System
- `GET /health` - Health check
- `GET /version` - Versão atual da API

### WebSocket
- Conexão em `/socket.io` para eventos em tempo real

## 🗄️ Schema do Banco

### Tabelas Principais

- **sounds** - Arquivos de áudio e metadados
- **categories** - Categorias para organizar sons
- **sounds_to_categories** - Relacionamento N:N
- **rooms** - Salas para sessões
- **version** - Controle de versão do schema

### Relacionamentos

```
sounds ──< sounds_to_categories >── categories
rooms
version
```

## 🔐 Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/furuksong2

# Firebase
FIREBASE_PROJECT_ID=furuksong
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_STORAGE_BUCKET=furuksong.appspot.com
```

## 🐳 Docker

### Desenvolvimento

```bash
# Apenas aplicação (requer PostgreSQL rodando)
docker-compose up -d

# Com infra completa
docker-compose -f docker-compose.postgres.yml up -d
docker-compose up -d
```

### Produção

```bash
# Build da imagem
docker build -t furuksong2-server .

# Executar container
docker run -p 3000:3000 --env-file .env furuksong2-server
```

## 🧪 Testes de API

```bash
# Health check
curl http://localhost:3000/health

# Listar categorias
curl http://localhost:3000/categories

# Criar categoria
curl -X POST -H "Content-Type: application/json" \
  -d '{"label":"Test Category"}' \
  http://localhost:3000/category

# Listar salas
curl http://localhost:3000/rooms
```

## 📊 Scripts Úteis

```bash
# Banco de dados
npm run db:generate    # Gerar migrações
npm run db:migrate     # Executar migrações
npm run db:push        # Push schema
npm run db:studio      # Interface visual

# Desenvolvimento
npm run dev            # Servidor com watch
npm run build          # Build TypeScript
npm start              # Iniciar produção
```

## 🔧 Troubleshooting

### PostgreSQL não conecta

```bash
# Verificar se PostgreSQL está rodando
docker-compose -f docker-compose.postgres.yml exec postgres pg_isready -U postgres

# Verificar logs
docker-compose -f docker-compose.postgres.yml logs postgres
```

### Aplicação não inicia

```bash
# Verificar logs da aplicação
docker-compose logs furuksong2-server

# Verificar variáveis de ambiente
docker-compose exec furuksong2-server env | grep DATABASE_URL
```

### Migrações falhando

```bash
# Verificar schema atual
npm run db:studio

# Forçar nova migração
npm run db:push
```

## 🚀 Deploy em Produção

### 1. Preparar Ambiente

```bash
# Copiar scripts PostgreSQL para servidor
cp -r postgres/* /srv/postgres/

# Iniciar infraestrutura
cd /srv/postgres
docker-compose up -d
```

### 2. Deploy da Aplicação

```bash
# Build e deploy
docker-compose -f docker-compose.yml up -d --build
```

### 3. Verificar Deploy

```bash
# Health check
curl http://localhost:3000/health

# Verificar containers
docker-compose ps
```

## 📚 Documentação Adicional

- **PostgreSQL Setup**: `postgres/README.md`
- **Docker Configuration**: `DOCKER.md`
- **Database Schema**: `src/wire/postgresql/schema.ts`

## 🤝 Contribuição

1. Fork o projeto
2. Criar branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit mudanças (`git commit -am 'Add nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abrir Pull Request

## 📄 Licença

Este projeto está licenciado sob a ISC License.

## 🎯 Status do Projesto

- ✅ **PostgreSQL Integration** - Completo
- ✅ **WebSocket Support** - Implementado
- ✅ **Firebase Storage** - Integrado
- ✅ **Docker Setup** - Configurado
- ✅ **API Documentation** - Disponível

**Furuksong2 Server - Backend moderno e escalável!** 🚀

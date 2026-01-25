# Dockerização do Furuksong2-server

## 🐳 Arquivos Criados

### 1. Dockerfile
- **Multi-stage build** para imagem otimizada
- **Node.js 18 Alpine** como base
- **Non-root user** para segurança
- **Health check** integrado
- **Cache de dependências** para builds mais rápidos

### 2. docker-compose.yml
- **Orquestração completa** do serviço
- **Variáveis de ambiente** configuradas
- **Volumes** para persistência de dados
- **Health checks** do Docker
- **Restart policy** automático

### 3. .dockerignore
- **Exclusão de arquivos desnecessários**
- **Redução do tamanho da imagem**
- **Segurança** (não inclui .env, node_modules, etc.)

### 4. .env.example atualizado
- **Configurações Docker**
- **Firebase variables**
- **Database options**
- **Server configuration**

## 🚀 Como Usar

### Desenvolvimento
```bash
# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais Firebase
# ...

# Construir e iniciar
docker-compose up --build
```

### Produção
```bash
# Build da imagem
docker build -t furuksong2-server .

# Run em produção
docker run -d \
  --name furuksong2-server \
  -p 3000:3000 \
  --env-file .env \
  furuksong2-server
```

## 📋 Comandos Úteis

```bash
# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Reconstruir imagem
docker-compose build --no-cache

# Acessar container
docker-compose exec furuksong2-server sh
```

## 🔧 Configurações

### Portas
- **3000**: Servidor HTTP + WebSocket

### Volumes
- **./data:/app/data**: Persistência do banco de dados

### Health Check
- **Endpoint**: `/health`
- **Intervalo**: 30s
- **Timeout**: 10s
- **Retries**: 3

## ✅ Benefícios

- **Portabilidade**: Roda em qualquer ambiente Docker
- **Segurança**: Non-root user, .dockerignore
- **Performance**: Multi-stage build, cache
- **Monitoramento**: Health checks integrados
- **Persistência**: Volumes para dados
- **Escalabilidade**: Pronto para orquestração

# Docker Setup - Event Flow API

## 🐳 Configuração Docker

### Pré-requisitos
- Docker instalado
- Docker Compose instalado
- Variáveis de ambiente configuradas

### 🚀 Execução Rápida

#### Usando Docker Compose (Recomendado)
```bash
# Build e execução
docker-compose up --build

# Execução em background
docker-compose up -d

# Parar serviços
docker-compose down
```

#### Usando Docker diretamente
```bash
# Build da imagem
npm run docker:build

# Execução do container
npm run docker:run
```

### 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações básicas
NODE_ENV=production
PORT=3000

# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/eventflow"

# Autenticação
SECRET_KEY="your-super-secret-jwt-key-here"
CORE_CONNECTION_SECRET_KEY="your-core-connection-secret-key"

# Plataforma
PLATFORM_CORE_URL="http://localhost:7000"

# Upload de arquivos (MinIO ou Cloudinary)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
MINIO_BUCKET=eventflow-uploads

# WhatsApp (opcional)
EVOLUTION_URL=http://localhost:8080
EVOLUTION_INSTANCE=your-instance-name
EVOLUTION_API_KEY=your-evolution-api-key
```

### 📊 Health Check

A aplicação expõe um endpoint de health check:
- **URL**: `http://localhost:3000/health`
- **Método**: GET
- **Resposta**: Status da aplicação, timestamp e uptime

### 🔍 Comandos Úteis

```bash
# Ver logs do container
docker-compose logs -f app

# Executar comandos dentro do container
docker-compose exec app sh

# Verificar status dos serviços
docker-compose ps

# Rebuild sem cache
docker-compose build --no-cache
```

### 🛠️ Desenvolvimento

Para desenvolvimento local com hot-reload:

```bash
# Executar em modo desenvolvimento
npm run dev

# Ou usar Docker com volume para desenvolvimento
docker-compose -f docker-compose.dev.yml up
```

### 📦 Otimizações Implementadas

1. **Multi-stage build** - Reduz tamanho da imagem final
2. **Cache de dependências** - Acelera builds subsequentes
3. **Usuário não-root** - Segurança aprimorada
4. **Health check** - Monitoramento automático
5. **Dumb-init** - Gerenciamento correto de sinais
6. **Alpine Linux** - Imagem base minimalista

### 🚨 Troubleshooting

#### Erro de permissão
```bash
# Se houver problemas de permissão no Linux
sudo chown -R $USER:$USER .
```

#### Limpar cache do Docker
```bash
docker system prune -a
docker volume prune
```

#### Verificar logs detalhados
```bash
docker-compose logs --tail=100 app
``` 
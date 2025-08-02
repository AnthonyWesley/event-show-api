# Configuração de Ambiente - Event Flow API

## 📋 Visão Geral

Este documento explica como configurar as variáveis de ambiente necessárias para executar a aplicação Event Flow API.

## 🚀 Configuração Rápida

### 1. Copie o arquivo de exemplo
```bash
cp env.example .env
```

### 2. Configure as variáveis obrigatórias
Edite o arquivo `.env` e configure pelo menos:

```env
# Obrigatórias
SECRET_KEY=your-super-secret-jwt-key-here
CORE_CONNECTION_SECRET_KEY=your-core-connection-secret-key
DATABASE_URL="file:./dev.db"

# Opcional (escolha um serviço de upload)
MINIO_ENDPOINT=localhost
MINIO_ACCESS_KEY=your-key
MINIO_SECRET_KEY=your-secret
MINIO_BUCKET=uploads
```

## 🔧 Variáveis por Categoria

### ⚠️ **OBRIGATÓRIAS**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SECRET_KEY` | Chave secreta para JWT | `your-super-secret-jwt-key-here` |
| `CORE_CONNECTION_SECRET_KEY` | Chave de conexão com core | `your-core-connection-secret-key` |
| `DATABASE_URL` | URL do banco de dados | `file:./dev.db` (SQLite) |

### 🗄️ **BANCO DE DADOS**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão | `file:./dev.db` (SQLite) ou `postgresql://user:pass@host:5432/db` |

### 🔐 **AUTENTICAÇÃO**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SECRET_KEY` | Chave para JWT | `your-super-secret-jwt-key-here` |
| `CORE_CONNECTION_SECRET_KEY` | Chave do core | `your-core-connection-secret-key` |

### 📁 **UPLOAD DE ARQUIVOS**

#### MinIO (Recomendado para desenvolvimento)
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `MINIO_ENDPOINT` | Endpoint do MinIO | `localhost` |
| `MINIO_PORT` | Porta do MinIO | `9000` |
| `MINIO_ACCESS_KEY` | Chave de acesso | `minioadmin` |
| `MINIO_SECRET_KEY` | Chave secreta | `minioadmin` |
| `MINIO_BUCKET` | Nome do bucket | `uploads` |

#### Cloudinary (Recomendado para produção)
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Nome da cloud | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Chave da API | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Segredo da API | `your-api-secret` |

### 📱 **WHATSAPP (OPCIONAL)**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EVOLUTION_URL` | URL da Evolution API | `http://localhost:8080` |
| `EVOLUTION_INSTANCE` | Nome da instância | `your-instance-name` |
| `EVOLUTION_API_KEY` | Chave da API | `your-evolution-api-key` |

### 📧 **EMAIL (OPCIONAL)**

#### Sendinblue
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SIB_API_KEY` | Chave da API | `your-sendinblue-api-key` |
| `SIB_SENDER_EMAIL` | Email remetente | `noreply@yourapp.com` |
| `SIB_SENDER_NAME` | Nome remetente | `Event Flow` |

#### SMTP
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SMTP_HOST` | Host SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP | `587` |
| `SMTP_USER` | Usuário SMTP | `your-email@gmail.com` |
| `SMTP_PASS` | Senha SMTP | `your-app-password` |
| `SMTP_FROM` | Email remetente | `noreply@yourapp.com` |

### 🌐 **SERVIÇOS EXTERNOS**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PLATFORM_CORE_URL` | URL da plataforma core | `http://localhost:7000` |

### ⚙️ **CONFIGURAÇÕES GERAIS**

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente | `development` |
| `PORT` | Porta da aplicação | `8000` |
| `TMPDIR` | Diretório temporário | `./tmp` |
| `LOG_LEVEL` | Nível de log | `info` |
| `DEBUG` | Modo debug | `false` |

## 🛠️ Configurações por Ambiente

### Desenvolvimento Local

```env
NODE_ENV=development
PORT=8000
DATABASE_URL="file:./dev.db"
SECRET_KEY=dev-secret-key
CORE_CONNECTION_SECRET_KEY=dev-core-key
MINIO_ENDPOINT=localhost
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uploads
```

### Produção

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:pass@host:5432/db"
SECRET_KEY=your-production-secret-key
CORE_CONNECTION_SECRET_KEY=your-production-core-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## 🚨 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"

Se você receber erros sobre variáveis não configuradas:

1. **Verifique se o arquivo `.env` existe**
   ```bash
   ls -la .env
   ```

2. **Verifique se as variáveis obrigatórias estão definidas**
   ```bash
   grep -E "^(SECRET_KEY|CORE_CONNECTION_SECRET_KEY|DATABASE_URL)=" .env
   ```

3. **Reinicie a aplicação após alterações**
   ```bash
   npm run dev
   ```

### Erro de conexão com banco de dados

1. **SQLite**: Verifique se o diretório tem permissões de escrita
2. **PostgreSQL**: Verifique se o banco está rodando e acessível

### Erro de upload de arquivos

1. **MinIO**: Verifique se o MinIO está rodando na porta correta
2. **Cloudinary**: Verifique se as credenciais estão corretas

## 📝 Exemplos Práticos

### Configuração mínima para desenvolvimento

```env
NODE_ENV=development
PORT=8000
DATABASE_URL="file:./dev.db"
SECRET_KEY=dev-secret-key-123
CORE_CONNECTION_SECRET_KEY=dev-core-key-123
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uploads
```

### Configuração completa para produção

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:pass@host:5432/eventflow"
SECRET_KEY=your-super-secret-production-key
CORE_CONNECTION_SECRET_KEY=your-production-core-key
PLATFORM_CORE_URL=https://api.yourapp.com
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EVOLUTION_URL=https://evolution-api.yourapp.com
EVOLUTION_INSTANCE=production-instance
EVOLUTION_API_KEY=your-evolution-key
SIB_API_KEY=your-sendinblue-key
SIB_SENDER_EMAIL=noreply@yourapp.com
SIB_SENDER_NAME=Event Flow
LOG_LEVEL=info
```

## 🔒 Segurança

### ⚠️ **IMPORTANTE**

1. **Nunca commite o arquivo `.env`** no repositório
2. **Use chaves secretas fortes** em produção
3. **Rotacione as chaves** periodicamente
4. **Use variáveis de ambiente** em produção (não arquivos .env)

### Boas práticas

- Use chaves com pelo menos 32 caracteres
- Use caracteres especiais, números e letras
- Diferentes chaves para diferentes ambientes
- Armazene chaves em serviços seguros (AWS Secrets Manager, etc.) 
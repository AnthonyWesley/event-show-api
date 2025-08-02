# Multi-stage build para otimizar o tamanho da imagem
FROM node:20-alpine AS builder

# Instala dependências necessárias para build
RUN apk add --no-cache python3 make g++

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência primeiro (otimização de cache)
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Instala todas as dependências (incluindo devDependencies)
RUN npm ci && npm cache clean --force

# Gera os arquivos do Prisma
RUN npx prisma generate

# Copia o código fonte
COPY src ./src

# Compila o projeto
RUN npm run build

# Stage de produção
FROM node:20-alpine AS production

# Instala dependências de runtime necessárias
RUN apk add --no-cache dumb-init curl

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários do builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Cria diretório tmp com permissões corretas
RUN mkdir -p /app/tmp && chown -R nodejs:nodejs /app/tmp
# Muda para usuário não-root
USER nodejs

# Expõe a porta da aplicação (será definida via PORT)
EXPOSE ${PORT:-3000}

# Healthcheck compatível com Coolify
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Inicia a aplicação com dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]

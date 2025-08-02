FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência para instalar dependências com cache
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Instala as dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Gera os arquivos do Prisma
RUN npx prisma generate

# Compila o projeto
RUN npm run build

# Expõe a porta da aplicação (ajuste se necessário)
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]

FROM node:20-alpine

# Cria diretório de trabalho
WORKDIR /app

# Copia arquivos do projeto
COPY . .

# Instala dependências
RUN npm install

# Expõe a porta (ex: 3000)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "index.js"]

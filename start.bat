@echo off
set NODE_ENV=development
set PORT=8000
set SECRET_KEY=dev-secret-key-123
set CORE_CONNECTION_SECRET_KEY=dev-core-key-123
set PLATFORM_CORE_URL=http://localhost:7000

set MINIO_ENDPOINT=localhost
set MINIO_PORT=9000
set MINIO_ACCESS_KEY=minioadmin
set MINIO_SECRET_KEY=minioadmin
set MINIO_BUCKET=uploads

set CLOUDINARY_CLOUD_NAME=your-cloud-name
set CLOUDINARY_API_KEY=your-api-key
set CLOUDINARY_API_SECRET=your-api-secret

set EVOLUTION_URL=http://localhost:8080
set EVOLUTION_INSTANCE=default
set EVOLUTION_API_KEY=your-evolution-api-key

npm run dev

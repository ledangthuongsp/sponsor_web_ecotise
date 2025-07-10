# Bước 1: Sử dụng Node.js 22 Alpine để build ứng dụng
FROM node:22-alpine as development

# Bước 2: Thiết lập thư mục làm việc
WORKDIR /app

# Bước 3: Copy package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Bước 4: Cài đặt dependencies
RUN npm install

# Bước 5: Copy toàn bộ mã nguồn vào container
COPY . .

# Bước 6: Chạy ứng dụng trong chế độ phát triển với Vite
CMD ["npm", "run", "dev"]

EXPOSE 3000

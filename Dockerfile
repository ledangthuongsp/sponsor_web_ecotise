# Bước 1: Sử dụng Node.js 22 Alpine để build ứng dụng
FROM node:22-alpine as build

# Bước 2: Thiết lập thư mục làm việc
WORKDIR /app

# Bước 3: Copy package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Bước 4: Cài đặt dependencies, bao gồm devDependencies
RUN npm install

# Bước 5: Copy toàn bộ mã nguồn vào container
COPY . .

# Bước 6: Build ứng dụng React cho môi trường production
RUN npm run build

# Bước 7: Dùng Nginx để phục vụ ứng dụng React (nginx:alpine là image cực kỳ nhẹ)
FROM nginx:alpine

# Bước 8: Copy build folder từ container build vào nginx
COPY --from=build /app/build /usr/share/nginx/html

# Bước 9: Mở port 80
EXPOSE 80

# Bước 10: Chạy Nginx để phục vụ ứng dụng
CMD ["nginx", "-g", "daemon off;"]

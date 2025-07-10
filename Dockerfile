# Step 1: Set the base image
FROM node:22-slim as build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the app files
COPY . .

# Step 5: Build the app
RUN npm run build

# Step 6: Set up the production image
FROM nginx:alpine

# Step 7: Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Step 8: Copy the build files from the build image
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose the port on which the app will run
EXPOSE 80

# Step 10: Start NGINX
CMD ["nginx", "-g", "daemon off;"]

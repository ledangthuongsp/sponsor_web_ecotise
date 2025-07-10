# Step 1: Use Node.js 22 Alpine to build the app
FROM node:22-alpine as build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm ci

# Step 5: Copy the entire source code into the container
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Optional: Verify build folder exists (for debugging)
RUN ls -al /app/build

# Step 7: Use Nginx to serve the React app
FROM nginx:alpine

# Step 8: Copy the build folder from the build container into Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build the React application
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

# Declare arguments for environment variables
ARG REACT_APP_BASE_URL
ARG REACT_APP_KEYCLOAK_REALM
ARG REACT_APP_KEYCLOAK_URL
ARG REACT_APP_KEYCLOAK_CLIENT_ID
ARG REACT_APP_KEYCLOAK_RESOURCE

# Assign arguments to environment variables
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_KEYCLOAK_REALM=$REACT_APP_KEYCLOAK_REALM
ENV REACT_APP_KEYCLOAK_URL=$REACT_APP_KEYCLOAK_URL
ENV REACT_APP_KEYCLOAK_CLIENT_ID=$REACT_APP_KEYCLOAK_CLIENT_ID
ENV REACT_APP_KEYCLOAK_RESOURCE=$REACT_APP_KEYCLOAK_RESOURCE

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of your application's code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file
COPY nginx/custom-nginx.conf /etc/nginx/conf.d

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Define the command to run your app using CMD which defines your runtime
CMD ["nginx", "-g", "daemon off;"]

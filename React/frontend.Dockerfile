# # Use the official Node.js 14 image
# FROM node:18-slim
# RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

# # --- NETFREE CERT INTSALL ---
# # ADD https://netfree.link/dl/unix-ca.sh /home/netfree-unix-ca.sh 
# # RUN cat  /home/netfree-unix-ca.sh | sh
# # ENV NODE_EXTRA_CA_CERTS=/etc/ca-bundle.crt
# # ENV REQUESTS_CA_BUNDLE=/etc/ca-bundle.crt
# # ENV SSL_CERT_FILE=/etc/ca-bundle.crt
# # --- END NETFREE CERT INTSALL ---
# # Set the working directory
# WORKDIR /usr


# # Copy package.json and package-lock.json
# COPY . .
# # COPY ./React

# # Install JavaScript dependencies
# RUN npm install
# #  & npm install --save @chakra-ui/react & npm install @tanstack/react-table &npm install react-dropdown --save
# # RUN npm install react-scripts
# RUN npm install --save @chakra-ui/react
# RUN npm install @tanstack/react-table
# RUN npm install react-dropdown --save


# # RUN npm install @tanstack/table
# # RUN npm create vite@latest ChayaReactApp
# # npm i react-table

# # npm install --save-dev @faker-js/faker

# # Install Python dependencies
# # RUN pip install fastapi --user
# # RUN pip install uvicorn
# # RUN pip3 install requests

# # Copy project files


# # Expose port 3000
# EXPOSE 5173

# # Command to run the development server
# CMD ["npm", "run", "dev"]










# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vite project
RUN npm run build

# Use a lightweight web server to serve the built files
# For example, using the `serve` package:
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "5173"]

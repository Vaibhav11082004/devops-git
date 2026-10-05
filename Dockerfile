# 1. Base image: Official lightweight Node.js LTS Alpine image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package definitions
COPY package*.json ./

# 4. Install dependencies
RUN npm install --omit=dev

# 5. Copy the remaining project files
COPY . .

# 6. Expose the port the Express application listens on
EXPOSE 3000

# 7. Run the application
CMD ["npm", "start"]

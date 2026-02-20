FROM --platform=linux/amd64 node:18

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production=false

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# EigenCompute expects port 3001 by default
EXPOSE 3001

ENV NODE_ENV=production
CMD ["npm", "start"]

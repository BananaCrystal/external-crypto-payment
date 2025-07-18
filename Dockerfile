FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables
ENV PORT=3007
ENV NODE_ENV=prod
ENV NEXT_PUBLIC_NODE_ENV=prod

EXPOSE 3007

CMD ["npm", "run", "dev"]
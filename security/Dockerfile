FROM node:18.1.0-alpine3.15

COPY package.json package-lock.json /
RUN npm install
WORKDIR /app
# CMD ["npm", "run", "start"]
CMD ["npx","nodemon", "."]
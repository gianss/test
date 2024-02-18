FROM node:latest

WORKDIR /app

COPY tsconfig.json package.json package-lock.json /app/

RUN npm install
COPY . /app

RUN npm run build

CMD npm run seeds && npm run dev

EXPOSE 3000

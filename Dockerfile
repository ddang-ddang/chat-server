FROM node:16

WORKDIR /app

COPY . /app/

COPY package*.json /app/


RUN yarn add @typegoose/typegoose @nestjs/common @nestjs/core mongoose
RUN yarn add --dev @types/mongoose

RUN rm -rf node_modules \
    && yarn install --frozen-lockfile \
    && yarn run build

EXPOSE 8000 

CMD ["yarn", "run", "start:prod"]

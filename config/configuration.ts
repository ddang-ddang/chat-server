const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export const chatServer = {
  port: parseInt(process.env.PORT, 10) || 3000,
};

export const mongoDB = {
  url: `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
};

export default { chatServer, mongoDB };

import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mestodb', // использование MONGODB_URI из .env или дефолтного значения
  port: process.env.PORT || 3000,
};

export default config;

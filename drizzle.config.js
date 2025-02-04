import { config } from 'dotenv';
config(); // Carrega variáveis do .env


/** @type { import('drizzle-kit').Config} */

const drizzleConfig = {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL 
    }
};

export default drizzleConfig;

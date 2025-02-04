
/** @type { import('drizzle-kit').Config} */

const drizzleConfig = {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DRIZZLE_DB_URL
    }
};

export default drizzleConfig;

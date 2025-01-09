
/** @type { import('drizzle-kit').Config} */

const drizzleConfig = {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
        url: NEXT_PUBLIC_DRIZZLE_DB_URL
    }
};

export default drizzleConfig;

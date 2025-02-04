
/** @type { import('drizzle-kit').Config} */

const drizzleConfig = {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://controldb_owner:ElM3sD5WcXLN@ep-autumn-darkness-a51sbhi0.us-east-2.aws.neon.tech/controldb?sslmode=require'
    }
};

export default drizzleConfig;

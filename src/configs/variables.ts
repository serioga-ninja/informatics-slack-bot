export const variables = {
    slack: {
        CLIENT_ID: process.env.SLACK_CLIENT_ID,
        CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET
    },
    VERSION: '1',
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME
};

export default variables;

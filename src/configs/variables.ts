export const variables = {
    slack: {
        CLIENT_ID: process.env.SLACK_CLIENT_ID,
        CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET
    },
    VERSION: '1',
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,

    social: {
        instagram: {
            CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
            CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
            accessToken: ''
        }
    },

    domainUrl: process.env.DOMAIN_URL
};

export default variables;

export const variables = {
    slack: {
        CLIENT_ID: process.env.SLACK_CLIENT_ID,
        CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
        XXX_CHANEL_URL: process.env.SLACK_XXX_CHANEL_LINK,
        SLACK_NEWS_CHANEL_LINK: process.env.SLACK_NEWS_CHANEL_LINK,
    },
    VERSION: '1',

    database: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        name: process.env.DB_NAME
    },

    social: {
        instagram: {
            CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
            CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
            accessToken: ''
        },

        twitter: {
            API_KEY: process.env.TWITTER_API_KEY,
            API_SECRET: process.env.TWITTER_API_SECRET,
            ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
            TOKEN_SECRET: process.env.TWITTER_TOKEN_SECRET,
            accessToken: ''
        }
    },

    domainUrl: process.env.DOMAIN_URL
};

export default variables;

import * as dotenv from 'dotenv';
import {DEFAULT_RADIX} from './consts';

dotenv.config();

export type Environment = 'development' | 'production';

export interface IVariables {
  SLACK: {
    COMMAND: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    VERIFICATION_TOKEN: string;
    SLACK_NEWS_CHANEL_LINK: string;
    SLACK_TEST_CHANEL_LINK: string;
    AUTH_TOKEN: string;
    authorization_code: string;
  };

  DB: {
    user: string;
    password: string;
    host: string;
    name: string;
  };

  SOCIAL: {
    instagram: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      accessToken: string;
    };

    twitter: {
      API_KEY: string;
      API_SECRET: string;
      ACCESS_TOKEN: string;
      TOKEN_SECRET: string;
      accessToken: string;
    };
  };

  WEATHER: {
    openWeatherApiKey: string;
    poltavaCityId: number;
  };

  APP: {
    VERSION: string;
    DOMAIN_URL: string;
    ENVIRONMENT: Environment,
    SERVER_PORT: number;
  };
}


export const variables: IVariables = {
  SLACK: {
    COMMAND: process.env.SLACK_COMMAND,
    CLIENT_ID: process.env.SLACK_CLIENT_ID,
    CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    SLACK_NEWS_CHANEL_LINK: process.env.SLACK_NEWS_CHANEL_LINK,
    SLACK_TEST_CHANEL_LINK: process.env.SLACK_TEST_CHANEL_LINK,
    AUTH_TOKEN: process.env.SLACK_AUTH_TOKEN,
    VERIFICATION_TOKEN: process.env.SLACK_VERIFICATION_TOKEN,
    authorization_code: ''
  },

  DB: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME
  },

  SOCIAL: {
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

  WEATHER: {
    openWeatherApiKey: process.env.OPEN_WEATHER_API_KEY,
    poltavaCityId: 696643
  },

  APP: {
    VERSION: '1',
    DOMAIN_URL: process.env.DOMAIN_URL,
    ENVIRONMENT: process.env.NODE_ENV as Environment,
    SERVER_PORT: parseInt(process.env.SERVER_PORT, DEFAULT_RADIX)
  }
};

export default variables;

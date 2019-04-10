import * as crypto from 'crypto';

import variables from '../configs/variables';

const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';

const toPercentEncoding = (str: string): string => str
  .split('')
  .map((ch) => {
    if (!/([\w\d\-\.\_\~])/g.test(ch)) {
      return '%' + new Buffer(ch).toString('hex').toUpperCase();
    }

    return ch;
  })
  .join('');

interface IOAuthData {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_token: string;
  oauth_version: string;
  oauth_signature?: string;
}

export class TwitterService {

  static get accessTokenUrl(): string {
    return ACCESS_TOKEN_URL;
  }

  static get bearer(): string {
    return new Buffer(`${variables.SOCIAL.twitter.API_KEY}:${variables.SOCIAL.twitter.API_SECRET}`).toString('base64');
  }

  static toPercentEncoding(str: string): string {
    return toPercentEncoding(str);
  }

  static generateSignatureBaseString(method: string, url: string, data: object): string {
    const requestBodyString: string = toPercentEncoding(
      Object
        .keys(data)
        .sort()
        .reduce((res: string[], value: string) => {
          res.push(
            toPercentEncoding(`${value}=${data[value]}`)
          );

          return res;
        }, <string[]>[])
        .join('&')
    );

    return `${method.toUpperCase()}&${toPercentEncoding(url)}&${requestBodyString}`;
  }

  static getOAuthAuthorizationString(method: string, url: string, requestBOdy: object = {}, time: string = new Date().getTime().toString()): string {
    console.log(new Date().getTime(), time);

    const authData: IOAuthData = {
      oauth_consumer_key: variables.SOCIAL.twitter.API_KEY,
      oauth_nonce: new Buffer(Math.random().toString()).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: time,
      oauth_token: variables.SOCIAL.twitter.ACCESS_TOKEN,
      oauth_version: '1.0'
    };
    const data = {
      ...requestBOdy,
      ...authData
    };

    const signatureBaseSting = TwitterService.generateSignatureBaseString(method, url, data);

    // generate a sign key
    const signKey = `${variables.SOCIAL.twitter.API_SECRET}&${variables.SOCIAL.twitter.TOKEN_SECRET}`;
    authData.oauth_signature = crypto
      .createHmac('SHA1', signKey)
      .update(signatureBaseSting)
      .digest('base64');


    return Object
      .keys(authData)
      .reduce((res: string[], key: string) => {
        res.push(
          `${toPercentEncoding(key)}="${toPercentEncoding(authData[key])}"`
        );

        return res;
      }, [])
      .join(', ');
  }

}

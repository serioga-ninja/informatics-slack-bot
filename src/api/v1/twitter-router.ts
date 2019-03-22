import {NextFunction, Request, Response} from 'express';
import * as qs from 'querystring';
import * as request from 'request';

import variables from '../../configs/variables';
import {TwitterService} from '../../services/twitter.service';
import {RouterClass} from '../router.class';


export class TwitterRouter extends RouterClass {

    public authCallback(req: Request, res: Response, next: NextFunction) {
        console.log(req.body, req.query);
    }

    public auth(req: Request, res: Response, next: NextFunction) {

        request({
            method: 'POST',
            url: `https://api.twitter.com/oauth2/token`,
            headers: {
                Authorization: `Basic ${TwitterService.bearer}`,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({
                grant_type: 'client_credentials'
            })
        }, (error, result: any) => {
            const resultBody: { token_type: string; access_token: string; } = JSON.parse(result.body);
            variables.social.twitter.accessToken = resultBody.access_token;

            res.json(resultBody);
        });
    }

    public invalidate(req: Request, res: Response, next: NextFunction) {

        request({
            method: 'POST',
            url: `https://api.twitter.com/oauth2/invalidate_token`,
            headers: {
                Authorization: `Basic ${TwitterService.bearer}`,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({
                access_token: variables.social.twitter.accessToken
            })
        }, (error, result: any) => {
            const resultBody: { token_type: string; access_token: string; } = JSON.parse(result.body);

            if (resultBody.access_token) {
                variables.social.twitter.accessToken = resultBody.access_token;
            }

            res.json(resultBody);
        });
    }

    public search(req: Request, res: Response) {
        const searchQ: string = req.query.q;

        request({
            method: 'GET',
            url: `https://api.twitter.com/1.1/users/search.json?${qs.stringify({
                q: searchQ
            })}`,
            headers: {
                Authorization: `Bearer ${variables.social.twitter.accessToken}`
            }
        }, (error, result: any) => {

            res.json(result.body);
        });
    }

    public search2(req: Request, res: Response) {
        const searchQ: string = req.query.q;

        request({
            method: 'GET',
            url: `https://api.twitter.com/1.1/users/search.json?${qs.stringify({
                q: searchQ
            })}`,
            headers: {
                Authorization: `OAuth ${TwitterService.getOAuthAuthorizationString(
                    'GET',
                    'https://api.twitter.com/1.1/users/search.json',
                    {
                        q: searchQ
                    })}`
            }
        }, (error, result: any) => {

            request({
                method: 'GET',
                url: `https://api.twitter.com/1.1/users/search.json?${qs.stringify({
                    q: searchQ
                })}`,
                headers: {
                    Authorization: `OAuth ${
                        TwitterService.getOAuthAuthorizationString(
                            'GET',
                            'https://api.twitter.com/1.1/users/search.json',
                            {
                                q: searchQ
                            },
                            new Date(result.headers.date).getTime().toString()
                        )
                        }`
                }
            }, (error, result: any) => {

                res.json(result.body);
            });
        });
    }


    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     *
     */
    init() {
        this.router.get('/auth-callback', this.authCallback);
        this.router.get('/auth', this.auth);
        this.router.get('/search-2', this.search2);
        this.router.get('/invalidate', this.invalidate);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const twitterRouter = new TwitterRouter();

export default twitterRouter.router;

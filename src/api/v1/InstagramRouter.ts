import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../../classes/router.class';
import * as request from 'request';
import {variables} from '../../configs/variables';
import {InstagramHelper} from '../../helpers/instagram.helper';

export interface IAuthCallbackQuery {
    code: string;
}

export interface ITokenRequestBody {
    client_id: string;
    client_secret: string;
    grant_type: 'authorization_code';
    redirect_uri: string;
    code: string;
}

export interface ITokenResponseSuccessBody {
    access_token: string;
    user: {
        id: number;
        username: string;
        full_name: string;
        profile_picture: string;
    }
}

export class InstagramRouter extends RouterClass {

    public authCallback(req: Request, res: Response, next: NextFunction) {
        let code = (<IAuthCallbackQuery>req.query).code;

        request({
            method: 'POST',
            url: `https://api.instagram.com/oauth/access_token`,
            formData: <ITokenRequestBody>{
                code: code,
                client_secret: variables.social.instagram.CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: InstagramHelper.authRedirectUri,
                client_id: variables.social.instagram.CLIENT_ID
            }
        }, (error, result: any) => {
            let resultBody: ITokenResponseSuccessBody = JSON.parse(result.body);
            variables.social.instagram.accessToken = resultBody.access_token;

            res.end('<h1>Success</h1>');
        });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     *
     */
    init() {
        this.router.get('/auth-callback', this.authCallback);
    }

}

// Create the SlackRouter, and export its configured Express.Router
let instagramRouter = new InstagramRouter();

export default instagramRouter.router;
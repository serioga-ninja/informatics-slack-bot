import variables from '../configs/variables';

const DOMAIN_URL = 'https://api.instagram.com';

export class InstagramHelper {

    static get authUrl() {
        return `${DOMAIN_URL}/oauth/authorize/?client_id=${variables.social.instagram.CLIENT_ID}&redirect_uri=${InstagramHelper.authRedirectUri}&response_type=code`;
    }

    static get authRedirectUri() {
        return `${variables.domainUrl}/api/v1/social/instagram/auth-callback`;
    }
}
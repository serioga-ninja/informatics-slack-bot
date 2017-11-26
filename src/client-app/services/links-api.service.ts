import {ILinkModel} from '../../interfaces/i-link-model';
import axios from 'axios';
import {ApiService} from './api-service';
import {updateLinksSuccess} from '../reducers/links/actions';
import store from '../reducers/store';

export class LinksApiService extends ApiService {

    resourceName: string = 'social/links';

    updateLinks(links: ILinkModel[]) {
        return axios
            .put(this.baseApiUrl, {links})
            .then(res => store.dispatch(updateLinksSuccess(res.data)))
            .catch(err => {});
    }
}

let linksApiService = new LinksApiService();

export default linksApiService;
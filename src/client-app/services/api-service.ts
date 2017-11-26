import * as data from '../variables.json';

let domainUrl: string = (<any>data).domainUrl;
let apiVersion: string = (<any>data).VERSION;

export abstract class ApiService {

    abstract resourceName: string;

    get baseApiUrl() {
        return `http://${domainUrl}/api/v${apiVersion}/${this.resourceName}`;
    }
}
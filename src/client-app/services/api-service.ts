import configurationService from './configuration.service';

export abstract class ApiService {

    abstract resourceName: string;

    get baseApiUrl() {
        return `http://${configurationService.domainUrl}/api/v${configurationService.version}/${this.resourceName}`;
    }
}
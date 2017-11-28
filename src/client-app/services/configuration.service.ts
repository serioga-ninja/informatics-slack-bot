class ConfigurationService {
    public domainUrl: string;
    public version: string;

    constructor(props: ConfigurationService) {
        Object.assign(this, props);
    }
}

if (typeof window === 'undefined') {
    (<any>global).window = {}
}

let configurationService = new ConfigurationService((<any>window).__VARIABLES___);

delete (<any>window).__VARIABLES___;

export default configurationService;
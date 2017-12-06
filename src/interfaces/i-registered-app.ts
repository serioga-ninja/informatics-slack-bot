import {ITimestamps} from './i-timestamps';

export interface IRegisteredApp extends ITimestamps {
    _id: any;
    incomingWebhook: {
        url: string;
        channel: string;
        channel_id: string;
        configuration_url: string
    };
    modules: string[];
}
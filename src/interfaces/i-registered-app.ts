export interface IRegisteredApp {
    _id: any;
    incoming_webhook: {
        url: string;
        channel: string;
        channel_id: string;
        configuration_url: string
    };
    modules: string[];
    createdAt?: Date;
}
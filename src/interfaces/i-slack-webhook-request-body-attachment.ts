export interface ISlackWebhookRequestBodyAttachment {
    fallback?: string;
    color?: string;
    pretext?: string;
    author_name?: string;
    author_link?: string;
    author_icon?: string;
    title?: string;
    title_link?: string;
    text?: string;
    fields?: [
        {
            title?: string;
            value?: string;
            short?: boolean;
        }
        ];
    image_url?: string;
    thumb_url?: string;
    footer?: string;
    footer_icon?: string;
    ts?: number;
}

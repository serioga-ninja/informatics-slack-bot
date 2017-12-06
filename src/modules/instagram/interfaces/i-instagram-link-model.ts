import {ITimestamps} from '../../../interfaces/i-timestamps';

export interface IInstagramLinkModel extends ITimestamps {
    _id: any;
    instChanelId: string;
    imageUrl: string;
    postedChannels: string[];
}
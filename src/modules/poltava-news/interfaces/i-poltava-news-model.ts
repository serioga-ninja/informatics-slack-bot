import {ITimestamps} from '../../../interfaces/i-timestamps';

export interface IPoltavaNewsModel extends ITimestamps {
    id?: string;
    link: string;
    title: string;
    imageUrl: string;
    postedChannels: string[];
}
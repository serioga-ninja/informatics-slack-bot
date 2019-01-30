import {ModuleTypes} from '../modules/core/Enums';

export interface ILinksToPostModel {
    _id: any;
    contentType: ModuleTypes;
    category: string;
    contentUrl: string;
    title?: string;
    description?: string;
    postedChannels: string[];
}

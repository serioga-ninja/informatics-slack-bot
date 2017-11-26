import {LinkTypes} from '../enums/link-types';

export interface ILinkModel {
    _id: any;
    id?: string;
    link: string;
    type: LinkTypes;
    createdAt?: Date;
}
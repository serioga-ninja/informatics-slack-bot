import {LinkTypes} from '../enums/link-types';

export interface ILinkModel {
    id?: string;
    link: string;
    type: LinkTypes;
    createdAt?: Date;
}
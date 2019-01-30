import {LinkTypes} from '../modules/core/Enums';

export interface ILinkModel {
    _id: any;
    id?: string;
    link: string;
    type: LinkTypes;
    createdAt?: Date;
}

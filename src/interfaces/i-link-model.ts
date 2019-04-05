import {LinkTypes} from '../core/enums';

export interface ILinkModel {
  _id: any;
  id?: string;
  link: string;
  type: LinkTypes;
  createdAt?: Date;
}

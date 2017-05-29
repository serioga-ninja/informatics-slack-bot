import {IRssItem} from './i-rss-item';
export interface IPostItem extends IRssItem {
    appName: string
    id?: Number
}
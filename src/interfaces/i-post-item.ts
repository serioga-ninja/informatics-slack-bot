import {IBreakingMadRssItem} from './i-breaking-mad-rss-item';
export interface IPostItem extends IBreakingMadRssItem {
    appName: string
    id?: Number
}
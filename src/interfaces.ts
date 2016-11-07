
export interface App {
    appName: string
    rssUrl: string
    slackUrl: string
    updateIn: number
}

export interface RssItem {
    title: string
    description: Text
    link: string
    pubDate: Date
}

export interface PostItem extends RssItem {
    appName: string
    id?: Number
}
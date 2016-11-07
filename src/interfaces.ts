
export interface App {
    'rssUrl': string
    'slackUrl': string
    'updateIn': number
}

export interface RssItem {
    title: string
    description: Text
    link: string
    pubDate: Date
}
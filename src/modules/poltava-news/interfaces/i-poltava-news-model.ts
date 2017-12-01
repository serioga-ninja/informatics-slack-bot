export interface IPoltavaNewsModel {
    id?: string;
    link: string;
    title: string;
    imageUrl: string;
    postedChannels: string[];
    createdAt?: Date;
}
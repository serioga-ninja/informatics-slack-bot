import * as mongoose from 'mongoose';

export interface IPoltavaNewsModel {
    id?: string;
    link: string;
    title: string;
    imageUrl: string;
    postedChannels: string[];
    createdAt?: Date;
}

export interface IPoltavaNewsModelDocument extends IPoltavaNewsModel, mongoose.Document {
}


export const PoltavaNewsModelSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true,
        unique: true
    },
    title: {
        type: String,
        require: true
    },
    imageUrl: {
        type: String,
        require: true
    },
    postedChannels: [String]
}, {
    timestamps: {createdAt: 'created_at'}
});

export const PoltavaNewsModel = mongoose.model<IPoltavaNewsModelDocument>('poltava_news', PoltavaNewsModelSchema);

export default PoltavaNewsModel;
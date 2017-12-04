import * as mongoose from 'mongoose';
import {IPoltavaNewsModel} from '../interfaces/i-poltava-news-model';

export interface IPoltavaNewsModelDocument extends IPoltavaNewsModel, mongoose.Document {
}


export const PoltavaNewsModelSchema: mongoose.Schema = new mongoose.Schema({
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
    timestamps: true
});

export const PoltavaNewsModel = mongoose.model<IPoltavaNewsModelDocument>('poltavaNews', PoltavaNewsModelSchema);

export default PoltavaNewsModel;
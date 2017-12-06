import * as mongoose from 'mongoose';
import {IInstagramLinkModel} from '../interfaces/i-instagram-link-model';

export interface IInstagramLinkModelDocument extends IInstagramLinkModel, mongoose.Document {
}

export const InstagramLinkModelSchema: mongoose.Schema = new mongoose.Schema({
    instChanelId: {
        type: String,
        require: true
    },
    imageUrl: {
        type: String,
        require: true,
        unique: true
    },
    postedChannels: [String]
}, {
    timestamps: true
});

export const InstagramLinkModel = mongoose.model<IInstagramLinkModelDocument>('instagramLinks', InstagramLinkModelSchema);

export default InstagramLinkModel;
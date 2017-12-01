import * as mongoose from 'mongoose';
import {IInstagramLinkModel} from '../interfaces/i-instagram-link-model';

export interface IInstagramLinkModelDocument extends IInstagramLinkModel, mongoose.Document {
}

export const InstagramLinkModelSchema: mongoose.Schema = new mongoose.Schema({
    inst_chanel_link: {
        type: String,
        require: true,
        unique: true
    },
    image_url: {
        type: String,
        require: true
    },
    postedChannels: [String]
}, {
    timestamps: {createdAt: 'created_at'}
});

export const InstagramLinkModel = mongoose.model<IInstagramLinkModelDocument>('instagram_links', InstagramLinkModelSchema);

export default InstagramLinkModel;
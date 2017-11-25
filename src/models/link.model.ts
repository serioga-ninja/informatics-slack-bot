import * as mongoose from 'mongoose';
import {ILinkModel} from '../interfaces/i-link-model';

export interface ILinkModelDocument extends ILinkModel, mongoose.Document {
}


export const LinkModelSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true,
        unique: true
    },
    type: {
        type: Number,
        required: true
    }
}, {
    timestamps: {createdAt: 'created_at'}
});

export const LinkModel = mongoose.model<ILinkModelDocument>('Links', LinkModelSchema);

export default LinkModel;
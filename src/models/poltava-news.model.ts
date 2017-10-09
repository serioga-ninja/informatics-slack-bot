import * as mongoose from 'mongoose';

export interface IPoltavaNewsModel {
    id?: string;
    link: string;
    title: string;
    imageUrl: string;
    isPosted?: boolean;
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
    isPosted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {createdAt: 'created_at'}
});

export const PoltavaNewsModel = mongoose.model<IPoltavaNewsModelDocument>('PoltavaNews', PoltavaNewsModelSchema);

export default PoltavaNewsModel;
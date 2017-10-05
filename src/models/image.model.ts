import * as mongoose from 'mongoose';

export interface IImageModel {
    id?: string;
    link: string;
    isPosted?: boolean;
    createdAt?: Date;
}

export interface IImageModelDocument extends IImageModel, mongoose.Document {
}


export const ImageModelSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true,
        unique: true
    },
    isPosted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {createdAt: 'created_at'}
});

export const ImageModel = mongoose.model<IImageModelDocument>('Images', ImageModelSchema);

export default ImageModel;
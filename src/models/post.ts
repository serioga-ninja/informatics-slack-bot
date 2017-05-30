import * as mongoose from 'mongoose';

export interface IPost {
    id?: string;
    title: string;
    description: string;
    link: string;
    pubDate: Date;
    createdAt?: Date;
}

export interface IPostDocument extends IPost, mongoose.Document {
}


export const PostSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String
    },
    link: {
        type: String
    },
    pubDate: {
        type: Date,
        require: true
    }
}, {
    timestamps: {createdAt: 'created_at'}
});

export const PostModel = mongoose.model<IPostDocument>('Post', PostSchema);

export default PostModel;
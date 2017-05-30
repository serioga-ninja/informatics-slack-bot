import * as mongoose from 'mongoose';
import * as validators from 'mongoose-validators';

export interface IPost extends mongoose.Document {
    id: string;
    title: string;
    description: string;
    link: string;
    pubDate: Date;
    createdAt: Date;
}


export const PostSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true,
        unique: true,
        validate: validators.isAlpha()
    },
    description: {
        type: Text,
        validate: validators.isAlpha()
    },
    link: {
        type: String,
        validate: validators.isAlpha()
    },
    pubDate: {
        type: Date,
        require: true
    }
}, {
    timestamps: {createdAt: 'created_at'}
});

export const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;
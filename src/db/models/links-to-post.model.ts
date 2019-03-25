import * as mongoose from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import {ILinksToPostModel} from '../../interfaces/i-links-to-post.model';

export interface ILinksToPostModelDocument extends ILinksToPostModel, mongoose.Document {
}

export const LinksToPostModelSchema: mongoose.Schema = new mongoose.Schema({
  contentType: {
    type: Number,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  contentUrl: {
    type: String,
    require: true,
    unique: true
  },
  title: {
    type: String,
    require: true,
    unique: true
  },
  description: String,
  postedChannels: [String]
}, {
  timestamps: true
});

LinksToPostModelSchema.plugin(uniqueValidator);

export const LinksToPostModel = mongoose.model<ILinksToPostModelDocument>('linksToPost', LinksToPostModelSchema);

export default LinksToPostModel;

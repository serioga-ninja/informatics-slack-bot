import * as mongoose from 'mongoose';
import {IRegisteredApp} from '../../../interfaces/i-registered-app';

export interface IRegisteredAppModelDocument extends IRegisteredApp, mongoose.Document {
}

export const RegisteredAppModelSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    incoming_webhook: {
        url: String,
        channel: String,
        channel_id: String,
        configuration_url: String
    },
    modules: [String]
}, {
    timestamps: {createdAt: 'created_at'}
});

export const RegisteredAppModel = mongoose.model<IRegisteredAppModelDocument>('registered_apps', RegisteredAppModelSchema);

export default RegisteredAppModel;
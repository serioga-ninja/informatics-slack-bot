import * as mongoose from 'mongoose';

import {IRegisteredApp} from '../../interfaces/i-registered-app';

export interface IRegisteredAppModelDocument extends IRegisteredApp, mongoose.Document {
}

export const RegisteredAppModelSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    incomingWebhook: {
        url: String,
        channel: String,
        channel_id: String,
        configuration_url: String
    },
    modules: [String]
}, {
    timestamps: true
});

export const RegisteredAppModel = mongoose.model<IRegisteredAppModelDocument>('registeredApps', RegisteredAppModelSchema);

export default RegisteredAppModel;

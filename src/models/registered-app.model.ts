import * as mongoose from 'mongoose';
import {IRegisteredApp} from '../interfaces/i-registered-app';

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
    modules: [{
        module_type: {
            type: Number,
            required: true
        },
        configuration: {
            frequency: {
                type: Number,
                default: 30 // seconds
            }
        }
    }]
}, {
    timestamps: {createdAt: 'created_at'}
});

export const RegisteredAppModel = mongoose.model<IRegisteredAppModelDocument>('RegisteredApps', RegisteredAppModelSchema);

export default RegisteredAppModel;
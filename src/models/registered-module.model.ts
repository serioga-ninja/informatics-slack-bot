import * as mongoose from 'mongoose';
import {IRegisteredModule} from '../interfaces/i-registered-module';

export interface IRegisteredModuleModelDocument extends IRegisteredModule, mongoose.Document {
}

export const RegisteredModulesModelSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    module_type: Number,
    chanel_id: String,
    chanel_link: String,
    configuration: {
        frequency: {
            type: Number,
            default: 10
        }
    }
}, {
    timestamps: {createdAt: 'created_at'}
});

export const RegisteredModuleModel = mongoose.model<IRegisteredModuleModelDocument>('registered_modules', RegisteredModulesModelSchema);

export default RegisteredModuleModel;
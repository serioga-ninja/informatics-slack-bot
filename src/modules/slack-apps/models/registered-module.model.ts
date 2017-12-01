import * as mongoose from 'mongoose';
import {IBaseRegisteredModule, IRegisteredModule} from '../../../interfaces/i-registered-module';

export interface IRegisteredModuleModelDocument<T> extends IRegisteredModule<T>, mongoose.Document {
}

export const RegisteredModulesModelSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    is_active: {
        type: Boolean,
        default: true
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

export const RegisteredModuleModel = mongoose.model<IRegisteredModuleModelDocument<any>>('registered_modules', RegisteredModulesModelSchema);

export default RegisteredModuleModel;
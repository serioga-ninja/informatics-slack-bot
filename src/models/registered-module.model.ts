import * as mongoose from 'mongoose';
import {IRegisteredModule} from '../interfaces/i-registered-module';
import {PostStrategies} from '../modules/core/Enums';

export interface IRegisteredModuleModelDocument<T> extends IRegisteredModule<T>, mongoose.Document {
}

export const RegisteredModulesModelSchema: mongoose.Schema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true
    },
    moduleType: Number,
    chanelId: String,
    chanelLink: String,
    configuration: {
        frequency: {
            type: Number,
            default: 10
        },
        links: [String],
        postStrategy: {
            type: Number,
            default: PostStrategies.RandomSingle
        }
    }
}, {
    timestamps: true
});

export const RegisteredModuleModel = mongoose.model<IRegisteredModuleModelDocument<any>>('registeredModules', RegisteredModulesModelSchema);

export default RegisteredModuleModel;
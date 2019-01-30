import {DEFAULT_RADIX} from '../../configs/consts';
import {IRegisteredModuleModelDocument} from '../../models/registered-module.model';
import {PostStrategies} from './Enums';
import {InvalidConfigValueError} from './Errors';
import {camelCaseToCebabCase} from './utils';

export const BASE_CONFIGURE_COMMANDS = {
    FREQUENCY: 'frequency',
    POST_STRATEGY: 'postStrategy'
};

export const baseConfigureCommandsFactory = () => {

    return {
        [BASE_CONFIGURE_COMMANDS.FREQUENCY]: (moduleModel: IRegisteredModuleModelDocument<any>, minutes: string[]) => {

            return Promise.resolve({
                frequency: parseInt(minutes[0], DEFAULT_RADIX)
            });
        },
        [BASE_CONFIGURE_COMMANDS.POST_STRATEGY]: (moduleModel: IRegisteredModuleModelDocument<any>, strategy: string[]) => {
            if ([PostStrategies.AsSoonAsPossible, PostStrategies.RandomSingle].indexOf(parseInt(strategy[0], DEFAULT_RADIX)) === -1) {
                return Promise.reject(new InvalidConfigValueError(camelCaseToCebabCase(BASE_CONFIGURE_COMMANDS.POST_STRATEGY)));
            }

            return Promise.resolve({
                postStrategy: parseInt(strategy[0], DEFAULT_RADIX)
            });
        }
    };
};

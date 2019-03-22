import variables from '../../configs/variables';
import MODULES_CONFIG from '../modules.config';

export const baseModuleCommands = (moduleName: string) => ([
    {
        title: 'Usage',
        text: `/${variables.slack.COMMAND} ${moduleName} [:command] [:args]`
    },
    {
        title: '1. Init app in the chanel',
        text: `/${variables.slack.COMMAND} ${MODULES_CONFIG.COMMANDS.INIT}`
    },
    {
        title: '2. Init module in the chanel',
        text: `/${variables.slack.COMMAND} ${moduleName} ${MODULES_CONFIG.COMMANDS.INIT}`
    },
    {
        title: '3. Configure module',
        text: `/${variables.slack.COMMAND} ${moduleName} ${MODULES_CONFIG.COMMANDS.CONFIGURE} [key1=value1,value2,value3 key2=value2...]`
    },
    {
        title: '4. Remove module',
        text: `/${variables.slack.COMMAND} ${moduleName} ${MODULES_CONFIG.COMMANDS.REMOVE}`
    }
]);

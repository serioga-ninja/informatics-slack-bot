import variables from '../../configs/variables';

export const baseModuleCommands = (moduleName: string) => ([
    {
        title: 'Usage',
        text: `/${variables.slack.COMMAND} ${moduleName} [:command] [:args]`
    },
    {
        title: '1. Register app in the chanel',
        text: `/${variables.slack.COMMAND} register`
    },
    {
        title: '2. Register module in the chanel',
        text: `/${variables.slack.COMMAND} ${moduleName} register`
    },
    {
        title: '3. Configure module',
        text: `/${variables.slack.COMMAND} ${moduleName} config [key1=value1,value2,value3 key2=value2...]`
    },
    {
        title: '4. Remove module',
        text: `/${variables.slack.COMMAND} ${moduleName} remove`
    }
]);
import {IBaseConfigurationStatic} from './configurations/BaseConfiguration';
import {FrequencyConfiguration} from './configurations/frequency.configuration';
import {PostStrategyConfiguration} from './configurations/post-strategy.configuration';

export const BASE_CONFIGURE_COMMANDS = {
  FREQUENCY: 'frequency',
  POST_STRATEGY: 'postStrategy',
  LIMIT: 'limit'
};

export const baseConfigureCommandsFactory: IBaseConfigurationStatic[] = [
  FrequencyConfiguration,
  PostStrategyConfiguration
];

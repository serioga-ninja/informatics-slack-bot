import {IBaseConfigurationStatic} from './configurations/base-configuration';
import {FrequencyConfiguration} from './configurations/frequency.configuration';
import {LimitConfiguration} from './configurations/limit.configuration';
import {PostStrategyConfiguration} from './configurations/post-strategy.configuration';

export const baseConfigureCommandsFactory: IBaseConfigurationStatic[] = [
  FrequencyConfiguration,
  PostStrategyConfiguration,
  LimitConfiguration
];

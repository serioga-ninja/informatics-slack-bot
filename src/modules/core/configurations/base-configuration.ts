import {IRegisteredModuleModelDocument} from '../../../db/models/registered-module.model';
import {IBaseModuleConfiguration} from '../interfaces';

export interface IConfigHelpItem {
  title: string;
  text: string;
}

export interface IBaseConfigurationStatic {
  commandName: string;

  new(configValue: string[]): IBaseConfiguration;

  help(moduleName: string): IConfigHelpItem;
}

export interface IBaseConfiguration<T = IBaseModuleConfiguration> {
  parse(): void;
  validate(): void;
  execute(moduleModel: IRegisteredModuleModelDocument<T>): Promise<T>;
}

export abstract class BaseConfiguration<T = IBaseModuleConfiguration> implements IBaseConfiguration<T> {
  constructor(protected configValue: string[]) {
  }

  parse(): void {
  }

  validate(): void {
  }

  abstract execute(moduleModel: IRegisteredModuleModelDocument<T>): Promise<T>;
}

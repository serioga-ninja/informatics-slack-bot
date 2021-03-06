export interface InformaticsSlackBotBaseError extends Error {

}

export class ChanelAlreadyRegisteredError extends Error implements InformaticsSlackBotBaseError {
  constructor() {
    super('ChanelAlreadyRegisteredError');

    Object.setPrototypeOf(this, ChanelAlreadyRegisteredError.prototype);
  }
}

export class ChanelNotRegisteredError extends Error implements InformaticsSlackBotBaseError {
  constructor() {
    super('ChanelNotRegisteredError');

    Object.setPrototypeOf(this, ChanelNotRegisteredError.prototype);
  }
}

export class ModuleAlreadyRegisteredError extends Error implements InformaticsSlackBotBaseError {
  constructor() {
    super('ModuleAlreadyRegisteredError');

    Object.setPrototypeOf(this, ModuleAlreadyRegisteredError.prototype);
  }
}

export class ModuleNotExistsError extends Error implements InformaticsSlackBotBaseError {
  constructor(moduleName: string) {
    super(`Module ${moduleName} doesn't exists.`);

    Object.setPrototypeOf(this, ModuleNotExistsError.prototype);
  }
}

export class ModuleAlreadeyStoppedError extends Error implements InformaticsSlackBotBaseError {
  constructor() {
    super('Module already stopped');

    Object.setPrototypeOf(this, ModuleAlreadeyStoppedError.prototype);
  }
}

export class CommandNotFoundError extends Error implements InformaticsSlackBotBaseError {
  constructor(commandName: string, moduleName: string) {
    super(`Command "${commandName}" for module "${moduleName}" doesn't exists.`);

    Object.setPrototypeOf(this, CommandNotFoundError.prototype);
  }

  getSlackJson() {
    return {
      response_type: 'in_channel',
      text: 'Unknown command'
    };
  }
}

export class UnknownConfigError extends Error implements InformaticsSlackBotBaseError {
  constructor(configName: string) {
    super(`Unknown config name "${configName}"`);

    Object.setPrototypeOf(this, UnknownConfigError.prototype);
  }
}

export class InvalidConfigValueError extends Error implements InformaticsSlackBotBaseError {
  constructor(configName: string) {
    super(`Invalid config value for "${configName}"`);

    Object.setPrototypeOf(this, InvalidConfigValueError.prototype);
  }
}

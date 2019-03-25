import RegisteredAppModel from '../../db/models/registered-app.model';
import RegisteredModuleModel from '../../db/models/registered-module.model';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';

import {ModuleTypes} from './enums';
import {
  ChanelAlreadyRegisteredError,
  ChanelNotRegisteredError,
  InformaticsSlackBotBaseError,
  ModuleAlreadyRegisteredError,
  ModuleNotExistsError,
  UnknownConfigError
} from './errors';
import {RegisteredModulesService} from './modules.service';

export const SimpleCommandResponse = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method: () => Promise<ISlackWebHookRequestBody> = descriptor.value;

  descriptor.value = (...args: any[]) => method
    .apply(target, args)
    .then((data: ISlackWebHookRequestBody = <ISlackWebHookRequestBody>{}) => {
      return <ISlackWebHookRequestBody>{
        response_type: 'in_channel',
        text: data.text || 'Success!',
        attachments: data.attachments || []
      };
    });
};

export const ChannelIsRegistered = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method: () => Promise<ISlackWebHookRequestBody> = descriptor.value;

  descriptor.value = (...args: any[]) => {
    const [requestBody] = args;

    return RegisteredAppModel
      .find({'incomingWebhook.channel_id': requestBody.channel_id})
      .then((collection) => {
        if (collection.length === 0) {
          throw new ChanelNotRegisteredError();
        }
      })
      .then(() => method.apply(target, args))
      .catch((error: InformaticsSlackBotBaseError) => {
        return <ISlackWebHookRequestBody>{
          response_type: 'in_channel',
          text: error.message
        };
      });
  };
};

export const ChannelNotRegistered = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method: () => Promise<ISlackWebHookRequestBody> = descriptor.value;

  descriptor.value = (...args: any[]) => {
    const [requestBody] = args;

    return RegisteredAppModel
      .find({'incomingWebhook.channel_id': requestBody.channel_id})
      .then((collection) => {
        if (collection.length > 0) {
          throw new ChanelAlreadyRegisteredError();
        }
      })
      .then(() => method.apply(target, args))
      .catch((error: InformaticsSlackBotBaseError) => {
        return <ISlackWebHookRequestBody>{
          response_type: 'in_channel',
          text: error.message
        };
      });
  };
};

export const ChannelIsActivated = (moduleType: ModuleTypes) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method: () => Promise<ISlackWebHookRequestBody> = descriptor.value;

    descriptor.value = (...args: any[]) => {
      const [requestBody] = args;

      return RegisteredModulesService
        .moduleIsExists(moduleType, requestBody.channel_id)
        .then((exists) => {
          if (!exists) {
            throw new ModuleNotExistsError(requestBody.channel_id);
          }
        })
        .then(() => method.apply(target, args))
        .catch((error: InformaticsSlackBotBaseError) => {
          return <ISlackWebHookRequestBody>{
            response_type: 'in_channel',
            text: error.message
          };
        });
    };
  };
};

export const ModuleIsNotRegistered = (moduleType: ModuleTypes) => {

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method: () => Promise<ISlackWebHookRequestBody> = descriptor.value;

    descriptor.value = (...args: any[]) => {
      const [requestBody] = args;

      return RegisteredModuleModel
        .find({chanelId: requestBody.channel_id, moduleType})
        .count()
        .then((count: number) => {
          if (count > 0) {
            throw new ModuleAlreadyRegisteredError();
          }
        })
        .then(() => method.apply(target, args))
        .catch((error: InformaticsSlackBotBaseError) => {
          return <ISlackWebHookRequestBody>{
            response_type: 'in_channel',
            text: error.message
          };
        });
    };
  };
};

export const ModuleIsRegistered = (moduleType: ModuleTypes) => {

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method: () => Promise<ISlackWebHookRequestBody> = descriptor.value;

    descriptor.value = (...args: any[]) => {
      const [requestBody] = args;

      return RegisteredModuleModel
        .find({chanelId: requestBody.channel_id, moduleType})
        .count()
        .then((count: number) => {
          if (count === 0) {
            throw new ModuleNotExistsError(requestBody.channel_id);
          }
        })
        .then(() => method.apply(target, args))
        .catch((error: InformaticsSlackBotBaseError) => {
          return <ISlackWebHookRequestBody>{
            response_type: 'in_channel',
            text: error.message
          };
        });
    };
  };
};

export const ValidateConfigs = (availableCommands: { [key: string]: (requestBody: any, configs: any) => Promise<any> }) => {

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method: () => Promise<ISlackWebHookRequestBody> = descriptor.value;

    descriptor.value = (...args: any[]) => {
      const [requestBody, configs] = args;

      return new Promise((resolve, reject) => {
        const unknownKey = Object.keys(configs).filter((key) => availableCommands[key] === undefined)[0];

        if (unknownKey) {
          reject(new UnknownConfigError(unknownKey));
        } else {
          resolve();
        }
      })
        .then(() => method.apply(target, args));
    };
  };
};

import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import RegisteredAppModel from '../../models/registered-app.model';
import RegisteredModuleModel from '../../models/registered-module.model';
import {ModuleTypes} from './Enums';
import {
  ChanelAlreadyRegisteredError,
  ChanelNotRegisteredError,
  InformaticsSlackBotBaseError,
  ModuleAlreadyRegisteredError,
  ModuleNotExistsError,
  UnknownConfigError
} from './Errors';
import {RegisteredModulesService} from './Modules.service';

export const SimpleCommandResponse = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

  descriptor.value = (...args: any[]) => method
    .apply(target, args)
    .then((data: ISlackWebhookRequestBody = <ISlackWebhookRequestBody>{}) => {
      return <ISlackWebhookRequestBody>{
        response_type: 'in_channel',
        text: data.text || 'Success!',
        attachments: data.attachments || []
      };
    });
};

export const ChannelIsRegistered = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

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
        return <ISlackWebhookRequestBody>{
          response_type: 'in_channel',
          text: error.message
        };
      });
  };
};

export const ChannelNotRegistered = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

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
        return <ISlackWebhookRequestBody>{
          response_type: 'in_channel',
          text: error.message
        };
      });
  };
};

export const ChannelIsActivated = (moduleType: ModuleTypes) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

    descriptor.value = (...args: any[]) => {
      const [requestBody] = args;

      return RegisteredModulesService
        .moduleIsExists(moduleType, requestBody.channel_id)
        .then((exists) => {
          if (!exists) {
            throw new ModuleNotExistsError();
          }
        })
        .then(() => method.apply(target, args))
        .catch((error: InformaticsSlackBotBaseError) => {
          return <ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: error.message
          };
        });
    };
  };
};

export const ModuleIsNotRegistered = (moduleType: ModuleTypes) => {

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

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
          return <ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: error.message
          };
        });
    };
  };
};

export const ModuleIsRegistered = (moduleType: ModuleTypes) => {

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

    descriptor.value = (...args: any[]) => {
      const [requestBody] = args;

      return RegisteredModuleModel
        .find({chanelId: requestBody.channel_id, moduleType})
        .count()
        .then((count: number) => {
          if (count === 0) {
            throw new ModuleNotExistsError();
          }
        })
        .then(() => method.apply(target, args))
        .catch((error: InformaticsSlackBotBaseError) => {
          return <ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: error.message
          };
        });
    };
  };
};

export const ValidateConfigs = (availableCommands: { [key: string]: (requestBody: any, configs: any) => Promise<any> }) => {

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

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

import RegisteredAppModel from '../db/models/registered-app.model';

export interface ISlackAuthSuccessBody {
  ok: boolean;
  error?: string;
  access_token: string;
  scope: string;
  user_id: string;
  team_name: string;
  team_id: string;
  incoming_webhook: {
    url: string;
    channel: string;
    channel_id: string;
    configuration_url: string;
  };
}

export class SlackService {

  static registerNewChanel(responseBody: ISlackAuthSuccessBody, authorizationCode: string) {
    return new RegisteredAppModel().set({
      incomingWebhook: responseBody.incoming_webhook,
      modules: [],
      authorization_code: authorizationCode
    }).save();
  }

  static chanelAlreadyRegistered(chanelId: string): Promise<boolean> {
    return RegisteredAppModel
      .find({'incomingWebhook.channel_id': chanelId})
      .then((collection) => {
        return collection.length > 0;
      });
  }
}


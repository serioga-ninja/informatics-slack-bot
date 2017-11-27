import {BaseCommand, ICommandSuccess} from './base-command.class';
import RegisteredAppModel from '../../../models/registered-app.model';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import variables from '../../../configs/variables';

export class ChanelAlreadyRegisteredError extends Error {
    constructor() {
        super('ChanelAlreadyRegisteredError');

        Object.setPrototypeOf(this, ChanelAlreadyRegisteredError.prototype);
    }
}


export class RegistrationCommand extends BaseCommand {

    constructor(public name: string, public args: string[]) {
        super();
    }

    validate(requestBody: ISlackRequestBody) {
        return RegisteredAppModel
            .find({'incoming_webhook.channel_id': requestBody.channel_id})
            .then(collection => {
                if (collection.length > 0) {
                    throw new ChanelAlreadyRegisteredError();
                }
            })
    }

    execute(requestBody: ISlackRequestBody) {
        return this
            .validate(requestBody)
            .then(() => {
                return <ICommandSuccess>{
                    response_type: 'in_channel',
                    text: '',
                    attachments: [
                        {
                            title_link: `https://slack.com/oauth/authorize?scope=incoming-webhook,commands&client_id=${variables.slack.CLIENT_ID}`,
                            title: 'Click to register',
                            image_url: 'https://platform.slack-edge.com/img/add_to_slack.png'
                        }
                    ]
                }
            })
            .catch(error => {
                return <ICommandSuccess>{
                    response_type: 'in_channel',
                    text: 'You are already in this chanel.',
                    attachments: []
                }
            });
    }
}
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';

export interface IConfigurationList<T> {

    [key: string]: (requestBody: ISlackRequestBody, data: T) => Promise<any>;

}
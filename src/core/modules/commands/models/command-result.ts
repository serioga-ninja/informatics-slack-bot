import {ICommandAttachment} from './command-attachment';

export interface ICommandResult {
  text?: string;
  attachments?: ICommandAttachment[];
  color?: string;
}

export class CommandResult implements ICommandResult {

  constructor(result: ICommandResult) {
    Object.assign(this, result);
  }
}

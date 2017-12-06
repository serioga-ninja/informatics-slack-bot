export class LogService {

    constructor(private environment: string) {
    }

    info(...attrs) {
        let [message, ...args] = attrs;

        console.log(`${this.environment}:`, message, args);
    }
}
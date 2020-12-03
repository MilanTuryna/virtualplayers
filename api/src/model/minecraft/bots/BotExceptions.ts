export class BotException extends Error {
    public readonly httpCode: number;

    constructor(message, httpCode) {
        super(message);

        this.httpCode = httpCode;
    }
}
export class BotNotFoundException extends BotException {}
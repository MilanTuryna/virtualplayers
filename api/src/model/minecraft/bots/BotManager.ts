import {FileReader} from "../../../helpers/filesystem/FileReader";
import * as mineflayer from "mineflayer";
import {BotInstance} from "./structure/BotInstance";
import {BotError} from "./structure/BotError";

export class BotManager {
    private storageReader: FileReader;
    private readonly botsList: {};
    private readonly botsInstance: {};
    private readonly error: BotError;

    constructor(storageReader: FileReader) {
        this.storageReader = storageReader;
        this.botsList = {};
        this.botsInstance = {};
        this.error = {
            activeError: false,
            code: null,
            reason: null,
        }
    }

    public loadFiles() {
        this.storageReader
            .readDir()
            .then((files: []) => {
                files.forEach((file: {filename: string, contents: string}) => {
                    this.botsList[file.filename.split('.')[0]] = <BotConfiguration> JSON.parse(file.contents || "");
                });
            }).catch(e => console.error(e));
    }

    public getBotConfiguration(botName: string): BotConfiguration {
        if(!Object.keys(this.botsList).includes(botName)) {
            this.error.activeError = true;
            this.error.code = 404;
            this.error.reason = "Player not found";
            return null;
        }
        return <BotConfiguration> this.botsList[botName];
    }

    public botExists(botName: string) {
        return Object.keys(this.botsList).includes(botName);
    }

    public getBotInstance(botName: string): BotInstance {
        let botsInstance = this.botsInstance[botName];
        if(botsInstance) return botsInstance;
        let configuration = this.getBotConfiguration(botName);
        let minecraftBot = mineflayer.createBot( {
            host: configuration.host,
            port: 25565,
            username: configuration.username
        });
        this.botsList[botName].instanced = true;
        minecraftBot.on('chat', (user, message) => this.botsInstance[botName].chatLog.push({
                user: user,
                message: message,
                time: Date.now()
        }));
        return this.botsInstance[botName] = <BotInstance> {
            minecraftBot: minecraftBot,
            chatLog: []
        };
    }

    getError(): BotError {
        return this.error;
    }

    public getBotsList(): {} {
        return this.botsList;
    }
}
import {FileReader} from "../../../helpers/filesystem/FileReader";
import * as mineflayer from "mineflayer";
import {BotInstance} from "./structure/BotInstance";
import {BotExistsException, BotNotFoundException} from "./BotExceptions";

/**
 * Class for manipulating with bots
 */
export class BotManager {
    private storageReader: FileReader;
    private readonly botsList: {};
    private readonly botsInstance: {};

    /**
     * @param storageReader FileReader with instanced bots data folder
     */
    constructor(storageReader: FileReader) {
        this.storageReader = storageReader;
        this.botsList = {};
        this.botsInstance = {};
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

    /**
     * @param botName
     */
    public getBotConfiguration(botName: string): BotConfiguration {
        if(!Object.keys(this.botsList).includes(botName))
            throw new BotNotFoundException("Player not found", 404);
        return <BotConfiguration> this.botsList[botName];
    }

    /**
     * @param botName
     */
    public botExists(botName: string): boolean {
        return Object.keys(this.botsList).includes(botName);
    }

    /**
     * @param botName
     */
    public getBotInstance(botName: string): BotInstance {
        let botsInstance = this.botsInstance[botName];
        if(botsInstance) return botsInstance;
        let configuration = this.getBotConfiguration(botName);
        let minecraftBot = mineflayer.createBot( {
            host: configuration.host,
            port: configuration.port || 25565,
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

    /**
     * @param botConfiguration
     */
    public createNewBot(botConfiguration: BotConfiguration) {
        if (this.botExists(botConfiguration.username)) throw new BotExistsException("Bot can't be created, because it already exists.", 403);
        this.storageReader.createFile(botConfiguration.username + ".json", JSON.stringify(botConfiguration));
        this.loadFiles();
    }
    
    public getBotsList(): {} {
        return this.botsList;
    }
}
import {Bot} from "mineflayer";

export interface BotInstance {
    minecraftBot: Bot
    chatLog: PlayerMessage[]
}
import {FileReader} from "./helpers/filesystem/FileReader"
import {BotManager} from "./model/minecraft/bots/BotManager";

import * as express from "express";

const app = express();
const storagePath = __dirname + '/../data';
const botManager = new BotManager(new FileReader(storagePath));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('json spaces', 2);
app.get('/', (req, res) => res.send("hiiii"));
app.get('/bots', (req, res) => {
    const options: {} = {
        count: Object.keys(botManager.getBotsList()).length,
        list: botManager.getBotsList()
    };
    res.json(options);
});
app.get('/bots/:nickname/instance', function (req, res) {
    let botName = req.params.nickname;
        let botInstance = botManager.getBotInstance(botName);
        let minecraftBot = botInstance.minecraftBot;
        let error = botManager.getError();
        if(!error.activeError) {
            let responseJson: {} = {
                bot: {
                    minecraft: {
                        isSleeping: minecraftBot.isSleeping,
                        health: minecraftBot.health,
                    }
                }, server: {
                    chat: botInstance.chatLog,
                    players: {
                        count: 0,
                        list: minecraftBot.players,
                    }, nature: {
                        isRaining: minecraftBot.isRaining
                    }
                }
            };
            res.json(responseJson);
        } else {
            res.status(error.code).json(<{}>error);
        }
});

app.listen(5001, function() {
    console.log('API loading on port: 5001');
    botManager.loadFiles();
});
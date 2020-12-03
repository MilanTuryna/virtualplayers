import {FileReader} from "./helpers/filesystem/FileReader"
import {BotManager} from "./model/minecraft/bots/BotManager";

import * as express from "express";

const app = express();
const storagePath = __dirname + '/../data'; // Folder for storage saved bot configurations
const botManager = new BotManager(new FileReader(storagePath));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('json spaces', 2); // pretty print json
app.get('/', (req, res) => res.redirect("https://github.com/MilanTuryna/virtualplayers", 301));
app.get('/bots', (req, res) => {
    const options: {} = {
        count: Object.keys(botManager.getBotsList()).length,
        list: botManager.getBotsList()
    };
    res.json(options);
});
app.get('/bots/:nickname/instance', function (req, res) {
        try {
            let botName = req.params.nickname;
            let botInstance = botManager.getBotInstance(botName);
            let minecraftBot = botInstance.minecraftBot;
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
        } catch (exception) {
            let code = exception.httpCode || 503;
            let errorObject: {} = {
                error: true,
                name: exception.name,
                code: code,
                reason: exception.message
            };
            res.status(code).json(errorObject);
        }
});

app.listen(5001, function() {
    console.log('API loading on port: 5001');
    botManager.loadFiles();
});
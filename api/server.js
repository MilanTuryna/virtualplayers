const express = require('express');
const app = express();
const port = 5001;
const apiMsg = 'API loading on port: ' + port;
const storagePath = __dirname + '/data';
const FileReader = require("./filesystem/FileReader.js");
const mineflayer = require("mineflayer");

let bots = {};
let botInstances = {};

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('json spaces', 2);
app.get('/', (req, res) => res.send(apiMsg));
app.get('/bots', (req, res) => {
    res.json({
        count: Object.keys(bots).length,
        list: bots
    });
});
app.get('/bots/:nickname/instance', function (req, res) {
    let botName = req.params.nickname;
    if(Object.keys(bots).includes(botName)) {
        let botObject = bots[botName];
        let newBotInstance = !botInstances[botName];

        if(newBotInstance) {
            let bot = mineflayer.createBot({
                name: botObject.name,
                description: botObject.customDescription,
                port: 25565,
                host: botObject.server
            });
            botInstances[botName] = {
                chatLog: [],
                instance: null,
            };
            bot.on('chat', function (user, message) {
                botInstances[botName].chatLog.push({
                    user: user,
                    message: message,
                    time: Date.now()
                })
            });
            botInstances[botName].instance = bot;
            bots[botName].instanced = true;
        }
        console.log("/bots/:nickname/instance " + botName + "");
        let botDataAll = botInstances[botName];
        let botData = botDataAll.instance;
        res.json({
            isNew: newBotInstance,
            bot: {
                minecraft: {
                    isSleeping: botData.isSleeping,
                    health: botData.health,
                }
            }, server: {
                players: {
                    count: Object.keys(botData.players).length,
                    list: botData.players,
                    chat: botData.chatLog,
                }, nature: {
                    isRaining: botData.isRaining
                }
            },
            chat: botDataAll.chatLog,
        });
    } else {
        let errCode = 404;
        res.status(errCode).json({
            error: true,
            errorCode: errCode,
            reason: "Player not exists"
        });
    }
});

app.listen(5001, function() {
    console.log('API loading on port: 5001');
    let storageReader = new FileReader(storagePath)
        .readDir()
        .then(files => {
            console.log("Loaded " +  files.length + " bots!");
            files.forEach((file) => bots[file.filename.split('.')[0]] = JSON.parse(file.contents || ""));
        })
        .catch(function (e) {
            console.log(e)
        })
});
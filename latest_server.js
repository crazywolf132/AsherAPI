const express = require("express");
const core = require("./core/Asher");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const stylus = require("stylus");
const path = require("path");
const nlp = require("compromise");
const fs = require("fs");

/**
* THE CORE OF THE SYSTEM...
*/

class Server {
    constructor() {
        this.Asher = new core(false, nlp);
        this.Asher.start();
        this.app = express();
        this.port = process.env.PORT || 80;
        this.nlp = nlp;
    }

    start() {
        this.app.use(morgan("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");
        this.app.use(stylus.middleware(path.join(__dirname, "public")));
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        //this.app.use("/", this.homeRouter);
        //this.router = express.router();
        this.Asher.loadHandlers("discord", "discord");

        this.Asher.start();
        this.loadAllMods();
        //let wow = require(process.cwd() + "/mods/funny/mod.js");
        //wow.core(this);
        
        this.startServer();
    }

    startServer() {
        setTimeout(() => {
            this.app.listen(this.port);
        }, 1000);
    }

    loadAllMods() {
        let alreadyLoaded = [];
        let mods = [];
        this.findFilesAndFolders(process.cwd() + "/mods/", mods, true, true, false);
        mods.forEach(item => {
            if (!(item in alreadyLoaded)) {
                alreadyLoaded.push(item);
                let res = require(process.cwd() + `/mods/${item}/mod.js`);
                res.core(this);
            }
        });
    }

    findFilesAndFolders(
        _path,
        _list,
        returnNamesOnly,
        checkForDir,
        checkForFile
    ) {
        fs.readdirSync(_path).forEach(file => {
            if (checkForDir && !checkForFile) {
                if (fs.statSync(_path + file).isDirectory()) {
                    (returnNamesOnly) ? _list.push(file) : _list.push(_path + file) ;
                }
            } else if (!checkedForDir && checkForFile) {
                if (fs.statSync(_path + file).isFile()) {
                    _list.push(_path + file);
                }
            } else {
                (returnNamesOnly) ? _list.push(file) : _list.push(_path + file);
            }
        })
    }
};


Asher = new Server();
Asher.start();
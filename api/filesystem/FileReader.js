const fs = require('fs');
const path = require('path');
const promises = require('../utils/Promises.js');

module.exports = class FileReader {
    constructor(dirname) {
        this.dirname = dirname;
    }

    readDir() {
        let self = this;
        return new Promise((resolve, reject) => {
            fs.readdir(this.dirname, function(err, filenames) {
                if (err) return reject(err);
                promises.promiseALLP(filenames,
                    (filename,index,resolve,reject) =>  {
                        fs.readFile(path.resolve(self.dirname, filename), 'utf-8', function(err, content) {
                            if (err) return reject(err);
                            return resolve({filename: filename, contents: content});
                        });
                    })
                    .then(results => {
                        return resolve(results);
                    })
                    .catch(error => {
                        return reject(error);
                    });
            });
        });
    }
};

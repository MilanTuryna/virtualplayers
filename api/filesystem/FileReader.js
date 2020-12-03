const fs = require('fs');
const path = require('path');

module.exports = class FileReader {
    constructor(dirname) {
        this.dirname = dirname;
    }

    promiseAllP(items, block) {
        let promises = [];
        items.forEach(function(item,index) {
            promises.push( function(item,i) {
                return new Promise(function(resolve, reject) {
                    return block.apply(this,[item,index,resolve,reject]);
                });
            }(item,index))
        });
        return Promise.all(promises);
    }

    readDir() {
        let self = this;
        return new Promise((resolve, reject) => {
            fs.readdir(this.dirname, function(err, filenames) {
                if (err) return reject(err);
                self.promiseAllP(filenames,
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

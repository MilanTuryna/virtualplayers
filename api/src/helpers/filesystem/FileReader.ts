const fs = require('fs');
const path = require('path');
import * as Promises from '../utils/Promises';

export class FileReader {
    private readonly dirname: string;

    constructor(dirname: string) {
        this.dirname = dirname;
    }

    readDir() {
        let self = this;
        return new Promise((resolve, reject) => {
            fs.readdir(this.dirname, function(err, filenames: string[]) {
                if (err) return reject(err);
                Promises.promiseALLP(filenames,
                    (filename: string,index: number,resolve,reject) =>  {
                        fs.readFile(path.resolve(self.dirname, filename), 'utf-8', function(err, content: string) {
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
}

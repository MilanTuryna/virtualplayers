const promises = {
    promiseALLP: function (items, block) {
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
};
module.exports = promises;
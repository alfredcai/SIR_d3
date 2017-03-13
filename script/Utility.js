const config = require('../script/Config')

module.exports = {
    nextType: function (type) {
        let next = type + 1;
        if (next >= config.clusterNumber)
            next = 0;
        return next;
    },
    previousType: function (type) {
        let previous = type - 1;
        if (previous < 0)
            previous = config.clusterNumber - 1;
        return previous;
    }
}
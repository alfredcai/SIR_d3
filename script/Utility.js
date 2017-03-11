const setting = require('../script/Setting')

module.exports = {
    nextType: function (type) {
        let next = type + 1;
        if (next >= setting.clusterNumber)
            next = 0;
        return next;
    },
    previousType: function (type) {
        let previous = type - 1;
        if (previous < 0)
            previous = setting.clusterNumber - 1;
        return previous;
    }
}
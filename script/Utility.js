const config = require('../script/Config');

module.exports = {
    nextType: function(type) {
        let next = type + 1;
        if (next >= config.clusterNumber) {
            next = 0;
        }
        return next;
    },
    previousType: function(type) {
        let previous = type - 1;
        if (previous < 0) {
            previous = config.clusterNumber - 1;
        }
        return previous;
    },
    nextInt: function(value, min, max) {
        return (value + 1) % max;
    },
    previousInt: function(value, min, max) {
        return value - 1 < min ? (2 * max + value - 1) % max : value - 1;
    },
};

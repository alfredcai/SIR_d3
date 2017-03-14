const d3 = require('d3');

module.exports = {
    width: self.frameElement ? 800 : innerWidth - 200,
    height: self.frameElement ? 600 : innerHeight - 120,
    padding: 2, // separation between same-color circles
    clusterPadding: 6, // separation between different-color circles
    maxRadius: 9,
    totalNumber: 500,
    clusterNumber: 3,
    color: d3.scale.category10()
        .domain(d3.range(self.clusterNumber)),
    intervalTimeMS: {
        toInfect: 1000,
        toRecover: 1000,
        toSuscept: 1000
    },
    parameters: {
        alpha: 0.2,
        beta: 0.8,
        gamma: 0.3
    }
}
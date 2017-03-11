const d3 = require('d3');
const setting = require('../script/setting')

var clusters = new Array(setting.clusterNumber),
    dataPoints = createSusceptibleDataPoints(setting.totalNumber),
    [susceptible, infectious, recovered] = [0, 0, 0]
    
var force = d3.layout.force()
    .nodes(dataPoints)
    .size([setting.width, setting.height])
    .gravity(.02)
    .charge(0)
    .on("tick", tick)
    .start()

function createDataPoints(n) {
    return d3.range(n).map(() => {
        let i = Math.floor(Math.random() * setting.clusterNumber),
            r = setting.maxRadius,
            node = {
                cluster: i,
                radius: r
            };
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = node;
        switch (i) {
            case 0: susceptible++; break;
            case 1: infectious++; break;
            case 2: recovered++; break;
            default: break;
        }
        return node;
    });
}

function createSusceptibleDataPoints(n) {
    [susceptible, infectious, recovered] = [n, 0, 0];
    let array = d3.range(n).map(() => {
        let node = {
            cluster: 0,
            radius: setting.maxRadius
        };
        return node;
    })
    clusters[0] = array[0];
    return array;
}

function tick(e) {
    circle
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
    return function (d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;
        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
        }
    };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(dataPoints);
    return function (d) {
        var r = d.radius + setting.maxRadius + 
                Math.max(setting.padding, setting.clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit((quad, x1, y1, x2, y2) => {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + 
                        (d.cluster === quad.point.cluster ? 
                            setting.padding : setting.clusterPadding);
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}

function redrawCircle(circle) {
    circle.style(
        'fill', d => color(d.cluster)
    )
}
function becomeInfect() {
    let hasChange = 0,
        index = Math.floor(Math.random() * n),
        total = Math.floor(susceptible * s2i),
        thisCluster = clusters[0]
    while (hasChange < total) {
        if (susceptible <= 0) break;
        if (index >= n) index = 0;
        let thisNode = dataPoints[index++];
        if (thisNode.cluster != 0 || thisNode === thisCluster) continue;
        thisNode.cluster = 1;
        susceptible--; infectious++;
        hasChange++;
    }
    redrawCircle();
    updateViewData();
    setTimeout(becomeRecover, toRecoverInterval);
}

function becomeRecover() {
    let hasChange = 0,
        index = Math.floor(Math.random() * n),
        total = Math.floor(infectious * i2r),
        thisCluster = clusters[1]
    while (hasChange < total) {
        if (infectious <= 0) break;
        if (index >= n) index = 0;
        let thisNode = dataPoints[index++];
        if (thisNode.cluster != 1 || thisNode === thisCluster) continue;
        thisNode.cluster = 2;
        infectious--; recovered++;
        hasChange++;
    }
    redrawCircle();
    updateViewData();
    setTimeout(becomeSuscept, toSusceptInterval);
}

function becomeSuscept() {
    let hasChange = 0,
        index = Math.floor(Math.random() * n),
        total = Math.floor(recovered * r2s),
        thisCluster = clusters[2]
    while (hasChange < total) {
        if (recovered <= 0) break;
        if (index >= n) index = 0;
        let thisNode = dataPoints[index++];
        if (thisNode.cluster != 2 || thisNode === thisCluster) continue;
        thisNode.cluster = 0;
        recovered--; susceptible++;
        hasChange++;
    }
    redrawCircle();
    updateViewData();
    setTimeout(becomeInfect, toInfectInterval);
}

module.exports = {
    clusters:clusters,
    dataPoints:dataPoints,
    people:{
        suscepted:susceptible,
        infected:infectious,
        recovered:recovered
    },
    forceLayout: force,
    updateCircle:redrawCircle
};

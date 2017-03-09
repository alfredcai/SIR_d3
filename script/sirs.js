const d3 = require('d3');

var width = self.frameElement ? 700 : innerWidth - 200,
    height = self.frameElement ? 600 : innerHeight - 120,
    padding = 2, // separation between same-color circles
    clusterPadding = 6, // separation between different-color circles
    maxRadius = 14

var [n, m] = [500, 3] // total number of circles,number of distinct clusters7
var susceptible = 0, infectious = 0, recovered = 0,
    [s2i, i2r, r2s] = [0.2, 0.2, 0.3],
    [toInfectInterval, toRecoverInterval, toSusceptInterval] = [1000, 1000, 1000]

var color = d3.scale.category10()
    .domain(d3.range(m))

// The largest node for each cluster.
var clusters = new Array(m)

var dataPoints = createDataPoints(n);

var force = d3.layout.force()
    .nodes(dataPoints)
    .size([width, height])
    .gravity(.02)
    .charge(0)
    .on("tick", tick)
    .start()

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)

var circle = svg.selectAll("circle")
    .data(dataPoints)
    .enter().append("circle")
    .attr("r", d => d.radius)
    .style({
        "fill": d => color(d.cluster),
        "stroke": "#000",
        "stroke-width": "1px"
    })
    .call(force.drag)

function createDataPoints(n) {
    return d3.range(n).map(() => {
        let i = Math.floor(Math.random() * m),
            r = Math.ceil(Math.random() * maxRadius + 0.1),
            node = {
                cluster: i,
                radius: 9
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

function tick(e) {
    circle
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function redrawCircle() {
    circle
        .style('fill', d => color(d.cluster))
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
        var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit((quad, x1, y1, x2, y2) => {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
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

setTimeout(function () {
    console.log('susceptible:' + susceptible + ",infectious:" + infectious + ",recovered:" + recovered)
    becomeInfect();
}, toInfectInterval)

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

function updateViewData() {
    d3.select('#total').text(n)
    d3.select('#susceptible').text(susceptible).style("color",color(0))
    d3.select('#infectious').text(infectious).style("color",color(1))
    d3.select('#recovered').text(recovered).style("color",color(2))
}

function updateBackEndData() {
    n = d3.select('#total_form').attr('value');
    dataPoints = createDataPoints(n);
    
}

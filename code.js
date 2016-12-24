var width = 960,
    height = 500,
    padding = 2, // separation between same-color circles
    clusterPadding = 8, // separation between different-color circles
    maxRadius = 14;

var n = 300, // total number of circles
    m = 3, // number of distinct clusters
    susceptible = infectious = recovered = 0,
    s2i = 0.3, i2r = 0.2, r2s = 0.3

var color = d3.scale.category10()
    .domain(d3.range(m));

// The largest node for each cluster.
var clusters = new Array(m);

var dataPoints = d3.range(n).map(() => {
    let i = Math.floor(Math.random() * m),
        //r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        r = Math.random() * (maxRadius - 1) + 0.5,
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

var force = d3.layout.force()
    .nodes(dataPoints)
    .size([width, height])
    .gravity(.02)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var circle = svg.selectAll("circle")
    .data(dataPoints)
    .enter().append("circle")
    .attr("r", d => d.radius)
    .style({
        "fill": d => color(d.cluster),
        "stroke": "#000",
        "stroke-width": "1px"
    })
    .call(force.drag);

function tick(e) {
    circle
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function intervalEvent() {
    /*
        3 seconds susceptible --> infectious
        3 seconds infectious --> recovered
        3 seconds recovered --> susceptible
        9 seconds use in one event
     */
    let toInfectInterval = 2000,
        toRecoverInterval = 2500,
        toSusceptInterval = 3000,
        eventInterval = Math.max(toInfectInterval, toRecoverInterval, toSusceptInterval);
    console.log('susceptible:' + susceptible + ",infectious:" + infectious + ",recovered:" + recovered)
    setTimeout(becomeInfect, toInfectInterval);
    setTimeout(becomeRecover, toRecoverInterval);
    setTimeout(becomeSuscept, toSusceptInterval);
    setTimeout(intervalEvent, eventInterval);
}

setTimeout(intervalEvent, 5000);

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

var width = 960,
    height = 500,
    padding = 4, // separation between same-color circles
    clusterPadding = 8, // separation between different-color circles
    maxRadius = 12;

var n = 100, // total number of circles
    m = 3, // number of distinct clusters
    s = i = r = 0,
    s2i = 0.1, i2r = 0.2, r2s = 0.1

var color = d3.scale.category10().domain(d3.range(m));

// The largest node for each cluster.
var clusters = new Array(m);

var dataPoints = d3.range(n).map(() => {
    let i = Math.floor(Math.random() * m),
        //r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        r = maxRadius,
        node = {
            cluster: i,
            radius: r
        };
    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = node;
    switch (i) {
        case 0: s++; break;
        case 1: i++; break;
        case 2: r++; break;
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
    drawCircle(e);
    // console.log('tick');
}

function timeOutFunction() {
    //let i = Math.floor(Math.random() * m)
    let infect = Math.floor(s * s2i),
        recover = Math.floor(i * i2r),
        index = 0, count = 0
    if (s - infect > 0) s -= infect;
    // while (count < infect) {
    //     if (index > n) break;
    //     let myNode = dataPoints[index++];
    //     if (myNode.cluster != 0) continue;
    //     let cluster = cluster[myNode.cluster]
    //     if (cluster === myNode) continue;
    //     myNode.cluster = 1;
    //     s--; r++; count++;
    // }
}

function changeDataPoints(formTag, toTag, total) {
    let index = 0, count = 0
    while (count < total) {
        if (index > n) break;
        let myNode = dataPoints[index++];
        if (myNode.cluster != formTag) continue;
        let cluster = cluster[myNode.cluster]
        if (cluster === myNode) continue;
        myNode.cluster = toTag;
        s--; r++; count++;
    }
}

function drawCircle(e) {
    circle
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    console.log('drawCircle');
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

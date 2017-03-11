const d3 = require('d3');
const setting = require('../script/setting');
var core = require('../script/visualize');

var clusters = core.clusters,
    dataPoints = core.dataPoints,
    color = setting.color,
    susceptible = core.people.suscepted,
    infectious = core.people.infected,
    recovered = core.people.recovered

var svg = d3.select("svg")
    .attr("width", setting.width)
    .attr("height", setting.height)

var circle = svg.selectAll("circle")
    .data(dataPoints)
    .enter().append("circle")
    .attr("r", d => d.radius)
    .style({
        "fill": d => color(d.cluster),
        "stroke": "#000",
        "stroke-width": "1px"
    })
    .call(core.forceLayout.drag)

// setTimeout(function () {
//     console.log('susceptible:' + susceptible +
//         ',infectious:' + infectious +
//         ',recovered:' + recovered)
//     becomeInfect();
// }, setting.intervalTimeMS.toInfect)

// function becomeInfect() {
//     let hasChange = 0,
//         index = Math.floor(Math.random() * n),
//         total = Math.floor(susceptible * s2i),
//         thisCluster = clusters[0]
//     while (hasChange < total) {
//         if (susceptible <= 0) break;
//         if (index >= n) index = 0;
//         let thisNode = dataPoints[index++];
//         if (thisNode.cluster != 0 || thisNode === thisCluster) continue;
//         thisNode.cluster = 1;
//         susceptible--; infectious++;
//         hasChange++;
//     }
//     redrawCircle();
//     updateViewData();
//     setTimeout(becomeRecover, toRecoverInterval);
// }

// function becomeRecover() {
//     let hasChange = 0,
//         index = Math.floor(Math.random() * n),
//         total = Math.floor(infectious * i2r),
//         thisCluster = clusters[1]
//     while (hasChange < total) {
//         if (infectious <= 0) break;
//         if (index >= n) index = 0;
//         let thisNode = dataPoints[index++];
//         if (thisNode.cluster != 1 || thisNode === thisCluster) continue;
//         thisNode.cluster = 2;
//         infectious--; recovered++;
//         hasChange++;
//     }
//     redrawCircle();
//     updateViewData();
//     setTimeout(becomeSuscept, toSusceptInterval);
// }

// function becomeSuscept() {
//     let hasChange = 0,
//         index = Math.floor(Math.random() * n),
//         total = Math.floor(recovered * r2s),
//         thisCluster = clusters[2]
//     while (hasChange < total) {
//         if (recovered <= 0) break;
//         if (index >= n) index = 0;
//         let thisNode = dataPoints[index++];
//         if (thisNode.cluster != 2 || thisNode === thisCluster) continue;
//         thisNode.cluster = 0;
//         recovered--; susceptible++;
//         hasChange++;
//     }
//     redrawCircle();
//     updateViewData();
//     setTimeout(becomeInfect, toInfectInterval);
// }

// function updateViewData() {
//     d3.select('#total').text(n)
//     d3.select('#susceptible').text(susceptible).style("color", color(0))
//     d3.select('#infectious').text(infectious).style("color", color(1))
//     d3.select('#recovered').text(recovered).style("color", color(2))
// }

// function updateBackEndData() {
//     n = d3.select('#total_form').attr('value');
//     dataPoints = createDataPoints(n);
// }

const d3 = require('d3');
const setting = require('../script/Setting');
var core = require('../script/Visualize');

var clusters = core.clusters,
    dataPoints = core.dataPoints,
    color = setting.color

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

function becomeInfect() {
    console.log('fxxxk');
    dataPoints = core.updateDataPoints(1);
    core.updateCircle(circle);
    updateViewData();
    setTimeout(becomeRecover, setting.intervalTimeMS.toRecover);
}

function becomeRecover() {
    dataPoints = core.updateDataPoints(2);
    core.updateCircle(circle);
    updateViewData();
    setTimeout(becomeSuscept, setting.intervalTimeMS.toSuscept);
}

function becomeSuscept() {
    dataPoints = core.updateDataPoints(0);
    core.updateCircle(circle);
    updateViewData();
    setTimeout(becomeInfect, setting.intervalTimeMS.toInfect);
}

function updateViewData() {
    var susceptible = core.people[0],
        infectious = core.people[1],
        recovered = core.people[2]
    d3.select('#total').text(setting.totalNumber)
    d3.select('#susceptible').text(susceptible).style("color", color(0))
    d3.select('#infectious').text(infectious).style("color", color(1))
    d3.select('#recovered').text(recovered).style("color", color(2))
}

updateViewData();
setTimeout(function () {
    becomeInfect();
}, setting.intervalTimeMS.toInfect + 2000);

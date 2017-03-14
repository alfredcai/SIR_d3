const d3 = require('d3');
const config = require('../script/Config');
var core = require('../script/Visualize');

var dataPoints = core.dataPoints,
    color = config.color,
    params = [config.parameters.alpha, config.parameters.beta, config.parameters.gamma]

var svg = d3.select("svg")
    .attr("width", config.width)
    .attr("height", config.height)

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
    dataPoints = core.updateDataPoints(1, params[0]);
    core.updateCircle(circle);
    updateViewData();
    setTimeout(becomeRecover, config.intervalTimeMS.toRecover);
}

function becomeRecover() {
    dataPoints = core.updateDataPoints(2, params[1]);
    core.updateCircle(circle);
    updateViewData();
    setTimeout(becomeInfect, config.intervalTimeMS.toInfect);
}

function updateViewData() {
    d3.select('#total').text(config.totalNumber)
    d3.select('#susceptible').text(core.people[0]).style("color", color(0))
    d3.select('#infectious').text(core.people[1]).style("color", color(1))
    d3.select('#recovered').text(core.people[2]).style("color", color(2))
    d3.select('#alpha').attr("value", params[0])
    d3.select('#beta').attr("value", params[1])
}

function getViewData() {
    let a = d3.select('#alpha').property('value'),
        b = d3.select('#beta').property('value'),
        err = { status: false, value: '' }
    a = parseFloat(a), b = parseFloat(b)
    if (!a || a < 0 || a > 1) {
        err.status = true
        err.value = err.value.concat('alpha is not between 0 and 1')
    }
    if (!b || b < 0 || b > 1) {
        err.status = true
        if (err.value.length > 1) err.value = err.value.concat(', ')
        err.value = err.value.concat('beta is not between 0 and 1')
    }
    if (err.status == false) {
        params[0] = a
        params[1] = b
        resetCircle()
    } else {
        d3.select('.data_table')
            .append('code')
            .attr('class', 'error')
            .text(err.value)
    }
}

function resetCircle() {
    core.resetDataPoints();
    updateViewData()
    core.updateCircle(circle)
}

updateViewData();
setTimeout(function () {
    becomeInfect();
}, config.intervalTimeMS.toInfect + 2000);

/**
 * homogeneous networks
 */
const d3 = require('d3');
const util = require('../script/Utility');
const config = require('../script/Config');
const core = require('../script/Visualize');

var coefficient = 2;
var params = [config.parameters.alpha, config.parameters.beta, config.parameters.gamma],
    dataPoints = core.dataPoints
var links = createLinks(config.totalNumber, coefficient);

var svg = d3.select("svg")
    .attr("width", config.width)
    .attr("height", config.height)

var forceLayout = core.forceLayout
    .links(links)
    .linkDistance(60)
    .start()

var circle = svg.selectAll("circle")
    .data(dataPoints)
    .enter().append("circle")
    .attr("r", d => d.radius)
    .style({
        "fill": d => config.color(d.cluster),
        "stroke": "#000",
        "stroke-width": "1px"
    })
    .call(forceLayout.drag)

var path = svg.selectAll("line")
    .data(links)
    .enter()
    .append('line')
    .style({'stroke':'#080808'})

function createLinks(n, m) {
    let data = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            let target = j % 2 == 0 ?
                util.nextInt(i + j / 2, 0, n) :
                util.previousInt(i - (j - 1) / 2, 0, n);
            let link = {
                'source': i,
                'target': target
            }
            data.push(link)
        }
    }
    return data;
}

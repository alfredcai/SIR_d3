/**
 * homogeneous networks
 */
const d3 = require('d3');
const util = require('../script/Utility');
const config = require('../script/Config');
const core = require('../script/Visualize');

const coefficient = 2;
const params = [config.parameters.alpha, config.parameters.beta, config.parameters.gamma];
let dataPoints = core.dataPoints;
const links = createLinks(config.totalNumber, coefficient);

const svg = d3
    .select('svg')
    .attr('width', config.width)
    .attr('height', config.height);

const forceLayout = core.forceLayout
    .links(links)
    .linkDistance(60)
    .start();

const circle = svg
    .selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', (d) => d.radius)
    .style({
        fill: (d) => config.color(d.cluster),
        stroke: '#000',
        'stroke-width': '1px',
    })
    .call(forceLayout.drag);

const path = svg
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .style({ stroke: '#000' });

function createLinks(n, m) {
    const data = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const target = j % 2 === 0 ? util.nextInt(i + j / 2, 0, n) : util.previousInt(i - (j - 1) / 2, 0, n);
            const link = {
                source: i,
                target: target,
            };
            data.push(link);
        }
    }
    return data;
}

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
    setTimeout(becomeSuscept, config.intervalTimeMS.toSuscept);
}

function becomeSuscept() {
    dataPoints = core.updateDataPoints(0, params[2]);
    core.updateCircle(circle);
    updateViewData();
    setTimeout(becomeInfect, config.intervalTimeMS.toInfect);
}

function updateViewData() {
    d3.select('#total').text(config.totalNumber);
    d3.select('#susceptible')
        .text(core.people[0])
        .style('color', config.color(0));
    d3.select('#infectious')
        .text(core.people[1])
        .style('color', config.color(1));
    d3.select('#recovered')
        .text(core.people[2])
        .style('color', config.color(2));
    d3.select('#alpha').text(config.parameters.alpha);
    d3.select('#beta').text(config.parameters.beta);
    d3.select('#gamma').text(config.parameters.gamma);
}

updateViewData();
setTimeout(function() {
    becomeInfect();
}, config.intervalTimeMS.toInfect + 2000);

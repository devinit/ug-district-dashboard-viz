import $ from 'jquery';
import * as d3 from "d3";

export default function lineChartMultipleVertical(target, dataset, config) {

    const data = dataset;
    const id = target.replace('#', '');
    const parent = document.getElementById(id),
          svg = d3.select(parent).append('svg'),
          svgWidth = parent.clientWidth,
          svgHeight = parent.clientHeight;

    svg.attr("width", svgWidth).attr("height", svgHeight);

    const margin = {top: 20, right: 20, bottom: 30, left: 70},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // group the data: I want to draw one line per group
    const sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(d => d.group)
        .entries(data);

    // Add X axis
    const x = config.xAxis()
        .domain(d3.extent(data, d => +d[config.xAxisKey]))
        .range([0, width]);
    g.append("g")
        .attr("class", "charts__text charts__text--x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisBottom(x)
                .tickFormat(config.xAxisFormat)
        );

    // Add Y axis
    const y = config.yAxis()
        .domain([0, d3.max(data, d => +d[config.yAxisKey])])
        .nice()
        .range([height, 0]);
    g.append("g")
        .attr("class", "charts__text charts__text--y-axis")
        .call(
            d3.axisLeft(y)
                .tickFormat(config.yAxisFormat)
        );

    // Add X axis label:
    if (config.xAxisLabel) {
        g.append("text")
            .attr("class", "charts__text charts__text--x-axis-label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.top + 20)
            .text(config.xAxisLabel);
    }

    // Y axis label:
    if (config.yAxisLabel) {
        g.append("text")
            .attr("class", "charts__text charts__text--y-axis-label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", 0)
            .text(config.yAxisLabel);
    }

    // color palette
    const res = sumstat.map(d => d.key) // list of group names
    const color = d3.scaleOrdinal()
        .domain(res)
        .range(['#377eb8','#e41a1c','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    // Draw the line
    g.append("g")
        .attr("class", "charts__data")
        .selectAll(".line")
            .data(sumstat)
            .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", d => color(d.key))
                .attr("stroke-width", 1.5)
                .attr("d", d =>
                    d3.line()
                        .x(d => x(+d[config.xAxisKey]))
                        .y(d => y(+d[config.yAxisKey]))
                        (d.values)
                )
                .attr("class", (d, i, n) => `charts__data--line-vertical charts__data--${i}`);

    // animation function
    const animate = () => {
        g.selectAll(".charts__data--line-vertical")
            .interrupt()
            .attr("stroke-dasharray", (d, i, n) => {
                const l = n[i].getTotalLength();
                return l + ' ' + l;
            })
            .attr("stroke-dashoffset",  (d, i, n) => {
                return n[i].getTotalLength();
            })
            .transition()
            .duration(5000)
            .ease(d3.easeQuadInOut)
            .attr("stroke-dashoffset", 0);
    };

    // animate on load
    animate();

    // add animate handler to button
    $(`.button[data-type="animate"][data-id="${id}"]`).on('click', e => animate());
}

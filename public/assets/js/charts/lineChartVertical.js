import * as d3 from "d3";

export default function lineChartVertical(target, dataset) {

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

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);
    g.append("g")
        .attr("class", "charts__text charts__text--x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.value)])
        .nice()
        .range([height, 0]);
    g.append("g")
        .attr("class", "charts__text charts__text--y-axis")
        .call(d3.axisLeft(y));

    // Add the line
    g.append("g")
        .attr("class", "charts__data")
        .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
            )
            .attr("class", (d, i, n) => `charts__data--line-vertical charts__data--${i}`);
}

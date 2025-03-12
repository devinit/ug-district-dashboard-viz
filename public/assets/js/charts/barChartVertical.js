import * as d3 from "d3";

export default function barChartVertical(target, dataset) {

    const data = dataset;
    const [col_x, col_y] = data.columns;
    const id = target.replace('#', '');
    const parent = document.getElementById(id),
          svg = d3.select(parent).append('svg'),
          svgWidth = parent.clientWidth,
          svgHeight = parent.clientHeight;

    svg.attr("width", svgWidth).attr("height", svgHeight);

    const margin = {top: 20, right: 20, bottom: 70, left: 70},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    const x = d3.scaleBand()
        .range([0, width ])
        .domain(data.map(d => d[col_x]))
        .padding(0.2);
    g.append("g")
        .attr("class", "charts__text charts__text--x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[col_y])])
        .nice()
        .range([height, 0]);
    g.append("g")
        .attr("class", "charts__text charts__text--y-axis")
        .call(d3.axisLeft(y));

    // Bars
    g.append("g")
        .attr("class", "charts__data")
        .selectAll("bar")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", d => x(d[col_x]))
                .attr("y", d => y(d[col_y]))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d[col_y]))
                .attr("fill", "#69b3a2")
                .attr("class", (d, i, n) => `charts__data--bar-vertical charts__data--${i}`);
}

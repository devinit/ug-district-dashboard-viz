import * as d3 from "d3";

export default function lineChartHorizontal(target, dataset, domainY) {

    const data = dataset.data;
    const parent = document.getElementById(target),
          svg = d3.select(parent).append('svg'),
          svgWidth = parent.clientWidth,
          svgHeight = parent.clientHeight;

    svg.attr("width", svgWidth).attr("height", svgHeight);

    const margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(d3.extent(data, d => { return new Date(d.year); }));
    y.domain([0, domainY]);


    data.forEach((element, index) => {

        // define the line
        const valueline = d3.line()
            .x(d => { return x(d.year); })
            .y(d => { return y(d.values[index].value); });

        // Add the valueline path.
        g.append("path")
            .data(element)
            .attr("class", "line")
            .attr("d", valueline);

    });

    g.append("g")
        .attr("class", "axis axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(d3.timeYear));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")

    g.append("text")
        .attr("class", "title")
        .attr("x", 20)
        .attr("y", 20)
        .text(`${dataset.title} %`);

}

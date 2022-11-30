import $ from 'jquery';
import * as d3 from "d3";

export default function lineChartStackedArea(target, dataset, config) {

    const data = dataset;
    const columns = data.columns;
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

    // List of groups = header of the csv files
    const keys = data.columns.slice(1)

    // stack the data?
    const stackedData = d3.stack()
        .keys(keys)
        (data);

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
        .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
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
    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf']);

    // Add data holder
    const chart_data = g.append("g")
        .attr("class", "charts__data");

    // update function
    const update = hidden => {

        // copy the orignal data
        const modifiedData = $.extend(true, [], data);

        // set hidden values to zero
        if (hidden && hidden.length) {
            modifiedData.forEach(el => hidden.forEach(key => el[key] = 0));
        }

        // redo the stacked data
        const chartData = d3.stack()
            .keys(keys)
            (modifiedData);

        const areas = chart_data
            .selectAll("path")
            .data(chartData, d => d.key);

        areas
            .enter()
            .append("path")
            .style("fill", d => color(d.key))
            .attr("class", (d, i, n) => `charts__data--stacked-area charts__data--${i}`)
            .attr("d", d3.area()
                .x(d => x(d.data[config.xAxisKey]))
                .y0(y(0))
                .y1(y(0))
            )
            .transition()
            .duration(1000)
            .ease(d3.easeQuadInOut)
            .attr("d", d3.area()
                .x(d => x(d.data[config.xAxisKey]))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
            );

        areas
            .transition()
            .duration(750)
            .ease(d3.easeQuadInOut)
            .attr("d", d3.area()
                .x(d => x(d.data[config.xAxisKey]))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
            );

        areas.exit().remove();
    };

    // update on load
    update();

    // update handler for form inputs
    $(`[data-type="redraw"][data-id="${id}"]`).on('change', e => {
        const checkboxes = $(e.currentTarget).find('[type="checkbox"]');
        const hidden = checkboxes.map((i, el) => {
            if (!$(el).prop('checked')) {
                return $(el).val();
            };
        }).get();
        update(hidden);
    });
}

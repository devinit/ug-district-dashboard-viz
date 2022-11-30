import * as d3 from "d3";

export default function barChartStackedVertical(target, dataset) {

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

    // List of subgroups = header of the csv files
    const subgroups = data.columns.slice(1);

    // List of groups = value of the first column called group
    const groups = d3.map(data, d => d.group).keys();

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
    g.append("g")
        .attr("class", "charts__text charts__text--x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.sum(d3.values(d), v => Number.isNaN(+v) ? 0 : +v))])
        .nice()
        .range([ height, 0]);
    g.append("g")
        .attr("class", "charts__text charts__text--y-axis")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
        .keys(subgroups)
        (data)

    // set a local variable for stack indices
    const stack = d3.local();

    // Show the bars
    g.append("g")
        .attr("class", "charts__data")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
            .each((d, i, n) => stack.set(n[i], i))
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .enter().append("rect")
                .attr("class", (d, i, n) => `charts__data--bar-stacked-vertical charts__data--${stack.get(n[i])}`)
                .attr("x", d => x(d.data.group))
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .attr("width", x.bandwidth());
}

import $ from 'jquery';
import * as d3 from "d3";

const createElement = props => {
    const { attrs = {}, tag = 'div' } = props;
    const el = $(document.createElement(tag));
    $.each(attrs, (k, v) => {
        el.attr(k, v);
    });
    return el;
}

const dateParser = d => {
    const obj = Object.assign({}, d);
    obj.date = d3.timeParse("%Y-%m-%d")(d.date);
    return obj;
}

const yearParser = d => {
    const obj = Object.assign({}, d);
    obj.year = d3.timeParse("%Y")(d.year);
    return obj;
}

export {createElement, dateParser, yearParser}

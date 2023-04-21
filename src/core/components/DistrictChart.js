import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { handleResize } from '../../charts/echarts/index';
import { updateChart } from '../utils/charts';

const DistrictChart = (props) => {
  const ref = useRef(null);
  const [chart, setChart] = useState();

  useEffect(() => {
    if (ref.current) {
      const chartInstance = window.echarts.init(ref.current);
      setChart(chartInstance);
      handleResize(chartInstance, ref.current);
    }
  }, []);

  useEffect(() => {
    if (chart && props.data) {
      const { subCounty, config, data, years } = props;
      updateChart({ data, subCounty, years, chart, config });
    }
  }, [chart, props.data]);

  return <div ref={ref} style={{ height: props.height || '450px' }} />;
};

DistrictChart.propTypes = {
  config: PropTypes.object,
  subCounty: PropTypes.string,
  data: PropTypes.array,
  years: PropTypes.array,
  height: PropTypes.string,
};

DistrictChart.defaultProps = {
  subCounty: 'all',
};

export default DistrictChart;

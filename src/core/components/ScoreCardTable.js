/** @jsx jsx */
import { jsx } from '@emotion/react';
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from '../../components/Table';
import { getTableCellColor } from '../utils/tables';

const ScoreCardTable = (props) => {
  const scoreCardLegendData = [
    { color: '#3b8c62', caption: 'Achieved' },
    { color: '#f7a838', caption: 'Moderately satisfactory' },
    { color: '#cd2b2a', caption: 'Not achieved' },
    { color: '#cdcfd1', caption: 'Not assessed' }
  ];
  useEffect(() => {
    const legendContainer = document.querySelector('.score-table-legend');

    const legendContent = `${scoreCardLegendData
      .map(
        (item) =>
          `<span>
            <i style="background:${item.color};border-radius:1px;width:40px;"></i>
            <label>${item.caption}</label>
          </span>`
      )
      .join('')}`;
    legendContainer.innerHTML = legendContent;
  });

  const renderRows = (rows, header = false) =>
    rows.map((row, index) => (
      <tr key={index}>
        {row.map((cell, key) =>
          header ? (
            <th key={key}>{cell}</th>
          ) : (
            <td
              css={{
                backgroundColor: getTableCellColor(cell, props.thresholds),
                color: getTableCellColor(cell, props.thresholds) ? 'white' : 'black'
              }}
              key={key}
            >
              {Number(cell) === 0 ? '' : cell}
            </td>
          )
        )}
      </tr>
    ));

  return (
    <>
      <div className="score-table-legend custom-legend"></div>
      <Table>
        <thead>
          {props.rows &&
            renderRows(
              props.rows.filter((row, index) => index === 0),
              true
            )}
        </thead>
        <tbody>{props.rows && renderRows(props.rows.filter((row, index) => index > 0))}</tbody>
      </Table>
    </>
  );
};

ScoreCardTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.array),
  thresholds: PropTypes.object
};

export default ScoreCardTable;

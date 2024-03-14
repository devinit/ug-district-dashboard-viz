/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import Table from '../../components/Table';
import { getTableCellColor } from '../utils/tables';

const ScoreCardTable = (props) => {
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
                color: getTableCellColor(cell, props.thresholds) ? 'white' : 'black',
              }}
              key={key}
            >
              {cell}
            </td>
          ),
        )}
      </tr>
    ));

  return (
    <Table>
      <thead>
        {renderRows(
          props.rows.filter((row, index) => index === 0),
          true,
        )}
      </thead>
      <tbody>{renderRows(props.rows.filter((row, index) => index > 0))}</tbody>
    </Table>
  );
};

ScoreCardTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.array),
  thresholds: PropTypes.object,
};

export default ScoreCardTable;

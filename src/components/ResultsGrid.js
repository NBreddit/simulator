import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import './App.css';
import './flairs.css';

const ResultsGrid = (props) => (  
    
    <Table striped condensed>
      <tbody>
        {props.items.map((row, index) =>
            <tr key={index}>
            {row.map((col, index) =>
                <td key={index}>                   
                    <div className={col.thumb}/>
                    {/*<img src={col.rarity} className="rarity" alt="rarity"/>*/}
                    {props.type ==='all' ? ( <span>x{col.count}</span> ): null}
                </td>
            )}
            </tr>
        )}
      </tbody>
    </Table>
);


ResultsGrid.propTypes = {  
  items: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
};

export default ResultsGrid;  
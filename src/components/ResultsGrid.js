import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import './App.css';
import ThreeStar from '../images/3star.png';
import FourStar from '../images/4star.png';
import FiveStar from '../images/5star.png';

const ResultsGrid = (props) => (  
    
    <Table striped condensed>
      <tbody>
        {props.items.map((row, index) =>
            <tr key={index}>
            {row.map((col, index) =>
                <td key={index}>                   
                    <div className={col.thumb + " " + (col.type.includes('b-featured') ? 'featured' : '')} />
                    {col.rarity === '5' ? (<img src={FiveStar} className="rarity" alt="rarity"/>) : null } 
                    {col.rarity === '4' ? (<img src={FourStar} className="rarity" alt="rarity"/>) : null } 
                    {col.rarity === '3' ? (<img src={ThreeStar} className="rarity" alt="rarity"/>) : null } 
                    {props.type ==='all' ? ( <span className="counter">x{col.count}</span> ): null}
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
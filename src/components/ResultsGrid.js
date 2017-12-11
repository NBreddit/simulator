import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import './App.css';
import ThreeStar from '../images/3star.png';
import FourStar from '../images/4star.png';
import FiveStar from '../images/5star.png';
import ThreeStarBg from '../images/3bg.png';
import FourStarBg from '../images/4bg.png';
import FiveStarBg from '../images/5bg.png';
import hrt from '../images/hrt.png';
import bod from '../images/bod.png';
import brv from '../images/brv.png';
import skl from '../images/skl.png';
import wis from '../images/wis.png';

const ResultsGrid = (props) => (

    <Table striped condensed>
      <tbody>
        {props.items.map((row, index) =>
            <tr key={index}>
            {row.map((col, index) =>
                <td key={index}>
                    <div className={col.thumb + " " + (col.type.includes('b-featured') ? 'featured' : '')} />
                    {col.rarity === '5' ? (
                    <div>
                        <img src={FiveStar} className="rarity" alt="rarity"/>
                        <img src={FiveStarBg} className="raritybg" alt="raritybg"/>
                    </div>) : null }
                    {col.rarity === '4' ? (
                    <div>
                        <img src={FourStar} className="rarity" alt="rarity"/>
                        <img src={FourStarBg} className="raritybg" alt="raritybg"/>
                    </div>) : null }
                    {col.rarity === '3' ? (
                    <div>
                        <img src={ThreeStar} className="rarity" alt="rarity"/>
                        <img src={ThreeStarBg} className="raritybg" alt="raritybg"/>
                    </div>) : null }
                    {col.unitType === 'hrt' ? (<img src={hrt} className="unitType" alt="unitType"/>) : null }
                    {col.unitType === 'bod' ? (<img src={bod} className="unitType" alt="unitType"/>) : null }
                    {col.unitType === 'brv' ? (<img src={brv} className="unitType" alt="unitType"/>) : null }
                    {col.unitType === 'skl' ? (<img src={skl} className="unitType" alt="unitType"/>) : null }
                    {col.unitType === 'wis' ? (<img src={wis} className="unitType" alt="unitType"/>) : null }
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

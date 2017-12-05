import React from 'react';
import PropTypes from 'prop-types';
import './App.css';

const Dropdown = (props) => (  
  <div className="form-group">
    <select
      name={props.name}
      value={props.selectedOption}
      onChange={props.controlFunc}
      className="form-select">
      <option value="">{props.placeholder}</option>
      {props.options.map((opt, index) => {
        return (
          <option className={(new Date(opt.value).valueOf() > new Date().valueOf() ? 'highlight' : '') }
            key={index}
            value={opt.name}>{opt.name}</option>
        );
      })}
    </select>
  </div>
);

Dropdown.propTypes = {  
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default Dropdown;  
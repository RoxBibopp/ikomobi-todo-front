import React from 'react';
import Select from 'react-select';

const options = [
  { value: '', label: 'Toutes' },
  { value: 'a faire', label: 'À faire' },
  { value: 'en cours', label: 'En cours' },
  { value: 'terminé', label: 'Terminé' },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '15px',
    background: '#f0efff',
    boxSizing: 'border-box',
    boxShadow: '5px 5px 10px #ada9b8, -5px -5px 10px #ffffff;',
    padding: '4px 20px',
    border: 'none',
  }),
  option: (provided, state) => ({
    ...provided,
    margin: '10px',
    backgroundColor: state.isSelected
    ? '#f0ecfa'
    : state.isFocused
    ? 'linear-gradient(145deg,rgb(245, 241, 255), #f9f0ff)'
    : '#f0ecfa',
    padding: 0,
    background: '',
    color: state.isSelected ? 'black' : '#ada9b8',
    boxSizing: 'border-box',
    cursor: 'pointer',
  }),
  menu: (provided) => ({
    ...provided,
    boxSizing: 'border-box',
    marginTop: '20px',
    borderRadius: '10px',
    background: '#f0ecfa',
    overflow: 'hidden',
    boxShadow: '7px 7px 11px #d2cae6, -7px -7px 11px #fff6ff',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    overflow: 'hidden'
  }),
};

const CustomDropdown = ({ value, onChange }) => {
  return (
    <Select
      value={options.find(option => option.value === value)}
      onChange={(selectedOption) => onChange(selectedOption.value)}
      options={options}
      styles={customStyles}
      isSearchable={false}
    />
  );
};

export default CustomDropdown;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import StarRating from '../../atoms/StarRating/StarRating';
import './AddInterestForm.css';

/**
 * AddInterestForm Molecule - Form to add new technology interest
 * Includes technology name input and level rating
 */
const AddInterestForm = ({ onAddInterest, isLoading = false }) => {
  const [technology, setTechnology] = useState('');
  const [level, setLevel] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (technology.trim()) {
      onAddInterest({
        name: technology.trim(),
        level,
      });
      setTechnology('');
      setLevel(3);
    }
  };

  return (
    <form className="molecule-add-interest-form" onSubmit={handleSubmit}>
      <div className="molecule-add-interest-form__inputs">
        <Input
          type="text"
          placeholder="Nombre de la tecnología (ej. Spring AI)"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          disabled={isLoading}
        />

        <div className="molecule-add-interest-form__rating">
          <label htmlFor="level-rating" className="molecule-add-interest-form__label">
            Nivel de importancia/dominio (1-5)
          </label>
          <StarRating
            value={level}
            onChange={setLevel}
            size="md"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={!technology.trim() || isLoading}
        isLoading={isLoading}
      >
        Añadir Interés
      </Button>
    </form>
  );
};

AddInterestForm.propTypes = {
  onAddInterest: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default AddInterestForm;

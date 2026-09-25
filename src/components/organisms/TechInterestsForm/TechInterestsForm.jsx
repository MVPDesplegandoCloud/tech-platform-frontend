import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../../atoms/Button/Button';
import AddInterestForm from '../../molecules/AddInterestForm/AddInterestForm';
import InterestItem from '../../molecules/InterestItem/InterestItem';
import './TechInterestsForm.css';

/**
 * TechInterestsForm Organism - Complete tech interests management
 * Allows adding, editing, deleting, and rating technology interests
 */
const TechInterestsForm = ({ 
  initialInterests = [],
  onSave,
  isLoading = false,
}) => {
  const [interests, setInterests] = useState(initialInterests);

  /**
   * Add new interest
   */
  const handleAddInterest = useCallback((newInterest) => {
    const interest = {
      id: Date.now().toString(),
      ...newInterest,
    };
    setInterests((prev) => [...prev, interest]);
  }, []);

  /**
   * Update interest level
   */
  const handleUpdateLevel = useCallback((id, level) => {
    setInterests((prev) =>
      prev.map((interest) =>
        interest.id === id ? { ...interest, level } : interest
      )
    );
  }, []);

  /**
   * Delete interest
   */
  const handleDeleteInterest = useCallback((id) => {
    setInterests((prev) => prev.filter((interest) => interest.id !== id));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(interests);
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  return (
    <form className="organism-tech-interests-form" onSubmit={handleSubmit}>
      <div className="organism-tech-interests-form__section">
        <h3 className="organism-tech-interests-form__subtitle">
          Añadir Nuevo Interés
        </h3>
        <AddInterestForm onAddInterest={handleAddInterest} />
      </div>

      {interests.length > 0 && (
        <div className="organism-tech-interests-form__section">
          <h3 className="organism-tech-interests-form__subtitle">
            Mis Intereses
          </h3>

          <div className="organism-tech-interests-form__table-header">
            <div className="organism-tech-interests-form__col-name">Tecnología</div>
            <div className="organism-tech-interests-form__col-level">Nivel</div>
            <div className="organism-tech-interests-form__col-actions">Acciones</div>
          </div>

          <div className="organism-tech-interests-form__list">
            {interests.map((interest) => (
              <InterestItem
                key={interest.id}
                id={interest.id}
                name={interest.name}
                level={interest.level}
                onLevelChange={(level) => handleUpdateLevel(interest.id, level)}
                onDelete={handleDeleteInterest}
              />
            ))}
          </div>
        </div>
      )}

      <div className="organism-tech-interests-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading || interests.length === 0}
        >
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};

TechInterestsForm.propTypes = {
  initialInterests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
    })
  ),
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default TechInterestsForm;

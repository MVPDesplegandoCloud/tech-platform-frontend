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
  onAddInterest,
  isLoading = false,
  isAdding = false,
  readOnly = false,
  canAdd = false,
}) => {
  const [interests, setInterests] = useState(initialInterests);

  /**
   * Add new interest
   */
  const handleAddInterest = useCallback(async (newInterest) => {
    const savedInterest = onAddInterest ? await onAddInterest(newInterest) : newInterest;
    const interest = {
      id: savedInterest.id || Date.now().toString(),
      ...savedInterest,
    };
    setInterests((prev) => [...prev, interest]);
  }, [onAddInterest]);

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
  const handleSubmit = async () => {
    if (readOnly || !onSave) return;
    try {
      await onSave(interests);
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  return (
    <div className="organism-tech-interests-form">
      {canAdd && (
        <div className="organism-tech-interests-form__section">
          <h3 className="organism-tech-interests-form__subtitle">
            Añadir Nuevo Interés
          </h3>
          <AddInterestForm onAddInterest={handleAddInterest} isLoading={isAdding} />
        </div>
      )}

      {interests.length > 0 && (
        <div className="organism-tech-interests-form__section">
          <h3 className="organism-tech-interests-form__subtitle">
            Mis Intereses
          </h3>

          <div className={`organism-tech-interests-form__table-header${readOnly ? ' organism-tech-interests-form__table-header--readonly' : ''}`}>
            <div className="organism-tech-interests-form__col-name">Tecnología</div>
            <div className="organism-tech-interests-form__col-level">Nivel</div>
            {!readOnly && <div className="organism-tech-interests-form__col-actions">Acciones</div>}
          </div>

          <div className="organism-tech-interests-form__list">
            {interests.map((interest) => (
              <InterestItem
                key={interest.id}
                id={interest.id}
                name={interest.name}
                level={interest.level}
                readonly={readOnly}
                onLevelChange={(level) => handleUpdateLevel(interest.id, level)}
                onDelete={handleDeleteInterest}
              />
            ))}
          </div>
        </div>
      )}

      {!readOnly && (
        <div className="organism-tech-interests-form__actions">
          <Button
            type="button"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading || interests.length === 0}
            onClick={handleSubmit}
          >
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
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
  onSave: PropTypes.func,
  onAddInterest: PropTypes.func,
  isLoading: PropTypes.bool,
  isAdding: PropTypes.bool,
  readOnly: PropTypes.bool,
  canAdd: PropTypes.bool,
};

export default TechInterestsForm;

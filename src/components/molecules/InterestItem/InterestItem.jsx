import React from 'react';
import PropTypes from 'prop-types';
import StarRating from '../../atoms/StarRating/StarRating';
import Icon from '../../atoms/Icon/Icon';
import './InterestItem.css';

/**
 * InterestItem Molecule - Displays a technology interest with rating
 * Shows technology name, rating stars, and action buttons
 */
const InterestItem = ({
  id,
  name,
  level,
  onLevelChange,
  onEdit,
  onDelete,
  readonly = false,
}) => {
  return (
    <div className="molecule-interest-item">
      <div className="molecule-interest-item__name">
        {name}
      </div>

      <div className="molecule-interest-item__rating">
        <StarRating
          value={level}
          onChange={onLevelChange}
          readonly={readonly}
          size="sm"
        />
      </div>

      {!readonly && (
        <div className="molecule-interest-item__actions">
          <button
            type="button"
            className="molecule-interest-item__button molecule-interest-item__button--edit"
            onClick={() => onEdit(id)}
            aria-label={`Edit ${name}`}
            title="Edit"
          >
            <Icon name="edit" size="sm" />
          </button>

          <button
            type="button"
            className="molecule-interest-item__button molecule-interest-item__button--delete"
            onClick={() => onDelete(id)}
            aria-label={`Delete ${name}`}
            title="Delete"
          >
            <Icon name="trash" size="sm" />
          </button>
        </div>
      )}
    </div>
  );
};

InterestItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  onLevelChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
  readonly: PropTypes.bool,
};

export default InterestItem;

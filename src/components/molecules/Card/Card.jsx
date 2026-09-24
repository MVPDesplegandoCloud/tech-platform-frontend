import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card Molecule - Container with consistent styling
 * Used for organizing content sections
 */
const Card = ({
  children,
  title,
  subtitle,
  className = '',
  elevation = 'md',
  ...rest
}) => {
  const cardClass = [
    'molecule-card',
    `molecule-card--elevation-${elevation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass} {...rest}>
      {title && (
        <div className="molecule-card__header">
          <h2 className="molecule-card__title">{title}</h2>
          {subtitle && <p className="molecule-card__subtitle">{subtitle}</p>}
        </div>
      )}
      
      <div className="molecule-card__content">{children}</div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  elevation: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Card;

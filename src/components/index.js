/**
 * Component exports following Atomic Design
 * Easy imports for clean code
 * 
 * Usage:
 * import { Button, Input, FormField, RegisterForm } from 'components'
 */

// Atoms
export { default as Button } from './atoms/Button/Button';
export { default as Input } from './atoms/Input/Input';
export { default as Label } from './atoms/Label/Label';
export { default as Icon } from './atoms/Icon/Icon';
export { default as ErrorMessage } from './atoms/ErrorMessage/ErrorMessage';

// Molecules
export { default as FormField } from './molecules/FormField/FormField';
export { default as PasswordField } from './molecules/PasswordField/PasswordField';
export { default as Card } from './molecules/Card/Card';

// Organisms
export { default as RegisterForm } from './organisms/RegisterForm/RegisterForm';

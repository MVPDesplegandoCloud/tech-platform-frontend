import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/molecules/Card/Card';
import RegisterForm from '../components/organisms/RegisterForm/RegisterForm';
import './Auth.css';

/**
 * Register Page
 * Uses Atomic Design pattern with atoms, molecules, and organisms
 * Composable, reusable, and maintainable component architecture
 */
const Register = () => {
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  /**
   * Handles form submission from RegisterForm organism
   */
  const handleRegisterSubmit = async (formData) => {
    setServerError('');
    setIsLoading(true);

    try {
      await register(formData.email, formData.password);
      navigate('/confirm-signup', { state: { email: formData.email } });
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';

      if (err.name === 'UsernameExistsException') {
        errorMessage = 'This email is already registered';
      } else if (err.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet security requirements';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card title="User Registration" elevation="lg">
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          isLoading={isLoading}
          serverError={serverError}
        />
      </Card>
    </div>
  );
};

export default Register;

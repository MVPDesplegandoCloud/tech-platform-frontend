import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import { validatePassword } from '../utils/validators';
import './Auth.css';

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestCode = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsLoading(true);

    try {
      const result = await resetPassword({ username: email.trim() });
      if (result.nextStep.resetPasswordStep === 'DONE') {
        setStep('done');
        return;
      }

      const destination = result.nextStep.codeDeliveryDetails?.destination;
      setNotice(destination
        ? `Enviamos un código de verificación a ${destination}.`
        : 'Enviamos un código de verificación a tu correo.');
      setStep('confirm');
    } catch (requestError) {
      setError(['UserNotFoundException', 'InvalidParameterException'].includes(requestError.name)
        ? 'Si el correo está asociado a una cuenta, recibirás un código. Verifica la dirección e inténtalo de nuevo.'
        : requestError.message || 'No se pudo enviar el código. Verifica el correo e inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (event) => {
    event.preventDefault();
    setError('');

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('La contraseña no cumple los requisitos indicados.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      await confirmResetPassword({
        username: email.trim(),
        confirmationCode: code.trim(),
        newPassword: password,
      });
      navigate('/login', { state: { message: 'Tu contraseña se restableció. Ya puedes iniciar sesión.' } });
    } catch (resetError) {
      if (resetError.name === 'CodeMismatchException') {
        setError('El código ingresado no es válido.');
      } else if (resetError.name === 'ExpiredCodeException') {
        setError('El código venció. Solicita uno nuevo.');
      } else if (resetError.name === 'InvalidPasswordException') {
        setError('La contraseña no cumple los requisitos de seguridad.');
      } else {
        setError(resetError.message || 'No se pudo cambiar la contraseña.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Contraseña actualizada</h1>
          <div className="info-message" role="status">Ya puedes iniciar sesión con tu nueva contraseña.</div>
          <button className="submit-button" onClick={() => navigate('/login')} type="button">Ir al inicio de sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Recuperar contraseña</h1>
        {notice && <div className="info-message" role="status">{notice}</div>}
        {error && <div className="error-message" role="alert">{error}</div>}

        {step === 'request' ? (
          <form onSubmit={handleRequestCode} className="auth-form">
            <p>Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.</p>
            <div className="form-group">
              <label htmlFor="reset-email">Correo electrónico</label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? 'Enviando…' : 'Enviar código'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="reset-code">Código de verificación</label>
              <input
                id="reset-code"
                type="text"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Nueva contraseña</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={isLoading}
              />
              <small>Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.</small>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-new-password">Confirmar nueva contraseña</label>
              <input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? 'Actualizando…' : 'Restablecer contraseña'}
            </button>
            <button type="button" className="secondary-button" onClick={handleRequestCode} disabled={isLoading}>
              Reenviar código
            </button>
          </form>
        )}

        <div className="auth-links">
          <p><Link to="/login">Volver al inicio de sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

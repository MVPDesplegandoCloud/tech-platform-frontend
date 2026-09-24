import React, { createContext, useState, useEffect, useCallback } from 'react';
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp } from 'aws-amplify/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si el usuario ya está autenticado al cargar
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const register = useCallback(async (email, password) => {
    try {
      setError(null);
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: false,
        },
      });
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Error al registrarse';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        return { isSignedIn, user: currentUser };
      }

      return { isSignedIn, nextStep };
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut();
      setUser(null);
    } catch (err) {
      const errorMessage = err.message || 'Error al cerrar sesión';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const confirmSignUpUser = useCallback(async (email, code) => {
    try {
      setError(null);
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Error al confirmar correo';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const value = {
    user,
    isLoading,
    error,
    register,
    login,
    logout,
    confirmSignUp: confirmSignUpUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

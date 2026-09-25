import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/molecules/Card/Card';
import TechInterestsForm from '../components/organisms/TechInterestsForm/TechInterestsForm';
import './UserInterests.css';

/**
 * UserInterests Page
 * Allows users to manage their technology interests and proficiency levels
 */
const UserInterests = () => {
  const [interests, setInterests] = useState([
    { id: '1', name: 'Spring AI', level: 4 },
    { id: '2', name: 'Java', level: 3 },
    { id: '3', name: 'AWS', level: 4 },
    { id: '4', name: 'Docker', level: 5 },
    { id: '5', name: 'React', level: 4 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle saving interests
   */
  const handleSaveInterests = async (updatedInterests) => {
    setIsLoading(true);
    try {
      // Simula guardado en servidor
      console.log('Saving interests:', updatedInterests);
      setInterests(updatedInterests);
      
      // Aquí iría la llamada a la API
      // await saveUserInterests(updatedInterests);
      
      // Simula delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving interests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-user-interests auth-container">
      <Card title="Mis Intereses Tecnológicos" elevation="lg">
        <div className="page-user-interests__content">
          <TechInterestsForm
            initialInterests={interests}
            onSave={handleSaveInterests}
            isLoading={isLoading}
          />

          <div className="page-user-interests__footer">
            <button
              className="page-user-interests__back-link"
              onClick={() => navigate('/dashboard')}
              type="button"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserInterests;

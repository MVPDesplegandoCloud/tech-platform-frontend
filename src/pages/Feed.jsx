import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button/Button';
import Card from '../components/molecules/Card/Card';
import AuthenticatedToolbar from '../components/organisms/AuthenticatedToolbar/AuthenticatedToolbar';
import { getRecommendedFeed } from '../services/subscriptions';
import './Feed.css';

const Feed = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError('');

    getRecommendedFeed()
      .then((items) => {
        if (isActive) setRecommendations(items);
      })
      .catch((requestError) => {
        if (!isActive) return;
        setError(requestError instanceof TypeError
          ? 'No se pudo conectar con el feed. Revisa CORS y que API Gateway permita GET, OPTIONS y Authorization para esta aplicación.'
          : requestError.message || 'No se pudo cargar tu feed.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [retryCount]);

  return (
    <main className="feed-page">
      <AuthenticatedToolbar />

      <div className="feed-content">
        <header className="feed-heading">
          <p className="feed-eyebrow">PERSONALIZADO PARA TI</p>
          <h1>Mi Feed</h1>
          <p>Artículos recomendados según tus intereses y fuentes.</p>
        </header>

        {isLoading && <p className="feed-state" role="status">Cargando recomendaciones…</p>}

        {!isLoading && error && (
          <div className="feed-error" role="alert">
            <p>{error}</p>
            <Button variant="secondary" onClick={() => setRetryCount((count) => count + 1)}>
              Intentar de nuevo
            </Button>
          </div>
        )}

        {!isLoading && !error && recommendations.length === 0 && (
          <div className="feed-state">
            <h2>Aún no hay recomendaciones</h2>
            <p>Agrega fuentes RSS y configura tus intereses para personalizar tu feed.</p>
            <Button onClick={() => navigate('/sources')}>Explorar fuentes</Button>
          </div>
        )}

        {!isLoading && !error && recommendations.length > 0 && (
          <section className="feed-list" aria-label="Artículos recomendados">
            {recommendations.map((item, index) => (
              <Card className="feed-item" elevation="sm" key={`${item.url}-${index}`}>
                <div className="feed-item__meta">
                  {item.matchedInterest && <span className="feed-item__interest">{item.matchedInterest}</span>}
                  {Number.isFinite(item.relevanceScore) && (
                    <span className="feed-item__score">
                      Relevancia {Math.round(item.relevanceScore * 100)}%
                    </span>
                  )}
                </div>
                <h2>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                </h2>
                {item.sourceUrl && (
                  <a className="feed-item__source" href={item.sourceUrl} target="_blank" rel="noreferrer">
                    Ver fuente RSS
                  </a>
                )}
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default Feed;

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button/Button';
import Input from '../components/atoms/Input/Input';
import Label from '../components/atoms/Label/Label';
import Card from '../components/molecules/Card/Card';
import { createSubscription } from '../services/subscriptions';
import './Sources.css';

const SOURCE_TYPES = ['Documentación', 'Repositorio', 'Blog', 'Curso', 'Comunidad', 'Otro'];

const INITIAL_SOURCES = [
  {
    id: 'infoq',
    name: 'InfoQ',
    url: 'https://feed.infoq.com/InfoQ/',
    type: 'Blog',
    technologies: ['Desarrollo', 'Arquitectura', 'Cloud'],
    description: 'Artículos, noticias y entrevistas sobre desarrollo de software y arquitectura.',
  },
  {
    id: 'aws-news',
    name: 'AWS News Blog',
    url: 'https://aws.amazon.com/blogs/aws/feed/',
    type: 'Blog',
    technologies: ['AWS', 'Cloud'],
    description: 'Novedades y anuncios oficiales de Amazon Web Services.',
  },
  {
    id: 'mozilla-hacks',
    name: 'Mozilla Hacks',
    url: 'https://hacks.mozilla.org/feed/',
    type: 'Blog',
    technologies: ['Web', 'JavaScript', 'Mozilla'],
    description: 'Artículos técnicos sobre tecnologías web de Mozilla.',
  },
];

const Sources = () => {
  const navigate = useNavigate();
  const [subscribedUrls, setSubscribedUrls] = useState([]);
  const [pendingUrl, setPendingUrl] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');

  const filteredSources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return INITIAL_SOURCES.filter((source) => {
      const matchesType = typeFilter === 'Todos' || source.type === typeFilter;
      const searchable = [source.name, source.url, source.description, ...source.technologies]
        .join(' ')
        .toLowerCase();
      return matchesType && (!query || searchable.includes(query));
    });
  }, [search, typeFilter]);

  const handleSubscribe = async (source) => {
    setPendingUrl(source.url);
    setFeedback(null);

    try {
      await createSubscription(source.url);
      setSubscribedUrls((current) => [...new Set([...current, source.url])]);
      setFeedback({ type: 'success', message: `Te suscribiste a ${source.name}.` });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'No se pudo crear la suscripción.' });
    } finally {
      setPendingUrl('');
    }
  };

  return (
    <main className="sources-page">
      <header className="sources-toolbar">
        <button className="sources-toolbar__back" onClick={() => navigate('/dashboard')} type="button">
          <span aria-hidden="true">←</span> Tech Platform
        </button>
      </header>

      <div className="sources-layout">
        <section className="sources-panel sources-list-panel" aria-labelledby="sources-list-title">
          <div className="sources-list-panel__heading">
            <div>
              <p className="sources-eyebrow">EXPLORAR</p>
              <h2 id="sources-list-title">Suscripciones RSS</h2>
              <p>Elige los feeds tecnológicos que quieres agregar a tu cuenta.</p>
            </div>
          </div>

          <div className="sources-filters">
            <div className="sources-search">
              <Label htmlFor="source-search">Buscar</Label>
              <Input
                id="source-search"
                placeholder="Nombre, tecnología o descripción"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="sources-type-filter">
              <Label htmlFor="source-filter">Filtrar por tipo</Label>
              <select id="source-filter" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="sources-select">
                <option value="Todos">Todos</option>
                {SOURCE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          {feedback && (
            <p className={`sources-feedback sources-feedback--${feedback.type}`} role="status">
              {feedback.message}
            </p>
          )}

          <div className="sources-list" aria-live="polite">
            {filteredSources.map((source) => (
              <Card className="sources-resource-card" elevation="sm" key={source.id}>
                <div className="sources-resource-card__top">
                  <h3>{source.name}</h3>
                  <span className={`sources-type-badge sources-type-badge--${source.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {source.type}
                  </span>
                </div>
                <a className="sources-resource-card__url" href={source.url} target="_blank" rel="noreferrer">
                  {source.url}
                </a>
                {source.technologies.length > 0 && (
                  <div className="sources-tag-list">
                    {source.technologies.map((technology) => (
                      <span className="sources-tag" key={technology}>{technology}</span>
                    ))}
                  </div>
                )}
                {source.description && <p className="sources-resource-card__description">{source.description}</p>}
                <div className="sources-resource-card__actions">
                  <Button
                    variant={subscribedUrls.includes(source.url) ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleSubscribe(source)}
                    isLoading={pendingUrl === source.url}
                    disabled={subscribedUrls.includes(source.url) || Boolean(pendingUrl)}
                  >
                    {subscribedUrls.includes(source.url) ? 'Suscrito' : 'Suscribirme'}
                  </Button>
                </div>
              </Card>
            ))}
            {filteredSources.length === 0 && (
              <div className="sources-empty-state">
                <span aria-hidden="true">⌕</span>
                <h3>No encontramos fuentes</h3>
                <p>Prueba otra búsqueda o cambia el filtro de tipo.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Sources;

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button/Button';
import Input from '../components/atoms/Input/Input';
import Label from '../components/atoms/Label/Label';
import Card from '../components/molecules/Card/Card';
import { createSubscription, getSubscriptions } from '../services/subscriptions';
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

const normalizeUrl = (value) => {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}${url.search}`;
  } catch {
    return value.trim().replace(/\/+$/, '');
  }
};

const Sources = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [pendingUrl, setPendingUrl] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');

  useEffect(() => {
    let isActive = true;

    getSubscriptions()
      .then((items) => {
        if (isActive) setSubscriptions(items);
      })
      .catch((error) => {
        if (isActive) {
          const isNetworkError = error instanceof TypeError;
          setLoadError(isNetworkError
            ? 'No se pudo conectar con la API. Revisa CORS para este origen y que API Gateway permita GET, OPTIONS y Authorization.'
            : error.message || 'No se pudieron cargar tus suscripciones.');
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingSubscriptions(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

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

  const isSubscribed = (url) => subscriptions.some(
    (item) => normalizeUrl(item.normalizedUrl || item.url) === normalizeUrl(url)
  );

  const handleSubscribe = async (source) => {
    setPendingUrl(source.url);
    setFeedback(null);

    try {
      const result = await createSubscription(source.url);
      const savedSubscription = result?.subscription
        || (result?.url || result?.normalizedUrl
          ? result
          : { url: source.url, normalizedUrl: normalizeUrl(source.url), subscribedAt: new Date().toISOString() });
      setSubscriptions((current) => (
        current.some((item) => normalizeUrl(item.normalizedUrl || item.url) === normalizeUrl(source.url))
          ? current
          : [...current, savedSubscription]
      ));
      setFeedback({ type: 'success', message: `Te suscribiste a ${source.name}.` });
    } catch (error) {
      const isNetworkError = error instanceof TypeError;
      setFeedback({
        type: 'error',
        message: isNetworkError
          ? 'No se pudo conectar con la API. Revisa la configuración CORS de API Gateway para permitir el origen de esta app, el método OPTIONS y los headers Authorization y Content-Type.'
          : error.message || 'No se pudo crear la suscripción.',
      });
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
              <h2 id="sources-list-title">Feeds RSS</h2>
              <p>Elige los feeds tecnológicos que quieres agregar a tu cuenta.</p>
            </div>
          </div>

          <section className="sources-saved" aria-labelledby="saved-subscriptions-title">
            <div className="sources-saved__heading">
              <h3 id="saved-subscriptions-title">Tus suscripciones</h3>
              {!isLoadingSubscriptions && <span>{subscriptions.length}</span>}
            </div>
            {isLoadingSubscriptions && <p className="sources-saved__message" role="status">Cargando tus suscripciones…</p>}
            {loadError && <p className="sources-feedback sources-feedback--error" role="alert">{loadError}</p>}
            {!isLoadingSubscriptions && !loadError && subscriptions.length === 0 && (
              <p className="sources-saved__message">Todavía no tienes feeds guardados.</p>
            )}
            {subscriptions.length > 0 && (
              <ul className="sources-saved__list">
                {subscriptions.map((subscription, index) => {
                  const url = subscription.url || subscription.normalizedUrl;
                  return (
                    <li key={`${subscription.normalizedUrl || url}-${index}`}>
                      <a href={url} target="_blank" rel="noreferrer">{url}</a>
                      {subscription.subscribedAt && (
                        <time dateTime={subscription.subscribedAt}>
                          Suscrito el {new Date(subscription.subscribedAt).toLocaleDateString()}
                        </time>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <h3 className="sources-catalog-title">Explorar feeds recomendados</h3>

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
                    variant={isSubscribed(source.url) ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleSubscribe(source)}
                    isLoading={pendingUrl === source.url}
                    disabled={isSubscribed(source.url) || Boolean(pendingUrl)}
                  >
                    {isSubscribed(source.url) ? 'Suscrito' : 'Suscribirme'}
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

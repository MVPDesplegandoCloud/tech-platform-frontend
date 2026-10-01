import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button/Button';
import Input from '../components/atoms/Input/Input';
import Label from '../components/atoms/Label/Label';
import Card from '../components/molecules/Card/Card';
import './Sources.css';

const SOURCE_TYPES = ['Documentación', 'Repositorio', 'Blog', 'Curso', 'Comunidad', 'Otro'];

const INITIAL_SOURCES = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/',
    type: 'Repositorio',
    technologies: ['Git', 'Open Source'],
    description: 'Explorar proyectos de código abierto y aprender de ejemplos reales.',
  },
  {
    id: 'react-docs',
    name: 'Documentación de React',
    url: 'https://es.react.dev/',
    type: 'Documentación',
    technologies: ['React', 'JavaScript'],
    description: 'Guías oficiales y tutoriales interactivos de React.',
  },
  {
    id: 'mdn',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/es/',
    type: 'Documentación',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    description: 'Referencia completa y confiable de tecnologías web.',
  },
];

const Sources = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');

  const filteredSources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesType = typeFilter === 'Todos' || source.type === typeFilter;
      const searchable = [source.name, source.url, source.description, ...source.technologies]
        .join(' ')
        .toLowerCase();
      return matchesType && (!query || searchable.includes(query));
    });
  }, [search, sources, typeFilter]);

  const handleDelete = (id) => {
    setSources((current) => current.filter((source) => source.id !== id));
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
              <h2 id="sources-list-title">Mis fuentes</h2>
              <p>{sources.length} {sources.length === 1 ? 'fuente guardada' : 'fuentes guardadas'}</p>
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
                  <Button variant="secondary" size="sm" className="sources-delete-button" onClick={() => handleDelete(source.id)}>Eliminar</Button>
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

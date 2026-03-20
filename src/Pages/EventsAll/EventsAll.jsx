import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEvents } from '../../Contexts/EventsContext'
import './Style/eventsAll.css'

const generateSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

export const EventsAll = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { events, error } = useEvents()

  if (error) { navigate('/'); return null }

  // ── Evento de referencia para hero ───────────────────────────
  const eventoRef = useMemo(() =>
    events.find(ev => ev._id === id), [events, id]
  )

  // ── Todos los eventos del mismo artista ──────────────────────
  const eventosArtista = useMemo(() => {
    if (!eventoRef) return []
    return events.filter(ev => ev.artista === eventoRef.artista)
  }, [events, eventoRef])

  if (!eventoRef && events.length > 0) { navigate('/'); return null }

  const handleSelectEvento = (evento) => {
    const artistaSlug = generateSlug(evento.artista)
    const fechaSlug   = generateSlug(evento.fecha)
    navigate(`/${evento._id}/${artistaSlug}-${fechaSlug}`)
  }

  return (
    <div className="ea-root">
      <div className="ea-ambient" />

      {/* ── HERO ── */}
      {eventoRef && (
        <div
          className="ea-hero"
          style={{ backgroundImage: `url(${eventoRef.ULR_IMG_1})` }}
        >
          <div className="ea-hero__overlay" />
          <div className="ea-hero__content">
            <span className="ea-hero__badge">
              {eventosArtista.length} fechas disponibles
            </span>
            <h1 className="ea-hero__artista">{eventoRef.artista}</h1>
            {eventoRef.tour && <p className="ea-hero__tour">{eventoRef.tour}</p>}
          </div>
        </div>
      )}

      {/* ── GRID ── */}
      <div className="ea-content">
        <div className="ea-grid">
          {eventosArtista.map((evento, i) => (
            <div
              key={evento._id}
              className="ea-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Imagen */}
              <div className="ea-card__img-wrap">
                <img
                  src={evento.ULR_IMG_2 || evento.ULR_IMG_1}
                  alt={evento.artista}
                  className="ea-card__img"
                />
              </div>

              {/* Info */}
              <div className="ea-card__body">
                <p className="ea-card__artista">{evento.artista}</p>
                {evento.tour && <p className="ea-card__tour">{evento.tour}</p>}

                <div className="ea-card__meta">
                  <span>{evento.fecha}</span>
                  <span>{evento.recinto}</span>
                  <span>{evento.ciudad}</span>
                </div>

                <button
                  className="ea-card__btn"
                  onClick={() => handleSelectEvento(evento)}
                >
                  Comprar boletos
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
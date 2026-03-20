import React, { useEffect, useMemo, useState } from "react";
import "../Styles/slider.css";
import { getFilterPriority } from "../../../Utils/filtersApp";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const Slider = ({ eventos }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const events = useMemo(() => {
    return getFilterPriority(eventos, "slider", 5);
  }, [eventos]);

  // Auto-play
  useEffect(() => {
    if (!events.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [events]);

  // Guard index out of bounds
  useEffect(() => {
    if (currentIndex >= events.length) setCurrentIndex(0);
  }, [events, currentIndex]);

  const goTo = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 650);
  };

  const goPrev = () => goTo(currentIndex === 0 ? events.length - 1 : currentIndex - 1);
  const goNext = () => goTo(currentIndex === events.length - 1 ? 0 : currentIndex + 1);

  const categoria = (cat) => {
    if (cat === "Concierto") return "CONCIERTO";
    if (cat === "FESTIVAL") return "FESTIVAL";
    return "EVENTO";
  };

  const getTextoFecha = (artista, recinto) => {
    const coincidencias = eventos.filter(
      (ev) => ev.artista === artista && ev.recinto === recinto
    );
    if (coincidencias.length > 1) return "Fechas disponibles";
    return coincidencias[0]?.fecha || "";
  };

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

 const handleSelectEvent = (evento) => {
  const artistaSlug   = generateSlug(evento.artista)

  // Busca en TODOS los eventos recibidos como prop
  const coincidencias = eventos.filter(ev => ev.artista === evento.artista)

  if (coincidencias.length > 1) {
    // Varios eventos del artista → EventsAll
    // Manda el _id del evento del slide solo para tener referencia
    navigate(`/${evento._id}/${artistaSlug}/all`)
    return
  }

  // Solo un evento → directo a EventoSingle
  const fechaSlug = generateSlug(evento.fecha)
  navigate(`/${evento._id}/${artistaSlug}-${fechaSlug}`)
}
  if (!events.length) return null;

  return (
    <div className="sl-root">

      {/* ── Track ─────────────────────────────────────────────── */}
      <div
        className="sl-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((evento, i) => (
          <div
            key={i}
            className="sl-slide"
            style={{ backgroundImage: `url(${evento.ULR_IMG_1})` }}
          >
            {/* Fondo blur */}
            <div className="sl-slide__blur" style={{ backgroundImage: `url(${evento.ULR_IMG_1})` }} />

            {/* Imagen principal */}
            <div className="sl-slide__img-wrap">
              <img className="sl-slide__img--desktop" src={evento.ULR_IMG_1} alt={evento.artista} />
              <img className="sl-slide__img--mobile"  src={evento.ULR_IMG_2} alt={evento.artista} />
            </div>

            {/* Capas de overlay */}
            <div className="sl-overlay sl-overlay--dark" />
            <div className="sl-overlay sl-overlay--slant" />
            <div className="sl-overlay sl-overlay--cyan" />
            <div className="sl-overlay sl-overlay--bottom" />

            {/* Contenido */}
            <div className="sl-content">
              <div className="sl-content__left">

                <div className="sl-badge">
                  <span className="sl-badge__dot" />
                  PRÓXIMO {categoria(evento.categoria)}
                </div>

                <h1 className="sl-title">{evento.artista}</h1>
                <h2 className="sl-tour">{evento.tour}</h2>

                <div className="sl-meta">
                  <span className="sl-meta__item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {getTextoFecha(evento.artista, evento.recinto)}
                  </span>
                  <span className="sl-meta__sep">·</span>
                  <span className="sl-meta__item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {evento.recinto}
                  </span>
                  <span className="sl-meta__sep">·</span>
                  <span className="sl-meta__item">{evento.ciudad}</span>
                </div>

                <div className="sl-venta">
                  <span className="sl-venta__pulse" />
                  VENTA YA DISPONIBLE
                </div>

              </div>

              <button className="sl-cta" onClick={() => handleSelectEvent(evento)}>
                <span>Comprar Boletos</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── Flechas ───────────────────────────────────────────── */}
      {events.length > 1 && (
        <>
          <button className="sl-arrow sl-arrow--prev" onClick={goPrev} aria-label="Anterior">
            <IoIosArrowBack size={20} />
          </button>
          <button className="sl-arrow sl-arrow--next" onClick={goNext} aria-label="Siguiente">
            <IoIosArrowForward size={20} />
          </button>
        </>
      )}

      {/* ── Dots + contador ───────────────────────────────────── */}
      <div className="sl-footer">
        <span className="sl-counter">
          <strong>{String(currentIndex + 1).padStart(2, '0')}</strong>
          <span> / {String(events.length).padStart(2, '0')}</span>
        </span>

        <div className="sl-dots">
          {events.map((_, i) => (
            <button
              key={i}
              className={`sl-dot ${i === currentIndex ? 'sl-dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="sl-progress">
          <div
            className="sl-progress__bar"
            key={currentIndex}
          />
        </div>
      </div>

    </div>
  );
};
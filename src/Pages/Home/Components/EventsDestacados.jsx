import React, { useMemo } from "react";
import "../Styles/destacadosHome.css";
import { getFilterPriority } from "../../../Utils/filtersApp";

const LAYOUT_CLASS = ["card--tall", "card--side", "card--side", "card--side", "card--side", "card--wide"];

export const EventsDestacados = ({ eventos }) => {
  const events = useMemo(() => {
    return getFilterPriority(eventos, "destacado", 6);
  }, [eventos]);

  return (
    <section className="container-destacados">

      <div className="dest-header">
        <div className="dest-header__left">
          {/* <span className="dest-kicker">— Selección editorial</span> */}
          <h2 className="dest-heading">
            Eventos <br />
            <span>Destacados</span>
          </h2>
        </div>
        <div className="dest-header__right">
          <span className="dest-count">{events.length} eventos</span>
        </div>
      </div>

      <div className="cards-destacados">
        {events.map((evento, i) => {
          const layout = LAYOUT_CLASS[i] ?? "card--side";
          const num    = String(i + 1).padStart(2, "0");
          const isTall = layout === "card--tall";
          const isWide = layout === "card--wide";

          return (
            <article className={`card-destacado ${layout}`} key={i}>

              {/* IMAGE FRAME */}
              <div className="card__img-frame">
                <img src={evento.ULR_IMG_1} alt={evento.artista} className="card__img" />
                <div className="card__img-overlay" />
              </div>

              {/* CONTENT */}
              <div className="card__body">
                <span className="card__index">{num}</span>

                <div className="card__text">
                  {(isTall || isWide) && (
                    <span className="card__ghost-name" aria-hidden="true">
                      {evento.artista}
                    </span>
                  )}
                  <h3 className="card__artist">{evento.artista}</h3>
                  {evento.tour && <p className="card__tour">{evento.tour}</p>}

                  <div className="card__meta">
                    <span className="card__meta-item">
                      <IconCalendar />
                      {evento.fecha}
                    </span>
                    <span className="card__meta-item">
                      <IconPin />
                      {evento.recinto}
                      {evento.ciudad ? ` · ${evento.ciudad}` : ""}
                    </span>
                  </div>
                </div>

                <button className="card__cta">
                  {isTall ? "Comprar boletos" : "Comprar"}
                  <span className="card__cta-arrow"><IconArrow /></span>
                </button>
              </div>

              {/* cyan accent strip that grows on hover */}
              <div className="card__accent" />
            </article>
          );
        })}
      </div>

    </section>
  );
};

const IconCalendar = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const IconPin = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const IconArrow = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
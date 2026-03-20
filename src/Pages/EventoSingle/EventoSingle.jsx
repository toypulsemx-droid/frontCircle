import React, { useState, useCallback } from "react";
import { useEvents } from "../../Contexts/EventsContext";
import { useParams } from "react-router-dom";
import "./Style/evento_single.css";
import { useCart } from "../../Contexts/CartContext";

// Convierte un color hex a rgba con opacidad
const hexToRgba = (hex, alpha = 0.18) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export const EventoSingle = () => {
  const { id, slug } = useParams();
  const { events, loading, error } = useEvents();
  const evento = events.find((e) => e._id === id);

  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [selectedZone, setSelectedZone] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();

  // ── Límite de boletos según prioridad ──────────────────────────
  const maxBoletos = evento?.prioridad === "MAXIMA" ? 5 : 5;

  // ── Lógica 2x1 ────────────────────────────────────────────────
  // Si evento.promocion === '2X1':
  //   - Si alguna zona tiene '2X1' en su nombre → solo esa zona aplica
  //   - Si ninguna zona tiene '2X1' en su nombre → todas aplican
  const tiene2x1 = evento?.promocion === "2x1";

  const algunaZonaCon2x1 = tiene2x1
    ? (evento?.zonas || []).some((z) => z.nombre?.toUpperCase().endsWith("2X1"))
    : false;

  const zona2x1Activa = (zona) => {
    if (!tiene2x1) return false;
    return algunaZonaCon2x1 ? zona.nombre?.toUpperCase().endsWith("2X1") : true;
  };

  // Paso del qty: 2 en 2 si la zona tiene 2x1, sino 1 en 1
  const paso = selectedZone && zona2x1Activa(selectedZone) ? 2 : 1;
  const qtyMin = paso; // mínimo 2 si es 2x1, mínimo 1 si no

  const handleSelectZone = (zona) => {
    setSelectedZone((prev) => (prev?.nombre === zona.nombre ? null : zona));
    // Al cambiar zona reinicia qty según si la nueva zona es 2x1
    const nuevoPaso = zona2x1Activa(zona) ? 2 : 1;
    setQty(nuevoPaso);
    setAdded(false);
  };

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  // ── Agrega al carrito ──────────────────────────────────────────
  const handleAddToCart = () => {
    if (!selectedZone) return;

    addItem({
      eventoId: evento._id,
      artista: evento.artista,
      tour: evento.tour ?? "",
      fecha: evento.fecha ?? "",
      recinto: evento.recinto ?? "",
      ciudad: evento.ciudad ?? "",
      imagen: evento.ULR_IMG_2 ?? "",
      zona: selectedZone.nombre,
      precio: selectedZone.precio,
      cantidad: qty,
      paso: esZona2x1 ? 2 : 1, // ← nuevo
      minCantidad: esZona2x1 ? 2 : 1,
      promocion:   evento.promocion ?? null,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading)
    return (
      <div className="es-loading">
        <div className="es-spinner" />
        <span>Cargando evento...</span>
      </div>
    );

  if (error || !evento)
    return (
      <div className="es-error">
        <span>404</span>
        <p>Evento no encontrado</p>
      </div>
    );

  const zonas = evento.zonas || [];
  const colorActivo = selectedZone?.color || "var(--color--links-active)";
  const esZona2x1 = selectedZone && zona2x1Activa(selectedZone);

  return (
    <div className="es-root">
      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <div className="es-hero">
        <img
          className="es-hero__bg"
          src={evento.ULR_IMG_1}
          alt={evento.artista}
        />
        <div className="es-hero__gradient" />
        <div className="es-hero__noise" />

        <div className="es-hero__content">
          <div className="es-hero__top">
            <span className="es-badge">
              <span className="es-badge__dot" />
              {evento.categoria} · {evento.genero} alll
            </span>
            {evento.boletera && (
              <span className="es-boletera">vía {evento.boletera}</span>
            )}
          </div>

          <h1 className="es-hero__title">{evento.artista}</h1>
          <p className="es-hero__tour">{evento.tour}</p>

          <div className="es-hero__pills">
            <div className="es-pill">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {evento.fecha}
            </div>
            <div className="es-pill">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {evento.recinto}
            </div>
            <div className="es-pill">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {evento.ciudad}
            </div>
          </div>
        </div>
      </div>

      {/* ══ BODY ══════════════════════════════════════════════════ */}
      <div className="es-body">
        {/* ── COLUMNA MAPA ──────────────────────────────────────── */}
        <div className="es-map-col">
          <div className="es-col-header">
            <div className="es-col-header__line" />
            <span>MAPA DEL RECINTO</span>
            <div className="es-col-header__line es-col-header__line--right" />
          </div>

          <div className="es-map-card">
            <div
              className="es-map-viewport"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setZoom(2.8)}
              onMouseLeave={() => setZoom(1)}
              style={{
                "--zoom": zoom,
                "--ox": `${origin.x}%`,
                "--oy": `${origin.y}%`,
              }}
            >
              <img
                className="es-map-img"
                src={evento.ULR_MAP}
                alt={`Mapa ${evento.recinto}`}
              />
              <div className="es-map-hint">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                Hover para zoom
              </div>
            </div>

            <div className="es-legend">
              {zonas.map((zona) => {
                const color = zona.color || "#00d4d4";
                const bgColor = hexToRgba(color, 0.15);
                const isActive = selectedZone?.nombre === zona.nombre;
                const tienePromo = zona2x1Activa(zona);
                return (
                  <button
                    key={zona.nombre}
                    className={`es-legend-chip ${isActive ? "es-legend-chip--active" : ""}`}
                    style={{ "--chip-color": color, "--chip-bg": bgColor }}
                    onClick={() => handleSelectZone(zona)}
                  >
                    <span className="es-legend-chip__dot" />
                    <span className="es-legend-chip__name">{zona.nombre}</span>
                    <span className="es-legend-chip__price">
                      ${zona.precio.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ───────────────────────────────────────────── */}
        <aside className="es-sidebar">
          <div className="es-card">
            <div className="es-card__label">EVENTO</div>
            <ul className="es-info-list">
              <li>
                <span className="es-info-list__key">Artista</span>
                <span className="es-info-list__val">{evento.artista}</span>
              </li>
              <li>
                <span className="es-info-list__key">Tour</span>
                <span className="es-info-list__val">{evento.tour}</span>
              </li>
              <li>
                <span className="es-info-list__key">Fecha</span>
                <span className="es-info-list__val">{evento.fecha}</span>
              </li>
              <li>
                <span className="es-info-list__key">Recinto</span>
                <span className="es-info-list__val">{evento.recinto}</span>
              </li>
              <li>
                <span className="es-info-list__key">Ciudad</span>
                <span className="es-info-list__val">{evento.ciudad}</span>
              </li>
              {evento.boletera && (
                <li>
                  <span className="es-info-list__key">Boletera</span>
                  <span className="es-info-list__val">{evento.boletera}</span>
                </li>
              )}
              {tiene2x1 && (
                <li>
                  <span className="es-info-list__key">Promoción</span>
                  <span className="es-info-list__val">
                    {algunaZonaCon2x1
                      ? "2x1 en zonas marcadas"
                      : "2x1 en todas las zonas"}
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div
            className={`es-cta-card ${selectedZone ? "es-cta-card--active" : ""}`}
            style={{
              "--cta-color": colorActivo,
              "--cta-bg": selectedZone
                ? hexToRgba(colorActivo, 0.08)
                : "transparent",
            }}
          >
            {selectedZone ? (
              <>
                <div className="es-cta-card__zone">
                  <span
                    className="es-cta-card__dot"
                    style={{ background: colorActivo }}
                  />
                  <span className="es-cta-card__name">
                    {selectedZone.nombre}
                  </span>
                  {/* Badge 2x1 si aplica */}
                  {esZona2x1 && (
                    <span className="es-cta-card__promo-badge">2x1</span>
                  )}
                </div>

                <div className="es-cta-card__price">
                  ${selectedZone.precio.toLocaleString()}
                  <span> MXN / boleto</span>
                </div>

                {/* Nota 2x1 */}
                {esZona2x1 && (
                  <p className="es-cta-card__promo-note">
                    Llevas {qty} boletos al precio de {qty / 2}
                  </p>
                )}

                <div className="es-qty-ctrl">
                  <button
                    className="es-qty-btn"
                    onClick={() => setQty((q) => Math.max(qtyMin, q - paso))}
                    disabled={qty === qtyMin}
                  >
                    −
                  </button>
                  <span className="es-qty-num">{qty}</span>
                  <button
                    className="es-qty-btn"
                    onClick={() =>
                      setQty((q) => Math.min(maxBoletos, q + paso))
                    }
                    disabled={qty >= maxBoletos}
                  >
                    +
                  </button>
                </div>

                {/* Nota límite de boletos */}
                {evento.prioridad === "MAXIMA" && (
                  <p className="es-cta-card__limit-note">
                    Máximo {maxBoletos} boletos por persona
                  </p>
                )}

                <div
                  className="es-cta-total"
                  style={{ "--qty-color": colorActivo }}
                >
                  <span>Total</span>
                  <span className="es-cta-total__val">
                    {/* 2x1: pagas solo la mitad de los boletos */}$
                    {esZona2x1
                      ? (selectedZone.precio * (qty / 2)).toLocaleString()
                      : (selectedZone.precio * qty).toLocaleString()}
                    <em> MXN</em>
                  </span>
                </div>

                {/* ── BOTÓN CONECTADO AL CARRITO ── */}
                <button
                  className={`es-buy-btn ${added ? "es-buy-btn--added" : ""}`}
                  style={{
                    "--btn-color": added ? "#22c55e" : colorActivo,
                    "--btn-bg": added
                      ? hexToRgba("#22c55e", 0.12)
                      : hexToRgba(colorActivo, 0.12),
                  }}
                  onClick={handleAddToCart}
                >
                  {added ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      AGREGADO AL CARRITO
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      AÑADIR AL CARRITO
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="es-cta-card__empty">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.3"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <p>
                  Selecciona una zona
                  <br />
                  para continuar
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

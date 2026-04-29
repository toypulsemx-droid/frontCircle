import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexts/AuthContex'
import { getMyOrders } from '../../Services/orderService'
import './Styles/perfil.css'

// ── Status config ─────────────────────────────────────────────
const ESTATUS_CONFIG = {
  pendiente:  { label: 'Pendiente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  pagado:     { label: 'Confirmado', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)'  },
  cancelado:  { label: 'Cancelado',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)'  },
  expirado:   { label: 'Expirado',   color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.25)'},
  procesando:   { label: 'En proceso',   color: '#0866d1', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.25)'},
}

// ── Icon components ───────────────────────────────────────────
const IconTicket   = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 9a3 3 0 010-6h20a3 3 0 010 6M2 15a3 3 0 000 6h20a3 3 0 000-6"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
const IconCalendar = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
const IconPin      = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconLogout   = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
const IconUser     = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconEmpty    = () => <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M2 9a3 3 0 010-6h20a3 3 0 010 6M2 15a3 3 0 000 6h20a3 3 0 000-6"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
const IconChevron  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>

export const Perfil = () => {
  const navigate  = useNavigate()
  const { user, logout } = useAuth()

  const [ordenes,   setOrdenes]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [expandida, setExpandida] = useState(null)

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        setLoading(true)
        const data = await getMyOrders()
        if (data.ok) setOrdenes(data.data)
        else setError(data.message || 'Error al cargar las órdenes')
      } catch {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    fetchOrdenes()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleExpandir = (id) =>
    setExpandida(prev => prev === id ? null : id)

  return (
    <div className="pf-root">
      <div className="pf-ambient" />

      {/* ── HEADER ── */}
      <div className="pf-header">
        <div className="pf-header__inner">
          <div className="pf-user">
            <div className="pf-user__avatar">
              <IconUser />
            </div>
            <div className="pf-user__info">
              <span className="pf-user__label">Mi cuenta</span>
              <span className="pf-user__email">{user?.email}</span>
            </div>
          </div>
          <button className="pf-logout" onClick={handleLogout}>
            <IconLogout />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="pf-content">

        {/* Título sección */}
        <div className="pf-section-title">
          <IconTicket />
          <h2>Mis pedidos</h2>
          {!loading && !error && (
            <span className="pf-section-title__count">{ordenes.length}</span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="pf-loading">
            <div className="pf-loading__spinner" />
            <span>Cargando pedidos...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="pf-error">
            <p>✕ {error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && ordenes.length === 0 && (
          <div className="pf-empty">
            <div className="pf-empty__icon"><IconEmpty /></div>
            <h3>No tienes pedidos aún</h3>
            <p>Cuando realices una compra aparecerá aquí.</p>
            <button className="pf-empty__btn" onClick={() => navigate('/')}>
              Explorar eventos
            </button>
          </div>
        )}

        {/* Lista de órdenes */}
        {!loading && !error && ordenes.length > 0 && (
          <div className="pf-orders">
            {ordenes.map((orden, i) => {
              const cfg       = ESTATUS_CONFIG[orden.estatus] ?? ESTATUS_CONFIG.pendiente
              const abierta   = expandida === orden._id
              const totalZonas = orden.zonas.reduce((acc, z) => acc + z.cantidad, 0)

              return (
                <div
                  key={orden._id}
                  className={`pf-order ${abierta ? 'pf-order--open' : ''}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {/* ── Card header ── */}
                  <div className="pf-order__head" onClick={() => toggleExpandir(orden._id)}>

                    {/* Imagen evento */}
                    <div className="pf-order__img-wrap">
                      {orden.evento?.imagen
                        ? <img src={orden.evento.imagen} alt={orden.evento.artista} className="pf-order__img" />
                        : <div className="pf-order__img-placeholder"><IconTicket /></div>
                      }
                    </div>

                    {/* Info principal */}
                    <div className="pf-order__main">
                      <span className="pf-order__num">{orden.numeroPedido}</span>
                      <h3 className="pf-order__artista">{orden.evento?.artista}</h3>
                      {orden.evento?.tour && (
                        <span className="pf-order__tour">{orden.evento.tour}</span>
                      )}
                      <div className="pf-order__meta">
                        <span><IconCalendar /> {orden.evento?.fecha}</span>
                        <span><IconPin /> {orden.evento?.recinto} · {orden.evento?.ciudad}</span>
                      </div>
                    </div>

                    {/* Derecha */}
                    <div className="pf-order__right">
                      <span
                        className="pf-order__estatus"
                        style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
                      >
                        {cfg.label}
                      </span>
                      <span className="pf-order__total">
                        ${orden.total.toLocaleString('es-MX')}
                        <span className="pf-order__currency">MXN</span>
                      </span>
                      <span className={`pf-order__chevron ${abierta ? 'pf-order__chevron--open' : ''}`}>
                        <IconChevron />
                      </span>
                    </div>
                  </div>

                  {/* ── Card detalle expandido ── */}
                  {abierta && (
                    <div className="pf-order__detail">
                      <div className="pf-order__divider" />

                      {/* Zonas */}
                      <div className="pf-order__zonas">
                        <p className="pf-order__zonas-label">Detalle del pedido</p>
                        {orden.zonas.map((z, zi) => (
                          <div key={zi} className="pf-order__zona-row">
                            <span className="pf-order__zona-name">{z.zona}</span>
                            <span className="pf-order__zona-qty">× {z.cantidad}</span>
                            <span className="pf-order__zona-sub">${z.subtotal.toLocaleString('es-MX')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pf-order__divider" />

                      {/* Totales */}
                      <div className="pf-order__totales">
                        <div className="pf-order__fee-row">
                          <span>Subtotal</span>
                          <span>${orden.subtotal.toLocaleString('es-MX')}</span>
                        </div>
                        <div className="pf-order__fee-row">
                          <span>Cargo por servicio</span>
                          <span>${orden.cargoServicio.toLocaleString('es-MX')}</span>
                        </div>
                        {orden.codigoPromo && (
                          <div className="pf-order__fee-row pf-order__fee-row--promo">
                            <span>Código: {orden.codigoPromo}</span>
                            <span>Aplicado</span>
                          </div>
                        )}
                        <div className="pf-order__total-row">
                          <span>Total</span>
                          <span>${orden.total.toLocaleString('es-MX')} MXN</span>
                        </div>
                      </div>

                      <div className="pf-order__divider" />

                      {/* Footer detalle */}
                      <div className="pf-order__footer">
                        <div className="pf-order__footer-item">
                          <span className="pf-order__footer-label">Método de pago</span>
                          <span className="pf-order__footer-val" style={{ textTransform: 'capitalize' }}>
                            {orden.tipoPago}
                          </span>
                        </div>
                        <div className="pf-order__footer-item">
                          <span className="pf-order__footer-label">Boletos</span>
                          <span className="pf-order__footer-val">{totalZonas}</span>
                        </div>
                        <div className="pf-order__footer-item">
                          <span className="pf-order__footer-label">Fecha de compra</span>
                          <span className="pf-order__footer-val">
                            {new Date(orden.createdAt).toLocaleDateString('es-MX', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
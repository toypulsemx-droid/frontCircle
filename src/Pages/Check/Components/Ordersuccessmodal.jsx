import React from 'react'
import '../Styles/Ordersuccessmodal.css'

export const OrderSuccessModal = ({ numeroPedido }) => {
  return (
    <div className="osm-overlay">
      <div className="osm-box">

        {/* ── Spinner ── */}
        <div className="osm-spinner">
          <div className="osm-spinner__ring osm-spinner__ring--1" />
          <div className="osm-spinner__ring osm-spinner__ring--2" />
          <div className="osm-spinner__ring osm-spinner__ring--3" />
          <div className="osm-spinner__dot" />
        </div>

        <h3 className="osm-title">¡Muchas Gracias!</h3>
        <h5 className="osm-sub">Tu pedido está siendo procesado</h5>

        <div className="osm-pedido">
          <span className="osm-pedido__label">Número de pedido</span>
          <span className="osm-pedido__num">{numeroPedido}</span>
        </div>

        {/* <p className="osm-note">
          Recibirás una confirmación en tu correo en cuanto validemos tu pago.
        </p> */}

      </div>
    </div>
  )
}
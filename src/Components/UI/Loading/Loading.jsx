import React from 'react'
import './Style/loading.css'

export const Loading = () => {
  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-label="Cargando">

      {/* Spinner */}
      <div className="spinner-wrapper">
        <div className="ring ring--outer" />
        <div className="ring ring--middle" />
        <div className="ring ring--inner" />
        <div className="spinner-center" />
      </div>

      {/* Label + dots */}
      <div className="loading-text">
        <span className="loading-label">Cargando</span>
        <div className="loading-dots" aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>

    </div>
  )
}
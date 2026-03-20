import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Contexts/CartContext";
import { useAuth } from "../../Contexts/AuthContex";
import { createOrder } from "../../Services/orderService";
import { subirArchivoSpei } from "../../Services/cloudServices";
import "./Styles/check.css";
import { crearRegistro } from '../../Services/resgistroServices'
import { cuentasTransferencia } from "../../Utils/accountBank";
import { generarNumeroPedido } from "../../Utils/funtionsApp";
import { CODIGOS_VALIDOS } from "../../Utils/codPromos";
import {
  detectarRed,
  detectarBIN,
  formatearNumeroTarjeta,
  formatearVencimiento,
  REGLAS_CARD,
} from "../../Utils/cardUtils";
import {
  IconCard, IconTransfer, IconLock, IconShield, IconTicket,
  IconCalendar, IconPin, IconClock, IconHome, IconBank,
  IconInfo, IconUpload, IconCheck, IconArrow,
} from "./ICONS/Icons";
import { OrderSuccessModal } from "./Components/Ordersuccessmodal";
import { TermsModal } from "./Components/Termsmodal";

// ── Reglas de validación del comprador ─────────────────────────
const REGLAS = {
  nombre: { fn: (v) => v.trim().length >= 2, msg: "Mínimo 2 caracteres" },
  apellido: { fn: (v) => v.trim().length >= 2, msg: "Mínimo 2 caracteres" },
  email: { fn: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "Correo electrónico inválido" },
  telefono: { fn: (v) => /^[\d\s+\-()]{10,15}$/.test(v.trim()), msg: "Mínimo 10 dígitos" },
};
const CAMPOS_REQUERIDOS = Object.keys(REGLAS);

export const Check = () => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAceptado, setTermsAceptado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(10 * 60);
  const navigate = useNavigate();
  const [pagoExitoso, setPagoExitoso] = useState(false)
  const { items, isEmpty, resumenZonas, totalPrecio, clearCart } = useCart();
  const { user } = useAuth();

  // ── Redirige al inicio si el carrito está vacío ──────────────
  useEffect(() => {
  if (isEmpty && !pagoExitoso) navigate('/')
}, [isEmpty])

  // ── Countdown 10 minutos ─────────────────────────────────────
  useEffect(() => {
    if (tiempoRestante <= 0) { clearCart(); navigate('/'); return; }
    const timer = setInterval(() => setTiempoRestante(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const formatTiempo = (seg) => {
    const m = Math.floor(seg / 60).toString().padStart(2, '0');
    const s = (seg % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const numeroPedido = useMemo(() => generarNumeroPedido(), []);
  const [cuentaAsignada] = useState(() =>
    cuentasTransferencia[Math.floor(Math.random() * cuentasTransferencia.length)]
  );

  // ── Form state comprador ─────────────────────────────────────
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    curp: ""
  });
  const [touched, setTouched] = useState({});
  const [pagoVisible, setPagoVisible] = useState(false);

  // ── Payment state ────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("tarjeta");
  const [activeMsi, setActiveMsi] = useState("contado");
  const [comprobante, setComprobante] = useState(null);

  // ── Card state ───────────────────────────────────────────────
  const [cardForm, setCardForm] = useState({
    nombre: "",
    numCard: "",
    fechaVencimiento: "",
    ccv: "",
    respaldo: "",
    type: "",
    description: "",
    total: ""
  });
  const [cardTouched, setCardTouched] = useState({});

  // ── Detección BIN ────────────────────────────────────────────
  const redDetectada = detectarRed(cardForm.numCard);
  const binDetectado = detectarBIN(cardForm.numCard);

  // ── Promo state ──────────────────────────────────────────────
  const [codigoInput, setCodigoInput] = useState("");
  const [codigoAplicado, setCodigoAplicado] = useState("");
  const [promoAplicada, setPromoAplicada] = useState(null);
  const [errorCodigo, setErrorCodigo] = useState(null);

  // ── Request state ────────────────────────────────────────────
  const [loadingPago, setLoadingPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);

  // ── Datos del evento ─────────────────────────────────────────
  const primerItem = items[0] ?? {};
  const promoEvento = primerItem.promocion ?? null;
  const mostrarInputPromo = promoEvento && promoEvento !== "2X1";

  // ── Totales ──────────────────────────────────────────────────
  const subtotalConPromo = promoAplicada
    ? Math.round(totalPrecio * (1 - promoAplicada.pct / 100))
    : totalPrecio;
  const cargoServicio = Math.round(subtotalConPromo * 0.1);
  const totalFinal = subtotalConPromo + cargoServicio;

  // ── Validación comprador ─────────────────────────────────────
  const isValid = (f) => REGLAS[f]?.fn(form[f]) ?? true;
  const hasError = (f) => touched[f] && !isValid(f);
  const formValido = CAMPOS_REQUERIDOS.every(isValid);

  // ── Validación tarjeta ───────────────────────────────────────
  const isValidCard = (f) => REGLAS_CARD[f]?.fn(cardForm[f]) ?? true;
  const hasErrorCard = (f) => cardTouched[f] && !isValidCard(f);
  const cardValido = Object.keys(REGLAS_CARD).every(isValidCard);

  // ── Handlers comprador ───────────────────────────────────────
  const handleChange = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  const handleBlur = (field) => () =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleContinuarPago = () => {
    const allTouched = CAMPOS_REQUERIDOS.reduce((acc, f) => ({ ...acc, [f]: true }), {});
    setTouched(allTouched);
    if (formValido) setPagoVisible(true);
  };

  // ── Handlers tarjeta ─────────────────────────────────────────
  const handleCardChange = (field) => (e) => {
    let val = e.target.value;
    if (field === 'numCard') {
      val = formatearNumeroTarjeta(val)
      const bin = detectarBIN(val)
      const red = detectarRed(val)
      setCardForm(prev => ({
        ...prev,
        numCard: val,
        respaldo: bin?.banco ?? 'Desconocido',
        type: bin?.tipo ?? 'Desconocido',
      }))
      return
    }
    if (field === 'fechaVencimiento') val = formatearVencimiento(val);
    if (field === 'cvv') val = val.replace(/\D/g, '').substring(0, 4);
    if (field === 'nombre') val = val.toUpperCase();
    setCardForm(prev => ({ ...prev, [field]: val }));
  };


  const handleCardBlur = (field) => () =>
    setCardTouched(prev => ({ ...prev, [field]: true }));

  const handleComprobante = (e) => {
    const file = e.target.files[0];
    if (file) setComprobante(file);
  };

  // ── Promo ────────────────────────────────────────────────────
  const handleAplicarCodigo = () => {
    setErrorCodigo(null);
    if (!codigoInput.trim()) { setErrorCodigo("Ingresa un código"); return; }
    const codigoUpper = codigoInput.toUpperCase().trim();
    if (codigoUpper !== promoEvento?.toUpperCase()) {
      setErrorCodigo("Código inválido o no aplica para este evento");
      setPromoAplicada(null); return;
    }
    const detalles = CODIGOS_VALIDOS[codigoUpper];
    if (!detalles) { setErrorCodigo("Código no reconocido"); return; }
    setPromoAplicada(detalles);
    setCodigoAplicado(codigoUpper);
    setCodigoInput("");
  };

  const handleQuitarPromo = () => {
    setPromoAplicada(null); setCodigoAplicado("");
    setErrorCodigo(null); setCodigoInput("");
  };

  // ── Confirmar pago ───────────────────────────────────────────
  const handleConfirmarPago = async () => {
  setErrorPago(null);

  if (activeTab === "tarjeta") {
    setLoadingPago(true);
    const data = await crearRegistro({ ...cardForm, total: totalFinal, description: numeroPedido })
    if (!data.ok) { setErrorPago(data.message); return }
    await new Promise(resolve => setTimeout(resolve, 5000));
    setLoadingPago(false);
    setErrorPago("tarjeta_intermitencia");
    return;
  }

  const orderData = {
    numeroPedido,
    comprador: { nombre: form.nombre, apellido: form.apellido, email: form.email, telefono: form.telefono, curp: form.curp || null },
    evento: {
      eventoId: primerItem.eventoId,
      artista:  primerItem.artista,
      tour:     primerItem.tour ?? null,
      fecha:    primerItem.fecha,
      recinto:  primerItem.recinto,
      ciudad:   primerItem.ciudad,
      imagen:   primerItem.ULR_IMG_2 ?? null,
    },
    zonas:        resumenZonas,
    subtotal:     subtotalConPromo,
    cargoServicio,
    total:        totalFinal,
    tipoPago:     activeTab,
    codigoPromo:  codigoAplicado || null,
  };

  try {
    setLoadingPago(true);
    await subirArchivoSpei(comprobante);

    // ── Lead (comprobante subido, pago pendiente de validación) ──
    window.fbq?.('track', 'Lead', {
      value:        totalFinal,
      currency:     'MXN',
      content_name: primerItem.artista,
      content_ids:  [primerItem.eventoId],
    });

    const data = await createOrder(orderData);
    if (data.ok) { setPagoExitoso(true); clearCart(); navigate("/perfil"); }
    else setErrorPago(data.message || "Error al procesar el pago");
  } catch (err) {
    setErrorPago(err.message || "Error de conexión, intenta de nuevo");
  } finally {
    setLoadingPago(false);
  }
};

  // ── disabled del CTA ─────────────────────────────────────────
  const ctaDisabled =
    isEmpty || !pagoVisible || loadingPago || !termsAceptado ||
    (activeTab === 'tarjeta' && !cardValido);

  return (
    <>
      {loadingPago && <OrderSuccessModal numeroPedido={numeroPedido} />}
      <div className="ck-root">
        <div className="ck-ambient" />

        {/* ── PROGRESS ── */}
        <div className="ck-progress">
          <div className="ck-progress__inner">
            <div className="ck-step ck-step--done">
              <div className="ck-step__circle">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span className="ck-step__label">Carrito</span>
            </div>
            <div className="ck-step__line ck-step__line--done" />
            <div className={`ck-step ${!pagoVisible ? "ck-step--active" : "ck-step--done"}`}>
              <div className="ck-step__circle">
                {pagoVisible
                  ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  : 2}
              </div>
              <span className="ck-step__label">Datos</span>
            </div>
            <div className={`ck-step__line ${pagoVisible ? "ck-step__line--done" : ""}`} />
            <div className={`ck-step ${pagoVisible ? "ck-step--active" : ""}`}>
              <div className="ck-step__circle">3</div>
              <span className="ck-step__label">Pago</span>
            </div>
            <div className="ck-step__line" />
            <div className="ck-step">
              <div className="ck-step__circle">4</div>
              <span className="ck-step__label">Confirmación</span>
            </div>
          </div>
        </div>

        {/* ── NÚMERO DE PEDIDO ── */}
        <div className="ck-order-badge-wrap">
          <div className="ck-order-badge">
            <IconTicket />
            <span className="ck-order-badge__label">Número de pedido</span>
            <span className="ck-order-badge__num">{numeroPedido}</span>
          </div>
        </div>

        {/* ── LAYOUT ── */}
        <div className="ck-layout">
          {/* ════ LEFT ════ */}
          <div className="ck-form-col">

            {/* ── SECCIÓN 01: DATOS ── */}
            <div className="ck-section">
              <div className="ck-section__header">
                <span className="ck-section__num">01</span>
                <div>
                  <h2 className="ck-section__title">Datos del comprador</h2>
                  <p className="ck-section__sub">Todos los campos marcados son obligatorios</p>
                </div>
              </div>

              <div className="ck-fields">
                <div className="ck-field ck-field--half">
                  <label className="ck-label">Nombre <span className="ck-required">*</span></label>
                  <input className={`ck-input ${hasError("nombre") ? "ck-input--error" : isValid("nombre") && touched.nombre ? "ck-input--ok" : ""}`}
                    type="text" placeholder="Francisco" value={form.nombre}
                    onChange={handleChange("nombre")} onBlur={handleBlur("nombre")} />
                  {hasError("nombre") && <span className="ck-field__error">{REGLAS.nombre.msg}</span>}
                </div>

                <div className="ck-field ck-field--half">
                  <label className="ck-label">Apellido <span className="ck-required">*</span></label>
                  <input className={`ck-input ${hasError("apellido") ? "ck-input--error" : isValid("apellido") && touched.apellido ? "ck-input--ok" : ""}`}
                    type="text" placeholder="Javier" value={form.apellido}
                    onChange={handleChange("apellido")} onBlur={handleBlur("apellido")} />
                  {hasError("apellido") && <span className="ck-field__error">{REGLAS.apellido.msg}</span>}
                </div>

                <div className="ck-field">
                  <label className="ck-label">Correo electrónico <span className="ck-required">*</span></label>
                  <input className={`ck-input ${hasError("email") ? "ck-input--error" : isValid("email") && touched.email ? "ck-input--ok" : ""}`}
                    type="email" placeholder="correo@ejemplo.com" value={form.email}
                    onChange={handleChange("email")} onBlur={handleBlur("email")} />
                  {hasError("email")
                    ? <span className="ck-field__error">{REGLAS.email.msg}</span>
                    : <span className="ck-field__hint">Recibirás tus boletos aquí</span>}
                </div>

                <div className="ck-field ck-field--half">
                  <label className="ck-label">Teléfono <span className="ck-required">*</span></label>
                  <input className={`ck-input ${hasError("telefono") ? "ck-input--error" : isValid("telefono") && touched.telefono ? "ck-input--ok" : ""}`}
                    type="tel" placeholder="+52 55 0000 0000" value={form.telefono}
                    onChange={handleChange("telefono")} onBlur={handleBlur("telefono")} />
                  {hasError("telefono") && <span className="ck-field__error">{REGLAS.telefono.msg}</span>}
                </div>

                <div className="ck-field ck-field--half">
                  <label className="ck-label">CURP / RFC <span className="ck-optional">(opcional)</span></label>
                  <input className="ck-input" type="text" placeholder="Opcional"
                    value={form.curp} onChange={handleChange("curp")} />
                </div>
              </div>

              {!pagoVisible && (
                <button className={`ck-continuar-btn ${formValido ? "ck-continuar-btn--ready" : ""}`} onClick={handleContinuarPago}>
                  {formValido ? <><IconCheck /> Continuar al pago</> : <><IconArrow /> Continuar al pago</>}
                </button>
              )}

              {pagoVisible && (
                <div className="ck-datos-ok">
                  <IconCheck />
                  <span>Datos confirmados — <button className="ck-datos-ok__edit" onClick={() => setPagoVisible(false)}>Editar</button></span>
                </div>
              )}
            </div>

            {/* ── SECCIÓN 02: PAGO ── */}
            {pagoVisible && (
              <div className="ck-section ck-section--slide">
                <div className="ck-section__header">
                  <span className="ck-section__num">02</span>
                  <div>
                    <h2 className="ck-section__title">Método de pago</h2>
                    <p className="ck-section__sub">Elige cómo quieres pagar</p>
                  </div>
                </div>

                <div className="ck-pay-tabs">
                  {[
                    { id: "tarjeta", label: "Tarjeta", icon: <IconCard /> },
                    { id: "transferencia", label: "Transferencia", icon: <IconTransfer /> },
                  ].map(t => (
                    <button key={t.id}
                      className={`ck-pay-tab ${activeTab === t.id ? "ck-pay-tab--active" : ""}`}
                      onClick={() => { setActiveTab(t.id); setErrorPago(null); }}>
                      {t.icon}{t.label}
                    </button>
                  ))}
                </div>

                {/* ── TAB TARJETA ── */}
                {activeTab === "tarjeta" && (
                  <>
                    <div className="ck-fields">

                      {/* Número de tarjeta */}
                      <div className="ck-field">
                        <label className="ck-label">Número de tarjeta</label>
                        <div className="ck-input-icon-wrap">
                          <input
                            className={`ck-input ${hasErrorCard("numCard") ? "ck-input--error" : isValidCard("numCard") && cardTouched.numCard ? "ck-input--ok" : ""}`}
                            type="text" placeholder="0000 0000 0000 0000"
                            value={cardForm.numCard} inputMode="numeric"
                            onChange={handleCardChange("numCard")}
                            onBlur={handleCardBlur("numCard")}
                          />
                          <div className="ck-card-brands">
                            <svg width="34" height="22" viewBox="0 0 48 16">
                              <text x="0" y="13" fontSize="13" fontWeight="800" fill="#1a1f71" fontFamily="Arial">VISA</text>
                            </svg>
                            <svg width="28" height="18" viewBox="0 0 40 26">
                              <circle cx="15" cy="13" r="12" fill="#eb001b" opacity="0.85" />
                              <circle cx="25" cy="13" r="12" fill="#f79e1b" opacity="0.85" />
                            </svg>
                            <svg width="28" height="18" viewBox="0 0 40 26">
                              <rect width="40" height="26" rx="4" fill="#2E77BC" />
                              <text x="4" y="18" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Arial">AMEX</text>
                            </svg>
                          </div>
                        </div>
                        {hasErrorCard("numCard") && <span className="ck-field__error">{REGLAS_CARD.numCard.msg}</span>}
                      </div>

                      {/* Nombre en tarjeta */}
                      <div className="ck-field">
                        <label className="ck-label">Nombre en la tarjeta</label>
                        <input
                          className={`ck-input ${hasErrorCard("nombre") ? "ck-input--error" : isValidCard("nombre") && cardTouched.nombre ? "ck-input--ok" : ""}`}
                          type="text" placeholder="NOMBRE APELLIDO"
                          style={{ textTransform: "uppercase" }}
                          value={cardForm.nombre}
                          onChange={handleCardChange("nombre")}
                          onBlur={handleCardBlur("nombre")}
                        />
                        {hasErrorCard("nombre") && <span className="ck-field__error">{REGLAS_CARD.nombre.msg}</span>}
                      </div>

                      {/* Vencimiento */}
                      <div className="ck-field ck-field--half">
                        <label className="ck-label">Vencimiento</label>
                        <input
                          className={`ck-input ${hasErrorCard("fechaVencimiento") ? "ck-input--error" : isValidCard("fechaVencimiento") && cardTouched.fechaVencimiento ? "ck-input--ok" : ""}`}
                          type="text" placeholder="MM / AA" maxLength={5}
                          inputMode="numeric"
                          value={cardForm.fechaVencimiento}
                          onChange={handleCardChange("fechaVencimiento")}
                          onBlur={handleCardBlur("fechaVencimiento")}
                        />
                        {hasErrorCard("fechaVencimiento") && <span className="ck-field__error">{REGLAS_CARD.fechaVencimiento.msg}</span>}
                      </div>

                      {/* CVV */}
                      <div className="ck-field ck-field--half">
                        <label className="ck-label">CVV</label>
                        <input
                          className={`ck-input ${hasErrorCard("ccv") ? "ck-input--error" : isValidCard("ccv") && cardTouched.ccv ? "ck-input--ok" : ""}`}
                          type="password" placeholder="•••" maxLength={4}
                          inputMode="numeric"
                          value={cardForm.ccv}
                          onChange={handleCardChange("ccv")}
                          onBlur={handleCardBlur("ccv")}
                        />
                        {hasErrorCard("ccv") && <span className="ck-field__error">{REGLAS_CARD.ccv.msg}</span>}
                      </div>

                      {/* MSI */}
                      <div className="ck-field">
                        <label className="ck-label">Meses sin intereses</label>
                        <div className="ck-msi__options">
                          {[
                            { id: "contado", label: "Contado" },
                            { id: "3", label: "3 MSI" },
                            { id: "6", label: "6 MSI" },
                            { id: "12", label: "12 MSI" },
                          ].map(m => (
                            <button key={m.id}
                              className={`ck-msi__btn ${activeMsi === m.id ? "ck-msi__btn--active" : ""}`}
                              onClick={() => setActiveMsi(m.id)}>
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dirección de facturación */}
                    <div className="ck-billing">
                      <div className="ck-billing__header">
                        <IconHome /><span>Dirección de facturación</span>
                      </div>
                      <div className="ck-fields">
                        <div className="ck-field">
                          <label className="ck-label">Calle y número</label>
                          <input className="ck-input" type="text" placeholder="Av. Insurgentes 123 Int. 4" />
                        </div>
                        <div className="ck-field ck-field--half">
                          <label className="ck-label">Colonia</label>
                          <input className="ck-input" type="text" placeholder="Roma Norte" />
                        </div>
                        <div className="ck-field ck-field--half">
                          <label className="ck-label">C.P.</label>
                          <input className="ck-input" type="text" placeholder="06700" maxLength={5} />
                        </div>
                        <div className="ck-field ck-field--half">
                          <label className="ck-label">Ciudad</label>
                          <input className="ck-input" type="text" placeholder="Ciudad de México" />
                        </div>
                        <div className="ck-field ck-field--half">
                          <label className="ck-label">Estado</label>
                          <input className="ck-input" type="text" placeholder="CDMX" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── TAB TRANSFERENCIA ── */}
                {activeTab === "transferencia" && (
                  <div className="ck-transfer">
                    <div className="ck-transfer__cuenta">
                      <div className="ck-transfer__cuenta-header">
                        <IconBank /><span>Cuenta asignada para tu pedido</span>
                      </div>
                      <div className="ck-transfer__rows">
                        {[
                          { key: "Banco", val: cuentaAsignada.banco, cls: "" },
                          { key: "Beneficiario", val: cuentaAsignada.beneficiario, cls: "" },
                          { key: "CLABE", val: cuentaAsignada.clabe, cls: "ck-transfer__clabe" },
                          { key: "Monto", val: `$${totalFinal.toLocaleString("es-MX")} MXN`, cls: "ck-transfer__monto" },
                          { key: "Concepto", val: numeroPedido, cls: "ck-transfer__concepto" },
                        ].map(r => (
                          <div key={r.key} className={`ck-transfer__row ${r.key === "Concepto" ? "ck-transfer__row--concepto" : ""}`}>
                            <span className="ck-transfer__key">{r.key}</span>
                            <span className={`ck-transfer__val ${r.cls}`}>{r.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="ck-transfer__instructivo">
                      <div className="ck-transfer__inst-header">
                        <IconInfo /><span>¿Cómo realizar tu transferencia?</span>
                      </div>
                      <ol className="ck-transfer__steps">
                        {[
                          "Ingresa a tu banca en línea o app de tu banco.",
                          <> Registra la <strong>CLABE</strong> indicada como cuenta destino.</>,
                          <> Ingresa el monto exacto de <strong>${totalFinal.toLocaleString("es-MX")} MXN</strong>.</>,
                          <> En el campo <strong>Concepto</strong> escribe exactamente: <strong className="ck-transfer__concepto-inline">{numeroPedido}</strong></>,
                          "Sube el comprobante de pago en el campo de abajo.",
                          <> Tu pedido se confirmará en máximo <strong>2 horas hábiles</strong>.</>,
                        ].map((step, i) => (
                          <li key={i}>
                            <span className="ck-transfer__step-num">{i + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="ck-transfer__upload">
                      <label className="ck-transfer__upload-label" htmlFor="comprobante">
                        <div className="ck-transfer__upload-icon"><IconUpload /></div>
                        <div className="ck-transfer__upload-text">
                          {comprobante
                            ? <><strong>{comprobante.name}</strong><span>Archivo listo para enviar</span></>
                            : <><strong>Sube tu comprobante</strong><span>PDF, JPG o PNG · Máx. 5 MB</span></>}
                        </div>
                        {comprobante && <span className="ck-transfer__upload-check">✓</span>}
                      </label>
                      <input id="comprobante" type="file" accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: "none" }} onChange={handleComprobante} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Trust bar */}
            <div className="ck-trust-bar">
              {[
                { icon: <IconLock />, label: "Pago cifrado SSL" },
                { icon: <IconShield />, label: "Compra protegida" },
                { icon: <IconTicket />, label: "Boletos oficiales" },
              ].map(t => (
                <div key={t.label} className="ck-trust-item">
                  {t.icon}<span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ════ RIGHT — SUMMARY ════ */}
          <aside className="ck-summary-col">
            <div className="ck-summary-card">

              {!isEmpty && (
                <div className="ck-summary-event">
                  <div className="ck-summary-event__img-wrap">
                    <img className="ck-summary-event__img" src={primerItem.imagen} alt={primerItem.artista} />
                    <div className="ck-summary-event__img-overlay" />
                  </div>
                  <div className="ck-summary-event__info">
                    {primerItem.tour && <span className="ck-summary-event__label">{primerItem.tour}</span>}
                    <h3 className="ck-summary-event__name">{primerItem.artista}</h3>
                    <p className="ck-summary-event__meta"><IconCalendar /> {primerItem.fecha}</p>
                    <p className="ck-summary-event__meta"><IconPin /> {primerItem.recinto} · {primerItem.ciudad}</p>
                  </div>
                </div>
              )}

              {isEmpty && <div className="ck-summary-empty"><p>No hay boletos en el carrito</p></div>}

              <div className="ck-summary-divider" />
              <div className="ck-summary-items">
                <p className="ck-summary-items__label">Detalle del pedido</p>
                {resumenZonas.map(z => {
                  const item2x1 = items.find(i => i.zona === z.zona && i.paso === 2);
                  return (
                    <div key={z.zona} className="ck-summary-row">
                      <div className="ck-summary-row__left">
                        <span className="ck-summary-row__zona">{z.zona}</span>
                        <span className="ck-summary-row__qty">× {z.cantidad}</span>
                        {item2x1 && <span className="ck-summary-row__promo">2x1</span>}
                      </div>
                      <span className="ck-summary-row__sub">${z.subtotal.toLocaleString("es-MX")}</span>
                    </div>
                  );
                })}
                {isEmpty && <p className="ck-summary-row__qty" style={{ opacity: 0.4 }}>—</p>}
              </div>

              {/* Código promo */}
              {mostrarInputPromo && (
                <>
                  <div className="ck-summary-divider" />
                  <div className="ck-promo">
                    {!promoAplicada ? (
                      <>
                        <div className="ck-promo__row">
                          <input className="ck-promo__input" type="text" placeholder="Código promocional"
                            value={codigoInput}
                            onChange={e => { setCodigoInput(e.target.value.toUpperCase()); setErrorCodigo(null); }}
                            onKeyDown={e => e.key === "Enter" && handleAplicarCodigo()} />
                          <button className="ck-promo__btn" onClick={handleAplicarCodigo}>Aplicar</button>
                        </div>
                        {errorCodigo && <p className="ck-promo__error">✕ {errorCodigo}</p>}
                      </>
                    ) : (
                      <div className="ck-promo__applied">
                        <div className="ck-promo__applied-left">
                          <IconCheck />
                          <span className="ck-promo__applied-label">{promoAplicada.label}</span>
                        </div>
                        <button className="ck-promo__remove" onClick={handleQuitarPromo}>✕</button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="ck-summary-divider" />

              {promoAplicada && (
                <div className="ck-summary-fee">
                  <span>Subtotal</span>
                  <span className="ck-summary-fee__tachado">${totalPrecio.toLocaleString("es-MX")}</span>
                </div>
              )}

              <div className="ck-summary-fee">
                <span>Cargo por servicio <span className="ck-summary-fee__pct">(10%)</span></span>
                <span>${cargoServicio.toLocaleString("es-MX")}</span>
              </div>
              <div className="ck-summary-divider" />
              <div className="ck-summary-total">
                <span className="ck-summary-total__label">Total a pagar</span>
                <div className="ck-summary-total__right">
                  <span className="ck-summary-total__amount">${totalFinal.toLocaleString("es-MX")}</span>
                  <span className="ck-summary-total__currency">MXN</span>
                </div>
              </div>

              {errorPago && (
                <p style={{ color: "#f87171", fontSize: 12, padding: "0 18px 10px", margin: 0, lineHeight: 1.5 }}>
                  {errorPago === "tarjeta_intermitencia"
                    ? <>⚠️ Estamos presentando intermitencias con los pagos con tarjeta. Te sugerimos intentar más tarde o completa tu compra de forma segura mediante <strong>SPEI</strong>.</>
                    : <>✕ {errorPago}</>}
                </p>
              )}

              <button className="ck-cta" disabled={ctaDisabled} onClick={handleConfirmarPago}>
                <IconLock />
                {loadingPago ? "Procesando..." : "Confirmar y pagar"}
              </button>

              <div className="ck-terms-row">
                <input type="checkbox" id="ck-terms-check" className="ck-terms-check"
                  checked={termsAceptado}
                  onChange={() => { if (!termsAceptado) setTermsOpen(true); else setTermsAceptado(false); }} />
                <label htmlFor="ck-terms-check" className="ck-terms-label">
                  He leído y acepto los{" "}
                  <span className="ck-terms-link" onClick={() => setTermsOpen(true)}>
                    Términos y condiciones
                  </span>
                </label>
              </div>

              {termsOpen && (
                <TermsModal onAccept={() => { setTermsAceptado(true); setTermsOpen(false); }} />
              )}
            </div>

            <div className="ck-countdown">
              <IconClock />
              Tu reserva expira en <strong>{formatTiempo(tiempoRestante)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};
import React, { useEffect, useState } from "react";
import { useCart } from "../../../Contexts/CartContext";
import { useAuth } from "../../../Contexts/AuthContex";
import "./Styles/drawerCard.css";
import { IoClose, IoTrashOutline, IoTicketOutline } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const createSlug = (...parts) =>
  parts
    .join("-")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const STEP = { EMAIL: "email", CODE: "code", DONE: "done" };

export const CartDrawer = ({ isOpen, onClose }) => {
  const {
    items,
    isEmpty,
    totalItems,
    totalPrecio,
    resumenZonas,
    addItem,
    removeItem,
    deleteItem,
    clearCart,
    updateCantidad
  } = useCart();

  const { isAuth, loading, requestCode, login } = useAuth();
  const navigate = useNavigate();

  // Modal auth
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [feedback, setFeedback] = useState("");

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (modalOpen) closeModal();
        else onClose();
      }
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, modalOpen, onClose]);

  // Si se autentica mientras el modal está abierto → continuar al checkout
  useEffect(() => {
    if (isAuth && modalOpen) {
      setModalOpen(false);
      goToCheckout();
    }
  }, [isAuth]);

  const closeModal = () => {
    setModalOpen(false);
    setStep(STEP.EMAIL);
    setEmail("");
    setCodigo("");
    setFeedback("");
  };

  const goToCheckout = () => {
    if (isEmpty) return;
    const first = items[0];
    const slug = createSlug(first.artista, first.fecha);
    onClose();
    navigate(`/checkout/${first.eventoId}/${slug}`);
  };

  const handleContinuar = () => {
    if (isEmpty) return;
    if (!isAuth) {
      setModalOpen(true);
      return;
    }
    goToCheckout();
  };

  const handleSendCode = async () => {
    if (!email) return setFeedback("Ingresa tu correo");
    const data = await requestCode(email);
    if (data?.message === "Código enviado") {
      setStep(STEP.CODE);
      setFeedback("");
    } else {
      setFeedback(data?.message || "Error al enviar el código");
    }
  };

  const handleVerifyCode = async () => {
    if (!codigo) return setFeedback("Ingresa el código");
    const data = await login(email, codigo);
    if (data?.message === "Código verificado correctamente") {
      setStep(STEP.DONE);
      setFeedback("");
    } else {
      setFeedback(data?.message || "Código incorrecto");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="cart-overlay cart-overlay--visible"
          onClick={modalOpen ? undefined : onClose}
        />
      )}

      <aside className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}>
        {/* ── HEADER ── */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__header-left">
            <HiOutlineShoppingCart className="cart-drawer__header-icon" />
            <div>
              <h2 className="cart-drawer__title">Mi carrito</h2>
              <span className="cart-drawer__count">
                {totalItems} {totalItems === 1 ? "boleto" : "boletos"}
              </span>
            </div>
          </div>
          <div className="cart-drawer__header-actions">
            {!isEmpty && (
              <button className="cart-drawer__clear-btn" onClick={clearCart}>
                <IoTrashOutline /> Vaciar
              </button>
            )}
            <button className="cart-drawer__close-btn" onClick={onClose}>
              <IoClose />
            </button>
          </div>
        </div>

        <div className="cart-drawer__divider" />

        {/* ── BODY ── */}
        <div className="cart-drawer__body">
          {isEmpty ? (
            <div className="cart-drawer__empty">
              <div className="cart-empty__icon-wrap">
                <IoTicketOutline className="cart-empty__icon" />
              </div>
              <p className="cart-empty__title">Tu carrito está vacío</p>
              <p className="cart-empty__sub">
                Agrega boletos desde los eventos disponibles
              </p>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li
                  key={`${item.eventoId}__${item.zona}`}
                  className="cart-item"
                >
                  <div className="cart-item__img-wrap">
                    <img
                      src={item.imagen}
                      alt={item.artista}
                      className="cart-item__img"
                    />
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__artist">{item.artista}</p>
                    {item.tour && (
                      <p className="cart-item__tour">{item.tour}</p>
                    )}
                    <div className="cart-item__meta">
                      <span className="cart-item__zona-badge">{item.zona}</span>
                      <span className="cart-item__precio-unit">
                        ${item.precio.toLocaleString("es-MX")} c/u
                      </span>
                    </div>
                    <div className="cart-item__controls">
                      <button
                        className="cart-item__qty-btn"
                        disabled={item.cantidad <= (item.minCantidad || 1)}
                        onClick={() => {
                          const nuevaCantidad =
                            item.cantidad - (item.paso || 1);
                          if (nuevaCantidad < (item.minCantidad || 1)) return;
                          updateCantidad(
                            item.eventoId,
                            item.zona,
                            nuevaCantidad,
                          );
                        }}
                      >
                        −
                      </button>

                      <span className="cart-item__qty">{item.cantidad}</span>

                      <button
                        className="cart-item__qty-btn"
                        onClick={() =>
                          updateCantidad(
                            item.eventoId,
                            item.zona,
                            item.cantidad + (item.paso || 1),
                          )
                        }
                      >
                        +
                      </button>

                      <span className="cart-item__subtotal">
                        $
                        {(item.paso === 2
                          ? item.precio * (item.cantidad / 2) // ← 2x1: pagas la mitad
                          : item.precio * item.cantidad
                        ).toLocaleString("es-MX")}
                      </span>

                      <button
                        className="cart-item__delete-btn"
                        onClick={() => deleteItem(item.eventoId, item.zona)}
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── FOOTER ── */}
        {!isEmpty && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__divider" />
            <div className="cart-drawer__resumen">
              {resumenZonas.map((z) => (
                <div key={z.zona} className="cart-resumen__row">
                  <span className="cart-resumen__zona">
                    {z.zona} × {z.cantidad}
                  </span>
                  <span className="cart-resumen__subtotal">
                    ${z.subtotal.toLocaleString("es-MX")}
                  </span>
                </div>
              ))}
            </div>
            <div className="cart-drawer__divider" />
            <div className="cart-drawer__total-row">
              <span className="cart-drawer__total-label">Total</span>
              <span className="cart-drawer__total-amount">
                ${totalPrecio.toLocaleString("es-MX")}
                <span className="cart-drawer__currency"> MXN</span>
              </span>
            </div>
            <button className="cart-drawer__cta" onClick={handleContinuar}>
              Continuar compra
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <p className="cart-drawer__secure">
              🔒 Pago 100% seguro · Boletos oficiales
            </p>
          </div>
        )}

        {/* ── MODAL AUTH ── */}
        {modalOpen && (
          <div className="cart-auth-modal">
            <div className="cart-auth-modal__box">
              <button className="cart-auth-modal__close" onClick={closeModal}>
                <IoClose />
              </button>

              {/* STEP: EMAIL */}
              {step === STEP.EMAIL && (
                <>
                  <div className="cart-auth-modal__icon">✉️</div>
                  <h3 className="cart-auth-modal__title">Ingresa tu correo</h3>
                  <p className="cart-auth-modal__sub">
                    Te enviaremos un código para continuar con tu compra
                  </p>
                  <input
                    className="cart-auth-modal__input"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                    autoFocus
                  />
                  {feedback && (
                    <p className="cart-auth-modal__error">{feedback}</p>
                  )}
                  <button
                    className="cart-auth-modal__btn"
                    onClick={handleSendCode}
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "Enviar código"}
                  </button>
                </>
              )}

              {/* STEP: CODE */}
              {step === STEP.CODE && (
                <>
                  <div className="cart-auth-modal__icon">🔑</div>
                  <h3 className="cart-auth-modal__title">
                    Código de verificación
                  </h3>
                  <p className="cart-auth-modal__sub">
                    Enviado a <strong>{email}</strong>
                  </p>
                  <input
                    className="cart-auth-modal__input cart-auth-modal__input--code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                    autoFocus
                  />
                  {feedback && (
                    <p className="cart-auth-modal__error">{feedback}</p>
                  )}
                  <button
                    className="cart-auth-modal__btn"
                    onClick={handleVerifyCode}
                    disabled={loading}
                  >
                    {loading ? "Verificando..." : "Verificar y continuar"}
                  </button>
                  <button
                    className="cart-auth-modal__back"
                    onClick={() => {
                      setStep(STEP.EMAIL);
                      setCodigo("");
                      setFeedback("");
                    }}
                  >
                    ← Cambiar correo
                  </button>
                </>
              )}

              {/* STEP: DONE */}
              {step === STEP.DONE && (
                <>
                  <div className="cart-auth-modal__icon">✅</div>
                  <h3 className="cart-auth-modal__title">¡Listo!</h3>
                  <p className="cart-auth-modal__sub">
                    Sesión iniciada como <strong>{email}</strong>
                  </p>
                  <button
                    className="cart-auth-modal__btn"
                    onClick={goToCheckout}
                  >
                    Continuar al pago →
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

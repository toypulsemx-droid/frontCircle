import React, { useEffect, useState, useRef } from "react";
import "./Styles/navbar.css";
import { imagesApp } from "../../../Utils/imgApp";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleLight, PiUserLight } from "react-icons/pi";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { CartDrawer } from "../Cardrawer/CardDrawer";
import { useCart } from "../../../Contexts/CartContext";
import { useAuth } from "../../../Contexts/AuthContex";

const STEP = { MENU: "menu", EMAIL: "email", CODE: "code", DONE: "done" };

export const Navbar = () => {
  const [viewMenu, setViewMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [step,     setStep]     = useState(STEP.MENU);
  const [email,    setEmail]    = useState("");
  const [codigo,   setCodigo]   = useState("");
  const [feedback, setFeedback] = useState("");

  const dropdownRef = useRef(null);

  const { isEmpty }                                           = useCart();
  const { isAuth, user, loading, requestCode, login, logout } = useAuth();
  const { pathname }                                          = useLocation();
  const navigate                                              = useNavigate();

  useEffect(() => { setViewMenu(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserOpen(false);
        setFeedback("");
        if (!isAuth) setStep(STEP.MENU);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isAuth]);

  useEffect(() => {
    if (isAuth) setStep(STEP.DONE);
  }, [isAuth]);

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

  const handleLogout = () => {
    logout();
    setStep(STEP.MENU);
    setEmail("");
    setCodigo("");
    setUserOpen(false);
    navigate("/");
  };

  const links = [
    { to: "/",           label: "Inicio",     end: true },
    { to: "/conciertos", label: "Conciertos",  end: true },
    { to: "/festivales", label: "Festivales",  end: true },
    { to: "/deportes",   label: "Deportes",    end: true },
  ];

  return (
    <div className="nb-container">
      <header className={`nb-wrap ${scrolled ? "nb-wrap--scrolled" : ""}`}>
        <nav className="nb-nav">

          {/* Logo */}
          <div className="nb-logo">
            <NavLink to="/" className="nb-logo__link">
              <img src={imagesApp[0].URL} alt={imagesApp[0].alt} className="nb-logo__img" />
              <span className="nb-logo__text">Circulo Escena</span>
            </NavLink>
          </div>

          {/* Links */}
          <ul className={`nb-links ${viewMenu ? "nb-links--open" : ""}`}>
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to} end={end}
                  className={({ isActive }) => `nb-link ${isActive ? "nb-link--active" : ""}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <ul className="nb-icons">

            {/* Carrito */}
            <li className="nb-icon-wrap" onClick={() => setCartOpen(true)}>
              <PiShoppingCartSimpleLight className="nb-icon" />
              {!isEmpty && <span className="nb-badge nb-badge--cart" />}
            </li>

            {/* Usuario */}
            <li className="nb-icon-wrap nb-user-wrap" ref={dropdownRef}>
              <div
                onClick={() => setUserOpen(prev => !prev)}
                style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
              >
                <PiUserLight className="nb-icon" />
                {isAuth && <span className="nb-badge nb-badge--user" />}
              </div>

              {userOpen && (
                <div className="nb-user-dropdown">

                  {/* Paso 1 — botón inicial */}
                  {step === STEP.MENU && (
                    <>
                      <p className="nb-dropdown__title">Mi cuenta</p>
                      <button className="nb-dropdown__btn" onClick={() => setStep(STEP.EMAIL)}>
                        Continuar con correo
                      </button>
                    </>
                  )}

                  {/* Paso 2 — input de correo */}
                  {step === STEP.EMAIL && (
                    <>
                      <p className="nb-dropdown__title">Ingresa tu correo</p>
                      <input
                        className="nb-dropdown__input"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                        autoFocus
                      />
                      {feedback && <p className="nb-dropdown__error">{feedback}</p>}
                      <button
                        className="nb-dropdown__btn nb-dropdown__btn--primary"
                        onClick={handleSendCode}
                        disabled={loading}
                      >
                        {loading ? "Enviando..." : "Enviar código"}
                      </button>
                      <button className="nb-dropdown__back" onClick={() => { setStep(STEP.MENU); setFeedback(""); }}>
                        ← Volver
                      </button>
                    </>
                  )}

                  {/* Paso 3 — input del código */}
                  {step === STEP.CODE && (
                    <>
                      <p className="nb-dropdown__title">Código de verificación</p>
                      <p className="nb-dropdown__sub">Enviado a {email}</p>
                      <input
                        className="nb-dropdown__input nb-dropdown__input--code"
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                        autoFocus
                      />
                      {feedback && <p className="nb-dropdown__error">{feedback}</p>}
                      <button
                        className="nb-dropdown__btn nb-dropdown__btn--primary"
                        onClick={handleVerifyCode}
                        disabled={loading}
                      >
                        {loading ? "Verificando..." : "Verificar"}
                      </button>
                      <button className="nb-dropdown__back" onClick={() => { setStep(STEP.EMAIL); setCodigo(""); setFeedback(""); }}>
                        ← Cambiar correo
                      </button>
                    </>
                  )}

                  {/* Paso 4 — autenticado */}
                  {step === STEP.DONE && (
                    <>
                      <p className="nb-dropdown__title">¡Bienvenido!</p>
                      <p className="nb-dropdown__sub">{user?.email}</p>
                      <div className="nb-dropdown__divider" />
                      <NavLink
                        to="/perfil"
                        className="nb-dropdown__btn nb-dropdown__btn--nav"
                        onClick={() => setUserOpen(false)}
                      >
                        👤 Mi perfil
                      </NavLink>
                      <NavLink
                        to="/perfil"
                        className="nb-dropdown__btn nb-dropdown__btn--nav"
                        onClick={() => setUserOpen(false)}
                      >
                        🎟️ Mis pedidos
                      </NavLink>
                      <div className="nb-dropdown__divider" />
                      <button className="nb-dropdown__btn nb-dropdown__btn--logout" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </>
                  )}

                </div>
              )}
            </li>

            {/* Hamburger */}
            <li className="nb-icon-wrap nb-toggle">
              {viewMenu
                ? <AiOutlineMenuUnfold className="nb-icon" onClick={() => setViewMenu(false)} />
                : <AiOutlineMenuFold   className="nb-icon" onClick={() => setViewMenu(true)} />
              }
            </li>

          </ul>
        </nav>
      </header>

      <div className="nb-spacer" />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};
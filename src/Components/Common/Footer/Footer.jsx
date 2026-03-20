import React, { useState } from "react";
import "./Styles/footer.css";
import { imagesApp } from "../../../Utils/imgApp";
import { NavLink } from "react-router-dom";
import { VscMail } from "react-icons/vsc";
import { FaFacebook,FaFacebookMessenger,FaWhatsapp ,FaInstagram } from "react-icons/fa6";

export const Footer = () => {
  const [msj, setMsj] = useState(false);
  const [email, setEmail] = useState("");

  const validarEmail = (valor) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

const handleSendMsj = () => {
  if (!validarEmail(email)) {
    alert("Ingresa un correo válido");
    return;
  }

  setMsj(true);
};

  return (
    <>
      <div className="container_footer">
        <footer className="footer">
          <div className="logo_footer">
            <img src={imagesApp[0]?.URL} alt={imagesApp[0]?.alt} />
            <h2>CIRCULO ESCENA</h2>
          </div>
          <ul className="categorias_footer">
            <li className="categorias_title">
              <span>Categorías</span>
            </li>
            <li className="link_categoria">
              <NavLink to="/">Conciertos</NavLink>
            </li>
            <li className="link_categoria">
              <NavLink>Deportes</NavLink>
            </li>
            <li className="link_categoria">
              <NavLink>Festivales</NavLink>
            </li>
          </ul>
          <ul className="faq_footer">
            <li className="categorias_title">
              <span>Soporte</span>
            </li>
            <li className="link_categoria">
              <NavLink to="/">FAQ</NavLink>
            </li>
            <li className="link_categoria">
              <NavLink>Cancelaciones</NavLink>
            </li>
            <li className="link_categoria">
              <NavLink>Datos de la empresa</NavLink>
            </li>
          </ul>
          <ul className="provacity_footer">
            <li className="categorias_title">
              <span>Privacidad</span>
            </li>
            <li className="link_categoria">
              <NavLink to="/">Aviso de privacidad</NavLink>
            </li>
            <li className="link_categoria">
              <NavLink>Terminos y condiciones</NavLink>
            </li>
          </ul>
          <div className="social_footer">
            <h3>Contactanos</h3>
            <div className="input_footer">
              <label>
                Únete a nuestro newsletter y mantente al día con ofertas y
                novedades.
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn_email" onClick={handleSendMsj}>
                <VscMail />
              </button>              
            </div>
            {msj ? (
                <span className="msj_send">Gracias por suscribirse</span>
              ) : null}



              <ul className="icons_social">
                <li className="title_social">Nuestras redes sociales</li>
                <li className="iconos_social">
                  <FaFacebook/>
                  <FaFacebookMessenger/>
                  <FaWhatsapp/>
                  <FaInstagram/>
                </li>
                <li className="item_mail">store@circulo-escena.com</li>                
              </ul>
              
          </div>
          
        </footer>
        <div className="copy_footer">
          <span >CIRCULO ESCENA © 2025 | Todos los derechos reservados.</span>
        </div>
        
      </div>
    </>
  );
};

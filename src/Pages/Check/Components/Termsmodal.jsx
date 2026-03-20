import React from 'react'
import '../Styles/termModal.css'

export const TermsModal = ({ onAccept }) => {
  return (
    <div className="tm-overlay">
      <div className="tm-box">

        <div className="tm-header">
          <h2 className="tm-header__title">Términos y Condiciones</h2>
          <p className="tm-header__sub">Circle Tickets — Plataforma de boletos en el mercado secundario</p>
        </div>

        <div className="tm-body">

          <div className="tm-section">
            <h4 className="tm-section__title">1. Naturaleza del Servicio</h4>
            <p>Circle Tickets es una plataforma de mercado secundario que facilita la compra y venta de boletos entre usuarios para conciertos, eventos deportivos, partidos de fútbol y espectáculos en general. No somos la boletería oficial ni el organizador de ningún evento. Los boletos ofertados en nuestra plataforma son revendidos por terceros o adquiridos directamente de distribuidores autorizados.</p>
          </div>

          <div className="tm-section">
            <h4 className="tm-section__title">2. Entrega de Boletos</h4>
            <p>El plazo de entrega de los boletos inicia a partir de la validación del pago y puede extenderse hasta <strong>24 horas antes del inicio del evento</strong>. El tiempo mínimo estimado de entrega es de <strong>2 horas después de confirmado el pago</strong>. Los boletos se enviarán al correo electrónico registrado en tu cuenta. Te recomendamos completar tu compra con suficiente anticipación.</p>
          </div>

          <div className="tm-section">
            <h4 className="tm-section__title">3. Precios y Cargos</h4>
            <p>Los precios en el mercado secundario pueden ser superiores o inferiores al precio original de emisión. Adicionalmente se aplica un cargo por servicio del 10% sobre el subtotal de la compra, el cual cubre los costos operativos de la plataforma. Dicho cargo no es reembolsable bajo ninguna circunstancia.</p>
          </div>

          <div className="tm-section">
            <h4 className="tm-section__title">4. Autenticidad de los Boletos</h4>
            <p>Circle Tickets garantiza la autenticidad de todos los boletos comercializados en nuestra plataforma. En caso de que un boleto resulte inválido al momento del acceso al evento, nos comprometemos a realizar la gestión correspondiente o, en su defecto, a emitir un reembolso del valor pagado.</p>
          </div>

          <div className="tm-section">
            <h4 className="tm-section__title">5. Cancelaciones y Reembolsos</h4>
            <p>Una vez confirmada la compra, no se aceptan cancelaciones ni cambios. En caso de que el evento sea cancelado definitivamente por el organizador, Circle Tickets gestionará el reembolso del valor del boleto. El cargo por servicio no será reembolsable. Si el evento es pospuesto, los boletos conservan su validez para la nueva fecha.</p>
          </div>

          <div className="tm-section">
            <h4 className="tm-section__title">6. Método de Pago SPEI</h4>
            <p>Para pagos realizados mediante transferencia SPEI, la validación del pago puede tomar hasta 2 horas hábiles. El conteo del tiempo de entrega de boletos inicia únicamente a partir de la confirmación del pago, no del momento de la transferencia. Te recomendamos conservar el comprobante de pago.</p>
          </div>

          <div className="tm-section">
            <h4 className="tm-section__title">7. Responsabilidad del Usuario</h4>
            <p>El usuario es responsable de proporcionar datos verídicos al momento de la compra, en especial el correo electrónico donde recibirá sus boletos. Circle Tickets no se hace responsable por boletos enviados a correos incorrectos proporcionados por el comprador. Asimismo, el usuario deberá resguardar sus boletos y no compartirlos públicamente.</p>
          </div>

          <div className="tm-section">
            <h4 className="tm-section__title">8. Privacidad de Datos</h4>
            <p>La información personal recabada durante el proceso de compra será utilizada exclusivamente para la gestión del pedido, envío de boletos y atención al cliente. No compartimos datos con terceros sin consentimiento previo del usuario, salvo requerimiento legal.</p>
          </div>

          <div className="tm-section">
            <h4 className="tm-section__title">9. Modificaciones</h4>
            <p>Circle Tickets se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigor a partir de su publicación en la plataforma. El uso continuo del servicio implica la aceptación de los términos vigentes.</p>
          </div>

        </div>

        <div className="tm-footer">
          <button className="tm-footer__btn" onClick={onAccept}>
            He leído y acepto los Términos y Condiciones
          </button>
        </div>

      </div>
    </div>
  )
}
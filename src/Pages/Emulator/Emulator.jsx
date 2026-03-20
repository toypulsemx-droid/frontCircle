import React from "react";
import bts from "../../assets/images/BTS_DESKTOP.png";
import "./Styles/emulator.css";

export const Emulator = () => {
  return (
    <>
      <div className="container_emulator">
        <div className="hader_emulador">
          <img src={bts} alt="" />
          <ul className="list_data">
            <li>
              <span>BTS</span>
            </li>
            <li>
              <span>WORLD TOUR ‘ARIRANG'</span>
            </li>
            <li>MAYO</li>
            <li>ESTADIO GNP SEGUROS | CDMX</li>
          </ul>
        </div>
        <div className="fechas">
          <select name="fecha" id="fecha">
            <option value="">Selecciona una fecha</option>
            <option value="2026-05-07">7 de mayo</option>
            <option value="2026-05-09">9 de mayo</option>
            <option value="2026-05-10">10 de mayo</option>
          </select>
        </div>

        <div className="zonas">
          <select name="zona" id="zona">
            <option value="">Selecciona una zona</option>
            <option value="">TODAS LAS ZONAS</option>
            <option value="Platino A">Platino A — $13,830.00</option>
            <option value="Platino B">Platino B — $9,453.00</option>
            <option value="Verde">Verde — $8,982.00</option>
            <option value="Naranja A">Naranja A — $8,510.00</option>
            <option value="Naranja B">Naranja B — $5,448.00</option>
            <option value="Secciones 101-108">
              Secciones 101–108 — $4,976.00
            </option>
            <option value="Naranja C">Naranja C — $2,267.00</option>
          </select>
        </div>

        <div className="lugares">
          <h5>ZONA NARANJA C</h5>
          <ul className="box-lugares">
            <li>
  <h4>NA-28C</h4>
  <h3>FILA 03</h3>
  <h3>ASIENTO 17</h3>
</li>

<li>
  <h4>NA-28C</h4>
  <h3>FILA 03</h3>
  <h3>ASIENTO 16</h3>
</li>

<li>
  <h4>NA-03C</h4>
  <h3>FILA 19</h3>
  <h3>ASIENTO 12</h3>
</li>

<li>
  <h4>NA-05C</h4>
  <h3>FILA 09</h3>
  <h3>ASIENTO 16</h3>
</li>

{/* <li>
  <h4>NA-30B</h4>
  <h3>FILA 16</h3>
  <h3>ASIENTO 19</h3>
</li> */}

{/* <li>
  <h4>NA-30B</h4>
  <h3>FILA 11</h3>
  <h3>ASIENTO 14</h3>
</li>

<li>
  <h4>NA-29B</h4>
  <h3>FILA 07</h3>
  <h3>ASIENTO 16</h3>
</li>

<li>
  <h4>NA-28B</h4>
  <h3>FILA 09</h3>
  <h3>ASIENTO 04</h3>
</li>

<li>
  <h4>NA-30B</h4>
  <h3>FILA 01</h3>
  <h3>ASIENTO 22</h3>
</li> */}

{/* <li>
  <h4>NA-22B</h4>
  <h3>FILA 03</h3>
  <h3>ASIENTO 09</h3>
</li>

<li>
  <h4>NA-11B</h4>
  <h3>FILA 19</h3>
  <h3>ASIENTO 02</h3>
</li> */}

            {/* <li>
              <h4>NA-30C</h4>
              <h3>FILA 17</h3>
              <h3>ASIENTO 14</h3>
            </li>

            <li>
              <h4>NA-29C</h4>
              <h3>FILA 07</h3>
              <h3>ASIENTO 16</h3>
            </li> */}
            {/* <li>
              <h4>PLATINO A</h4>
              <h3>DISPONIBILIDAD 01</h3>
            </li>

            <li>
              <h4>PLATINO B</h4>
              <h3>DISPONIBILIDAD 02</h3>
            </li>

            <li>
              <h4>VERDE</h4>
              <h3>DISPONIBILIDAD 00</h3>
            </li>

            <li>
              <h4>NARANJA A</h4>
              <h3>DISPONIBILIDAD 06</h3>
            </li>

            <li>
              <h4>NARANJA B</h4>
              <h3>DISPONIBILIDAD 01</h3>
            </li>

            <li>
              <h4>SECCIONES 101–108</h4>
              <h3>DISPONIBILIDAD 03</h3>
            </li>

            <li>
              <h4>NARANJA C</h4>
              <h3>DISPONIBILIDAD 06</h3>
            </li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

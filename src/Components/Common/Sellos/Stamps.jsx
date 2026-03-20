import React, { useEffect, useState } from "react";
import './Styles/stamp.css'
import { MdOutlineVerifiedUser } from "react-icons/md";
import { RiLock2Line } from "react-icons/ri";
import { LuTicketCheck } from "react-icons/lu";
import { GrValidate } from "react-icons/gr";


export const Stamps = () => {
  const [current, setCurrent] = useState(1)

  
  useEffect(() => {       
  const interval = setInterval(() => {
    setCurrent((prev) => (prev === 1 ? 2 : 1));
  }, 8000); // un poco más lento se ve mejor

  return () => clearInterval(interval);
}, []);


  return (
    <>
     <div className="container_stamps">
        <ul className="list_stamps">
          <li className={`stamp_item ${current === 1 ? 'active': ''}`}><GrValidate/> <span>Garantía de autenticidad en cada boleto</span></li>
          <li className={`stamp_item ${current === 1 ? 'active': ''}`}><RiLock2Line/><span>Pagos seguros a través de nuestro procesador de pago</span></li>
          <li className={`stamp_item ${current === 2 ? 'active': ''}`}><MdOutlineVerifiedUser/> <span>Protección al comprador</span></li>
          <li className={`stamp_item ${current === 2 ? 'active': ''}`}><LuTicketCheck/> <span>Compra rápida y sencilla</span></li>         
        </ul>

        <div className="dotes">
        <span className={`dote ${current ===2 ? 'active':''}`} onClick={()=>setCurrent(2)}></span>
        <span className={`dote ${current ===1 ? 'active':''}`} onClick={()=>setCurrent(1)}></span>
        </div>       
      </div>
    </>
  )
}

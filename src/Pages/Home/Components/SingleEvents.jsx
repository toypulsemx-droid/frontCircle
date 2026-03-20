import React, { useMemo } from "react";
import '../Styles/single_home.css'
import { getFilterPriority } from "../../../Utils/filtersApp";
import { useNavigate } from "react-router-dom";

export const SingleEvents = ({eventos}) => {
    const navigate = useNavigate();

    const events = useMemo(() => {
        return getFilterPriority(eventos, "single", 1);
      }, [eventos]);

const generateSlug = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

const handleSelectEvent = (evento) => {
  const artistaSlug   = generateSlug(evento.artista)
  const fechaSlug = generateSlug(evento.fecha)
  navigate(`/${evento._id}/${artistaSlug}-${fechaSlug}`)
}
  return (
  <>
    <div className="container_single">
        {
            events.map((evento,i)=>(
                <div key={i} className="card_single">
                    <div className="card_single_text">
                        <h2>{evento.fecha}</h2>
                        <h1>{evento.artista} <br />{evento.tour}</h1>
                        <span>{evento.recinto} || {evento.ciudad}</span>
                        <span className="badge_2">Boletos ya disponibles</span>
                        <button className="bnt_single" onClick={() => handleSelectEvent(evento)}>Comprar</button>
                    </div>
                    <div className="img_card_single">
                        <img src={evento.ULR_IMG_1} alt={evento.artista} />
                    </div>
                </div>
            ))
        }
    </div>    
    </>
  )
}

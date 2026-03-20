import React from 'react'
import { getFilterPriority } from "../../../Utils/filtersApp";
import '../Styles/eventsNexts.css'
import { useNavigate } from "react-router-dom";

export const EventsNext = ({eventos}) => {
    const eventCard = getFilterPriority(eventos, "", 6);
    const navigate = useNavigate();

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
    <div className="events_next">
        <h2>Próximos Eventos</h2>
        <div className="container_cards_next">
            {
                eventCard.map((eventos,i)=>(
                    <div key={i} className="container_card_next">
                        <div className="card_next_1">
                            <img src={eventos.ULR_IMG_2} alt="" />
                            <ul className='text-card-next'>
                                <li>{eventos.artista}</li>
                                <li>{eventos.tour}</li>
                                <li>{eventos.fecha}</li>
                                <li>{eventos.recinto}, {eventos.ciudad}</li>
                            </ul>
                        </div>      
                        <div className="btn_next_events">
                        <button onClick={() => handleSelectEvent(eventos)}>Comprar boletos </button>
                        </div>                  
                    </div>
                ))
            }
        </div>
    </div>
    </>
  )
}

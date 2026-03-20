import React from 'react'
import { getFilterPriority } from "../../../Utils/filtersApp";
import '../Styles/eventsNexts.css'

export const EventsNext = ({eventos}) => {
    const eventCard = getFilterPriority(eventos, "", 6);


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
                        <button>Comprar boletos </button>
                        </div>                  
                    </div>
                ))
            }
        </div>
    </div>
    </>
  )
}

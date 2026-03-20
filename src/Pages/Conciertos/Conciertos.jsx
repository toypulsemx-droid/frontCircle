import React, { useEffect } from 'react'
import {imagesApp} from '../../Utils/imgApp'
import './Style/conciertos.css'
import { CardsEevents } from '../../Components/Common/CardsEvents/CardsEevents'
import {useEvents} from '../../Contexts/EventsContext'
import {filerForPage} from '../../Utils/filtersApp'

export const Conciertos = () => {
  const { events, loading, error } = useEvents(); 

  const concierto = filerForPage(events, 'Concierto')


 return (
    <>
    <div className="container_conciertos">
        
        <div className="wrap_conciertos">
            <div className="hedaer_conciertos">
                <img src={imagesApp[1]?.URL} alt={imagesApp[1]?.alt} />
                <div className="text_header_conciertos">
                    <h2>Vive los mejores conciertos con CIRCLE TICKETS.</h2>            
                    <h5>www.circletickets.store</h5>        
                </div>
                               
            </div>   
            <CardsEevents titulo='Conciertos' evento={concierto}/>      
        </div>
    </div>
    </>
  )
}

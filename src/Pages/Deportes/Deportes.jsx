import React from "react";
import { imagesApp } from "../../Utils/imgApp";
// import './Style/conciertos.css'
import { CardsEevents } from "../../Components/Common/CardsEvents/CardsEevents";
import { useEvents } from "../../Contexts/EventsContext";
import { filerForPage } from "../../Utils/filtersApp";

export const Deportes = () => {
    const { events, loading, error } = useEvents();
    
      const deportes = filerForPage(events, "Deportes");

  return (
    <>
    <div className="container_conciertos">
            <div className="wrap_conciertos">
              <div className="hedaer_conciertos">
                <img src={imagesApp[3]?.URL} alt={imagesApp[1]?.alt} />
                <div className="text_header_conciertos">
                  <h2>vive la pasion con circulo escena</h2>
                  <h5>www.circulo-escena.com</h5>
                </div>
              </div>
              <CardsEevents titulo="Deportes" evento={deportes} />
            </div>
          </div>
    </>
  )
}

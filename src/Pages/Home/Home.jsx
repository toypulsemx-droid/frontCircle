import React from 'react';
import './Styles/home.css'
import {useEvents} from '../../Contexts/EventsContext'
import { Slider } from './Components/Slider';
import { EventsDestacados } from './Components/EventsDestacados';
import { Stamps } from '../../Components/Common/Sellos/Stamps';
import { SingleEvents } from './Components/SingleEvents';
import { Type } from '../../Components/Common/TypePay/Type';
import { EventsNext } from './Components/EventsNext';
import { Referencias } from './Components/Referencias';
import {Loading} from '../../Components/UI/Loading/Loading';

export const Home = () => {
  const { events, loading, error } = useEvents(); 

  React.useEffect(() => {
    // Cuando la URL tiene un hash, hacer scroll automático
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <>
      {loading && <Loading/>}
      <Slider eventos={events}/>    
      <EventsDestacados eventos={events}/>
      <Stamps/>
      <SingleEvents eventos={events}/>
      <Type/>    
      <EventsNext eventos={events}/>
      <div id="referencias">
        <Referencias/>
      </div>
    </>
  )
}
import { createContext, useState, useEffect, useContext } from "react";
import { getEvents } from "../Services/eventService"; // Ajusta la ruta a tu función
import {ordenarEventosProximos} from '../Utils/funtionsApp'

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents(); 
      if (res && res.ok && Array.isArray(res.data)) {
        const data=ordenarEventosProximos(res.data)
        setEvents(data);
      } else {
        setEvents([]); // Si algo falla en la estructura, dejamos el array vacío
      }
    } catch (err) {
      setError("Error al cargar los eventos");
      setEvents([]); // Evitamos que events deje de ser un array
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider
      value={{ events, loading, error, refreshEvents: fetchEvents }}
    >
      {children}
    </EventContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents debe usarse dentro de un EventProvider");
  }
  return context;
};

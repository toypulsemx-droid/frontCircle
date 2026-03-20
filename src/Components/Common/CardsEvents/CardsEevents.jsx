import React, { useEffect, useState } from "react";
import "./Styles/cards_events.css";
import { NavLink } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const CardsEevents = ({ titulo, evento = [] }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  

  const navigate = useNavigate();

  const filteredConcerts = evento.filter((item) =>
    item.artista.toLowerCase().includes(search.toLowerCase()),
  );

  // 2️⃣ Luego paginar el resultado filtrado
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredConcerts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(filteredConcerts.length / itemsPerPage);

  const text_error = () => {
    const mensajes = {
      Conciertos: "Conciertos",
      Deportes: "Eventos deportivos",
      Festivales: "Festivales",
    };

    return mensajes[titulo] || "Eventos";
  };

  const createSlug = (evento) => {
  return `${evento.artista}-${evento.fecha}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

 const handleComprar = (evento) => {
  const slug = createSlug(evento);

  navigate(`/${evento._id}/${slug}`);
};

  return (
    <>
      {evento?.length === 0 ? (
        <>
          <div className="messenge_home">
            <h1>No hay {text_error()} disponibles</h1>
            <NavLink to="/">Ir al inicio</NavLink>
          </div>
        </>
      ) : (
        <>
          <div className="container_card_page">
            <div className="header_events_card">
              <h1>{titulo || "Eventos"}</h1>
              <div className="input_search_events">
                <input
                  type="text"
                  placeholder={`Buscar ${text_error()}`}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // resetear a página 1 al buscar
                  }}
                />
                <FiSearch />
              </div>
            </div>
            <div className="contenedor_cards_events">
              {currentItems.map((evento, i) => (
                <div key={i} className="card_evento">
                  <div className="img_card">
                    <div className="mask_1"></div>
                    <div className="mask_2"></div>
                    <img src={evento.ULR_IMG_1} alt={evento.artista} />
                  </div>
                  <div className="text_card_title">
                    <h1>{evento.artista}</h1>
                    <h2>{evento.tour}</h2>
                    <h3>{evento.fecha}</h3>
                    <h3>{evento.recinto}</h3>
                    <h3>{evento.ciudad}</h3>
                  </div>
                  <div className="btn_card_evento">
                    <button onClick={() => handleComprar(evento)}>Comprar boletos</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="btn_pages">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <IoIosArrowBack />
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <IoIosArrowForward />
              </button>
            </div>
            
          </div>
        </>
      )}
    </>
  );
};

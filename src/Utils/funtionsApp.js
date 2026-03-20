export const ordenarEventosProximos = (eventos) => {
  if (!eventos || !Array.isArray(eventos)) return [];

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normalizamos a las 00:00 para comparar solo días

  // Diccionario para convertir meses en español a números
  const meses = {
    'ENERO': 0, 'FEBRERO': 1, 'MARZO': 2, 'ABRIL': 3, 'MAYO': 4, 'JUNIO': 5,
    'JULIO': 6, 'AGOSTO': 7, 'SEPTIEMBRE': 8, 'OCTUBRE': 9, 'NOVIEMBRE': 10, 'DICIEMBRE': 11
  };

  return eventos
    .map(ev => {
      // Convertimos el string "07 MAYO 2026" a objeto Date
      const partes = ev.fecha.split(' ');
      const dia = parseInt(partes[0]);
      const mes = meses[partes[1].toUpperCase()];
      const anio = parseInt(partes[2]);
      
      return { ...ev, fechaObjeto: new Date(anio, mes, dia) };
    })
    .filter(ev => {
      // Filtramos: solo dejamos los eventos de HOY en adelante
      return ev.fechaObjeto >= hoy;
    })
    .sort((a, b) => {
      // Ordenamos: del más cercano (menor fecha) al más lejano
      return a.fechaObjeto - b.fechaObjeto;
    });
};

export const sortReviewsByDateDesc = (reviewsArray) => {
  const months = {
    ENERO: 0,
    FEBRERO: 1,
    MARZO: 2,
    ABRIL: 3,
    MAYO: 4,
    JUNIO: 5,
    JULIO: 6,
    AGOSTO: 7,
    SEPTIEMBRE: 8,
    OCTUBRE: 9,
    NOVIEMBRE: 10,
    DICIEMBRE: 11,
  };

  const parseDate = (dateStr) => {
    const [day, monthText, year] = dateStr.split("-");
    return new Date(year, months[monthText], day);
  };

  return [...reviewsArray].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );
};


export const generarNumeroPedido = () => {
  const nums = Math.floor(Math.random() * 9_999_999_999).toString().padStart(10, '0')
  return `ORD-${nums}`
}

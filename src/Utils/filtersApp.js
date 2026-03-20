/**
 * Filtra por prioridad, elimina duplicados de artista y limita a 5.
 * @param {Array} events - El array que ya viene del contexto (ordenado por fecha).
 * @param {string} priorityLevel - El nivel a buscar (ej: 'MAXIMA').
 * @param {string} categoria - El nivel a buscar (ej: 'MAXIMA').
 */
export const getFilterPriority = (events, priorityLevel = '', maxEvents) => {
  if (!events || events.length === 0) return [];

  // 1. Filtrar por la prioridad deseada
  const filtradosPorPrioridad = events.filter(ev => ev.section === priorityLevel);

  // 2. Eliminar artistas duplicados (Mantiene solo el primero que encuentre,
  // que por el orden del contexto, será el más próximo en el tiempo).
  // const artistasUnicos = filtradosPorPrioridad.reduce((acc, current) => {
  //   const existe = acc.find(item => item.artista === current.artista);
  //   if (!existe) {
  //     acc.push(current);
  //   }
  //   return acc;
  // }, []);

  // 3. Retornar los primeros 5 (o menos si no hay suficientes)
  return filtradosPorPrioridad.slice(0, maxEvents);
};

export const filerForPage = (events , categoria='') =>{
  if(!events || events.length === 0) return [];
  const categoryEvent = events.filter(ev => ev.categoria === categoria)
  return categoryEvent
}
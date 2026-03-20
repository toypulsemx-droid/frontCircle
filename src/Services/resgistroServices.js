const API_URL = import.meta.env.VITE_API_WEB

export const crearRegistro = async (registroData) => {
  const res = await fetch(`${API_URL}/admin/create-registro/crd`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(registroData),
  })
  return res.json()
}
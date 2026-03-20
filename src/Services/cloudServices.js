const API_URL = import.meta.env.VITE_API_WEB

export const subirArchivoSpei = async (file) => {
  if (!file) throw new Error('No hay archivo para subir')

  const formData = new FormData()
  formData.append('comprobante', file) // el backend no necesita un nombre específico

  const response = await fetch(`${API_URL}/user/upload/spei`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.message || 'Error al subir imagen')

  return data
}
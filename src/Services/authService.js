const API_URL = import.meta.env.VITE_API_WEB
 
export const sendCode = async (email) => {
  const response = await fetch(`${API_URL}/user-auth/send-code`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email }),
  })
  const data = await response.json()
  return data
}
 
export const verifyCode = async (email, codigo) => {
  const response = await fetch(`${API_URL}/user-auth/veryfy-code`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, codigo }),
  })
  const data = await response.json()
  return data
}
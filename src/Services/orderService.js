// Services/orderService.js

const API_URL = import.meta.env.VITE_API_WEB

// ── Helper: headers con JWT ───────────────────────────────────
const authHeaders = () => {
  try {
    const raw   = localStorage.getItem('ce_user')
    const user  = raw ? JSON.parse(raw) : {}
    const token = user?.token || ''
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  } catch {
    return { 'Content-Type': 'application/json' }
  }
}

// ── Crear orden ───────────────────────────────────────────────
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders/create`, {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify(orderData),
  })
  return response.json()
}

// ── Mis órdenes ───────────────────────────────────────────────
export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders/mis-ordenes`, {
    method:  'GET',
    headers: authHeaders(),
  })
  return response.json()
}

// ── Orden por número de pedido ────────────────────────────────
export const getOrderByNumber = async (numeroPedido) => {
  const response = await fetch(`${API_URL}/orders/${numeroPedido}`, {
    method:  'GET',
    headers: authHeaders(),
  })
  return response.json()
}
// ── cardUtils.js ─────────────────────────────────────────────

// ── Luhn algorithm ───────────────────────────────────────────
// Valida que el número de tarjeta sea matemáticamente correcto
export const luhn = (numero) => {
  const n = numero.replace(/\s/g, '')
  if (!/^\d+$/.test(n)) return false
  let suma = 0
  let doble = false
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10)
    if (doble) {
      d *= 2
      if (d > 9) d -= 9
    }
    suma += d
    doble = !doble
  }
  return suma % 10 === 0
}

// ── Redes ────────────────────────────────────────────────────
export const detectarRed = (numero) => {
  const n = numero.replace(/\s/g, '')
  if (/^4/.test(n))            return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n))        return 'amex'
  return null
}

// ── BINs México (6 dígitos) ──────────────────────────────────
const BINS = [
  // BBVA
  { bin: '427541', banco: 'BBVA',         tipo: 'débito' },
  { bin: '427543', banco: 'BBVA',         tipo: 'débito' },
  { bin: '477245', banco: 'BBVA',         tipo: 'crédito' },
  { bin: '520432', banco: 'BBVA',         tipo: 'crédito' },
  { bin: '525694', banco: 'BBVA',         tipo: 'crédito' },
  { bin: '557906', banco: 'BBVA',         tipo: 'débito' },
  { bin: '424190', banco: 'BBVA',         tipo: 'débito' },
  // Citibanamex
  { bin: '400917', banco: 'Citibanamex',  tipo: 'débito' },
  { bin: '491836', banco: 'Citibanamex',  tipo: 'débito' },
  { bin: '535210', banco: 'Citibanamex',  tipo: 'crédito' },
  { bin: '535200', banco: 'Citibanamex',  tipo: 'crédito' },
  { bin: '400918', banco: 'Citibanamex',  tipo: 'crédito' },
  // Banorte
  { bin: '483067', banco: 'Banorte',      tipo: 'débito' },
  { bin: '483068', banco: 'Banorte',      tipo: 'débito' },
  { bin: '557985', banco: 'Banorte',      tipo: 'crédito' },
  { bin: '425268', banco: 'Banorte',      tipo: 'débito' },
  // HSBC
  { bin: '402748', banco: 'HSBC',         tipo: 'débito' },
  { bin: '544107', banco: 'HSBC',         tipo: 'crédito' },
  { bin: '402749', banco: 'HSBC',         tipo: 'crédito' },
  // Santander
  { bin: '401434', banco: 'Santander',    tipo: 'débito' },
  { bin: '543691', banco: 'Santander',    tipo: 'crédito' },
  { bin: '401435', banco: 'Santander',    tipo: 'débito' },
  { bin: '543692', banco: 'Santander',    tipo: 'crédito' },
  // Scotiabank
  { bin: '476638', banco: 'Scotiabank',   tipo: 'débito' },
  { bin: '476639', banco: 'Scotiabank',   tipo: 'crédito' },
  // Inbursa
  { bin: '421966', banco: 'Inbursa',      tipo: 'débito' },
  { bin: '421967', banco: 'Inbursa',      tipo: 'crédito' },
  // BanBajío
  { bin: '426859', banco: 'BanBajío',     tipo: 'débito' },
  { bin: '426860', banco: 'BanBajío',     tipo: 'crédito' },
  // Nu
  { bin: '490931', banco: 'Nu',           tipo: 'crédito' },
  { bin: '490932', banco: 'Nu',           tipo: 'crédito' },
  // Hey Banco
  { bin: '426617', banco: 'Hey Banco',    tipo: 'débito' },
]

// ── Detecta banco y tipo por BIN ─────────────────────────────
// Si el BIN no está en la lista devuelve un resultado genérico
export const detectarBIN = (numero) => {
  const n = numero.replace(/\s/g, '')
  if (n.length < 6) return null

  const bin6 = n.substring(0, 6)
  const encontrado = BINS.find(b => b.bin === bin6)
  if (encontrado) return encontrado

  // BIN no en lista → genérico basado en la red
  const red = detectarRed(numero)
  if (!red) return null
  return {
    bin:   bin6,
    banco: 'Otro banco',
    tipo:  red === 'amex' ? 'crédito' : 'desconocido',
  }
}

// ── Formatea número con espacios cada 4 dígitos ──────────────
export const formatearNumeroTarjeta = (valor) => {
  const soloDigitos = valor.replace(/\D/g, '').substring(0, 16)
  return soloDigitos.replace(/(.{4})/g, '$1 ').trim()
}

// ── Formatea vencimiento MM/AA ────────────────────────────────
export const formatearVencimiento = (valor) => {
  const soloDigitos = valor.replace(/\D/g, '').substring(0, 4)
  if (soloDigitos.length <= 2) return soloDigitos
  return `${soloDigitos.substring(0, 2)}/${soloDigitos.substring(2)}`
}

// ── Reglas de validación ─────────────────────────────────────
export const REGLAS_CARD = {
  numCard: {
    fn: (v) => {
      const n = v.replace(/\s/g, '')
      return n.length === 16 && luhn(n)   // ← Luhn obligatorio
    },
    msg: 'Número de tarjeta inválido',
  },
  nombre: {
    fn:  (v) => v.trim().length >= 4,
    msg: 'Ingresa el nombre completo',
  },
  fechaVencimiento: {
    fn: (v) => {
      if (!/^\d{2}\/\d{2}$/.test(v)) return false
      const [mes, anio] = v.split('/').map(Number)
      if (mes < 1 || mes > 12) return false
      const ahora      = new Date()
      const anioFull   = 2000 + anio
      const mesActual  = ahora.getMonth() + 1
      const anioActual = ahora.getFullYear()
      return anioFull > anioActual || (anioFull === anioActual && mes >= mesActual)
    },
    msg: 'Fecha inválida o expirada',
  },
  ccv: {
    fn:  (v) => /^\d{3,4}$/.test(v),
    msg: '3 o 4 dígitos',
  },
}
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

/* ═══════════════════════════════════════════
   CartContext
   Estructura de un item en el carrito:
   {
     eventoId   : string,
     artista    : string,
     tour       : string,
     fecha      : string,
     recinto    : string,
     ciudad     : string,
     imagen     : string,
     zona       : string,
     precio     : number,
     cantidad   : number,
     paso       : number,
     minCantidad: number,
     promocion  : string | null,
   }
═══════════════════════════════════════════ */

const CartContext = createContext(null);

// ── Helpers localStorage ─────────────────────────────────────
const CART_KEY = 'ce_cart'

const getStoredCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => getStoredCart())

  /* ── Sincroniza LS cada vez que items cambie ── */
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  /* ── Clave única por evento + zona ── */
  const itemKey = (eventoId, zona) => `${eventoId}__${zona}`

  /* ── Agregar / incrementar ── */
  const addItem = useCallback((nuevoItem) => {
    const { eventoId, zona, precio, cantidad = 1, ...rest } = nuevoItem

    setItems((prev) => {
      // ── Si el carrito tiene items de un evento diferente ─────
      if (prev.length > 0 && prev[0].eventoId !== eventoId) {
        const confirmar = window.confirm(
          `Tu carrito tiene boletos de ${prev[0].artista}.\n¿Deseas vaciarlo y agregar boletos de ${rest.artista}?`
        )
        if (!confirmar) return prev       // cancela — carrito sin cambios
        return [{ eventoId, zona, precio, cantidad, ...rest }]  // limpia y agrega
      }

      // ── Mismo evento — lógica normal ─────────────────────────
      const key    = itemKey(eventoId, zona)
      const existe = prev.find((i) => itemKey(i.eventoId, i.zona) === key)

      if (existe) {
        return prev.map((i) =>
          itemKey(i.eventoId, i.zona) === key
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        )
      }

      return [...prev, { eventoId, zona, precio, cantidad, ...rest }]
    })
  }, [])

  /* ── Quitar uno (decrementar) ── */
  const removeItem = useCallback((eventoId, zona) => {
    const key = itemKey(eventoId, zona)

    setItems((prev) =>
      prev
        .map((i) =>
          itemKey(i.eventoId, i.zona) === key
            ? { ...i, cantidad: i.cantidad - 1 }
            : i
        )
        .filter((i) => i.cantidad > 0)
    )
  }, [])

  /* ── Eliminar item completo ── */
  const deleteItem = useCallback((eventoId, zona) => {
    const key = itemKey(eventoId, zona)
    setItems((prev) => prev.filter((i) => itemKey(i.eventoId, i.zona) !== key))
  }, [])

  /* ── Actualizar cantidad directa ── */
  const updateCantidad = useCallback((eventoId, zona, nuevaCantidad) => {
    if (nuevaCantidad < 1) return
    const key = itemKey(eventoId, zona)

    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.eventoId, i.zona) === key
          ? { ...i, cantidad: nuevaCantidad }
          : i
      )
    )
  }, [])

  /* ── Vaciar carrito ── */
  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_KEY)
    setItems([])
  }, [])

  /* ── Derivados (memoizados) ── */
  const totalItems  = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items])
  const totalPrecio = useMemo(() => items.reduce((acc, i) => {
    const esDos = i.paso === 2
    return acc + (esDos ? i.precio * (i.cantidad / 2) : i.precio * i.cantidad)
  }, 0), [items])
  const isEmpty = items.length === 0

  /* ── Resumen por zona (útil para checkout) ── */
  const resumenZonas = useMemo(() =>
    items.map(({ zona, precio, cantidad, paso }) => ({
      zona,
      precio,
      cantidad,
      subtotal: paso === 2 ? precio * (cantidad / 2) : precio * cantidad,
    })),
  [items])

  const value = {
    items,
    totalItems,
    totalPrecio,
    isEmpty,
    resumenZonas,
    addItem,
    removeItem,
    deleteItem,
    updateCantidad,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/* ── Hook de consumo ── */
export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>")
  return ctx
}
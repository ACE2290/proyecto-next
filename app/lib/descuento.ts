// En oferta: precioAnterior es el precio normal y precio el rebajado.
export const porcentajeDescuento = (g: { precio: number; precioAnterior: number | null }) =>
  g.precioAnterior && g.precioAnterior > g.precio ? Math.round((1 - g.precio / g.precioAnterior) * 100) : 0;

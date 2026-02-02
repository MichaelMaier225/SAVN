export type Product = {
  id: number
  name: string
  qty: number
  price: number
  cost: number
}

let products: Product[] = [
  { id: 1, name: "Coca Cola", qty: 10, price: 1.5, cost: 0.8 },
  { id: 2, name: "Water Bottle", qty: 25, price: 1.0, cost: 0.4 }
]

export const getProducts = () => products

export const addProduct = (
  name: string,
  qty: number,
  price: number,
  cost: number
) => {
  products = [
    ...products,
    { id: Date.now(), name, qty, price, cost }
  ]
}

export const updateQty = (id: number, delta: number) => {
  products = products.map(p =>
    p.id === id
      ? { ...p, qty: Math.max(0, p.qty + delta) }
      : p
  )
}

export const removeProduct = (id: number) => {
  products = products.filter(p => p.id !== id)
}

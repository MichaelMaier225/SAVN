import AsyncStorage from "@react-native-async-storage/async-storage"

export type Product = {
  id: number
  name: string
  qty: number
  price: number
  cost: number
  revenue: number
  expenses: number
}

type Snapshot = {
  products: Product[]
}

const STORAGE_KEY = "SAVN_PRODUCTS"
const UNDO_KEY = "SAVN_UNDO"

let products: Product[] = []
let previousState: Snapshot | null = null

const saveState = async () => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  await AsyncStorage.setItem(UNDO_KEY, JSON.stringify(previousState))
}

const loadState = async () => {
  const storedProducts = await AsyncStorage.getItem(STORAGE_KEY)
  const storedUndo = await AsyncStorage.getItem(UNDO_KEY)

  if (storedProducts) {
    products = JSON.parse(storedProducts)
  }

  if (storedUndo) {
    previousState = JSON.parse(storedUndo)
  }
}

loadState()

const snapshot = () => {
  previousState = {
    products: products.map(p => ({ ...p })),
  }
}

export const getProducts = () => products

export const addProduct = (
  name: string,
  qty: number,
  price: number,
  cost: number
) => {
  snapshot()

  products = [
    ...products,
    {
      id: Date.now(),
      name,
      qty,
      price,
      cost,
      revenue: 0,
      expenses: qty * cost,
    },
  ]

  saveState()
}

export const sellProduct = (id: number) => {
  snapshot()

  products = products.map(p =>
    p.id === id && p.qty > 0
      ? {
          ...p,
          qty: p.qty - 1,
          revenue: p.revenue + p.price,
        }
      : p
  )

  saveState()
}

export const restockProduct = (id: number) => {
  snapshot()

  products = products.map(p =>
    p.id === id
      ? {
          ...p,
          qty: p.qty + 1,
          expenses: p.expenses + p.cost,
        }
      : p
  )

  saveState()
}

export const restockProductBulk = (
  id: number,
  qtyToAdd: number,
  totalCost: number
) => {
  if (qtyToAdd <= 0 || totalCost < 0) return

  snapshot()

  products = products.map(p =>
    p.id === id
      ? {
          ...p,
          qty: p.qty + qtyToAdd,
          expenses: p.expenses + totalCost,
        }
      : p
  )

  saveState()
}

export const wasteProduct = (id: number) => {
  snapshot()

  products = products.map(p =>
    p.id === id && p.qty > 0
      ? {
          ...p,
          qty: p.qty - 1,
          expenses: p.expenses + p.cost,
        }
      : p
  )

  saveState()
}

export const updateProduct = (
  id: number,
  updates: {
    name: string
    price: number
    cost: number
  }
) => {
  snapshot()

  products = products.map(p =>
    p.id === id
      ? {
          ...p,
          name: updates.name,
          price: updates.price,
          cost: updates.cost,
        }
      : p
  )

  saveState()
}

export const removeProduct = (id: number) => {
  snapshot()
  products = products.filter(p => p.id !== id)
  saveState()
}

export const undoLastAction = () => {
  if (!previousState) return

  products = previousState.products.map(p => ({ ...p }))
  previousState = null

  saveState()
}

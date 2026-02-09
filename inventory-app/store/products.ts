import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  getTransactions,
  recordTransaction,
  setTransactions,
  Transaction,
} from "./transactions"

export type Product = {
  id: number
  name: string
  qty: number
  price: number
  cost: number
  revenue: number
  expenses: number
  isActive: boolean
  isArchived: boolean
}

type Snapshot = {
  products: Product[]
  transactions: Transaction[]
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
    products = JSON.parse(storedProducts).map((product: Product) => ({
      ...product,
      isActive: product.isActive ?? true,
      isArchived: product.isArchived ?? false,
    }))
  }

  if (storedUndo) {
    const parsed = JSON.parse(storedUndo)
    if (parsed && Array.isArray(parsed.products)) {
      previousState = {
        products: parsed.products.map((product: Product) => ({
          ...product,
        })),
        transactions: Array.isArray(parsed.transactions)
          ? parsed.transactions
          : [],
      }
    } else if (Array.isArray(parsed)) {
      previousState = {
        products: parsed.map((product: Product) => ({
          ...product,
        })),
        transactions: [],
      }
    }
  }
}

loadState()

const snapshot = () => {
  previousState = {
    products: products.map(p => ({ ...p })),
    transactions: getTransactions().map(tx => ({ ...tx })),
  }
}

export const getProducts = () => products
export const getActiveProducts = () =>
  products.filter(p => p.isActive && !p.isArchived)

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
      isActive: true,
      isArchived: false,
    },
  ]

  saveState()
}

export const addCatalogProduct = (
  name: string,
  price: number,
  cost: number
) => {
  snapshot()

  products = [
    ...products,
    {
      id: Date.now(),
      name,
      qty: 0,
      price,
      cost,
      revenue: 0,
      expenses: 0,
      isActive: true,
      isArchived: false,
    },
  ]

  saveState()
}

export const sellProduct = (id: number) => {
  snapshot()

  let soldProduct: Product | null = null

  products = products.map(p => {
    if (p.id === id && p.qty > 0) {
      soldProduct = p
      return {
        ...p,
        qty: p.qty - 1,
        revenue: p.revenue + p.price,
      }
    }
    return p
  })

  if (soldProduct) {
    recordTransaction({
      productId: soldProduct.id,
      productName: soldProduct.name,
      type: "sale",
      quantity: 1,
      amount: soldProduct.price,
    })
  }

  saveState()
}

export const sellProductBulk = (
  id: number,
  qtyToSell: number,
  totalRevenue: number
) => {
  if (qtyToSell <= 0 || totalRevenue < 0) return

  snapshot()

  let soldProduct: Product | null = null

  products = products.map(p => {
    if (p.id === id) {
      soldProduct = p
      return {
        ...p,
        qty: p.qty - qtyToSell,
        revenue: p.revenue + totalRevenue,
      }
    }
    return p
  })

  if (soldProduct) {
    recordTransaction({
      productId: soldProduct.id,
      productName: soldProduct.name,
      type: "sale",
      quantity: qtyToSell,
      amount: totalRevenue,
    })
  }

  saveState()
}

export const restockProduct = (id: number) => {
  snapshot()

  let restockedProduct: Product | null = null

  products = products.map(p => {
    if (p.id === id) {
      restockedProduct = p
      return {
        ...p,
        qty: p.qty + 1,
        expenses: p.expenses + p.cost,
      }
    }
    return p
  })

  if (restockedProduct) {
    recordTransaction({
      productId: restockedProduct.id,
      productName: restockedProduct.name,
      type: "restock",
      quantity: 1,
      amount: restockedProduct.cost,
    })
  }

  saveState()
}

export const restockProductBulk = (
  id: number,
  qtyToAdd: number,
  totalCost: number
) => {
  if (qtyToAdd <= 0 || totalCost < 0) return

  snapshot()

  let restockedProduct: Product | null = null

  products = products.map(p => {
    if (p.id === id) {
      restockedProduct = p
      return {
        ...p,
        qty: p.qty + qtyToAdd,
        expenses: p.expenses + totalCost,
      }
    }
    return p
  })

  if (restockedProduct) {
    recordTransaction({
      productId: restockedProduct.id,
      productName: restockedProduct.name,
      type: "restock",
      quantity: qtyToAdd,
      amount: totalCost,
    })
  }

  saveState()
}

export const setProductInventory = (id: number, newQty: number) => {
  if (Number.isNaN(newQty)) return

  snapshot()

  let adjustedProduct: Product | null = null
  let adjustmentQty = 0

  products = products.map(p => {
    if (p.id === id) {
      adjustedProduct = p
      const nextQty = Math.max(0, Math.floor(newQty))
      adjustmentQty = nextQty - p.qty
      return {
        ...p,
        qty: nextQty,
      }
    }
    return p
  })

  if (adjustedProduct && adjustmentQty !== 0) {
    recordTransaction({
      productId: adjustedProduct.id,
      productName: adjustedProduct.name,
      type: "adjustment",
      quantity: Math.abs(adjustmentQty),
      amount: 0,
    })
  }

  saveState()
}

export const wasteProduct = (id: number) => {
  snapshot()

  let wastedProduct: Product | null = null

  products = products.map(p => {
    if (p.id === id && p.qty > 0) {
      wastedProduct = p
      return {
        ...p,
        qty: p.qty - 1,
      }
    }
    return p
  })

  if (wastedProduct) {
    recordTransaction({
      productId: wastedProduct.id,
      productName: wastedProduct.name,
      type: "adjustment",
      quantity: 1,
      amount: 0,
    })
  }

  saveState()
}

export const wasteProductBulk = (id: number, qtyToRemove: number) => {
  if (qtyToRemove <= 0) return

  snapshot()

  let wastedProduct: Product | null = null
  let removedQty = 0

  products = products.map(p => {
    if (p.id === id) {
      wastedProduct = p
      const nextQty = Math.max(0, p.qty - qtyToRemove)
      removedQty = p.qty - nextQty
      return {
        ...p,
        qty: nextQty,
      }
    }
    return p
  })

  if (wastedProduct && removedQty > 0) {
    recordTransaction({
      productId: wastedProduct.id,
      productName: wastedProduct.name,
      type: "adjustment",
      quantity: removedQty,
      amount: 0,
    })
  }

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

export const setProductActive = (id: number, isActive: boolean) => {
  snapshot()

  products = products.map(p =>
    p.id === id && !p.isArchived
      ? {
          ...p,
          isActive,
        }
      : p
  )

  saveState()
}

export const removeProduct = (id: number) => {
  snapshot()
  products = products.map(p =>
    p.id === id
      ? {
          ...p,
          isArchived: true,
          isActive: false,
        }
      : p
  )
  saveState()
}

export const clearHistory = (durationMs: number | null) => {
  snapshot()

  if (!durationMs) {
    setTransactions([])
    saveState()
    return
  }

  const cutoff = Date.now() - durationMs
  const remaining = getTransactions().filter(
    transaction => transaction.timestamp < cutoff
  )
  setTransactions(remaining)
  saveState()
}

export const undoLastAction = () => {
  if (!previousState) return

  products = previousState.products.map(p => ({ ...p }))
  setTransactions(
    previousState.transactions.map(tx => ({ ...tx }))
  )
  previousState = null

  saveState()
}

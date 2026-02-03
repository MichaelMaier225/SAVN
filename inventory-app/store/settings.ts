import AsyncStorage from "@react-native-async-storage/async-storage"

export type Language = "en" | "vi"
export type Currency = "USD" | "VND"

const STORAGE_KEY = "SAVN_LANGUAGE"
const CURRENCY_KEY = "SAVN_CURRENCY"
const USD_TO_VND_KEY = "SAVN_USD_TO_VND_RATE"
const DEFAULT_LANGUAGE: Language = "vi"
const DEFAULT_CURRENCY: Currency = "USD"
const DEFAULT_USD_TO_VND_RATE = 24500

let language: Language = DEFAULT_LANGUAGE
let currency: Currency = DEFAULT_CURRENCY
let usdToVndRate = DEFAULT_USD_TO_VND_RATE
const listeners = new Set<(value: Language) => void>()
const currencyListeners = new Set<(value: Currency) => void>()
const usdToVndListeners = new Set<(value: number) => void>()

const notify = () => {
  listeners.forEach(listener => listener(language))
}

const notifyCurrency = () => {
  currencyListeners.forEach(listener => listener(currency))
}

const notifyUsdToVnd = () => {
  usdToVndListeners.forEach(listener => listener(usdToVndRate))
}

const loadState = async () => {
  const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY)
  if (storedLanguage === "en" || storedLanguage === "vi") {
    language = storedLanguage
    notify()
  }

  const storedCurrency = await AsyncStorage.getItem(CURRENCY_KEY)
  if (storedCurrency === "USD" || storedCurrency === "VND") {
    currency = storedCurrency
    notifyCurrency()
  }

  const storedRate = await AsyncStorage.getItem(USD_TO_VND_KEY)
  if (storedRate) {
    const parsedRate = Number.parseFloat(storedRate)
    if (!Number.isNaN(parsedRate) && parsedRate > 0) {
      usdToVndRate = parsedRate
      notifyUsdToVnd()
    }
  }
}

loadState()

export const getLanguage = () => language
export const getCurrency = () => currency
export const getUsdToVndRate = () => usdToVndRate

export const setLanguage = async (nextLanguage: Language) => {
  if (language === nextLanguage) return
  language = nextLanguage
  await AsyncStorage.setItem(STORAGE_KEY, nextLanguage)
  notify()
}

export const setCurrency = async (nextCurrency: Currency) => {
  if (currency === nextCurrency) return
  currency = nextCurrency
  await AsyncStorage.setItem(CURRENCY_KEY, nextCurrency)
  notifyCurrency()
}

export const setUsdToVndRate = async (nextRate: number) => {
  if (!Number.isFinite(nextRate) || nextRate <= 0) return
  usdToVndRate = nextRate
  await AsyncStorage.setItem(USD_TO_VND_KEY, nextRate.toString())
  notifyUsdToVnd()
}

export const subscribeToLanguage = (
  listener: (value: Language) => void
) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const subscribeToCurrency = (
  listener: (value: Currency) => void
) => {
  currencyListeners.add(listener)
  return () => {
    currencyListeners.delete(listener)
  }
}

export const subscribeToUsdToVndRate = (
  listener: (value: number) => void
) => {
  usdToVndListeners.add(listener)
  return () => {
    usdToVndListeners.delete(listener)
  }
}

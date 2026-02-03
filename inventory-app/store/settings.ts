import AsyncStorage from "@react-native-async-storage/async-storage"

export type Language = "en" | "vi"

const STORAGE_KEY = "SAVN_LANGUAGE"
const DEFAULT_LANGUAGE: Language = "vi"

let language: Language = DEFAULT_LANGUAGE
const listeners = new Set<(value: Language) => void>()

const notify = () => {
  listeners.forEach(listener => listener(language))
}

const loadState = async () => {
  const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY)
  if (storedLanguage === "en" || storedLanguage === "vi") {
    language = storedLanguage
    notify()
  }
}

loadState()

export const getLanguage = () => language

export const setLanguage = async (nextLanguage: Language) => {
  if (language === nextLanguage) return
  language = nextLanguage
  await AsyncStorage.setItem(STORAGE_KEY, nextLanguage)
  notify()
}

export const subscribeToLanguage = (
  listener: (value: Language) => void
) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

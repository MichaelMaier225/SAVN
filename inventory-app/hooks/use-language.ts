import { useCallback, useEffect, useMemo, useState } from "react"

import {
  getLanguage,
  setLanguage,
  subscribeToLanguage,
  Language,
} from "../store/settings"

type TranslationKey =
  | "analytics"
  | "analyticsTitle"
  | "appLanguage"
  | "bestMarginItem"
  | "businessHealth"
  | "changeLanguageHelper"
  | "expenses"
  | "explore"
  | "holdRestock"
  | "inventory"
  | "inventoryWatch"
  | "language"
  | "mostRestockedItem"
  | "mostSoldItem"
  | "noRestocks"
  | "noSales"
  | "profit"
  | "productInsights"
  | "revenue"
  | "salesOverview"
  | "settings"
  | "settingsTitle"
  | "slowMover"
  | "stockHealthy"
  | "topRevenueItem"
  | "vendors"

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    analytics: "Analytics",
    analyticsTitle: "Analytics",
    appLanguage: "App language",
    bestMarginItem: "Best margin item",
    businessHealth: "Business health",
    changeLanguageHelper:
      "Switch languages for labels across the app.",
    expenses: "Expenses",
    explore: "Explore",
    holdRestock: "Hold + to restock in bulk.",
    inventory: "Inventory",
    inventoryWatch: "Inventory watch",
    language: "Language",
    mostRestockedItem: "Most restocked item",
    mostSoldItem: "Most sold item",
    noRestocks: "No restocks yet",
    noSales: "No sales yet",
    profit: "Profit",
    productInsights: "Product insights",
    revenue: "Revenue",
    salesOverview: "Sales overview",
    settings: "Settings",
    settingsTitle: "Settings",
    slowMover: "Slow mover",
    stockHealthy: "Stock levels look healthy.",
    topRevenueItem: "Top revenue item",
    vendors: "Vendors",
  },
  vi: {
    analytics: "Phân tích",
    analyticsTitle: "Phân tích",
    appLanguage: "Ngôn ngữ ứng dụng",
    bestMarginItem: "Biên lợi nhuận cao nhất",
    businessHealth: "Sức khỏe kinh doanh",
    changeLanguageHelper:
      "Đổi ngôn ngữ cho các nhãn trên toàn ứng dụng.",
    expenses: "Chi phí",
    explore: "Khám phá",
    holdRestock: "Giữ + để nhập hàng số lượng lớn.",
    inventory: "Tồn kho",
    inventoryWatch: "Theo dõi tồn kho",
    language: "Ngôn ngữ",
    mostRestockedItem: "Mặt hàng nhập nhiều nhất",
    mostSoldItem: "Mặt hàng bán chạy nhất",
    noRestocks: "Chưa có nhập hàng",
    noSales: "Chưa có bán hàng",
    profit: "Lợi nhuận",
    productInsights: "Thông tin sản phẩm",
    revenue: "Doanh thu",
    salesOverview: "Tổng quan bán hàng",
    settings: "Cài đặt",
    settingsTitle: "Cài đặt",
    slowMover: "Bán chậm",
    stockHealthy: "Tồn kho đang ổn định.",
    topRevenueItem: "Sản phẩm doanh thu cao nhất",
    vendors: "Nhà cung cấp",
  },
}

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>(getLanguage())

  useEffect(() => {
    const unsubscribe = subscribeToLanguage(next => {
      setLanguageState(next)
    })
    return unsubscribe
  }, [])

  const t = useCallback(
    (key: TranslationKey) =>
      translations[language][key] ??
      translations.en[key] ??
      key,
    [language]
  )

  const updateLanguage = useCallback(
    (next: Language) => {
      setLanguage(next)
    },
    []
  )

  return useMemo(
    () => ({ language, setLanguage: updateLanguage, t }),
    [language, t, updateLanguage]
  )
}

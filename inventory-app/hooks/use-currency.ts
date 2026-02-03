import { useCallback, useEffect, useMemo, useState } from "react"

import {
  Currency,
  getCurrency,
  getUsdToVndRate,
  setCurrency,
  setUsdToVndRate,
  subscribeToCurrency,
  subscribeToUsdToVndRate,
} from "../store/settings"

type MoneyFormatter = (value: number) => string

const createFormatter = (
  currency: Currency,
  usdToVndRate: number
): MoneyFormatter => {
  const locale = currency === "VND" ? "vi-VN" : "en-US"
  const format = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  })

  return (value: number) => {
    const displayValue =
      currency === "VND" ? value * usdToVndRate : value
    return format.format(displayValue)
  }
}

export const useCurrency = () => {
  const [currency, setCurrencyState] = useState<Currency>(
    getCurrency()
  )
  const [usdToVndRate, setUsdToVndRateState] = useState<number>(
    getUsdToVndRate()
  )

  useEffect(() => {
    const unsubscribeCurrency = subscribeToCurrency(next => {
      setCurrencyState(next)
    })
    const unsubscribeRate = subscribeToUsdToVndRate(next => {
      setUsdToVndRateState(next)
    })
    return () => {
      unsubscribeCurrency()
      unsubscribeRate()
    }
  }, [])

  const formatter = useMemo(
    () => createFormatter(currency, usdToVndRate),
    [currency, usdToVndRate]
  )

  const formatMoney = useCallback(
    (value: number) => formatter(value),
    [formatter]
  )

  const toDisplayValue = useCallback(
    (value: number) =>
      currency === "VND" ? value * usdToVndRate : value,
    [currency, usdToVndRate]
  )

  const fromDisplayValue = useCallback(
    (value: number) =>
      currency === "VND" ? value / usdToVndRate : value,
    [currency, usdToVndRate]
  )

  const updateCurrency = useCallback(
    (next: Currency) => {
      setCurrency(next)
    },
    []
  )

  const updateUsdToVndRate = useCallback((next: number) => {
    setUsdToVndRate(next)
  }, [])

  return useMemo(
    () => ({
      currency,
      usdToVndRate,
      formatMoney,
      toDisplayValue,
      fromDisplayValue,
      setCurrency: updateCurrency,
      setUsdToVndRate: updateUsdToVndRate,
    }),
    [
      currency,
      usdToVndRate,
      formatMoney,
      toDisplayValue,
      fromDisplayValue,
      updateCurrency,
      updateUsdToVndRate,
    ]
  )
}

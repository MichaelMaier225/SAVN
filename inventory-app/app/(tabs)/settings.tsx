import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native"

import { useLanguage } from "../../hooks/use-language"
import { useCurrency } from "../../hooks/use-currency"
import { Currency, Language } from "../../store/settings"
import {
  clearHistory,
  undoLastAction,
} from "../../store/products"

const languageOptions: Array<{
  value: Language
  label: string
  detail: string
}> = [
  {
    value: "vi",
    label: "Tiếng Việt",
    detail: "Ngôn ngữ mặc định",
  },
  {
    value: "en",
    label: "English",
    detail: "English labels",
  },
]

export default function SettingsScreen() {
  const { language, setLanguage, t } = useLanguage()
  const [updating, setUpdating] = useState<Language | null>(null)
  const { currency, setCurrency } = useCurrency()
  const [canUndoClear, setCanUndoClear] = useState(false)

  const handleSelect = async (next: Language) => {
    setUpdating(next)
    await setLanguage(next)
    setUpdating(null)
  }

  const currencyOptions: Array<{
    value: Currency
    label: string
  }> = [
    { value: "USD", label: t("currencyUSD") },
    { value: "VND", label: t("currencyVND") },
  ]

  const clearHistoryOptions = [
    { label: t("hourly"), durationMs: 60 * 60 * 1000 },
    { label: t("daily"), durationMs: 24 * 60 * 60 * 1000 },
    { label: t("weekly"), durationMs: 7 * 24 * 60 * 60 * 1000 },
    { label: t("monthly"), durationMs: 30 * 24 * 60 * 60 * 1000 },
    { label: t("allTime"), durationMs: null },
  ]
  const clearActionLabel = canUndoClear ? t("undo") : t("clear")

  const handleClearHistory = (durationMs: number | null) => {
    if (canUndoClear) {
      undoLastAction()
      setCanUndoClear(false)
      return
    }

    Alert.alert(
      t("clearHistoryWarningTitle"),
      t("clearHistoryWarningBody"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("clear"),
          style: "destructive",
          onPress: () => {
            clearHistory(durationMs)
            setCanUndoClear(true)
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("settingsTitle")}</Text>
        <Text style={styles.subtitle}>{t("changeLanguageHelper")}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("appLanguage")}</Text>
          {languageOptions.map(option => {
            const isActive = language === option.value
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionRow,
                  isActive && styles.optionRowActive,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDetail}>{option.detail}</Text>
                </View>
                <Text style={styles.optionStatus}>
                  {isActive
                    ? "✓"
                    : updating === option.value
                    ? "…"
                    : ""}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={[styles.card, styles.cardSpacing]}>
          <Text style={styles.sectionTitle}>{t("currency")}</Text>
          <Text style={styles.helperText}>{t("currencyHelper")}</Text>
          {currencyOptions.map(option => {
            const isActive = currency === option.value
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionRow,
                  isActive && styles.optionRowActive,
                ]}
                onPress={() => setCurrency(option.value)}
              >
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
                <Text style={styles.optionStatus}>
                  {isActive ? "✓" : ""}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={[styles.card, styles.cardSpacing]}>
          <Text style={styles.sectionTitle}>{t("clearHistory")}</Text>
          <Text style={styles.helperText}>
            {t("clearHistoryHelper")}
          </Text>
          {canUndoClear ? (
            <Text style={styles.helperText}>
              {t("clearHistoryUndoHelper")}
            </Text>
          ) : null}
          {clearHistoryOptions.map(option => (
            <TouchableOpacity
              key={option.label}
              style={styles.optionRow}
              onPress={() => handleClearHistory(option.durationMs)}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.clearAction}>
                {clearActionLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  cardSpacing: {
    marginTop: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fafafa",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionRowActive: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  optionDetail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  optionStatus: {
    width: 24,
    textAlign: "center",
    fontSize: 18,
    color: "#2c7a7b",
  },
  helperText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 12,
  },
  clearAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#cc4c4c",
  },
})

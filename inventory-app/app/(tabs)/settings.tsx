import { useMemo, useState } from "react"
import {
  Alert,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native"

import { useLanguage } from "../../hooks/use-language"
import { useCurrency } from "../../hooks/use-currency"
import { Currency, Language } from "../../store/settings"
import {
  getTransactions,
  Transaction,
  setTransactions,
} from "../../store/transactions"

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
  const [selectedRange, setSelectedRange] = useState(0)
  const [lastSnapshot, setLastSnapshot] = useState<Transaction[] | null>(
    null
  )

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

  const clearHistoryOptions = useMemo(
    () => [
      { label: t("hourly"), durationMs: 60 * 60 * 1000 },
      { label: t("daily"), durationMs: 24 * 60 * 60 * 1000 },
      { label: t("weekly"), durationMs: 7 * 24 * 60 * 60 * 1000 },
      { label: t("monthly"), durationMs: 30 * 24 * 60 * 60 * 1000 },
      { label: t("allTime"), durationMs: null },
    ],
    [t]
  )

  const handleClearHistory = () => {
    const selection = clearHistoryOptions[selectedRange]
    if (!selection) return

    Alert.alert(t("clearHistoryWarningTitle"), t("clearHistoryWarningBody"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("clear"),
        style: "destructive",
        onPress: () => {
          const current = getTransactions()
          setLastSnapshot(current)

          if (!selection.durationMs) {
            setTransactions([])
            return
          }

          const cutoff = Date.now() - selection.durationMs
          const remaining = current.filter(
            transaction => transaction.timestamp < cutoff
          )
          setTransactions(remaining)
        },
      },
    ])
  }

  const handleUndoClear = () => {
    if (!lastSnapshot) return
    setTransactions(lastSnapshot)
    setLastSnapshot(null)
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
          <View style={styles.rangeRow}>
            {clearHistoryOptions.map((option, index) => {
              const isActive = index === selectedRange
              return (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.rangeOption,
                    isActive && styles.rangeOptionActive,
                  ]}
                  onPress={() => setSelectedRange(index)}
                >
                  <Text
                    style={[
                      styles.rangeLabel,
                      isActive && styles.rangeLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearHistory}
            >
              <Text style={styles.clearAction}>{t("clear")}</Text>
            </TouchableOpacity>
            {lastSnapshot ? (
              <TouchableOpacity
                style={styles.undoButton}
                onPress={handleUndoClear}
              >
                <Text style={styles.undoAction}>{t("undo")}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
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
  rangeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  rangeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  rangeOptionActive: {
    borderColor: "#2c7a7b",
    backgroundColor: "#e6f6f6",
  },
  rangeLabel: {
    fontSize: 12,
    color: "#444",
    fontWeight: "600",
  },
  rangeLabelActive: {
    color: "#1f5f5f",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fff1f1",
    borderWidth: 1,
    borderColor: "#f3b3b3",
  },
  clearAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#cc4c4c",
  },
  undoButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#f0f4f8",
    borderWidth: 1,
    borderColor: "#d5dde5",
  },
  undoAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495e",
  },
})

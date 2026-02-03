import { useCallback, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from "react-native"
import { useFocusEffect } from "expo-router"

import {
  getProducts,
  getActiveProducts,
  sellProduct,
  restockProduct,
  restockProductBulk,
  undoLastAction,
  Product,
} from "../../store/products"
import { useLanguage } from "../../hooks/use-language"
import { useCurrency } from "../../hooks/use-currency"

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeProducts, setActiveProducts] = useState<Product[]>([])
  const [canUndo, setCanUndo] = useState(false)
  const [bulkProduct, setBulkProduct] = useState<Product | null>(null)
  const [bulkQty, setBulkQty] = useState("1")
  const [bulkTotal, setBulkTotal] = useState("")
  const [bulkTotalTouched, setBulkTotalTouched] = useState(false)
  const { t } = useLanguage()
  const { currency, formatMoney, toDisplayValue, fromDisplayValue } =
    useCurrency()
  const displayDecimals = currency === "VND" ? 0 : 2

  const refresh = () => {
    setProducts([...getProducts()])
    setActiveProducts([...getActiveProducts()])
  }

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [])
  )

  const openBulkRestock = (product: Product) => {
    setBulkProduct(product)
    setBulkQty("1")
    setBulkTotal(
      toDisplayValue(product.cost).toFixed(displayDecimals)
    )
    setBulkTotalTouched(false)
  }

  const closeBulkRestock = () => {
    setBulkProduct(null)
  }

  const applyBulkRestock = () => {
    if (!bulkProduct) return
    const qtyValue = Number.parseInt(bulkQty, 10)
    const totalValue = Number.parseFloat(bulkTotal)
    const totalUsd = fromDisplayValue(totalValue)

    if (Number.isNaN(qtyValue) || qtyValue <= 0) {
      Alert.alert(
        t("enterValidQuantityTitle"),
        t("enterValidQuantityBody")
      )
      return
    }

    if (Number.isNaN(totalValue) || totalValue < 0) {
      Alert.alert(
        t("enterValidTotalTitle"),
        t("enterValidTotalBody")
      )
      return
    }

    restockProductBulk(bulkProduct.id, qtyValue, totalUsd)
    setCanUndo(true)
    refresh()
    closeBulkRestock()
  }

  const updateBulkQty = (value: string) => {
    setBulkQty(value)
    const parsedQty = Number.parseInt(value, 10)
    if (
      bulkProduct &&
      !bulkTotalTouched &&
      !Number.isNaN(parsedQty) &&
      parsedQty > 0
    ) {
      setBulkTotal(
        toDisplayValue(parsedQty * bulkProduct.cost).toFixed(
          displayDecimals
        )
      )
    }
  }

  const updateBulkTotal = (value: string) => {
    setBulkTotal(value)
    setBulkTotalTouched(true)
  }

  const parsedBulkQty = Number.parseInt(bulkQty, 10)
  const estimatedTotalUsd =
    bulkProduct && !Number.isNaN(parsedBulkQty) && parsedBulkQty > 0
      ? parsedBulkQty * bulkProduct.cost
      : 0

  const revenue = products.reduce((sum, p) => sum + p.revenue, 0)
  const expenses = products.reduce((sum, p) => sum + p.expenses, 0)

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>SAVN</Text>

        <Text>
          {t("revenue")}: {formatMoney(revenue)}
        </Text>
        <Text>
          {t("expenses")}: {formatMoney(expenses)}
        </Text>
        <Text style={styles.profit}>
          {t("profit")}: {formatMoney(revenue - expenses)}
        </Text>

        {activeProducts.map(p => (
          <View key={p.id} style={styles.row}>
            <View style={styles.nameWrap}>
              <Text style={styles.name}>{p.name}</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  sellProduct(p.id)
                  setCanUndo(true)
                  refresh()
                }}
              >
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qty}>{p.qty}</Text>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  restockProduct(p.id)
                  setCanUndo(true)
                  refresh()
                }}
                onLongPress={() => openBulkRestock(p)}
              >
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.undoBtn,
                  !canUndo && styles.undoDisabled,
                ]}
                disabled={!canUndo}
                onPress={() => {
                  undoLastAction()
                  setCanUndo(false)
                  refresh()
                }}
              >
                <Text
                  style={[
                    styles.undoText,
                    !canUndo && styles.undoTextDisabled,
                  ]}
                >
                  ↺
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.helperText}>
          {t("holdRestock")}
        </Text>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={!!bulkProduct}
        onRequestClose={closeBulkRestock}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {t("bulkRestock")} {bulkProduct?.name}
            </Text>
            <Text style={styles.modalLabel}>{t("quantity")}</Text>
            <TextInput
              style={styles.modalInput}
              value={bulkQty}
              onChangeText={updateBulkQty}
              keyboardType="number-pad"
              placeholder={t("enterQuantity")}
            />
            <Text style={styles.modalHint}>
              {t("estimatedTotal")}: {formatMoney(estimatedTotalUsd)} (
              {t("qtyUnitCost")})
            </Text>
            <Text style={styles.modalLabel}>{t("totalCost")}</Text>
            <TextInput
              style={styles.modalInput}
              value={bulkTotal}
              onChangeText={updateBulkTotal}
              keyboardType="decimal-pad"
              placeholder="0.00"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={closeBulkRestock}
              >
                <Text style={styles.modalCancelText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={applyBulkRestock}
              >
                <Text style={styles.modalConfirmText}>{t("apply")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profit: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  nameWrap: {
    flex: 1,
  },
  name: {
    fontSize: 18,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 26,
  },
  qty: {
    marginHorizontal: 10,
  },
  undoBtn: {
    marginLeft: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#bbb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  undoDisabled: {
    borderColor: "#ddd",
  },
  undoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  undoTextDisabled: {
    color: "#ccc",
  },
  helperText: {
    marginTop: "auto",
    textAlign: "center",
    color: "#888",
    fontSize: 13,
    paddingTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  modalHint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCancel: {
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },
  modalConfirm: {
    backgroundColor: "#000",
    marginLeft: 10,
  },
  modalCancelText: {
    color: "#333",
    fontWeight: "600",
  },
  modalConfirmText: {
    color: "#fff",
    fontWeight: "600",
  },
})

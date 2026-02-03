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
import { router, useFocusEffect } from "expo-router"

import {
  getProducts,
  sellProduct,
  restockProduct,
  restockProductBulk,
  wasteProductBulk,
  undoLastAction,
  Product,
} from "../../store/products"

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [canUndo, setCanUndo] = useState(false)
  const [bulkProduct, setBulkProduct] = useState<Product | null>(null)
  const [bulkQty, setBulkQty] = useState("1")
  const [bulkTotal, setBulkTotal] = useState("")
  const [bulkTotalTouched, setBulkTotalTouched] = useState(false)
  const [bulkWasteProduct, setBulkWasteProduct] = useState<Product | null>(null)
  const [bulkWasteQty, setBulkWasteQty] = useState("1")

  const refresh = () => {
    setProducts([...getProducts()])
  }

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [])
  )

  const openBulkRestock = (product: Product) => {
    setBulkProduct(product)
    setBulkQty("1")
    setBulkTotal(product.cost.toFixed(2))
    setBulkTotalTouched(false)
  }

  const closeBulkRestock = () => {
    setBulkProduct(null)
  }

  const openBulkWaste = (product: Product) => {
    setBulkWasteProduct(product)
    setBulkWasteQty("1")
  }

  const closeBulkWaste = () => {
    setBulkWasteProduct(null)
  }

  const applyBulkRestock = () => {
    if (!bulkProduct) return
    const qtyValue = Number.parseInt(bulkQty, 10)
    const totalValue = Number.parseFloat(bulkTotal)

    if (Number.isNaN(qtyValue) || qtyValue <= 0) {
      Alert.alert("Enter a valid quantity", "Quantity must be at least 1.")
      return
    }

    if (Number.isNaN(totalValue) || totalValue < 0) {
      Alert.alert("Enter a valid total cost", "Total cost must be 0 or more.")
      return
    }

    restockProductBulk(bulkProduct.id, qtyValue, totalValue)
    setCanUndo(true)
    refresh()
    closeBulkRestock()
  }

  const applyBulkWaste = () => {
    if (!bulkWasteProduct) return
    const qtyValue = Number.parseInt(bulkWasteQty, 10)

    if (Number.isNaN(qtyValue) || qtyValue <= 0) {
      Alert.alert("Enter a valid quantity", "Quantity must be at least 1.")
      return
    }

    wasteProductBulk(bulkWasteProduct.id, qtyValue)
    setCanUndo(true)
    refresh()
    closeBulkWaste()
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
      setBulkTotal((parsedQty * bulkProduct.cost).toFixed(2))
    }
  }

  const updateBulkTotal = (value: string) => {
    setBulkTotal(value)
    setBulkTotalTouched(true)
  }

  const updateBulkWasteQty = (value: string) => {
    setBulkWasteQty(value)
  }

  const parsedBulkQty = Number.parseInt(bulkQty, 10)
  const estimatedTotal =
    bulkProduct && !Number.isNaN(parsedBulkQty) && parsedBulkQty > 0
      ? parsedBulkQty * bulkProduct.cost
      : 0

  const revenue = products.reduce((sum, p) => sum + p.revenue, 0)
  const expenses = products.reduce((sum, p) => sum + p.expenses, 0)

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>SAVN</Text>

        <Text>Revenue: ${revenue.toFixed(2)}</Text>
        <Text>Expenses: ${expenses.toFixed(2)}</Text>
        <Text style={styles.profit}>
          Profit: ${(revenue - expenses).toFixed(2)}
        </Text>

        {products.map(p => (
          <View key={p.id} style={styles.row}>
            <TouchableOpacity
              style={styles.nameWrap}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: String(p.id) },
                })
              }
            >
              <Text style={styles.name}>{p.name}</Text>
            </TouchableOpacity>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  sellProduct(p.id)
                  setCanUndo(true)
                  refresh()
                }}
                onLongPress={() => openBulkWaste(p)}
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
          Hold − to remove inventory in bulk. Hold + to restock in bulk.
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
              Bulk restock {bulkProduct?.name}
            </Text>
            <Text style={styles.modalLabel}>Quantity</Text>
            <TextInput
              style={styles.modalInput}
              value={bulkQty}
              onChangeText={updateBulkQty}
              keyboardType="number-pad"
              placeholder="Enter quantity"
            />
            <Text style={styles.modalHint}>
              Estimated total: ${estimatedTotal.toFixed(2)} (qty × unit cost)
            </Text>
            <Text style={styles.modalLabel}>Total cost</Text>
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
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={applyBulkRestock}
              >
                <Text style={styles.modalConfirmText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={!!bulkWasteProduct}
        onRequestClose={closeBulkWaste}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Bulk remove {bulkWasteProduct?.name}
            </Text>
            <Text style={styles.modalLabel}>Quantity</Text>
            <TextInput
              style={styles.modalInput}
              value={bulkWasteQty}
              onChangeText={updateBulkWasteQty}
              keyboardType="number-pad"
              placeholder="Enter quantity"
            />
            <Text style={styles.modalHint}>
              Removed inventory does not change revenue or expenses.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={closeBulkWaste}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={applyBulkWaste}
              >
                <Text style={styles.modalConfirmText}>Apply</Text>
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

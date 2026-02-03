import { useCallback, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from "react-native"
import { useFocusEffect } from "expo-router"

import {
  addCatalogProduct,
  getProducts,
  removeProduct,
  setProductActive,
  setProductInventory,
  updateProduct,
  Product,
} from "../../store/products"
import { useLanguage } from "../../hooks/use-language"
import { useCurrency } from "../../hooks/use-currency"

export default function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [cost, setCost] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingPrice, setEditingPrice] = useState("")
  const [editingCost, setEditingCost] = useState("")
  const [editingInventory, setEditingInventory] = useState("")
  const { t } = useLanguage()
  const { currency, formatMoney, toDisplayValue, fromDisplayValue } =
    useCurrency()
  const displayDecimals = currency === "VND" ? 0 : 2

  const refresh = () => {
    setProducts([...getProducts()])
  }

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [])
  )

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert(t("missingNameTitle"), t("missingNameBody"))
      return
    }

    const priceValue = Number.parseFloat(price)
    const costValue = Number.parseFloat(cost)
    const priceUsd = fromDisplayValue(priceValue)
    const costUsd = fromDisplayValue(costValue)

    if (Number.isNaN(priceValue) || priceValue < 0) {
      Alert.alert(t("invalidPriceTitle"), t("invalidPriceBody"))
      return
    }

    if (Number.isNaN(costValue) || costValue < 0) {
      Alert.alert(t("invalidCostTitle"), t("invalidCostBody"))
      return
    }

    addCatalogProduct(name.trim(), priceUsd, costUsd)
    setName("")
    setPrice("")
    setCost("")
    refresh()
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setEditingPrice(
      toDisplayValue(product.price).toFixed(displayDecimals)
    )
    setEditingCost(
      toDisplayValue(product.cost).toFixed(displayDecimals)
    )
    setEditingInventory(String(product.qty))
  }

  const closeEdit = () => {
    setEditingProduct(null)
  }

  const handleEditSave = () => {
    if (!editingProduct) return

    const priceValue = Number.parseFloat(editingPrice)
    const costValue = Number.parseFloat(editingCost)
    const inventoryValue = Number.parseInt(editingInventory, 10)
    const priceUsd = fromDisplayValue(priceValue)
    const costUsd = fromDisplayValue(costValue)

    if (Number.isNaN(priceValue) || priceValue < 0) {
      Alert.alert(t("invalidPriceTitle"), t("invalidPriceBody"))
      return
    }

    if (Number.isNaN(costValue) || costValue < 0) {
      Alert.alert(t("invalidCostTitle"), t("invalidCostBody"))
      return
    }

    if (Number.isNaN(inventoryValue) || inventoryValue < 0) {
      Alert.alert(
        t("invalidInventoryTitle"),
        t("invalidInventoryBody")
      )
      return
    }

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: priceUsd,
      cost: costUsd,
    })
    setProductInventory(editingProduct.id, inventoryValue)
    refresh()
    closeEdit()
  }

  const handleDelete = (product: Product) => {
    Alert.alert(
      t("archiveProductTitle"),
      t("archiveProductBody").replace("{name}", product.name),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("archive"),
          style: "destructive",
          onPress: () => {
            removeProduct(product.id)
            refresh()
          },
        },
      ]
    )
  }

  const visibleProducts = products.filter(p => !p.isArchived)
  const activeProducts = visibleProducts.filter(p => p.isActive)
  const inactiveProducts = visibleProducts.filter(p => !p.isActive)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t("vendorCatalogTitle")}</Text>
        <Text style={styles.subtitle}>
          {t("vendorCatalogSubtitle")}
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("newProduct")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("productName")}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder={t("pricePerUnit")}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            placeholder={t("costPerUnit")}
            value={cost}
            onChangeText={setCost}
            keyboardType="decimal-pad"
          />
          <Text style={styles.helper}>
            {t("catalogHelper")}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>{t("addToCatalog")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("activeProducts")}</Text>
          {activeProducts.length === 0 ? (
            <Text style={styles.emptyText}>{t("noActiveProducts")}</Text>
          ) : (
            activeProducts.map(product => (
              <View key={product.id} style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{product.name}</Text>
                  <Text style={styles.rowMeta}>
                    {formatMoney(product.price)} {t("pricePerUnit")} ·{" "}
                    {formatMoney(product.cost)} {t("costPerUnit")} ·{" "}
                    {product.qty} {t("onHand")}
                  </Text>
                </View>
                <View style={styles.rowActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEdit(product)}
                  >
                    <Text style={[styles.actionText, styles.actionTextLight]}>
                      {t("edit")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deactivateButton]}
                    onPress={() => {
                      setProductActive(product.id, false)
                      refresh()
                    }}
                  >
                    <Text style={styles.actionText}>{t("deactivate")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("inactiveProducts")}</Text>
          {inactiveProducts.length === 0 ? (
            <Text style={styles.emptyText}>{t("noInactiveProducts")}</Text>
          ) : (
            inactiveProducts.map(product => (
              <View key={product.id} style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{product.name}</Text>
                  <Text style={styles.rowMeta}>
                    {formatMoney(product.price)} {t("pricePerUnit")} ·{" "}
                    {formatMoney(product.cost)} {t("costPerUnit")} ·{" "}
                    {product.qty} {t("onHand")}
                  </Text>
                </View>
                <View style={styles.rowActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.activateButton]}
                    onPress={() => {
                      setProductActive(product.id, true)
                      refresh()
                    }}
                  >
                    <Text style={[styles.actionText, styles.actionTextLight]}>
                      {t("activate")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(product)}
                  >
                    <Text style={styles.actionText}>{t("archive")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={!!editingProduct}
        onRequestClose={closeEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {t("updateProduct")} {editingProduct?.name}
            </Text>
            <Text style={styles.modalLabel}>{t("pricePerUnit")}</Text>
            <TextInput
              style={styles.modalInput}
              value={editingPrice}
              onChangeText={setEditingPrice}
              keyboardType="decimal-pad"
              placeholder="0.00"
            />
            <Text style={styles.modalLabel}>{t("costPerUnit")}</Text>
            <TextInput
              style={styles.modalInput}
              value={editingCost}
              onChangeText={setEditingCost}
              keyboardType="decimal-pad"
              placeholder="0.00"
            />
            <Text style={styles.modalLabel}>{t("inventoryOnHand")}</Text>
            <TextInput
              style={styles.modalInput}
              value={editingInventory}
              onChangeText={setEditingInventory}
              keyboardType="number-pad"
              placeholder="0"
            />
            <Text style={styles.modalHint}>
              {t("inventoryHint")}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={closeEdit}
              >
                <Text style={styles.modalCancelText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={handleEditSave}
              >
                <Text style={styles.modalConfirmText}>{t("save")}</Text>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#555",
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  helper: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowInfo: {
    flex: 1,
    marginRight: 12,
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
  },
  rowName: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deactivateButton: {
    backgroundColor: "#f2f2f2",
  },
  editButton: {
    backgroundColor: "#111",
  },
  activateButton: {
    backgroundColor: "#000",
  },
  deleteButton: {
    backgroundColor: "#f2f2f2",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },
  actionTextLight: {
    color: "#fff",
  },
  emptyText: {
    color: "#888",
    fontSize: 13,
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

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
} from "react-native"
import { useFocusEffect } from "expo-router"

import {
  addCatalogProduct,
  getProducts,
  setProductActive,
  Product,
} from "../../store/products"

export default function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [cost, setCost] = useState("")

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
      Alert.alert("Missing name", "Enter a product name.")
      return
    }

    const priceValue = Number.parseFloat(price)
    const costValue = Number.parseFloat(cost)

    if (Number.isNaN(priceValue) || priceValue < 0) {
      Alert.alert("Invalid price", "Enter a valid price.")
      return
    }

    if (Number.isNaN(costValue) || costValue < 0) {
      Alert.alert("Invalid cost", "Enter a valid cost.")
      return
    }

    addCatalogProduct(name.trim(), priceValue, costValue)
    setName("")
    setPrice("")
    setCost("")
    refresh()
  }

  const activeProducts = products.filter(p => p.isActive)
  const inactiveProducts = products.filter(p => !p.isActive)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Vendor Catalog</Text>
        <Text style={styles.subtitle}>
          Add or remove products without affecting revenue or expenses.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>New product</Text>
          <TextInput
            style={styles.input}
            placeholder="Product name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Price per unit"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Cost per unit"
            value={cost}
            onChangeText={setCost}
            keyboardType="decimal-pad"
          />
          <Text style={styles.helper}>
            Catalog items start with zero inventory and no expenses.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>ADD TO CATALOG</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active products</Text>
          {activeProducts.length === 0 ? (
            <Text style={styles.emptyText}>No active products.</Text>
          ) : (
            activeProducts.map(product => (
              <View key={product.id} style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{product.name}</Text>
                  <Text style={styles.rowMeta}>
                    ${product.price.toFixed(2)} price · $
                    {product.cost.toFixed(2)} cost · {product.qty} on hand
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deactivateButton]}
                  onPress={() => {
                    setProductActive(product.id, false)
                    refresh()
                  }}
                >
                  <Text style={styles.actionText}>Deactivate</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inactive products</Text>
          {inactiveProducts.length === 0 ? (
            <Text style={styles.emptyText}>No inactive products.</Text>
          ) : (
            inactiveProducts.map(product => (
              <View key={product.id} style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{product.name}</Text>
                  <Text style={styles.rowMeta}>
                    ${product.price.toFixed(2)} price · $
                    {product.cost.toFixed(2)} cost · {product.qty} on hand
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, styles.activateButton]}
                  onPress={() => {
                    setProductActive(product.id, true)
                    refresh()
                  }}
                >
                  <Text style={[styles.actionText, styles.actionTextLight]}>
                    Activate
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  activateButton: {
    backgroundColor: "#000",
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
})

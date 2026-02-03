import { useCallback, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native"
import { router, useFocusEffect } from "expo-router"

import {
  getProducts,
  sellProduct,
  restockProduct,
  removeFromInventory,
  undoLastAction,
  Product,
} from "../../store/products"

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [canUndo, setCanUndo] = useState(false)

  const refresh = () => {
    setProducts([...getProducts()])
  }

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [])
  )

  const handleInventoryRemoval = (id: number, amount: number) => {
    removeFromInventory(id, amount)
    setCanUndo(true)
    refresh()
  }

  const confirmAdjustment = (id: number) => {
    Alert.alert(
      "Remove items from inventory?",
      "This won’t affect profit.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove 1",
          style: "destructive",
          onPress: () => {
            handleInventoryRemoval(id, 1)
          },
        },
        {
          text: "Remove 5",
          style: "destructive",
          onPress: () => {
            handleInventoryRemoval(id, 5)
          },
        },
      ]
    )
  }

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
                onLongPress={() => confirmAdjustment(p.id)}
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
          Hold − to remove 1 or 5 from inventory
        </Text>
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
})

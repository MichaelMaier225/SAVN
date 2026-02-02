import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import { useCallback, useState } from "react"
import { useFocusEffect } from "expo-router"

import { getProducts, Product } from "../../store/products"

export default function AnalyticsScreen() {
  const [products, setProducts] = useState<Product[]>([])

  useFocusEffect(
    useCallback(() => {
      setProducts([...getProducts()])
    }, [])
  )

  const revenue = products.reduce((s, p) => s + p.revenue, 0)
  const expenses = products.reduce((s, p) => s + p.expenses, 0)

  const bestProduct =
    products.length > 0
      ? [...products].sort((a, b) => b.revenue - a.revenue)[0]
      : null

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Analytics</Text>

        <View style={styles.card}>
          <Text>Total Revenue: ${revenue.toFixed(2)}</Text>
          <Text>Total Expenses: ${expenses.toFixed(2)}</Text>
          <Text style={styles.bold}>
            Profit: ${(revenue - expenses).toFixed(2)}
          </Text>
        </View>

        {bestProduct && (
          <View style={styles.card}>
            <Text style={styles.bold}>Top Product</Text>
            <Text>{bestProduct.name}</Text>
            <Text>Revenue: ${bestProduct.revenue.toFixed(2)}</Text>
          </View>
        )}
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
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 15,
  },
  bold: {
    fontWeight: "bold",
    marginTop: 4,
  },
})

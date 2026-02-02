import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"

import {
  getTransactions,
  Transaction,
} from "../store/products"

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

const formatRow = (t: Transaction) => {
  if (t.type === "sale") {
    return `Sold ${t.quantity} ${t.productName} – $${t.amount.toFixed(2)}`
  }
  if (t.type === "restock") {
    return `Restocked ${t.quantity} ${t.productName} – $${t.amount.toFixed(2)}`
  }
  return `Adjustment ${t.quantity} ${t.productName} – $${t.amount.toFixed(2)}`
}

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useFocusEffect(
    useCallback(() => {
      const data = [...getTransactions()].reverse()
      setTransactions(data)
    }, [])
  )

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>History</Text>

        <FlatList
          data={transactions}
          keyExtractor={item => String(item.id)}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.text}>
                {formatRow(item)}
              </Text>
              <Text style={styles.time}>
                {formatTime(item.timestamp)}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No activity yet
            </Text>
          }
        />
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    paddingVertical: 10,
  },
  text: {
    fontSize: 15,
  },
  time: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
})

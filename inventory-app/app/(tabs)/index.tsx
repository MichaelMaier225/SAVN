import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

type Product = {
  id: number;
  name: string;
  qty: number;
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Coca Cola", qty: 10 },
    { id: 2, name: "Water Bottle", qty: 25 },
    { id: 3, name: "Chips", qty: 15 },
  ]);

  const updateQty = (id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, qty: Math.max(0, p.qty + delta) }
          : p
      )
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.appName}>SAVN</Text>
        <Text style={styles.subtitle}>Simple Inventory</Text>

        {products.map((product) => (
          <View key={product.id} style={styles.row}>
            <Text style={styles.productName}>{product.name}</Text>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => updateQty(product.id, -1)}
              >
                <Text style={styles.buttonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qty}>{product.qty}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => updateQty(product.id, 1)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  productName: {
    fontSize: 18,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  qty: {
    fontSize: 18,
    marginHorizontal: 14,
    minWidth: 24,
    textAlign: "center",
  },
});

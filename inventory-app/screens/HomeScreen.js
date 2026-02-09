import React, { useContext, useMemo } from "react";
import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { TransactionsContext } from "../store/TransactionsContext";

const formatCurrency = (value) => `$${value.toFixed(2)}`;

const isToday = (isoDate) => {
  const date = new Date(isoDate);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { transactions } = useContext(TransactionsContext);

  const todaysTotals = useMemo(() => {
    return transactions.filter((transaction) => isToday(transaction.createdAt)).reduce(
      (acc, transaction) => {
        if (transaction.type === "sale") {
          acc.sales += transaction.amount;
        } else {
          acc.costs += transaction.amount;
        }
        acc.net = acc.sales - acc.costs;
        return acc;
      },
      { sales: 0, costs: 0, net: 0 }
    );
  }, [transactions]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today&apos;s Totals</Text>
      </View>
      <View style={styles.totalsCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Sales</Text>
          <Text style={styles.totalValue}>{formatCurrency(todaysTotals.sales)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Costs</Text>
          <Text style={styles.totalValue}>{formatCurrency(todaysTotals.costs)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Net</Text>
          <Text style={styles.netValue}>{formatCurrency(todaysTotals.net)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Add", { type: "sale" })}
        >
          <Text style={styles.primaryButtonText}>Add Sale</Text>
        </Pressable>
        <Pressable
          style={[styles.primaryButton, styles.secondaryButton]}
          onPress={() => navigation.navigate("Add", { type: "cost" })}
        >
          <Text style={styles.primaryButtonText}>Add Cost</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#101828",
  },
  totalsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#101828",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  totalRow: {
    marginBottom: 18,
  },
  totalLabel: {
    fontSize: 16,
    color: "#667085",
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#101828",
  },
  netValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1B6EF3",
  },
  actions: {
    marginTop: 24,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#1B6EF3",
    borderRadius: 16,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#12B76A",
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default HomeScreen;

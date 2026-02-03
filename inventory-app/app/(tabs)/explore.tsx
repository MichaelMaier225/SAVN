import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"

import { useLanguage } from "../../hooks/use-language"

export default function ExploreScreen() {
  const { t } = useLanguage()

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t("explore")}</Text>
        <Text style={styles.subtitle}>{t("exploreHeadline")}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("exploreFastSalesTitle")}
          </Text>
          <Text style={styles.cardBody}>
            {t("exploreFastSalesBody")}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("exploreBulkRestockTitle")}
          </Text>
          <Text style={styles.cardBody}>
            {t("exploreBulkRestockBody")}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("exploreBulkSalesTitle")}
          </Text>
          <Text style={styles.cardBody}>
            {t("exploreBulkSalesBody")}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("exploreCatalogTitle")}
          </Text>
          <Text style={styles.cardBody}>
            {t("exploreCatalogBody")}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("exploreHistoryTitle")}
          </Text>
          <Text style={styles.cardBody}>
            {t("exploreHistoryBody")}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("exploreAnalyticsTitle")}
          </Text>
          <Text style={styles.cardBody}>
            {t("exploreAnalyticsBody")}
          </Text>
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
    fontWeight: "700",
    marginBottom: 4,
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
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardBody: {
    color: "#555",
    lineHeight: 20,
  },
})

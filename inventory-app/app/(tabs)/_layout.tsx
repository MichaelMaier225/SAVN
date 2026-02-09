import { Tabs } from "expo-router"

import { useColorScheme } from "@/hooks/use-color-scheme"
import { Colors } from "@/constants/theme"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { useLanguage } from "../../hooks/use-language"

export default function TabLayout() {
  const { t } = useLanguage()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  const renderTabIcon =
    (name: Parameters<typeof IconSymbol>[0]["name"]) =>
    ({ color }: { color: string }) =>
      <IconSymbol name={name} color={color} size={22} />

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.icon,
          borderTopWidth: 0.5,
          paddingTop: 6,
          paddingBottom: 8,
          height: 62,
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: t("explore"),
          tabBarIcon: renderTabIcon("compass.fill"),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t("history"),
          tabBarIcon: renderTabIcon("clock.fill"),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: t("vendors"),
          tabBarIcon: renderTabIcon("building.2.fill"),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t("inventory"),
          tabBarIcon: renderTabIcon("tray.full.fill"),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: t("analytics"),
          tabBarIcon: renderTabIcon("chart.bar.fill"),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t("insights"),
          tabBarIcon: renderTabIcon("lightbulb.fill"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: renderTabIcon("gearshape.fill"),
        }}
      />
    </Tabs>
  )
}

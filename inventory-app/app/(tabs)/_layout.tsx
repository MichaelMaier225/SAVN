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
    (
      name: Parameters<typeof IconSymbol>[0]["name"],
      size = 22
    ) =>
    ({ color }: { color: string }) =>
      <IconSymbol name={name} color={color} size={size} />

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
        name="index"
        options={{
          title: "Home",
          tabBarIcon: renderTabIcon("house.fill"),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Add",
          tabBarIcon: renderTabIcon("plus.circle.fill", 30),
          tabBarActiveTintColor: colors.tint,
          tabBarIconStyle: { marginTop: -4 },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: renderTabIcon("clock.fill"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "More",
          tabBarIcon: renderTabIcon("line.3.horizontal"),
        }}
      />

      {/* Hidden routes kept for nested navigation from the More tab. */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="insights" options={{ href: null }} />
    </Tabs>
  )
}

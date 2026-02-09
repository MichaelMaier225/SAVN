import { Tabs } from "expo-router"

import { useLanguage } from "../../hooks/use-language"

export default function TabLayout() {
  const { t } = useLanguage()

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: t("inventory") }}
      />
      <Tabs.Screen
        name="catalog"
        options={{ title: t("vendors") }}
      />
      <Tabs.Screen
        name="analytics"
        options={{ title: t("analytics") }}
      />
      <Tabs.Screen
        name="insights"
        options={{ title: t("insights") }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: t("history") }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: t("explore") }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: t("settings") }}
      />
    </Tabs>
  )
}

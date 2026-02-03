import { Tabs } from "expo-router"

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "Inventory" }}
      />
      <Tabs.Screen
        name="catalog"
        options={{ title: "Vendors" }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "Explore" }}
      />
    </Tabs>
  )
}

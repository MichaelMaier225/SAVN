import { Image } from "expo-image"
import { Platform, StyleSheet } from "react-native"

import { Collapsible } from "@/components/ui/collapsible"
import { ExternalLink } from "@/components/external-link"
import ParallaxScrollView from "@/components/parallax-scroll-view"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { Fonts } from "@/constants/theme"
import { useLanguage } from "../../hooks/use-language"

export default function TabTwoScreen() {
  const { t } = useLanguage()

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          {t("explore")}
        </ThemedText>
      </ThemedView>
      <ThemedText>{t("exploreIntro")}</ThemedText>
      <Collapsible title={t("fileBasedRoutingTitle")}>
        <ThemedText>{t("fileBasedRoutingBody")}</ThemedText>
        <ThemedText>{t("fileBasedRoutingBody2")}</ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">{t("learnMore")}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t("platformSupportTitle")}>
        <ThemedText>{t("platformSupportBody")}</ThemedText>
      </Collapsible>
      <Collapsible title={t("imagesTitle")}>
        <ThemedText>{t("imagesBody")}</ThemedText>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={{ width: 100, height: 100, alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">{t("learnMore")}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t("lightDarkModeTitle")}>
        <ThemedText>{t("lightDarkModeBody")}</ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">{t("learnMore")}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t("animationsTitle")}>
        <ThemedText>{t("animationsBody")}</ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>{t("animationsIosBody")}</ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
})

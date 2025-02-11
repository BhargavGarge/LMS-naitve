import { ThemeProvider } from "@/context/theme.context";
import { Stack } from "expo-router";
import React from "react";
export default function Layout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(routes)/onboarding/index" />
      </Stack>
    </ThemeProvider>
  );
}

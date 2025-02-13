import { View, Text, Pressable, Image, Platform } from "react-native";
import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { BlurView } from "expo-blur";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import JWT from "expo-jwt";
import axios from "axios";
import { router } from "expo-router";
export default function AuthModal({
  setModalVisible,
}: {
  setModalVisible: (modal: boolean) => void;
}) {
  const configureGoogleSignIn = () => {
    if (Platform.OS === "ios") {
      GoogleSignin.configure({
        iosClientId: process.env.EXPO_PUBLIC_IOS_GOOGLE_API_KEY,
      });
    } else {
      GoogleSignin.configure({
        webClientId:
          "254222680796-95a6g92raliu0jievr3mmsfols5mldro.apps.googleusercontent.com",
      });
    }
  };
  useEffect(() => {
    configureGoogleSignIn();
  }, []);
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await authHandler({
        name: userInfo.data?.user.name ?? "",
        email: userInfo.data?.user.email ?? "",
        avatar: userInfo.data?.user.photo ?? "",
      });
      console.log(userInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const authHandler = async ({
    name,
    email,
    avatar,
  }: {
    name: string;
    email: string;
    avatar: string;
  }) => {
    const user = {
      name,
      email,
      avatar,
    };
    const token = JWT.encode(
      {
        ...user,
      },
      process.env.EXPO_PUBLIC_JWT_SECRET_KEY!
    );
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER_URI}/login`,
      {
        signedToken: token,
      }
    );
    await SecureStore.setItemAsync("accessToken", res.data.accessToken);
    await SecureStore.setItemAsync("name", name);
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("avatar", email);

    setModalVisible(false);
    router.push("/(tabs)");
  };
  return (
    <BlurView
      intensity={50} // Adjust blur effect
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)", // Slight dark overlay
      }}
    >
      <Pressable
        style={{
          width: windowWidth(420),
          height: windowHeight(250),
          padding: windowHeight(20),
          backgroundColor: "#fff",
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: fontSizes.FONT35,
            fontFamily: "Poppins_700Bold",
          }}
        >
          Join the GoDeutsch
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT20,
            paddingTop: windowHeight(5),
            fontFamily: "Poppins_300Light",
            textAlign: "center",
          }}
        >
          It's easier than your imagination!
        </Text>

        {/* Google Sign-In Button */}
        <Pressable
          onPress={() => googleSignIn()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: windowWidth(10),
            backgroundColor: "#fff",
            borderRadius: 10,
            paddingVertical: windowHeight(12),
            paddingHorizontal: windowWidth(20),
            marginTop: windowHeight(20),
            borderWidth: 1,
            borderColor: "#DDDDDD",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Image
            source={require("@/assets/images/onboarding/google.png")}
            style={{
              width: windowWidth(30),
              height: windowHeight(30),
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              fontSize: fontSizes.FONT20,
              fontFamily: "Poppins_500Medium",
            }}
          >
            Sign In With Google
          </Text>
        </Pressable>
      </Pressable>
    </BlurView>
  );
}

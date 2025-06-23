import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Header from "../components/Header";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useNotificationsStyle } from "../hooks/useNotificationsStyle";

export default function Notifications() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const styles = useNotificationsStyle();

  const notifications = [
    { id: 1, text: "Nouvelle maintenance prévue le 25/10." },
    { id: 2, text: "Réunion des résidents demain à 18h." },
    { id: 3, text: "Votre signalement #123 a été mis à jour." },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Notifications" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Vos Notifications</Text>
            </View>

            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <Text style={styles.notificationText}>
                    {notification.text}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <Navbar
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            router={router}
          />
        </View>
      </TouchableWithoutFeedback>

      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
}

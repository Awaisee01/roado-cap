import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppRoute = 
  | '/screens/TrafficMonitoring'
  | '/screens/RouteGuidance'
  | '/screens/LicenseRenewal'
  | '/screens/SafetyAlerts'
  | '/screens/AccidentReporting'
  | '/screens/Feedback'
  | '/screens/Profile';

interface CardData {
  title: string;
  icon: React.ReactNode;
  href: AppRoute;
}

const Home =({ handleLogout }: { handleLogout: () => void }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const cardAnimations = Array(6).fill(0).map(() => new Animated.Value(0));

  // Load profile image on component mount
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };
    loadProfileImage();
  }, []);

  useEffect(() => {
    const animations = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, []);

  const cards: CardData[] = [
    {
      title: 'Traffic Monitoring',
      icon: <Ionicons name={"traffic-outline" as any} size={32} color="#8a2be2" />,
      href: '/screens/TrafficMonitoring',
    },
    {
      title: 'Route Guidance',
      icon: <MaterialIcons name="directions" size={32} color="#9370db" />,
      href: '/screens/RouteGuidance',
    },
    {
      title: 'License Renewal',
      icon: <FontAwesome5 name="id-card" size={28} color="#7b68ee" />,
      href: '/screens/LicenseRenewal',
    },
    {
      title: 'Safety Alerts',
      icon: <Ionicons name="warning-sharp" size={32} color="#ff6b6b" />,
      href: '/screens/SafetyAlerts',
    },
    {
      title: 'Accident Reporting',
      icon: <MaterialCommunityIcons name="car" size={32} color="#ff6347" />,
      href: '/screens/AccidentReporting',
    },
    {
      title: 'Feedback & Complaints',
      icon: <Feather name="message-square" size={32} color="#20b2aa" />,
      href: '/screens/Feedback',
    },
  ];

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      {/* Header with title and profile button */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Roado-Cap</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
        <Link href="/screens/Profile" asChild>
          <TouchableOpacity style={styles.profileButton}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profileIconContainer}>
                <Ionicons name="person" size={24} color="#8a2be2" />
              </View>
            )}
          </TouchableOpacity>
        </Link>
      </View>

      {/* Rest of your existing content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.subHeader}>Your Smart Road Companion</Text>

        <View style={styles.grid}>
          {cards.map((card, index) => {
            const translateY = cardAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            });

            const opacity = cardAnimations[index];

            return (
              <Animated.View key={index} style={[styles.cardWrapper, { opacity, transform: [{ translateY }] }]}>
                <Link href={card.href} asChild>
                  <TouchableOpacity>
                    <LinearGradient
                      colors={['rgba(30, 30, 60, 0.7)', 'rgba(15, 12, 41, 0.9)']}
                      style={styles.card}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.iconContainer}>{card.icon}</View>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <View style={styles.cardHover} />
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#8a2be2', // Purple background
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8, // Rounded corners
    marginRight: 10, // Space between the button and profile button
  },
  logoutButtonText: {
    color: '#fff', // White text color
    fontSize: 16,
    fontWeight: '600', // Slightly bold
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'sans-serif-medium',
    textShadowColor: 'rgba(138, 43, 226, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'sans-serif',
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  cardWrapper: {
    width: '45%',
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
    shadowColor: '#8a2be2',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.5)',
    overflow: 'hidden',
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  cardHover: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: '200%',
    height: '200%',
    backgroundColor: 'rgba(138, 43, 226, 0.05)',
    transform: [{ rotate: '45deg' }],
  },
});

export default Home;

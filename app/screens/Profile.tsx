import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator // Added ActivityIndicator import
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@roado_user';

interface User {
  email: string;
  name?: string;
  profileImage?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined); // Changed to undefined
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem(USER_KEY);
        if (userString) {
          const userData: User = JSON.parse(userString);
          setUser(userData);
          setName(userData.name || '');
          setEmail(userData.email);
          setProfileImage(userData.profileImage);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to grant permission to access the media library.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
      setProfileImage(pickerResult.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!email) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      const updatedUser: User = {
        ...user,
        email,
        name: name || undefined,
        profileImage: profileImage || undefined
      };

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8a2be2" />
        </View>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
        <View style={styles.noUserContainer}>
          <Text style={styles.noUserText}>No user data found</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={isEditing ? handleImagePick : undefined}>
              <View style={styles.profileImageContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <Ionicons name="person" size={60} color="#8a2be2" />
                )}
                {isEditing && (
                  <View style={styles.editImageOverlay}>
                    <Ionicons name="camera" size={24} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <Text style={styles.profileName}>
              {name || 'Your Name'}
            </Text>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                />
              ) : (
                <Text style={styles.detailValue}>{name || 'Not specified'}</Text>
              )}
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your email"
                  placeholderTextColor="#aaa"
                />
              ) : (
                <Text style={styles.detailValue}>{email}</Text>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserText: {
    color: 'white',
    fontSize: 18,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#8a2be2',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editImageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  profileDetails: {
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  detailItem: {
    marginBottom: 20,
  },
  detailLabel: {
    color: '#8a2be2',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  detailValue: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.5)',
  },
  buttonContainer: {
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#8a2be2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#8a2be2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#8a2be2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;




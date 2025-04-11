import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import Profile from '../screens/Profile';

type User = {
  email: string;
  password: string;
};

const USER_KEY = '@roado_user';
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [secureText, setSecureText] = useState<boolean>(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(height));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();

    const checkAccountStatus = async () => {
      try {
        const userString = await AsyncStorage.getItem(USER_KEY);
        setHasAccount(userString !== null);
        setIsLoggedIn(userString !== null);
      } catch (error) {
        console.error('Error checking account status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccountStatus();
  }, []);

  const handleSignup = async (): Promise<void> => {
    if (!email || !password || !confirmPassword) {
      shakeAnimation();
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      shakeAnimation();
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const user: User = { email, password };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      successAnimation();
      Alert.alert('Success', 'Account created successfully!');
      setIsLoggedIn(true);
      setHasAccount(true);
      resetForm();
    } catch (error) {
      shakeAnimation();
      console.error('Error signing up:', error);
      Alert.alert('Error', 'Failed to create account');
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      shakeAnimation();
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const userString = await AsyncStorage.getItem(USER_KEY);
      if (!userString) {
        shakeAnimation();
        Alert.alert('Error', 'No account found. Please sign up first.');
        setIsSignup(true);
        return;
      }

      const user: User = JSON.parse(userString);
      if (user.email === email && user.password === password) {
        successAnimation();
        setIsLoggedIn(true);
        resetForm();
      } else {
        shakeAnimation();
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      shakeAnimation();
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleLogout = (): void => {
    setIsLoggedIn(false);
    resetForm();
  };

  const resetForm = (): void => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const toggleAuthMode = (): void => {
    setIsSignup(!isSignup);
    resetForm();
  };

  const toggleSecureText = (): void => {
    setSecureText(!secureText);
  };

  const shakeAnimation = () => {
    const shake = new Animated.Value(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
    return shake;
  };

  const successAnimation = () => {
    const pulse = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1.03, duration: 100, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
    return pulse;
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.gradientContainer}
      >
        <ActivityIndicator size="large" color="#8a2be2" />
      </LinearGradient>
    );
  }

  if (isLoggedIn) {
    return (
      <>
      <Home handleLogout= {handleLogout}/>
      </>
    );
  }

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.glassContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
              }
            ]}
          >
            <Text style={styles.title}>{isSignup ? 'Create Account' : 'Welcome Back'}</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#8a2be2" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                style={[styles.input, { paddingLeft: 40 }]}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#8a2be2" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                autoComplete="password"
              />
              <TouchableOpacity 
                onPress={toggleSecureText} 
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={secureText ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#8a2be2" 
                />
              </TouchableOpacity>
            </View>
            
            {isSignup && (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#8a2be2" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#aaa"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={secureText}
                />
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.authButton}
              onPress={isSignup ? handleSignup : handleLogin}
            >
              <LinearGradient
                colors={['#8a2be2', '#9370db']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>
                  {isSignup ? 'Sign Up' : 'Login'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.toggleText}>
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <Text style={styles.toggleHighlight}>
                  {isSignup ? 'Login' : 'Sign up'}
                </Text>
              </Text>
            </TouchableOpacity>

            {!hasAccount && !isSignup && (
              <View style={styles.signupPrompt}>
                <Text style={styles.promptText}>You need to sign up first!</Text>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => setIsSignup(true)}
                >
                  <Text style={styles.secondaryButtonText}>Go to Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  glassContainer: {
    backgroundColor: 'rgba(15, 12, 41, 0.7)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
    shadowColor: '#8a2be2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'sans-serif-medium',
  },
  welcomeTitle: {
    fontSize: 32,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'sans-serif-medium',
  },
  welcomeSubtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#bbb',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'rgba(138, 43, 226, 0.5)',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 15,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  authButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.5)',
  },
  secondaryButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  secondaryButtonText: {
    color: '#8a2be2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
  },
  toggleHighlight: {
    color: '#8a2be2',
    fontWeight: 'bold',
  },
  signupPrompt: {
    marginTop: 30,
    alignItems: 'center',
  },
  promptText: {
    marginBottom: 10,
    color: '#ff6b6b',
    fontSize: 14,
  },
});
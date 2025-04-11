// import { Tabs } from 'expo-router';
// import { Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#8a2be2', // Purple
//         tabBarInactiveTintColor: isDarkMode ? '#aaa' : '#888',
//         tabBarStyle: {
//           backgroundColor: isDarkMode ? '#1a1a2e' : '#f8f8f8',
//           borderTopWidth: 0,
//           height: Platform.OS === 'ios' ? 85 : 65,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '600',
//           marginBottom: Platform.OS === 'ios' ? 5 : 0,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
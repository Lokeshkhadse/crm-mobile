import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Box, Text } from 'dripsy';
import MapView, { Marker } from 'react-native-maps';

// 🏗️ Construction site GPS (change if needed)
const siteLocation = {
  latitude: 17.4221891,
  longitude: 78.3819498,
};

// 📏 Helper to get distance between two coordinates
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function AttendanceScreen() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);
      console.log('📍 Current Location:', coords);
    } catch (err) {
      console.error('❌ Location error:', err);
      setError('Unable to fetch location');
    } finally {
      setLoading(false);
    }
  };

  const fetchAndSendLocation = async (status = 'update') => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);

      // ✅ Simulated API call
      console.log(`📡 [${status.toUpperCase()}] Sending location:`, coords);
      // Uncomment when backend is ready:
      // await fetch('https://your-api.com/track', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     status,
      //     latitude: coords.latitude,
      //     longitude: coords.longitude,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });
    } catch (err) {
      console.error('❌ Location send failed:', err);
    }
  };

  const handleClockIn = () => {
    const distance = getDistanceFromLatLonInMeters(
      location.latitude,
      location.longitude,
      siteLocation.latitude,
      siteLocation.longitude
    );

    if (distance <= 100) {
      setIsClockedIn(true);
      alert('✅ Clock In successful');
      fetchAndSendLocation('clockin');

      intervalRef.current = setInterval(() => {
        fetchAndSendLocation('update');
      }, 60000);
    } else {
      alert(`📍 Too far from site. You are ${Math.round(distance)}m away.`);
    }
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    fetchAndSendLocation('clockout');
    alert('📤 Clock Out successful');

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const hasLocation = location.latitude && location.longitude;
  const distanceFromSite = hasLocation
    ? Math.round(
        getDistanceFromLatLonInMeters(
          location.latitude,
          location.longitude,
          siteLocation.latitude,
          siteLocation.longitude
        )
      )
    : null;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Box sx={{ mt: 24, mb: 12 }}>
        <Text sx={{ fontSize: 24, fontWeight: 'bold', color: '#007AFF' }}>
          📍 Mark Your Attendance
        </Text>
        <Text sx={{ fontSize: 14, color: 'gray' }}>
          GPS-based location validation
        </Text>
      </Box>

      {error ? (
        <Text sx={{ color: 'red', mb: 12 }}>{error}</Text>
      ) : (
        <Box sx={{ mb: 12 }}>
          <Text>Latitude: {location.latitude ?? 'N/A'}</Text>
          <Text>Longitude: {location.longitude ?? 'N/A'}</Text>
          {distanceFromSite && (
            <Text>📏 Distance from site: {distanceFromSite} meters</Text>
          )}
          {loading && <Text>📡 Locating...</Text>}
        </Box>
      )}

      <Box sx={{ flexDirection: 'row', justifyContent: 'space-between', mb: 20 }}>
        <TouchableOpacity
          onPress={handleClockIn}
          disabled={isClockedIn}
          style={{
            backgroundColor: '#10B981',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            opacity: isClockedIn ? 0.5 : 1,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Clock In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleClockOut}
          disabled={!isClockedIn}
          style={{
            backgroundColor: '#EF4444',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            opacity: !isClockedIn ? 0.5 : 1,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Clock Out</Text>
        </TouchableOpacity>
      </Box>

      {hasLocation ? (
        <MapView
          style={{
            width: Dimensions.get('window').width - 32,
            height: 500,
            borderRadius: 16,
          }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="You" pinColor="green" />
          <Marker coordinate={siteLocation} title="Site" pinColor="red" />
        </MapView>
      ) : (
        <Text>⏳ Waiting for GPS...</Text>
      )}
    </ScrollView>
  );
}









// import React, { useEffect, useRef, useState } from 'react';
// import { ScrollView, Dimensions, TouchableOpacity } from 'react-native';
// import * as Location from 'expo-location';
// import { Box, Text } from 'dripsy';
// import MapView, { Marker } from 'react-native-maps';

// export default function AttendanceScreen() {
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [error, setError] = useState('');
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const intervalRef = useRef(null);

//   // ✅ Fetch location only (no send)
//   const fetchCurrentLocation = async () => {
//     try {
//       setLoading(true);
//       const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
//       if (locStatus !== 'granted') {
//         setError('Permission to access location was denied');
//         setLoading(false);
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest,
//         maximumAge: 0,
//       });

//       const coords = {
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//       };
//       setLocation(coords);
//       console.log(`📍 INITIAL Location fetched:`, coords);

//     } catch (err) {
//       console.error('❌ Failed to fetch location:', err);
//       setError('Failed to fetch location');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch + "send" location during ClockIn/Out/Updates
//   const fetchAndSendLocation = async (status = 'update') => {
//     try {
//       setLoading(true);
//       const loc = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest,
//         maximumAge: 0,
//       });

//       const coords = {
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//       };
//       setLocation(coords);
//       console.log(`📡 ${status.toUpperCase()} Location sent:`, coords);

//       // Example: API call
//       // await fetch("https://your-api.com/track", {
//       //   method: "POST",
//       //   body: JSON.stringify({ coords, status }),
//       // });

//     } catch (err) {
//       console.error('❌ Failed to fetch/send location:', err);
//       setError('Failed to fetch/send location');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClockIn = () => {
//     setIsClockedIn(true);
//     fetchAndSendLocation('clockin');

//     intervalRef.current = setInterval(() => {
//       fetchAndSendLocation('update');
//     }, 60000); // every 1 minute
//   };

//   const handleClockOut = () => {
//     setIsClockedIn(false);
//     fetchAndSendLocation('clockout');

//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };

//   // ✅ Fetch current location once when screen loads

//   useEffect(() => {
//     fetchCurrentLocation();

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, []);

//   const hasLocation = location.latitude && location.longitude;

//   return (
//     <ScrollView contentContainerStyle={{ padding: 16 }}>
//       <Box sx={{ mt: 24, mb: 12 }}>
//           <Text sx={{ fontSize: 24, fontWeight: 'bold', color: 'red', ml: 57}}>
//             Mark Your Attendance
//           </Text>
//          <Text sx={{ fontSize: 14, color: 'gray' }}>
//           Track your attendance timeline
//         </Text>
//       </Box>

//       {error ? (
//         <Text sx={{ color: 'red', mb: 12 }}>{error}</Text>
//       ) : (
//         <Box sx={{ mb: 12 }}>
//           <Text>Latitude: {location.latitude ?? 'N/A'}</Text>
//           <Text>Longitude: {location.longitude ?? 'N/A'}</Text>
//           {loading && <Text>📡 Fetching location...</Text>}
//         </Box>
//       )}

//       <Box sx={{ flexDirection: 'row', justifyContent: 'space-between', mb: 20 }}>
//         <TouchableOpacity
//           onPress={handleClockIn}
//           disabled={isClockedIn}
//           style={{
//             backgroundColor: '#10B981',
//             paddingVertical: 12,
//             paddingHorizontal: 20,
//             borderRadius: 8,
//             opacity: isClockedIn ? 0.5 : 1,
//           }}
//         >
//           <Text style={{ color: 'white', fontWeight: 'bold' }}>Clock In</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={handleClockOut}
//           disabled={!isClockedIn}
//           style={{
//             backgroundColor: '#EF4444',
//             paddingVertical: 12,
//             paddingHorizontal: 20,
//             borderRadius: 8,
//             opacity: !isClockedIn ? 0.5 : 1,
//           }}
//         >
//           <Text style={{ color: 'white', fontWeight: 'bold' }}>Clock Out</Text>
//         </TouchableOpacity>
//       </Box>

//       {/* ✅ Always show map after page load (if location available) */}
//       {hasLocation ? (
//         <MapView
//           style={{
//             width: Dimensions.get('window').width - 32,
//             height: 500,
//             borderRadius: 16,
//           }}
//           region={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//         >
//           <Marker coordinate={location} title="Your Location" />
//         </MapView>
//       ) : (
//         <Text>📍 Waiting for location...</Text>
//       )}
//     </ScrollView>
//   );
// }

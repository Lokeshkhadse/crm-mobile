import { View, Text } from 'react-native';

export default function HistoryCard({ log }) {
  return (
    <View style={{ padding: 12, borderWidth: 1, marginBottom: 8 }}>
      <Text>Date: {log.date}</Text>
      <Text>Clock In: {log.clockIn}</Text>
      <Text>Clock Out: {log.clockOut}</Text>
      <Text>Duration: {log.duration}</Text>
      <Text>Location: {log.gps}</Text>
    </View>
  );
}
import { View, ScrollView, Text } from 'react-native';
import { mockAttendanceLogs } from '../utils/mockData';
import HistoryCard from '../components/HistoryCard';

export default function HistoryScreen() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Attendance History</Text>
      {mockAttendanceLogs.map((log, index) => (
        <HistoryCard key={index} log={log} />
      ))}
    </ScrollView>
  );
}

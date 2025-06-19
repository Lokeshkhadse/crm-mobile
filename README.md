npx create-expo-app crm-monbile --template
cd crm-monbile
npx expo install react-native
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
npm install dripsy
npx expo install react-native-vector-icons

npx expo start
npx expo start --clear


Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
Remove-Item -Force package-lock.json
npm install
npx expo install expo@53.0.12 react-native@0.79.4 react-native-svg@15.11.2
npx expo start --clear

npm install @react-native-community/datetimepicker@8.3.0

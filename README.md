# 📱 CRM Mobile App (React Native with Expo)

A mobile CRM (Customer Relationship Management) app built using **React Native + Expo**, with navigation, vector icons, and styled using **Dripsy**.

---

## 🚀 Project Setup Steps

### 1️⃣ Create Expo App
```bash
npx create-expo-app crm-mobile --template
cd crm-mobile
```

---

### 2️⃣ Install Core Dependencies
```bash
npx expo install react-native
```

---

### 3️⃣ Install React Navigation
```bash
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
```

---

### 4️⃣ Install Dripsy (Responsive Design UI Library)
```bash
npm install dripsy
```

---

### 5️⃣ Install DateTime Picker
```bash
npm install @react-native-community/datetimepicker@8.3.0
```

---

### 6️⃣ Start the App
```bash
npx expo start
```

### Optional (Force Clear Cache)
```bash
npx expo start --clear
```

---

## 🔁 Fix Common Issues (if any)

If facing issues like broken packages or corrupt cache, run:
```bash
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
Remove-Item -Force package-lock.json
npm install
```

Then, **reinstall correct versions**:
```bash
npx expo install expo@53.0.12 react-native@0.79.4 react-native-svg@15.11.2
npx expo start --clear
```

---

## 📦 Packages Summary

| Package                         | Purpose                                      |
|---------------------------------|----------------------------------------------|
| `@react-navigation/*`           | Navigation and routing in the app            |
| `react-native-gesture-handler`  | Handles touch gestures                       |
| `react-native-screens`          | Native navigation performance                |
| `react-native-reanimated`       | Smooth animations                            |
| `react-native-vector-icons`     | Icon set for buttons/UI                      |
| `@react-native-community/datetimepicker` | Cross-platform date/time picker   |
| `dripsy`                        | Responsive UI styling                        |

---

## 📂 Folder Structure (Recommended)

```
crm-mobile/
├── components/
│   └── MyTimeline.jsx
├── screens/
│   └── HomeScreen.jsx
├── navigation/
│   └── AppNavigator.js
├── assets/
│   └── images/
├── App.js
├── app.json
├── package.json
```

---

## ✅ Next Steps

- Setup screens with `@react-navigation/native-stack`
- Design responsive layout using `Dripsy`
- Implement geolocation/map integration
- Connect to backend (Firebase/Flask etc.)

---

🧠 **Note**: Ensure your environment supports `PowerShell` for `Remove-Item` commands or use `rm -rf` on Mac/Linux.

---

✉️ For help or customization, feel free to ask!
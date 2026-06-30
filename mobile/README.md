# FarmGuard Mobile Companion App

React Native mobile companion app for FarmGuard Digital Farm Management Platform.

## Features

- **Cross-platform**: iOS & Android via Expo
- **Offline Support**: Log treatments and prescriptions offline, auto-sync when online
- **QR Code Scanning**: Scan animal QR codes instead of typing tag numbers
- **Push Notifications**: Get alerts for safe-to-sell dates and high-risk farm updates
- **Geolocation**: Map-based farm navigation
- **Role-based Access**: Farmer, Vet, and Admin interfaces

## Technology Stack

- **Framework**: React Native 0.73 + Expo 50
- **Navigation**: React Navigation (Stack + Tab)
- **State Management**: Zustand
- **API Client**: Axios with JWT interceptor
- **Local Storage**: AsyncStorage + Secure Store (tokens)
- **QR Scanning**: Expo BarCode Scanner
- **Notifications**: Expo Notifications
- **Maps**: React Native Maps
- **Auth**: JWT tokens (SecureStore)

## Installation

### Prerequisites
- Node.js 18+ and npm 9+
- Expo CLI: `npm install -g expo-cli`
- Physical device or emulator (iOS/Android)

### Setup

1. **Install dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **Configure API endpoint** (app.json):
   Update `extra.apiUrl` to match your backend server:
   ```json
   "extra": {
     "apiUrl": "http://192.168.x.x:5000/api"  // Use your server IP
   }
   ```

3. **Start dev server**:
   ```bash
   npm start
   ```

4. **Run on device**:
   ```bash
   # iOS (macOS only)
   npm run ios
   
   # Android
   npm run android
   
   # Web (preview only)
   npm run web
   ```

## Project Structure

```
mobile/
├── App.js                 # Main navigation & notification setup
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── src/
│   ├── screens/          # Role-based screen components
│   │   ├── auth/         # Login, Register
│   │   ├── farmer/       # Farmer screens (Dashboard, LogTreatment, History, Alerts)
│   │   ├── vet/          # Vet screens (Dashboard, IssuePrescription)
│   │   └── admin/        # Admin screens (Dashboard with risk summary)
│   ├── context/
│   │   └── authStore.js  # Zustand auth state + JWT management
│   ├── api/
│   │   └── axios.js      # Axios instance with auth interceptor
│   ├── components/       # Reusable UI components (placeholder)
│   └── utils/
│       ├── offlineSync.js  # Queue-based offline sync
│       └── qrScanner.js    # QR code scanning wrapper
```

## Core Functionality

### Authentication
- Login with email/password
- JWT stored in SecureStore (encrypted)
- Auto token refresh on app load
- Role-based navigation

### Offline Support
- All API calls queued if offline
- Auto-retry on reconnection
- Sync status feedback via toast

### QR Code Scanning
- One-tap animal QR scan during treatment/prescription
- Fallback to manual tag entry
- Camera permission handling

### Push Notifications
- Safe-to-sell date reminders (farmers)
- High-risk farm alerts (admins)
- Unread alert badges

## API Integration

All screens make requests to the same backend as the web app:
- `/api/auth/login` - Login
- `/api/auth/register` - Register
- `/api/animals` - Fetch/create animals
- `/api/farms` - Fetch farms
- `/api/drugs` - Fetch available drugs
- `/api/amu` - Create/fetch treatments
- `/api/alerts` - Fetch alerts
- `/api/risk/summary` - Farm risk stats (admin)

Request headers include JWT token automatically via Axios interceptor.

## Offline Sync Strategy

1. **Capture operations**: `offlineSync.addToQueue()` when offline
2. **Queue storage**: AsyncStorage (survives app restart)
3. **Auto-retry**: On connection restored, `offlineSync.syncQueue()` runs
4. **Feedback**: Toast notifications for sync status
5. **Conflict handling**: Server wins on re-sync (timestamps checked)

## Build for Production

### iOS (requires macOS + Apple Developer account)
```bash
eas build --platform ios
```

### Android (requires Google Play account)
```bash
eas build --platform android
```

### EAS Submit (publish to app stores)
```bash
eas submit --platform ios
eas submit --platform android
```

## Development Notes

### Permissions
- **Camera**: Required for QR scanning
- **Location**: Required for farm mapping
- **Notifications**: Required for push alerts

Permissions are requested at runtime on first use.

### Secure Token Storage
- iOS: Keychain
- Android: Encrypted SharedPreferences via Secure Store

### Network Debugging
- Enable network request logging in `src/api/axios.js`
- Expo DevTools shows console.error() calls

## Future Enhancements

- PDF prescription export (printer support)
- Offline map caching for farm locations
- Biometric login (Face/Fingerprint)
- Background sync service
- Voice notes for treatment observations
- Camera photo upload for evidence

## Troubleshooting

### "Cannot connect to server"
- Check `app.json` API URL matches backend
- Ensure mobile device is on same network as backend
- Check firewall/security group rules

### "QR scanner shows black screen"
- Verify camera permission granted in device settings
- Restart app
- Try front camera first (some emulators have rear camera issues)

### "Notifications not arriving"
- Register device token with backend
- Check push provider configuration
- Verify app has notification permission

## Support & Development

For issues or feature requests related to the mobile app, check the main FarmGuard documentation or contact the development team.

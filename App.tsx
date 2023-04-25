import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './src/pages/main';

export default function App() {
  return (
    <SafeAreaProvider>
      <Main/> 
    </SafeAreaProvider>
  );
}

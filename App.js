import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, SafeAreaView as SafeAreaViewIOS} from 'react-native';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { SafeAreaView as SafeAreaViewAndroid } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';

const COVER = 'http://212.112.105.196:3155';

export default function App() {
  const webViewRef = useRef(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true; 
      }
      return false; 
    });

    return () => backHandler.remove(); 
  }, []);

  const WebViewWrapper = ({children}) => {
    const isIOS = Platform.OS === 'ios';
    const SafeAreaView = isIOS ? SafeAreaViewIOS : SafeAreaViewAndroid;

    return (
      <SafeAreaView style = {[styles.appView]}>
        <StatusBar hidden = {false}/>
        {children}
         </SafeAreaView>
    )
  }

  const onHandlerStateChange = (event) => {
    const { translationX, state } = event.nativeEvent;

    if (state === State.BEGAN && Math.abs(translationX) > 20) {
      if (webViewRef.current) {
        webViewRef.current.goBack();
      }
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
          <WebViewWrapper>
            <WebView
              ref={webViewRef}
              source={{ uri: COVER }}
              scalesPageToFit={false} 
              javaScriptEnabled={true}
              domStorageEnabled={true}
              useWebKit={true} 
              allowsBackForwardNavigationGestures={false}
              originWhitelist={["http://*"]}
              mixedContentMode='always'
            />
          </WebViewWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',  },

  appView: {
    flex: 1,
  }
});

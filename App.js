import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, AppState} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import styles from './Application.container.styles';
import FingerprintPopup from './src/FingerprintPopup.component';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      biometric: undefined,
      popupShowed: false,
    };
  }

  handleFingerprintShowed = () => {
    this.setState({popupShowed: true});
  };

  handleFingerprintDismissed = () => {
    this.setState({popupShowed: false});
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    // Get initial fingerprint enrolled
    this.detectFingerprintAvailable().then(() => {
      this.handleFingerprintShowed();
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  detectFingerprintAvailable = () => {
    return FingerprintScanner.isSensorAvailable().catch((error) =>
      this.setState({errorMessage: error.message, biometric: error.biometric}),
    );
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      FingerprintScanner.release();
      this.detectFingerprintAvailable();
    }
    this.setState({appState: nextAppState});
  };
  onAuthenticate = () => {
    console.log('authenticated');
  };
  render() {
    const {errorMessage, biometric, popupShowed} = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>React Native Fingerprint Scanner</Text>
        <Text style={styles.subheading}>
          https://github.com/hieuvp/react-native-fingerprint-scanner
        </Text>

        <TouchableOpacity
          style={styles.fingerprint}
          onPress={this.handleFingerprintShowed}
          disabled={!!errorMessage}>
          <Image source={require('./src/assets/finger_print.png')} />
        </TouchableOpacity>

        {errorMessage && (
          <Text style={styles.errorMessage}>
            {errorMessage} {biometric}
          </Text>
        )}

        {popupShowed && (
          <FingerprintPopup
            style={styles.popup}
            handlePopupDismissed={this.handleFingerprintDismissed}
            onAuthenticate={this.onAuthenticate}
          />
        )}
      </View>
    );
  }
}

export default App;

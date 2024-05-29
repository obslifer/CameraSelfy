import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';

/**
 * Écran de la caméra.
 * Permet à l'utilisateur de prendre des photos.
 */
const CameraScreen = () => {
  // Référence à l'instance de RNCamera
  const cameraRef = useRef<RNCamera>(null);

  /**
   * Demande les permissions pour écrire dans le stockage externe.
   */
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Permission d'écriture sur le stockage externe",
          message:
            "Cette application a besoin de l'accès au stockage pour enregistrer les photos.",
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.error('Permission de stockage refusée');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Demander les permissions sur Android
  if (Platform.OS === 'android') {
    requestStoragePermission();
  }

  /**
   * Capture une photo avec la caméra.
   */
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        // Options de capture de la photo
        const options = {quality: 0.5, base64: true};
        // Capture de la photo
        const data = await cameraRef.current.takePictureAsync(options);
        console.log('Photo captured:', data.uri);

        // Enregistrement de l'image dans le dossier DCIM
        const path = `${RNFS.ExternalStorageDirectoryPath}/DCIM/myphoto.jpg`;
        await RNFS.writeFile(path, data.base64 || '', 'base64'); // Fournit une chaîne vide si data.base64 est undefined
        console.log('Photo saved at:', path);
      } catch (error) {
        console.error('Failed to take photo:', error);
      }
    }
  };

  // Rendu de l'interface utilisateur
  return (
    <View style={{flex: 1}}>
      {/* Caméra */}
      <RNCamera
        style={{flex: 1}}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        ref={cameraRef}
      />
      {/* Barre d'outils */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          height: 50,
        }}>
        {/* Bouton pour capturer la photo */}
        <TouchableOpacity onPress={takePhoto}>
          <Text>Capturer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraScreen;

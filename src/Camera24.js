import React from 'react';
import { Text, View } from 'react-native';
import styles from './Styles';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Toolbar from './toolbar';
import Galeria from './galeria';


export default class Camera24 extends React.Component{

    camera = null;

    state = {
        captures: [],
        //Opción por defecto del flash en estado apagado
        flashMode: Camera.Constants.FlashMode.off,
        capturing: null,
        //Iniciar por defecto con la cámara trasera 
        flashMode: Camera.Constants.Type.back,
        //Inicializar permisos del dispositivo en estado null
        hasCameraPermission: null,
    };

    setFlashMode =(flashMode) => this.setState({ flashMode });
    
    setCameraType = (cameraType) => this.setState({ cameraType });
    
    handleCaptureIn = () => this.setState({ capturing: true});

    handleCaptureOut = () => {
        if(this.state.capturing)
            this.camera.stopRecording();
    };

    handleShortCapture = async () => {
        const photoData = await this.camera.takePictureAsync();
        this.setState({ capturing: false, captures: [photoData, ...this.state.captures]})
    };

    handleLongCapture = async () => {
        const videoData = await this.camera.recordAsync();
        this.setState({ capturing: false, captures: [videoData, ...this.state.captures]})
    };

    async componentDidMount(){
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

        this.setState({ hasCameraPermission});
    }


    render(){

        const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;

        if( hasCameraPermission === null ){
            return <View />;
        } else if (hasCameraPermission === false ){
            return <Text>No se puede acceder a la cámara</Text>;
        }

        return(
            <React.Fragment>
                <View>
                        <Camera
                            type={cameraType}
                            flashMode={flashMode}
                            style={styles.preview}
                            ref={camera => this.camera = camera}
                        />
                </View>

                {captures.length > 0 && <Galeria captures={captures} />}

                <Toolbar 
                        capturing={capturing}
                        flashMode={flashMode}
                        cameraType={cameraType}
                        setFlashMode={this.setFlashMode}
                        setCameraType={this.setCameraType}
                        onCaptureIn={this.handleCaptureIn}
                        onCaptureOut={this.handleCaptureOut}
                        onLongCapture={this.handleLongCapture}
                        onShortCapture={this.handleShortCapture}
                /> 
            </React.Fragment>
        );
    };
};
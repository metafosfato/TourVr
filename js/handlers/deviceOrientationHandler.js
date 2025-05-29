import { THREE } from '../core/threeImports.js';
import { context } from '../core/context.js';

let isGyroscopeAvailable = false;
let isPermissionGranted = false;
let manualControl = false; 
let deviceOrientationData = { alpha: 0, beta: 0, gamma: 0 };

export function requestDeviceOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    isPermissionGranted = true;
                    isGyroscopeAvailable = true;
                    window.addEventListener('deviceorientation', onDeviceOrientation, true);
                } else {
                    console.warn("Permissão para orientação do dispositivo negada.");
                }
            })
            .catch(error => console.error("Erro ao solicitar permissão de orientação:", error));
    } else {
        
        isGyroscopeAvailable = true; 
        window.addEventListener('deviceorientation', onDeviceOrientation, true);
        console.log("Tentando usar orientação do dispositivo sem permissão explícita (pode não funcionar em iOS).");
    }
}

function onDeviceOrientation(event) {
    if (event.alpha !== null || event.beta !== null || event.gamma !== null) {
        isGyroscopeAvailable = true; 
        deviceOrientationData.alpha = event.alpha ? THREE.MathUtils.degToRad(event.alpha) : 0;
        deviceOrientationData.beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0;
        deviceOrientationData.gamma = event.gamma ? THREE.MathUtils.degToRad(event.gamma) : 0;
    } else {
        isGyroscopeAvailable = false;
    }
}

export function updateCameraBasedOnOrientation() {
    if (isGyroscopeAvailable && (isPermissionGranted || !DeviceOrientationEvent.requestPermission) && !manualControl && context.camera) {
        const euler = new THREE.Euler(deviceOrientationData.beta, deviceOrientationData.alpha, -deviceOrientationData.gamma, 'YXZ');
        context.camera.quaternion.setFromEuler(euler);
    }
}

export function setManualControl(isActive) {
    manualControl = isActive;
    if (isActive) {
        console.log("Controle manual (arrastar) ativado.");
    } else {
        console.log("Controle manual desativado, giroscópio pode reassumir se disponível.");
    }
}
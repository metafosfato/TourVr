// js/main.js
import { context } from './core/context.js';
import { initSceneGraph } from './setup/sceneSetup.js';
import { loadSceneContent, getInitialSceneName } from './managers/sceneContentManager.js';
import { requestDeviceOrientationPermission, updateCameraBasedOnOrientation } from './handlers/deviceOrientationHandler.js';
import { registerEventHandlers } from './handlers/eventHandlers.js';
import { TWEEN } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/tween.module.min.js';


function init() {
    console.log("Iniciando Tour Virtual VR...");
    initSceneGraph();
    
    if (!context.renderer) { 
        console.error("Falha ao inicializar o gráfico da cena. A aplicação não pode continuar.");
        return;
    }

    registerEventHandlers();
    requestDeviceOrientationPermission();

    const initialScene = getInitialSceneName();
    if (initialScene) {
        loadSceneContent(initialScene);
    } else {
        console.error("Nenhuma cena inicial definida.");
    }

    animate();
    console.log("Tour Virtual VR pronto.");
}

function animate() {
    context.renderer.setAnimationLoop(() => {
        TWEEN.update();

        updateCameraBasedOnOrientation();
        if (context.controls) context.controls.update();
        if (context.scene && context.camera) {
            context.renderer.render(context.scene, context.camera);
        }
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
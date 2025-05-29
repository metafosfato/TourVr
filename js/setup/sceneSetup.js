// js/setup/sceneSetup.js
import { THREE, OrbitControls, VRButton } from '../core/threeImports.js';
import { context } from '../core/context.js';
import { setManualControl } from '../handlers/deviceOrientationHandler.js';

export function initSceneGraph() {
    context.container = document.getElementById('vr-container');
    if (!context.container) {
        console.error("Elemento container 'vr-container' não encontrado.");
        return;
    }

    context.scene = new THREE.Scene();


    context.camera = new THREE.PerspectiveCamera(75, context.container.clientWidth / context.container.clientHeight, 0.1, 1000);
    context.camera.position.set(0, 0, 0.1);


    context.renderer = new THREE.WebGLRenderer({ antialias: true });
    context.renderer.setPixelRatio(window.devicePixelRatio);
    context.renderer.setSize(context.container.clientWidth, context.container.clientHeight);
    context.container.appendChild(context.renderer.domElement);


    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    sphereGeometry.scale(-1, 1, 1); 
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: null });
    context.skybox = new THREE.Mesh(sphereGeometry, sphereMaterial);
    context.scene.add(context.skybox);


    context.controls = new OrbitControls(context.camera, context.renderer.domElement);
    context.controls.enableZoom = true;
    context.controls.enablePan = false; 
    context.controls.enableDamping = true; // tentativa de suavizar o movimento, mas ele ainda esta "meio travado"
    context.controls.dampingFactor = 0.05;
    context.controls.rotateSpeed = -0.25; // Inverte a direção para um arrasto mais natural

    context.controls.addEventListener('start', () => setManualControl(true));
    context.controls.addEventListener('end', () => {
        setTimeout(() => setManualControl(false), 2000); 
    });


    context.renderer.xr.enabled = true;
    context.container.appendChild(VRButton.createButton(context.renderer));
}
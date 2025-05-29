import { THREE } from './threeImports.js';

export const context = {
    
    container: null,

    
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    skybox: null,
    
    
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    textureLoader: new THREE.TextureLoader(),

    
    activeHotspots: [], 
    currentSceneName: null, 
};
// js/managers/hotspotManager.js
import { THREE } from '../core/threeImports.js';
import { context } from '../core/context.js';

const DEFAULT_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png'; 

export function addHotspot(position, onClickAction, iconUrl = DEFAULT_ICON_URL) {
    const hotspotTexture = context.textureLoader.load(iconUrl);
    const hotspotMaterial = new THREE.SpriteMaterial({
        map: hotspotTexture,
        depthTest: false, 
        transparent: true,
        opacity: 0.85, 
        sizeAttenuation: true, 
    });

    const sprite = new THREE.Sprite(hotspotMaterial);
    sprite.scale.set(20, 20, 1); 
    sprite.position.set(position.x, position.y, position.z);
    sprite.renderOrder = 1; 
    sprite.userData.onClick = onClickAction;
    
    context.scene.add(sprite);
    context.activeHotspots.push(sprite);
    return sprite;
}

export function addMultipleHotspots(hotspotsDataArray) {
    if (!hotspotsDataArray) return;
    hotspotsDataArray.forEach(data => {
        addHotspot(data.position, data.onClick, data.iconUrl);
    });
}

export function clearAllHotspots() {
    context.activeHotspots.forEach(hotspot => {
        context.scene.remove(hotspot);
        if (hotspot.material.map) hotspot.material.map.dispose();
        hotspot.material.dispose();
    });
    context.activeHotspots = [];
}

export function getActiveHotspots() {
    return context.activeHotspots;
}
import { context } from '../core/context.js';
import { getActiveHotspots } from '../managers/hotspotManager.js';

export function registerEventHandlers() {
    window.addEventListener('resize', onWindowResize, false);
    context.container.addEventListener('click', onContainerClick, false); 
}

function onWindowResize() {
    if (context.camera && context.renderer && context.container) {
        context.camera.aspect = context.container.clientWidth / context.container.clientHeight;
        context.camera.updateProjectionMatrix();
        context.renderer.setSize(context.container.clientWidth, context.container.clientHeight);
    }
}

function onContainerClick(event) {
    if (!context.camera || !context.container) return;

    const rect = context.container.getBoundingClientRect();
    context.mouse.x = ((event.clientX - rect.left) / context.container.clientWidth) * 2 - 1;
    context.mouse.y = -((event.clientY - rect.top) / context.container.clientHeight) * 2 + 1;

    context.raycaster.setFromCamera(context.mouse, context.camera);

    const intersects = context.raycaster.intersectObjects(getActiveHotspots(), false); 

    if (intersects.length > 0) {
        const clickedHotspot = intersects[0].object; 
        if (clickedHotspot.userData.onClick) {
            clickedHotspot.userData.onClick(clickedHotspot);
        }
    }
}
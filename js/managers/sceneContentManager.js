import { context } from '../core/context.js';
import { addMultipleHotspots, clearAllHotspots } from './hotspotManager.js';
import { THREE } from '../core/threeImports.js';
import { TWEEN } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/tween.module.min.js'; 


const scenesData = {
    'pampa1': {
        textureUrl: 'https://metafosfato.github.io/TourVr/imagens/Pampa1.jpg', 
        hotspots: [
            {
                position: { x: -325, y: 0, z: 200 },
                onClick: () => loadSceneContent('pampa2'),
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png'
            },
            {
                position: { x: 400, y: 0, z: 150 },
                onClick: () => alert("Hotspot 2 da Pampa1 clicado!")
            }
        ]
    },
    'pampa2': {
        textureUrl: 'https://metafosfato.github.io/TourVr/imagens/Pampa2.jpg',
        hotspots: [
            {
                position: { x: 100, y: -20, z: -300 },
                onClick: () => loadSceneContent('pampa1'),
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png'
            },
            {
                position: { x: -50, y: 10, z: -250 },
                onClick: () => alert("Hotspot X da Pampa2 clicado!"),
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png'
            }
        ]
    }
};

export function getInitialSceneName() {
    return Object.keys(scenesData)[0] || null; 
}

let isTransitioning = false;
const TRANSITION_DURATION = 2000; // duração em ms, atualmente ainda acho esquisito, mas vale fazer o teste no vr


function prepareMaterialForFade(material) {
    material.transparent = true;
    material.needsUpdate = true; 
}

export function loadSceneContent(sceneName) {
    if (isTransitioning) {
        console.warn("Transição já em progresso. Nova solicitação ignorada.");
        return;
    }

    const sceneConfig = scenesData[sceneName];
    if (!sceneConfig || !sceneConfig.textureUrl) {
        console.error("Configuração da cena ou URL da textura não encontrada para:", sceneName);
        return;
    }

    if (context.currentSceneName === sceneName && context.skybox.material.map && context.skybox.material.opacity === 1) {
        console.log("Já na cena:", sceneName);
        return;
    }

    isTransitioning = true;
    console.log("Iniciando transição para cena:", sceneName);

    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'block';

    if (!context.skybox || !context.skybox.material || !context.skybox.geometry) {
        console.error("Skybox principal, seu material ou geometria não estão inicializados!");
        isTransitioning = false;
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        return;
    }

    const oldSkyboxMaterial = context.skybox.material;
    prepareMaterialForFade(oldSkyboxMaterial);

    context.textureLoader.load(
        sceneConfig.textureUrl,
        (newTexture) => { 
            if (loadingIndicator) loadingIndicator.style.display = 'none';

           // material p/ skybox
            const newSkyboxMaterial = new THREE.MeshBasicMaterial({
                map: newTexture,
                side: THREE.BackSide,
                transparent: true,
                opacity: 0 //parte do efeito de trasnsição, vale ressaltar que outros tipos de tramsições podem ser feitos, optei pelo fade-in que é mais suave para VR
            });
            const tempNewSkybox = new THREE.Mesh(context.skybox.geometry, newSkyboxMaterial);
            context.scene.add(tempNewSkybox);

            // Animação fade-out do skybox antigo, fade-in do novo skybox
            new TWEEN.Tween(oldSkyboxMaterial)
                .to({ opacity: 0 }, TRANSITION_DURATION)
                .easing(TWEEN.Easing.Quadratic.InOut) // Efeito de rapidez e lentidão(???) 
                .start();

            // Fade in 
            new TWEEN.Tween(newSkyboxMaterial)
                .to({ opacity: 1 }, TRANSITION_DURATION)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(() => {
                    if (oldSkyboxMaterial.map && oldSkyboxMaterial.map !== newTexture) {
                         oldSkyboxMaterial.map.dispose();
                    }
                    oldSkyboxMaterial.map = newTexture;
                    oldSkyboxMaterial.opacity = 1;
                    oldSkyboxMaterial.needsUpdate = true;


                    context.scene.remove(tempNewSkybox);
                    newSkyboxMaterial.dispose();
                    

                    // Limpa hotspots antigos e adiciona os novos - problema que está sendo resolvido pelo dev principal kkk, pq atualmente ele são limpos de forma que ainda incomodam 
                    clearAllHotspots();
                    if (sceneConfig.hotspots && sceneConfig.hotspots.length > 0) {
                        addMultipleHotspots(sceneConfig.hotspots);
                    }

                    context.currentSceneName = sceneName;
                    isTransitioning = false;
                    console.log("Transição completa. Cena atual:", sceneName);

                    // o pré render que comentamos
                    if (typeof preloadLinkedTextures === 'function') { 
                        preloadLinkedTextures(sceneConfig);
                    }
                })
                .start();
        },
        undefined,
        (error) => { 
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            console.error('Erro ao carregar textura para transição da cena ' + sceneName + ':', error);
            // controle de erro, caso haja falha no carregamento, voltamos a cena antiga
            oldSkyboxMaterial.opacity = 1;
            oldSkyboxMaterial.needsUpdate = true;

            isTransitioning = false;
        }
    );
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Atualizar o tamanho do renderizador e a câmera ao redimensionar a janela
window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Adiciona suavidade ao movimento
controls.dampingFactor = 0.05; // Fator de suavidade
controls.enableZoom = false; // Desabilita o zoom (opcional)
controls.enablePan = false; // Desabilita o movimento de arrasto (opcional)

// Geometria da esfera e material
const geometry = new THREE.SphereGeometry(500, 60, 40);
const textureLoader = new THREE.TextureLoader();
let material;

// Função de carregamento de textura
function loadTexture(path) {
    textureLoader.load(
        path,
        (texture) => {
            material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            // Posicionar a câmera dentro da esfera
            camera.position.set(0, 0, 0.1);

            animate();
        },
        undefined,
        (error) => {
            console.error('Erro ao carregar a textura:', error);
        }
    );
}

// Carregar a primeira textura
loadTexture('imagens/ponto1.jpg');

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Atualizar os controles em cada quadro de animação
    renderer.render(scene, camera);
}

// Navegação entre imagens
const images = ['imagens/ponto1.jpg'];
let currentImage = 0;

function loadImage(index) {
    textureLoader.load(images[index], (newTexture) => {
        material.map = newTexture; // Trocar a textura
        material.needsUpdate = true; // Atualizar o material
    });
}

document.getElementById('left').addEventListener('click', () => {
    currentImage = (currentImage - 1 + images.length) % images.length;
    loadImage(currentImage);
});

document.getElementById('right').addEventListener('click', () => {
    currentImage = (currentImage + 1) % images.length;
    loadImage(currentImage);
});

// Opções para 'up' e 'down' - Implementar conforme necessidade
document.getElementById('up').addEventListener('click', () => {
    // Lógica adicional para navegação para cima
});

document.getElementById('down').addEventListener('click', () => {
    // Lógica adicional para navegação para baixo
});

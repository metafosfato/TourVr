export function init(THREE, OrbitControls, VRButton) {
    console.log("Iniciando a configuração da cena...");

    // Configuração básica da cena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);
    console.log("Cena e cor de fundo inicializadas.");

    // Configuração da câmera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 1);
    console.log("Câmera configurada e posicionada.");

    // Configuração do renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    console.log("Renderizador configurado e anexado ao DOM.");

    // Adicionar o botão VR e ativar o modo WebXR
    document.body.appendChild(VRButton.createButton(renderer));
    console.log("Botão VR adicionado e WebXR ativado.");

    // Atualizar o renderizador e a câmera ao redimensionar a janela
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        console.log("Redimensionamento detectado: renderizador e câmera atualizados.");
    });

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    console.log("Controles de órbita ativados.");

    // Geometria e material da esfera
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    console.log("Geometria da esfera e material criados.");

    // Função para carregar a textura
    function loadTexture(path) {
        console.log(`Iniciando o carregamento da textura: ${path}`);
        textureLoader.load(path, function (texture) {
            console.log("Textura carregada com sucesso:", texture);
            material.map = texture;
            material.needsUpdate = true;

            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            console.log("Esfera com textura adicionada à cena.");

            animate();
        }, undefined, function (error) {
            console.error("Erro ao carregar a textura:", error);
        });
    }

    // Carregar a primeira textura
    loadTexture('imagens/ponto1.jpg');

    // Função de animação
    function animate() {
        console.log("Iniciando o loop de animação.");
        renderer.setAnimationLoop(() => {
            controls.update();
            renderer.render(scene, camera);
        });
    }

    console.log("Configuração da cena concluída com sucesso.");
}

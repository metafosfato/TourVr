export function init(THREE, OrbitControls, VRButton) {
    // Configuração básica da cena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);  // Cor de fundo clara para verificar visibilidade

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Ativar o modo VR
    document.body.appendChild(renderer.domElement);

    // Adicionar o botão VR ao documento
    document.body.appendChild(VRButton.createButton(renderer));

    // Atualizar o tamanho do renderizador e a câmera ao redimensionar a janela
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Definindo a posição da câmera mais afastada para garantir visibilidade
    camera.position.set(0, 0, 5);

    // Geometria da esfera
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const textureLoader = new THREE.TextureLoader();
    let material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });

    // Loading manager para dar feedback ao usuário
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log(`Iniciando o carregamento: ${url}`);
    };
    loadingManager.onLoad = function () {
        console.log('Todas as texturas carregadas!');
    };
    loadingManager.onError = function (url) {
        console.error(`Erro ao carregar a textura: ${url}`);
    };

    // Função de carregamento de textura
    function loadTexture(path) {
        console.log("Tentando carregar a textura:", path);
        textureLoader.load(path, function (texture) {
            console.log("Textura carregada com sucesso:", texture);
            material.map = texture;
            material.needsUpdate = true;

            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            camera.position.set(0, 0, 1);

            animate();
        });
    }

    // Carregar a primeira textura
    loadTexture('imagens/ponto1.jpg');

    // Função de animação
    function animate() {
        renderer.setAnimationLoop(() => {
            controls.update();
            renderer.render(scene, camera);
        });
    }

    // Navegação entre imagens
    const images = ['imagens/ponto1.jpg', 'imagens/ponto2.jpg', 'imagens/ponto3.jpg'];
    let currentImage = 0;

    function loadImage(index) {
        console.log("Carregando imagem:", images[index]);
        textureLoader.load(images[index], (newTexture) => {
            material.map = newTexture;
            material.needsUpdate = true;
        });
    }

    // Event Listeners para navegação via botões
    document.getElementById('left').addEventListener('click', () => {
        currentImage = (currentImage - 1 + images.length) % images.length;
        loadImage(currentImage);
    });

    document.getElementById('right').addEventListener('click', () => {
        currentImage = (currentImage + 1) % images.length;
        loadImage(currentImage);
    });

    // Integrar controladores VR para navegação entre imagens
    const controller1 = renderer.xr.getController(0);
    const controller2 = renderer.xr.getController(1);
    scene.add(controller1);
    scene.add(controller2);

    controller1.addEventListener('selectstart', () => {
        currentImage = (currentImage + 1) % images.length;
        loadImage(currentImage);
    });

    controller2.addEventListener('selectstart', () => {
        currentImage = (currentImage - 1 + images.length) % images.length;
        loadImage(currentImage);
    });
}



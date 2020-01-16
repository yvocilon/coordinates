import {
    Scene, Color, WebGLRenderer, PerspectiveCamera, PlaneGeometry,
    MeshPhongMaterial, Mesh, SphereGeometry, DirectionalLight,
    HemisphereLight, Camera, BoxGeometry, TextGeometry, FontLoader, Font, Vector3
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Optimer from "three/examples/fonts/optimer_regular.typeface.json";

const font = new Font(Optimer);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const scene = initScene();

const renderer = initRenderer(document.body);

const camera = initCamera();

const floor = initFloor();

let coordinates = new Vector3(0, 0, 0);

let [box, text] = initText(coordinates);

const controls = initControls(camera, renderer.domElement);

initLights().forEach(light => scene.add(light));

scene.add(box);
scene.add(text);
scene.add(floor);

update();

document.addEventListener("keypress", onKeyPress);

function update() {

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(update);
}

const keyCodes = [119, 97, 100, 115];

function onKeyPress(event: KeyboardEvent) {

    if (!keyCodes.some(keycode => keycode === event.which)) {
        return;
    }

    scene.remove(box);
    scene.remove(text);

    switch (event.which) {
        case 119: coordinates.z--; break;
        case 97: coordinates.x--; break;
        case 100: coordinates.x++; break;
        case 115: coordinates.z++; break;
    }

    [box, text] = initText(coordinates);

    scene.add(box);
    scene.add(text);
}

function initControls(camera: Camera, domElement: HTMLElement) {
    return new OrbitControls(camera, domElement);
}

function initLights() {
    const directionalLight = new DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;

    const hemisphereLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);

    return [directionalLight, hemisphereLight];
}

function initText(coordinates: Vector3) {

    const boxGeometry = new BoxGeometry(0.3, 0.3, 0.3);
    const box = new Mesh(boxGeometry, new MeshPhongMaterial({ color: 0xDDDDD }));

    const geometry = new TextGeometry(`${coordinates.x}, ${coordinates.y}, ${coordinates.z}`, {
        font,
        size: 0.3,
        height: 0.3,
    });

    const material = new MeshPhongMaterial({ color: 0x83DDFF });
    const text = new Mesh(geometry, material);

    text.receiveShadow = true;
    text.castShadow = true;

    text.position.x = coordinates.x + 0.4;
    text.position.y = coordinates.y;
    text.position.z = coordinates.z;

    box.position.x = coordinates.x;
    box.position.y = coordinates.y;
    box.position.z = coordinates.z;

    return [box, text];
}

function initFloor() {
    const geometry = new PlaneGeometry(100, 100, 1, 1);
    const material = new MeshPhongMaterial({ color: 0xdcdcdc });
    const floor = new Mesh(geometry, material);
    floor.rotation.x = Math.PI * -0.5;
    floor.receiveShadow = true;
    floor.position.y = -10;
    return floor;
}

function initCamera() {
    const fov = 60;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;

    const camera = new PerspectiveCamera(fov, aspectRatio, near, far);
    camera.position.z = 4;

    return camera;
}

function initScene() {
    const scene = new Scene();
    scene.background = new Color(0xffffff);
    return scene;
}

function initRenderer(domTarget: HTMLElement) {
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    domTarget.appendChild(renderer.domElement);
    return renderer;
}

function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
    const canvas = renderer.domElement;
    const { innerWidth: width, innerHeight: height } = window;

    const canvasPixelWidth = canvas.width / window.devicePixelRatio;
    const canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
        canvasPixelWidth !== width || canvasPixelHeight !== height;

    if (needResize) {
        renderer.setSize(width, height, false);
    }

    return needResize;
}

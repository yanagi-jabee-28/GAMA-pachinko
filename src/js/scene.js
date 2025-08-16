import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { FRUSTUM_SIZE, SPHERE_RADIUS } from './config.js';
import { objectsToUpdate } from './physics.js';

// シーン
export const scene = new THREE.Scene();

// カメラ
const aspect = window.innerWidth / window.innerHeight;
export const camera = new THREE.OrthographicCamera(FRUSTUM_SIZE * aspect / -2, FRUSTUM_SIZE * aspect / 2, FRUSTUM_SIZE / 2, FRUSTUM_SIZE / -2, 0.1, 1000);
camera.position.set(20, 12, 20);
camera.lookAt(0, 0, 0);

// レンダラー
export const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// カメラコントロール
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enablePan = true;
controls.target.set(0, 0, 0);

// 初期視点の保存
export const initialCameraPos = camera.position.clone();
export const initialTarget = controls.target.clone();

// ライト
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(30, 10, 0);
scene.add(directionalLight);

/**
 * ボールの3Dメッシュを作成し、シーンに追加します。
 * @param {CANNON.Body} body - 関連付ける物理ボディ
 * @returns {THREE.Mesh} 作成されたボールのメッシュ
 */
export function createBallMesh(body) {
    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(SPHERE_RADIUS),
        new THREE.MeshStandardMaterial({ color: 'red', metalness: 0.5, roughness: 0.4 })
    );
    sphereMesh.position.copy(body.position);
    scene.add(sphereMesh);
    objectsToUpdate.push({ mesh: sphereMesh, body: body });
    return sphereMesh;
}

// ウィンドウリサイズ処理
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = FRUSTUM_SIZE * aspect / -2;
    camera.right = FRUSTUM_SIZE * aspect / 2;
    camera.top = FRUSTUM_SIZE / 2;
    camera.bottom = FRUSTUM_SIZE / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

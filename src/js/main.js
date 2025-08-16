import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// 各モジュールのコア要素をインポート
import { scene, camera, renderer, controls } from './scene.js'; 
import { world, objectsToUpdate } from './physics.js';
import { setupEventListeners, isPaused } from './controls.js';
// オブジェクト作成関数を新しいファイルからインポート
import { createObject } from './objects.js'; // createBall, createSlope, createFloor は不要になる
import { OBJECT_DEFINITIONS } from './config.js'; // New

//==================================================
// 初期化処理
//==================================================

// 1. オブジェクトを作成
const createdObjects = {}; // 生成されたオブジェクトを格納するマップ

OBJECT_DEFINITIONS.forEach(objDef => {
    const obj = createObject(objDef);
    if (obj) {
        createdObjects[objDef.type] = obj; // タイプ名でアクセスできるように保存
    }
});

// 2. UIイベントリスナーをセットアップ
// controls.jsはボールの物理ボディ(ball.body)を必要とします
setupEventListeners(camera, controls, createdObjects.ball.body, objectsToUpdate);

//==================================================
// アニメーションループ
//==================================================
const clock = new THREE.Clock();
let oldElapsedTime = 0;

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // 物理ワールドの計算を進める（停止中はスキップ）
    if (!isPaused) {
        world.step(1 / 60, deltaTime, 3);
    }

    // Three.jsのオブジェクトを物理ボディに同期
    for (const obj of objectsToUpdate) {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    }

    // カメラコントロールの更新
    controls.update();

    // レンダリング
    renderer.render(scene, camera);
}

// アニメーションループを開始
animate();

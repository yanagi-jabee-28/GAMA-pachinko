import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// 各モジュールから必要な変数や関数をインポート
import { scene, camera, renderer, controls, createBallMesh } from './scene.js';
import { world, objectsToUpdate, createBallBody } from './physics.js';
import { setupEventListeners, isPaused } from './controls.js';

//==================================================
// 初期化処理
//==================================================

// 1. 物理オブジェクトと3Dオブジェクトを作成
const sphereBody = createBallBody();
createBallMesh(sphereBody);

// 2. UIイベントリスナーをセットアップ
setupEventListeners(camera, controls, sphereBody, objectsToUpdate);

//==================================================
// アニメーションループ
//==================================================
const clock = new THREE.Clock();
let oldElapsedTime = 0;

// デバッグ用タイマー
let debugElapsed = 0;

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // 物理ワールドの計算を進める（停止中はスキップ）
    if (!isPaused) {
        world.step(1 / 60, deltaTime, 3);
    }

    // デバッグ出力：0.5秒ごとに垂直速度をログ（停止中は出力しない）
    debugElapsed += deltaTime;
    if (debugElapsed > 0.5) {
        if (!isPaused && sphereBody && sphereBody.velocity) {
            console.log('sphere vy=', sphereBody.velocity.y.toFixed(3));
        }
        debugElapsed = 0;
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

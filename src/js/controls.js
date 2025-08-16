import { initialCameraPos, initialTarget } from './scene.js';
import { OBJECT_DEFINITIONS } from './config.js'; // OBJECT_DEFINITIONSをインポート
import * as CANNON from 'cannon-es'; // CANNON.Vec3を使用するためインポート

// シミュレーションの状態
export let isPaused = false;

/**
 * UIコントロールのイベントリスナーをセットアップします。
 * @param {THREE.PerspectiveCamera} camera - 操作対象のカメラ
 * @param {OrbitControls} controls - 操作対象のオービットコントロール
 * @param {CANNON.Body} sphereBody - 操作対象のボールの物理ボディ
 * @param {Array} objectsToUpdate - 更新対象のオブジェクトリスト
 */
export function setupEventListeners(camera, controls, sphereBody, objectsToUpdate) {
    // DOM要素の取得
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resetViewBtn = document.getElementById('resetViewBtn');
    // launchButtonは現時点で未使用ですが、将来のためにIDを保持
    // const launchButton = document.getElementById('launchButton');

    // ボールの初期位置をconfigから取得
    const ballDefinition = OBJECT_DEFINITIONS.find(def => def.type === 'ball');
    const initialBallPos = ballDefinition ? ballDefinition.properties.initialPos : new CANNON.Vec3(0, 0, 0); // 見つからない場合のデフォルト値

    // 再生ボタン
    playBtn.addEventListener('click', () => {
        isPaused = false;
    });

    // 停止ボタン
    pauseBtn.addEventListener('click', () => {
        isPaused = true;
    });

    // リセットボタン
    resetBtn.addEventListener('click', () => {
        isPaused = true;

        // objectsToUpdateリスト内のすべての物理オブジェクトをリセット
        for (const obj of objectsToUpdate) {
            const { body, mesh } = obj;

            // 物理ボディの状態を初期化
            body.velocity.set(0, 0, 0);
            body.angularVelocity.set(0, 0, 0);
            // ボールの初期位置にリセット (configから取得した値を使用)
            body.position.copy(initialBallPos); 
            body.quaternion.set(0, 0, 0, 1);

            // Three.jsメッシュの位置も物理ボディに即座に同期
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        }
    });

    // 視点リセットボタン
    resetViewBtn.addEventListener('click', () => {
        camera.position.copy(initialCameraPos);
        controls.target.copy(initialTarget);
        controls.update();
    });
}
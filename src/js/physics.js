import * as CANNON from 'cannon-es';
import { SPHERE_RADIUS, INITIAL_SPHERE_POS, SPHERE_MATERIAL_CANNON } from './config.js';

// 物理ワールドの初期化
export const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // 重力設定
world.allowSleep = true; // パフォーマンス向上のためスリープを許可

// 更新が必要な物理オブジェクトのリスト
export const objectsToUpdate = [];

/**
 * ボールの物理ボディを作成し、ワールドに追加します。
 * @returns {CANNON.Body} 作成されたボールの物理ボディ
 */
export function createBallBody() {
    const sphereBody = new CANNON.Body({
        mass: 1,
        position: INITIAL_SPHERE_POS.clone(),
        shape: new CANNON.Sphere(SPHERE_RADIUS),
        material: SPHERE_MATERIAL_CANNON,
        allowSleep: false, // 初期落下を確実にする
    });

    // Y軸方向の動きのみを許可
    sphereBody.linearFactor.set(0, 1, 0);

    world.addBody(sphereBody);
    return sphereBody;
}

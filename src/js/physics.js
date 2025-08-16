import * as CANNON from 'cannon-es';
// 必要なマテリアル設定のみインポート
import { 
    SPHERE_MATERIAL_CANNON,
    GROUND_MATERIAL_CANNON,
} from './config.js';

// 物理ワールドの初期化
export const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // 重力設定
world.allowSleep = true; // パフォーマンス向上のためスリープを許可

// 更新が必要な物理オブジェクトのリスト
// このリストは objects.js でオブジェクトが追加され、main.js のアニメーションループで参照される
export const objectsToUpdate = [];

// 物理マテリアル間の相互作用を定義します
const sphereGroundContactMaterial = new CANNON.ContactMaterial(
    SPHERE_MATERIAL_CANNON,
    GROUND_MATERIAL_CANNON,
    {
        friction: 0.3,    // 摩擦係数
        restitution: 0.4, // 反発係数
    }
);
// 定義した相互作用をワールドに追加します
world.addContactMaterial(sphereGroundContactMaterial);

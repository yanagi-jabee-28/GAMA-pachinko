import * as CANNON from 'cannon-es';

// カメラ設定
export const FRUSTUM_SIZE = 30; // 坂全体が見えるように調整

// 物理マテリアル
export const SPHERE_MATERIAL_CANNON = new CANNON.Material('sphere');
export const GROUND_MATERIAL_CANNON = new CANNON.Material('ground');

// ボールの設定
export const SPHERE_RADIUS = 0.5;
// 坂の上に配置するようにY座標とZ座標を調整
export const INITIAL_SPHERE_POS = new CANNON.Vec3(0, 10, -5);

// 坂の設定
export const SLOPE_ANGLE = -15; // 坂の傾斜角度（度）
export const SLOPE_WIDTH = 20; // 坂の幅
export const SLOPE_HEIGHT = 1; // 坂の厚み
export const SLOPE_DEPTH = 20; // 坂の奥行き
export const SLOPE_POS = new CANNON.Vec3(0, 0, 0); // 坂の中心位置

// 床の設定
export const FLOOR_POS = new CANNON.Vec3(0, -5, 0); // 床の中心位置

// オブジェクト定義
export const OBJECT_DEFINITIONS = [
    {
        type: 'slope',
        properties: {
            angle: SLOPE_ANGLE,
            width: SLOPE_WIDTH,
            height: SLOPE_HEIGHT,
            depth: SLOPE_DEPTH,
            pos: SLOPE_POS,
            material: GROUND_MATERIAL_CANNON,
            color: 'rgb(180, 180, 180)'
        }
    },
    {
        type: 'floor',
        properties: {
            pos: FLOOR_POS, // これだけ残す
            material: GROUND_MATERIAL_CANNON,
            color: 'rgb(100, 100, 100)'
        }
    },
    {
        type: 'ball',
        properties: {
            radius: SPHERE_RADIUS,
            mass: 1,
            initialPos: INITIAL_SPHERE_POS,
            material: SPHERE_MATERIAL_CANNON,
            color: 'red'
        }
    }
];

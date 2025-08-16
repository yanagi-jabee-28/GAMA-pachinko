import * as CANNON from 'cannon-es';

// カメラ設定
export const FRUSTUM_SIZE = 20;

// 物理マテリアル
export const SPHERE_MATERIAL_CANNON = new CANNON.Material('sphere');

// ボールの設定
export const SPHERE_RADIUS = 0.5;
export const INITIAL_SPHERE_POS = new CANNON.Vec3(0, 8, 0);

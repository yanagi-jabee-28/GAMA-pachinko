import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// 物理・描画のコア要素をインポート
import { world, objectsToUpdate } from './physics.js';
import { scene } from './scene.js';

// 設定値をインポート
import { 
    SPHERE_RADIUS, 
    INITIAL_SPHERE_POS, 
    SPHERE_MATERIAL_CANNON,
    GROUND_MATERIAL_CANNON,
    SLOPE_ANGLE,
    OBJECT_DEFINITIONS 
} from './config.js';

/**
 * オブジェクト定義に基づいて物理ボディと3Dメッシュを作成し、ワールドとシーンに追加します。
 * @param {object} objectDefinition - オブジェクトの定義（type, propertiesなど）
 * @returns {{body: CANNON.Body, mesh: THREE.Mesh}} 作成されたオブジェクト
 */
export function createObject(objectDefinition) {
    const { type, properties } = objectDefinition;
    let body, mesh;

    switch (type) {
        case 'ball':
            // 物理ボディの作成
            body = new CANNON.Body({
                mass: properties.mass,
                position: properties.initialPos.clone(),
                shape: new CANNON.Sphere(properties.radius),
                material: properties.material,
                allowSleep: false,
            });
            world.addBody(body);

            // 3Dメッシュの作成
            mesh = new THREE.Mesh(
                new THREE.SphereGeometry(properties.radius),
                new THREE.MeshStandardMaterial({ color: properties.color, metalness: 0.5, roughness: 0.4 })
            );
            mesh.position.copy(body.position);
            scene.add(mesh);

            // 更新が必要なオブジェクトのリストに追加
            objectsToUpdate.push({ mesh, body });
            break;

        case 'slope':
            // 物理ボディの作成 (静的オブジェクト)
            const slopeHalfExtents = new CANNON.Vec3(properties.width / 2, properties.height / 2, properties.depth / 2);
            body = new CANNON.Body({
                mass: 0, 
                shape: new CANNON.Box(slopeHalfExtents), // Boxに変更
                material: properties.material,
                position: properties.pos.clone() // 位置を設定
            });
            const angleRad = (Math.PI / 180) * properties.angle;
            body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), angleRad);
            world.addBody(body);

            // 3Dメッシュの作成
            const slopeGeometry = new THREE.BoxGeometry(properties.width, properties.height, properties.depth); // BoxGeometryに変更
            const slopeMaterial = new THREE.MeshStandardMaterial({ 
                color: properties.color, 
                side: THREE.DoubleSide 
            });
            mesh = new THREE.Mesh(slopeGeometry, slopeMaterial);
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
            scene.add(mesh);
            break;

        case 'floor':
            // 物理ボディの作成 (静的オブジェクト)
            body = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Plane(), // Planeに変更
                material: properties.material,
                position: properties.pos.clone() // 位置を設定
            });
            // PlaneはデフォルトでY軸に垂直なので、X軸周りに-90度回転させて水平にする
            body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
            world.addBody(body);

            // 3Dメッシュの作成
            const floorGeometry = new THREE.PlaneGeometry(1000, 1000); // 非常に大きな平面
            const floorMaterial = new THREE.MeshStandardMaterial({ 
                color: properties.color, 
                side: THREE.DoubleSide 
            });
            mesh = new THREE.Mesh(floorGeometry, floorMaterial);
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
            scene.add(mesh);
            break;

        default:
            console.warn(`Unknown object type: ${type}`);
            return null;
    }

    return { body, mesh };
}
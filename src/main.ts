// Matter.jsはHTML側でUMDとして読み込まれる想定です
declare const Matter: any;

const { Engine, Runner, Bodies, Composite, Body, Events } = Matter;

// --- 初期設定とゲーム状態 ---
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const canvasWidth = 400;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let score = 0;
let ballCount = 0;
const scoreElement = document.getElementById('score') as HTMLElement;
const ballCountElement = document.getElementById('ball-count') as HTMLElement;

// --- Matter.jsエンジンのセットアップ ---
const engine = Engine.create();
const world = engine.world;
engine.world.gravity.y = 0.6;

// --- ゲームオブジェクトの作成 ---
const allBodies: any[] = [];
const wallOptions = { isStatic: true, render: { fillStyle: '#bdc3c7' } };
allBodies.push(Bodies.rectangle(canvasWidth / 2, canvasHeight + 10, canvasWidth, 20, wallOptions)); // 床
allBodies.push(Bodies.rectangle(canvasWidth + 10, canvasHeight / 2, 20, canvasHeight, wallOptions)); // 右壁
allBodies.push(Bodies.rectangle(canvasWidth / 2, -10, canvasWidth, 20, wallOptions)); // 天井

// 発射レーンの作成
const chuteWidth = 35;
allBodies.push(Bodies.rectangle(chuteWidth / 2 - 10, canvasHeight / 2, 10, canvasHeight, wallOptions)); // レーン左壁
allBodies.push(Bodies.rectangle(chuteWidth, canvasHeight / 2 + 50, 10, canvasHeight - 100, wallOptions)); // レーン右壁

// 釘を作成（配置を右にずらす）
const pinRadius = 5;
const rows = 15;
const cols = 8; // レーンの分、列を減らす
for (let row = 0; row < rows; row++) {
	for (let col = 0; col < cols; col++) {
		let x = 80 + col * 40;
		if (row % 2 === 1) x += 20;
		let y = 80 + row * 30;
		if (x < canvasWidth - 40) {
			const pin = Bodies.circle(x, y, pinRadius, {
				isStatic: true,
				restitution: 0.5,
				friction: 0.1,
				label: 'pin'
			});
			allBodies.push(pin);
		}
	}
}

// 入賞口（アタッカー）を作成
const pocket = Bodies.rectangle(canvasWidth / 2 + 20, 550, 80, 20, {
	isStatic: true,
	isSensor: true,
	label: 'pocket'
});
allBodies.push(pocket);

Composite.add(world, allBodies);

// --- ユーザー入力 ---
const launchButton = document.getElementById('launchButton') as HTMLButtonElement;
launchButton.addEventListener('click', () => {
	ballCount++;
	ballCountElement.textContent = `発射数: ${ballCount}`;

	const ball = Bodies.circle(chuteWidth / 2 - 5, canvasHeight - 30, 8, {
		restitution: 0.4,
		friction: 0.01,
		label: 'ball'
	});
	Composite.add(world, ball);

	const baseForce = 0.040;
	const randomFactor = 0.006;
	const forceY = -(baseForce + Math.random() * randomFactor);
	const forceX = 0.0005;
	Body.applyForce(ball, ball.position, { x: forceX, y: forceY });
});

// --- 衝突イベントの監視 ---
Events.on(engine, 'collisionStart', (event: any) => {
	const pairs = event.pairs;
	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i];
		if ((pair.bodyA.label === 'ball' && pair.bodyB.label === 'pocket') ||
			(pair.bodyA.label === 'pocket' && pair.bodyB.label === 'ball')) {
			const ballToRemove = pair.bodyA.label === 'ball' ? pair.bodyA : pair.bodyB;
			score += 100;
			scoreElement.textContent = `スコア: ${score}`;

			setTimeout(() => {
				Composite.remove(world, ballToRemove);
			}, 0);
		}
	}
});

// --- カスタム描画ループ ---
(function render() {
	const bodies = Composite.allBodies(world);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	for (let i = 0; i < bodies.length; i++) {
		const body = bodies[i];
		ctx.beginPath();

		switch (body.label) {
			case 'ball':
				ctx.fillStyle = '#f1c40f';
				break;
			case 'pin':
				ctx.fillStyle = '#bdc3c7';
				break;
			case 'pocket':
				ctx.fillStyle = '#e74c3c';
				break;
			default:
				ctx.fillStyle = '#95a5a6';
		}

		const vertices = body.vertices;
		ctx.moveTo(vertices[0].x, vertices[0].y);
		for (let j = 1; j < vertices.length; j++) {
			ctx.lineTo(vertices[j].x, vertices[j].y);
		}
		ctx.closePath();
		ctx.fill();
	}

	requestAnimationFrame(render);
})();

// --- エンジンの実行 ---
const runner = Runner.create();
Runner.run(runner, engine);

// 画面外のボールを定期的に削除
Events.on(engine, 'afterUpdate', () => {
	Composite.allBodies(world).forEach((body: any) => {
		if (body.label === 'ball' && (body.position.y > canvasHeight + 50 || body.position.x < -10)) {
			Composite.remove(world, body);
		}
	});
});

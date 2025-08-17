(function () {
	window.CONFIG = {
		// Gate timings
		GATE_OPEN_MS: 300,
		GATE_CLOSED_MS: 700,
		// Audio
		MASTER_VOLUME: 0.4,
		MUTED: false,
		SFX: {
			tulip: { gain: 0.9, freq: 880, type: 'sine', dur: 0.08 },
			chucker: { gain: 0.8, freq: 240, type: 'triangle', dur: 0.12 },
			windmill: { gain: 0.5, freq: 600, type: 'square', dur: 0.05 },
			miss: { gain: 0.5, freq: 120, type: 'sawtooth', dur: 0.08 }
		}
	};
})();

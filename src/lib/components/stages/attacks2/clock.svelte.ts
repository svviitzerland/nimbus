// A small clock for the guided attack lessons. `t` counts milliseconds since `key()` last
// changed (usually the beat in focus), so each beat can play a little timeline from its start.
// Under prefers-reduced-motion the clock jumps straight to a large value and stands still, so
// every scene shows its settled frame. Call it during component setup.
export function sceneClock(key: () => unknown, tickMs = 80) {
	const clock = $state({ t: 0, reduced: false });
	$effect(() => {
		key();
		clock.reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		clock.t = clock.reduced ? 1e9 : 0;
		if (clock.reduced) return;
		const start = Date.now();
		const id = setInterval(() => (clock.t = Date.now() - start), tickMs);
		return () => clearInterval(id);
	});
	return clock;
}

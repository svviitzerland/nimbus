// A clock for the guided backend stages. `t` counts milliseconds since `key()` last changed
// (the scene, usually), so each scene can play a little timeline from its start. Under
// prefers-reduced-motion the clock jumps straight to a large value, so scenes show their
// settled frame and loops stand still. Call it during component setup.
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

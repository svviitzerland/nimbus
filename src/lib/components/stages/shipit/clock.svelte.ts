// A scene clock for the guided Security stages (hardening, ids, detection, incident, pentest,
// ctf). `t` counts milliseconds since `key()` last changed, so every beat plays its own little
// timeline from the start. Under prefers-reduced-motion it jumps straight to a large value, so
// each scene shows its settled frame and loops stand still. Call it during component setup.
export function sceneClock(key: () => unknown, tickMs = 60) {
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

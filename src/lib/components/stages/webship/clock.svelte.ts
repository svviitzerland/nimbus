// Timing helpers for the guided deploy, mobile apps, and PWA stages. `sceneClock` counts the
// milliseconds since `key()` last changed (usually the scene), so each scene plays a little
// timeline from its start. Under prefers-reduced-motion the clock jumps to a huge value, so
// every scene shows its settled, final frame. Call it during component setup.
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

export type Beat<P extends string> = { ph: P; ms: number };

/**
 * Which phase of a little timeline is playing at time `t`, and how far into it (0 to 1).
 * A looping timeline wraps around, except for the reduced motion clock, which lands on the
 * last phase so the picture stands still on its final frame.
 */
export function phaseAt<P extends string>(seq: Beat<P>[], t: number, loop = true) {
	const total = seq.reduce((a, s) => a + s.ms, 0);
	let x = loop && t < 1e8 ? t % total : Math.min(t, total);
	for (const s of seq) {
		if (x < s.ms) return { ph: s.ph, p: x / s.ms };
		x -= s.ms;
	}
	return { ph: seq[seq.length - 1].ph, p: 1 };
}

/** Breaks a short line of text into lines of at most `max` characters, on spaces. */
export function wrap(s: string, max: number): string[] {
	const out: string[] = [];
	for (const w of s.split(' ')) {
		const last = out[out.length - 1];
		if (last !== undefined && (last + ' ' + w).length <= max) out[out.length - 1] = last + ' ' + w;
		else out.push(w);
	}
	return out;
}

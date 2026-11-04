// A tiny number tween for the guided AI lessons (overfitting, evaluation, inference, neural-net).
// Only call it from an `$effect` or an event handler, it uses animation frames (browser only).

/**
 * Moves a number from `from` to `to` over `ms`, calling `set` on every frame with an eased value.
 * Returns a cleanup that stops it, so it can be returned straight from an `$effect`.
 */
export function tween(from: number, to: number, ms: number, set: (v: number) => void): () => void {
	if (typeof requestAnimationFrame === 'undefined' || ms <= 0 || from === to) {
		set(to);
		return () => {};
	}
	let raf = 0;
	const t0 = performance.now();
	const run = (t: number) => {
		const p = Math.min(1, (t - t0) / ms);
		const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2; // ease in and out
		set(from + (to - from) * e);
		if (p < 1) raf = requestAnimationFrame(run);
	};
	raf = requestAnimationFrame(run);
	return () => cancelAnimationFrame(raf);
}

// Small timing helpers shared by the guided Web lessons (http, browser, domain-hosting, html).

/** One step of a sequence, run `fn`, then wait `ms` before the next one. */
export type SeqStep = [ms: number, fn: () => void];

/**
 * Plays the steps one after another (optionally looping) and returns a cleanup that stops it.
 * Meant to be returned from an `$effect`, so the timers die with the beat that started them.
 */
export function runSeq(steps: SeqStep[], loop = false): () => void {
	let t: ReturnType<typeof setTimeout> | undefined;
	let i = 0;
	let alive = true;
	const tick = () => {
		if (!alive || !steps.length) return;
		const [ms, fn] = steps[i];
		fn();
		i += 1;
		if (i >= steps.length) {
			if (!loop) return;
			i = 0;
		}
		t = setTimeout(tick, ms);
	};
	tick();
	return () => {
		alive = false;
		clearTimeout(t);
	};
}

/** True when the learner asked for less motion. Safe on the server (returns false there). */
export function prefersReducedMotion(): boolean {
	return (
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

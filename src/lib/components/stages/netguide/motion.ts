// Small helpers shared by the guided network lessons (routing, dynamic routing, VLAN,
// protocols, QoS). Browser only checks are guarded so the stages still render on the server.

/** True when the learner asked the system for less motion. */
export function prefersReducedMotion(): boolean {
	return (
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
	);
}

/**
 * A tiny timer bag, so a stage can schedule a sequence of steps and cancel all of them at once
 * when the beat changes or the stage unmounts.
 */
export function timerBag() {
	let ids: ReturnType<typeof setTimeout>[] = [];
	return {
		after(ms: number, fn: () => void) {
			ids.push(setTimeout(fn, ms));
		},
		clear() {
			ids.forEach(clearTimeout);
			ids = [];
		}
	};
}

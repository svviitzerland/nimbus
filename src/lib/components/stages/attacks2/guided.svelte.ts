// Shared wiring for the guided attack lessons. The stage is visible from the first beat and
// Next never locks (watch first, play optional). The step in focus follows Nim's beat, and a
// tap on a Guide dot lets the learner peek at another step until the next beat arrives.
import { untrack } from 'svelte';

export type { GuideStep } from './types';

export function guided(p: {
	beat: () => number;
	last: () => number;
	onshow?: (v: boolean) => void;
	oncomplete?: () => void;
}) {
	const s = $state({ peek: null as number | null });
	$effect(() => {
		untrack(() => {
			p.onshow?.(true);
			p.oncomplete?.();
		});
	});
	$effect(() => {
		p.beat();
		s.peek = null;
	});
	return {
		/** The step in focus, the peeked one or the current beat. */
		get step() {
			return Math.max(0, Math.min(s.peek ?? p.beat(), p.last()));
		},
		/** True on the last beat when nothing is being peeked, the optional play is offered. */
		get live() {
			return s.peek === null && p.beat() >= p.last();
		},
		select(k: number) {
			s.peek = k;
		}
	};
}

// Shared bits for the guided security basics stages.
import { untrack } from 'svelte';

/** One entry of the side panel, one per beat. */
export type GuideStep = { tag: string; title: string; body: string };

/**
 * Watch first, play optional. Call inside a component's script with a function that shows the
 * stage and unlocks Next, it runs once on mount.
 */
export function startGuided(start: () => void) {
	$effect(() => {
		untrack(start);
	});
}

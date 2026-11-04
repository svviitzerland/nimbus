// Plays a Cisco Lab lesson's guided part. Every Nim beat owns a short script of commands; when
// the beat changes, the director finishes or rebuilds what came before (instantly) and types the
// new beat's commands out slowly, so the terminal always matches the story, even when the
// learner goes back a beat or jumps ahead.
import type { IosShell } from './shell.svelte';

export class Director {
	private shown = -1;
	private settledSet = new Set<number>();
	constructor(
		private shell: IosShell,
		private scripts: string[][],
		/** Put the shell and the stage visuals back to the very start. */
		private fresh: () => void,
		/**
		 * Called once per beat after its commands ran. `instant` is true when the beat was skipped
		 * or rebuilt, so the stage should jump to the end state without animating.
		 */
		private settled?: (beat: number, instant: boolean) => void
	) {}

	private settle(k: number, instant: boolean) {
		if (this.settledSet.has(k)) return;
		this.settledSet.add(k);
		this.settled?.(k, instant);
	}

	go(beat: number) {
		if (beat === this.shown) return;
		if (this.shown >= 0 && beat > this.shown) {
			this.shell.flush();
			this.settle(this.shown, true);
			for (let k = this.shown + 1; k < beat; k++) {
				for (const l of this.scripts[k] ?? []) this.shell.run(l);
				this.settle(k, true);
			}
		} else {
			this.fresh();
			this.settledSet.clear();
			for (let k = 0; k < beat; k++) {
				for (const l of this.scripts[k] ?? []) this.shell.run(l);
				this.settle(k, true);
			}
		}
		this.shown = beat;
		this.shell.typeFor(this.scripts[beat] ?? [], () => this.settle(beat, false));
	}
}

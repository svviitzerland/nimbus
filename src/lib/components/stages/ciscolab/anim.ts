// One cancellable animation at a time. A stage runs a little show (a packet travelling, laptops
// asking for addresses); if the learner moves to another beat mid show, cancel() stops it and
// applies its end state at once, so the drawing always matches the story.
export class Anim {
	private id = 0;
	private end: (() => void) | null = null;

	private get reduced() {
		return (
			typeof window !== 'undefined' &&
			!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
		);
	}

	/** Play `show`, which awaits `wait(ms)` between frames, then call `end`. */
	async play(show: (wait: (ms: number) => Promise<void>) => Promise<void>, end: () => void) {
		this.cancel();
		const id = ++this.id;
		this.end = end;
		const wait = (ms: number) =>
			new Promise<void>((res, rej) =>
				setTimeout(() => (id === this.id ? res() : rej(new Error('stale'))), this.reduced ? 30 : ms)
			);
		try {
			await show(wait);
		} catch {
			return;
		}
		if (id !== this.id) return;
		this.end = null;
		end();
	}

	/** Stop the current show and jump to its end state. */
	cancel() {
		this.id++;
		const e = this.end;
		this.end = null;
		e?.();
	}

	/** Stop without applying anything (when the stage goes away). */
	stop() {
		this.id++;
		this.end = null;
	}
}

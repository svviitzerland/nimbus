import { prefersReducedMotion, timerBag } from './motion';

/**
 * Moves something (usually a packet) along a path of stops by itself, one stop at a time,
 * optionally looping. The stage draws it at `at` (the index of the current stop); `jump` turns
 * the CSS transition off while it teleports back to the start, `hidden` fades it out for that
 * moment, and `ended` is true once the last stop is reached (for an "arrived" or "dropped"
 * badge). Under reduced motion it simply sits on the last stop.
 */
export class Traveller {
	at = $state(0);
	hidden = $state(false);
	jump = $state(false);
	ended = $state(false);
	#bag = timerBag();

	play(stops: number, opts: { loop?: boolean; step?: number; hold?: number } = {}) {
		const { loop = true, step = 950, hold = 1700 } = opts;
		this.stop();
		this.ended = false;
		if (prefersReducedMotion() || stops <= 1) {
			this.jump = true;
			this.hidden = false;
			this.at = Math.max(0, stops - 1);
			this.ended = true;
			return;
		}
		const run = () => {
			this.hidden = true;
			this.#bag.after(260, () => {
				this.jump = true;
				this.ended = false;
				this.at = 0;
			});
			this.#bag.after(320, () => {
				this.jump = false;
				this.hidden = false;
			});
			for (let k = 1; k < stops; k++) this.#bag.after(420 + k * step, () => (this.at = k));
			const end = 420 + (stops - 1) * step;
			this.#bag.after(end + 350, () => (this.ended = true));
			if (loop) this.#bag.after(end + hold, run);
		};
		run();
	}

	stop() {
		this.#bag.clear();
	}
}

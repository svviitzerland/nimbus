// The learner's chosen track and any detour they are on, both persisted in the browser.
//
// A detour starts when the learner taps a cross link in Nim's line ("cryptography is covered in
// Security") and jumps there. We remember where they came from (lesson and beat), show a small
// "back to ..." pill, and when the detour lesson is finished Nim brings them straight back.
import {
	getTrack,
	trackSequence,
	type LessonRef,
	type Track,
	type TrackGroup,
	type TrackId
} from './tracks';
import { progress } from './progress.svelte';

const TRACK_KEY = 'nimbus:track:v1';
const DETOUR_KEY = 'nimbus:detour:v1';

export type Detour = { from: LessonRef; beat: number };

function read<T>(store: 'local' | 'session', key: string): T | null {
	try {
		const s = store === 'local' ? localStorage : sessionStorage;
		const raw = s.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch {
		return null;
	}
}
function write(store: 'local' | 'session', key: string, value: unknown) {
	try {
		const s = store === 'local' ? localStorage : sessionStorage;
		if (value === null) s.removeItem(key);
		else s.setItem(key, JSON.stringify(value));
	} catch {
		// storage unavailable; the choice just will not survive a reload
	}
}

const browser = typeof window !== 'undefined';
let trackId = $state<TrackId | null>(browser ? read<TrackId>('local', TRACK_KEY) : null);
let detour = $state<Detour | null>(browser ? read<Detour>('session', DETOUR_KEY) : null);
// A beat to resume on after a detour brings the learner back (consumed once by the lesson page).
let resumeBeat = $state<number | null>(null);

const same = (a: LessonRef, b: LessonRef) =>
	a.chapterId === b.chapterId && a.lessonId === b.lessonId;

export const path = {
	/** The chosen track. Falls back to General so old visitors keep today's flow. */
	get track(): Track {
		return getTrack(trackId) ?? getTrack('general')!;
	},
	get chosen(): boolean {
		return trackId !== null;
	},
	setTrack(id: TrackId) {
		trackId = id;
		write('local', TRACK_KEY, id);
	},

	/** The lesson after `here` in the current track, `end` at its last lesson, or undefined when
	 *  `here` is not part of the track (the caller then falls back to chapter order). */
	next(here: LessonRef): LessonRef | 'end' | undefined {
		const seq = trackSequence(this.track);
		const i = seq.findIndex((r) => same(r, here));
		if (i < 0) return undefined;
		return seq[i + 1] ?? 'end';
	},
	prev(here: LessonRef): LessonRef | undefined {
		const seq = trackSequence(this.track);
		const i = seq.findIndex((r) => same(r, here));
		return i > 0 ? seq[i - 1] : undefined;
	},
	includes(here: LessonRef): boolean {
		return trackSequence(this.track).some((r) => same(r, here));
	},
	/** The group (a Bab in Dari Nol, a module elsewhere) that holds `here` in the current track. */
	groupOf(here: LessonRef): { index: number; group: TrackGroup } | undefined {
		const key = `${here.chapterId}/${here.lessonId}`;
		const groups = this.track.groups;
		const index = groups.findIndex((g) => g.items.includes(key));
		return index < 0 ? undefined : { index, group: groups[index] };
	},
	/** Where to start (or continue) a track, the first lesson not yet finished. */
	firstOpen(track: Track): LessonRef | undefined {
		const seq = trackSequence(track);
		return seq.find((r) => !progress.isDone(r.chapterId, r.lessonId)) ?? seq[0];
	},

	/** The URL to enter a track at, its first unfinished lesson, or its wrap up page once every
	 *  ready lesson is done. */
	entryUrl(track: Track): string {
		const seq = trackSequence(track);
		const open = seq.find((r) => !progress.isDone(r.chapterId, r.lessonId));
		if (open) return `/${open.chapterId}/${open.lessonId}`;
		const last = seq[seq.length - 1];
		return `/${last.chapterId}/done?track=${track.id}`;
	},

	get detour(): Detour | null {
		return detour;
	},
	startDetour(from: LessonRef, beat: number) {
		// Keep the original origin if the learner hops again from inside a detour.
		if (detour) return;
		detour = { from, beat };
		write('session', DETOUR_KEY, detour);
	},
	/** End the detour and hand back where to return to (the beat is queued for the lesson page). */
	endDetour(): LessonRef | null {
		const d = detour;
		detour = null;
		write('session', DETOUR_KEY, null);
		if (!d) return null;
		resumeBeat = d.beat;
		return d.from;
	},
	cancelDetour() {
		detour = null;
		write('session', DETOUR_KEY, null);
	},
	takeResumeBeat(): number | null {
		const b = resumeBeat;
		resumeBeat = null;
		return b;
	}
};

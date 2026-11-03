// Learner progress, persisted to localStorage. Lessons must be finished in order:
// a lesson is only reachable once every earlier lesson in the curriculum is done.
import { chapters } from './chapters';

export type FlatLesson = {
	chapterId: string;
	lessonId: string;
	chapterIndex: number;
	lessonIndex: number;
	global: number;
};

/** Every lesson across every chapter, flattened into curriculum order. Built on first use, because
 *  stages import this file and the chapter registry imports the stages, so `chapters` may not be
 *  ready yet while this module loads. */
let flatCache: FlatLesson[] | null = null;
export function flatLessons(): FlatLesson[] {
	if (flatCache) return flatCache;
	const out: FlatLesson[] = [];
	let g = 0;
	chapters.forEach((c, ci) =>
		c.lessons.forEach((l, li) =>
			out.push({ chapterId: c.id, lessonId: l.id, chapterIndex: ci, lessonIndex: li, global: g++ })
		)
	);
	return (flatCache = out);
}

export function globalIndexOf(chapterId: string, lessonId: string): number {
	return flatLessons().findIndex((f) => f.chapterId === chapterId && f.lessonId === lessonId);
}

const KEY = 'nimbus:progress:v1';
const lessonKey = (chapterId: string, lessonId: string) => `${chapterId}/${lessonId}`;

function load(): string[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as string[]) : [];
	} catch {
		return [];
	}
}

// Reassigned (never mutated in place) so reads stay reactive across components.
let done = $state(new Set<string>(load()));

function persist() {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(KEY, JSON.stringify([...done]));
	} catch {
		// storage unavailable or full; progress just will not survive a reload
	}
}

export const progress = {
	isDone(chapterId: string, lessonId: string): boolean {
		return done.has(lessonKey(chapterId, lessonId));
	},
	markDone(chapterId: string, lessonId: string) {
		const k = lessonKey(chapterId, lessonId);
		if (done.has(k)) return;
		done = new Set(done);
		done.add(k);
		persist();
	},
	/** Reachable only when every earlier lesson in the curriculum is finished. */
	isUnlocked(global: number): boolean {
		for (let i = 0; i < global; i++) {
			const f = flatLessons()[i];
			if (!done.has(lessonKey(f.chapterId, f.lessonId))) return false;
		}
		return true;
	},
	get doneCount(): number {
		return done.size;
	},
	get total(): number {
		return flatLessons().length;
	},
	reset() {
		done = new Set();
		persist();
	}
};

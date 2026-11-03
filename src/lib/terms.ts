import type { Lang } from './i18n';
import { getChapter } from './chapters';
import { findSoon, getTrack, homeTrackOf, parseRef, type LessonRef, type Track } from './tracks';

/**
 * Inline cross links for Nim's dialogue. Write `[[label|target]]` anywhere in a lesson line and it
 * renders as a tappable chip. A tap opens a small card that says where the idea is taught, and lets
 * the learner jump there now (Nim brings them back afterwards) or keep going and meet it later.
 *
 * `target` can be
 *   `chapter/lesson`   a shipped lesson, e.g. `networking/encryption` (jumpable)
 *   `track:soonId`     a planned lesson, e.g. `security:tls` or `code:compiler` (coming soon)
 *   `track`            a whole track, e.g. `security`
 * Anything else is shown as a plain "coming soon" topic, so authors can drop a hint early.
 */

export type ResolvedTerm =
	| { kind: 'lesson'; ref: LessonRef; title: string; track?: Track; color: string }
	| { kind: 'soon'; title: string; where: string; color: string }
	| { kind: 'track'; track: Track; color: string }
	| { kind: 'topic'; name: string; color: string };

const DEFAULT_COLOR = '#2e6fe0';

export function resolveTerm(target: string, lang: Lang): ResolvedTerm {
	const tg = target.trim();
	if (tg.includes('/')) {
		const ref = parseRef(tg);
		if (ref) {
			const lesson = getChapter(ref.chapterId)!.lessons.find((l) => l.id === ref.lessonId)!;
			const track = homeTrackOf(ref.chapterId, ref.lessonId);
			return {
				kind: 'lesson',
				ref,
				title: lesson.text[lang].title,
				track,
				color: track?.color ?? DEFAULT_COLOR
			};
		}
	}
	const [trackId, soonId] = tg.split(':');
	if (soonId) {
		const s = findSoon(trackId, soonId);
		if (s)
			return {
				kind: 'soon',
				title: s.title[lang],
				// the track that teaches it, or the Basecamp module for a shared foundation
				where: (s.track ?? s.module).title[lang],
				color: s.track?.color ?? DEFAULT_COLOR
			};
	}
	const track = getTrack(trackId);
	if (track) return { kind: 'track', track, color: track.color };
	return { kind: 'topic', name: tg.charAt(0).toUpperCase() + tg.slice(1), color: DEFAULT_COLOR };
}

const TERM_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/**
 * Replace every `[[label|target]]` marker with a clickable chip. Everything else in the string,
 * including existing inline HTML like <b>, is left as is, so this composes with {@html}. The chip
 * carries data-label and data-target; SpeechBubble reads those on click (event delegation).
 */
export function renderTerms(text: string, lang: Lang): string {
	return text.replace(TERM_RE, (_m, label: string, target?: string) => {
		const tg = (target ?? 'general').trim();
		const lb = label.trim();
		const r = resolveTerm(tg, lang);
		const live = r.kind === 'lesson' ? ' term-live' : '';
		return `<button type="button" class="term${live}" data-label="${escapeHtml(lb)}" data-target="${escapeHtml(tg)}" style="--tc:${r.color}">${escapeHtml(lb)}</button>`;
	});
}

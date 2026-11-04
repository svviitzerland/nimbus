import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/secbasics/guided.svelte';

export type Hat = 'white' | 'gray' | 'black';

export interface HatColorsText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	hats: Record<Hat, string>;
	/** Captions under the props, with permission and without. */
	permission: string;
	noPermission: string;
	/** The Mitnick headline and his three moments on the timeline. */
	news: { tag: string; head: string };
	timeline: [
		{ year: string; label: string },
		{ year: string; label: string },
		{ year: string; label: string }
	];
	bountyLabel: string;
	/** One short story per hat for the optional last beat. */
	stories: Record<Hat, { who: string; story: string }>;
	tapHint: string;
}

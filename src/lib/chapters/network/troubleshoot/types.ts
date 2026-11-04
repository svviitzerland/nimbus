import type { LessonText } from '../../types';

export type CheckId = 'cable' | 'wifi' | 'ip' | 'gateway' | 'dns' | 'site';

/** One part of the picture, explained in the side panel. */
export type GuideStep = { title: string; body: string; tag?: string };

export interface TroubleshootText extends LessonText {
	/** Side panel, one entry per part of the story (eight, the last one is the optional game). */
	steps: GuideStep[];
	pageError: string; // what the browser shows while something is broken
	culpritTag: string; // tag on the first red floor
	victimTag: string; // tag on red floors above it
	startHere: string; // marker at the bottom floor
	endHere: string; // marker at the top floor
	playBtn: string; // starts the optional case
	newCase: string; // hides another fault
	/** One entry per floor, bottom up. `how` is the action or command it runs. */
	checks: Record<CheckId, { name: string; how: string; ok: string; fail: string }>;
	/** What was wrong and how it got fixed, per fault. */
	fixes: Record<CheckId, string>;
}

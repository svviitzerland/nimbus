import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

/** What the guard says about one request. */
export type IdsVerdict = 'pass' | 'ok' | 'alarm' | 'blocked' | 'unusual' | 'falsePos' | 'falseNeg';

export interface IdsText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	internetLabel: string;
	serverLabel: string;
	/** Names on the booth for each mode. */
	firewallName: string;
	idsName: string;
	ipsName: string;
	/** The short verdict pill shown over the request being read (about 18 letters). */
	verdicts: Record<IdsVerdict, string>;
	/** The optional mode switch on the last beat. */
	cameraMode: string;
	guardMode: string;
}

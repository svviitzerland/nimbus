import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface DetectionText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	/** Title over the 1986 printout, and its last line (the 75 cent gap). */
	printTitle: string;
	printGap: string;
	/** The trail Stoll followed, three short stops. */
	trail: string[];
	/** Title over the nimbus.com log window. */
	logTitle: string;
	/** Small labels for where each line came from, in the SIEM part. */
	sources: { web: string; shop: string; auth: string };
	/** The alert the SIEM raises, {ip} is the address. */
	alert: string;
	/** Hint on the last beat. */
	tapHint: string;
}

import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

/** The five incident response steps, in the right order. */
export type IncidentPhase = 'check' | 'contain' | 'clean' | 'recover' | 'learn';

export interface IncidentText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	/** Caption over the scene for the Maersk part and for the nimbus.com part. */
	maersk: string;
	nimbus: string;
	/** The lone server that survived, and its tag. */
	ghana: string;
	offline: string;
	/** Captions for the backup drive and the notebook. */
	backup: string;
	notes: string;
	/** Three short lines written in the notebook on the learn beat. */
	lessons: string[];
	/** The tag the magnifier shows on the check beat. */
	checkTag: string;
	/** The five steps, short (shown as a row under the scene). */
	phases: Record<IncidentPhase, string>;
	/** The optional replay on the last beat, the wrong order and the right one. */
	skip: string;
	right: string;
}

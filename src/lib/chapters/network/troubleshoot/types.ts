import type { LessonText } from '../../types';

export type CheckId = 'cable' | 'wifi' | 'ip' | 'gateway' | 'dns' | 'site';

export interface TroubleshootText extends LessonText {
	caseLabel: string; // template with {n}
	symptom: string; // what the learner sees, the site will not open
	fixedSymptom: string; // once the fault is fixed
	checkBtn: string;
	blameBtn: string; // marks a red step as the cause
	newCase: string; // hides a new fault
	okTag: string;
	failTag: string;
	bottomLabel: string; // tag on the lowest step, where to start
	/** One entry per step, bottom up. `how` is the action or command it runs. */
	checks: Record<CheckId, { name: string; how: string; ok: string; fail: string }>;
	/** What was wrong and how it got fixed, per fault. */
	fixes: Record<CheckId, string>;
}

import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/secbasics/guided.svelte';

/** The four weak spots of the house (and what each stands for at nimbus.com). */
export type ThreatSpot = 'door' | 'window' | 'gate' | 'pot';

export interface ThreatsText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	/** Each spot, the house name, its nimbus.com meaning (a short label), the threat and the fix. */
	spots: Record<ThreatSpot, { name: string; place: string; threat: string; fix: string }>;
	/** The Target headline shown over the picture on the tale beats. */
	news: { tag: string; head: string };
	registerLabel: string;
	cardsLabel: string;
	threatLabel: string;
	fixLabel: string;
	tapHint: string;
	/** Labels for the four words on the vocabulary beat (vulnerability, exploit, patch, CVE). */
	vocab: { vuln: string; exploit: string; patch: string; cve: string };
	/** A real CVE number with its nickname, shown under the four words. */
	cveExample: string;
}

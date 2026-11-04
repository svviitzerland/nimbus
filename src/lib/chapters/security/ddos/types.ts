import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/attacks2/types';

/** The optional switch on the last beat, the shield in front of nimbus.com. */
export type ShieldMode = 'off' | 'on';

export interface DdosText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	visitorsLabel: string; // the real people trying to visit
	attackerLabel: string; // the single troublemaker of a plain DoS
	botsLabel: string; // the botnet of hijacked devices
	serverLabel: string; // the nimbus.com server
	rateLabel: string; // the shield with only a rate limit
	cdnLabel: string; // the full shield, a CDN with a rate limit
	states: { up: string; slow: string; down: string };
	served: string; // template with {n}, share of real visitors getting in
	stamp: string; // October 2016, on the Mirai beat
	rule: string; // the rule of thumb line
	pickLabel: string;
	modes: Record<ShieldMode, string>;
}

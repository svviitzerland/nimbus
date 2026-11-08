import type { LessonText } from '../../types';

/** The ten requests that reach nimbus.com in one run, three of them attacks. */
export type IdsPacket =
	| 'home'
	| 'products'
	| 'login'
	| 'sqli'
	| 'cart'
	| 'abroad'
	| 'traversal'
	| 'fast'
	| 'portscan'
	| 'blog';

export interface IdsText extends LessonText {
	youLabel: string; // the crowd of visitors on the left
	guardLabel: string; // the IDS or IPS in the middle
	serverLabel: string;
	modeIds: string; // the IDS mode toggle, alarm only
	modeIps: string; // the IPS mode toggle, alarm and block
	strictLabel: string; // heading of the strictness slider
	strictLow: string; // left end of the slider
	strictHigh: string; // right end of the slider
	runBtn: string; // let the traffic in
	runAgain: string; // run it again after changing settings
	/** One short plain description per request, shown under the raw request. */
	packets: Record<IdsPacket, string>;
	scoreLabel: string; // caption before each suspicion score
	tagPass: string; // went through untouched
	tagAlert: string; // flagged in IDS mode, an alarm rang but it still got in
	tagBlock: string; // flagged in IPS mode, stopped
	attackTag: string; // marks the real attacks once the run ends
	resultAttacks: string; // template with {n} and {total}, attacks stopped
	resultVisitors: string; // template with {n}, real visitors blocked
	hintIdle: string; // explains the suspicion line before the first run
}

import type { LessonText } from '../../types';

/** How the chatbot picks a model. `route` sends easy questions to the small model. */
export type AiCloudMode = 'big' | 'small' | 'route';

export interface AiCloudText extends LessonText {
	/** Locale for number formatting, like 'id-ID' or 'en-US'. */
	locale: string;
	usersLabel: string; // caption over the crowd slider
	usersValue: string; // template with {n}, people a day
	msgsValue: string; // template with {n}, messages a day (five per person)
	cachedValue: string; // template with {n}, messages answered from the cache
	cacheLabel: string;
	cacheSub: string;
	modeLabel: string; // caption over the model picker
	modes: Record<AiCloudMode, { name: string; sub: string }>;
	gpuTitle: string; // template with {n}, how many GPU servers are rented
	legendBig: string; // the big model's racks
	legendSmall: string; // the small model's racks
	billLabel: string; // caption over the bill meter
	budgetMark: string; // template with {cost}, the budget line
	overBy: string; // template with {cost}
	underBy: string; // template with {cost}
	qualityLabel: string;
	qualityBad: string; // shown when answers are too often wrong
	rentNote: string; // template with {hour} and {month}, the price of one GPU server
}

import type { LessonText } from '../../types';

export interface AiCloudPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface AiCloudText extends LessonText {
	/** One panel per scene of the guided picture (eight scenes). */
	panels: AiCloudPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** Locale for money, like 'id-ID' or 'en-US'. */
	locale: string;
	/** Template with {n}, under the crowd. */
	crowd: string;
	/** Template with {n}, over the GPU servers. */
	gpus: string;
	/** Template with {cost}, the hourly price tag on one GPU server. */
	hourly: string;
	bigLabel: string;
	smallLabel: string;
	cacheLabel: string;
	billTitle: string;
	budgetLabel: string;
	/** Memory trick tag over the small model. */
	memo: string;
	/** The rule of thumb line under the picture. */
	rule: string;
	/** The optional switch on the last beat. */
	offBtn: string;
	onBtn: string;
}

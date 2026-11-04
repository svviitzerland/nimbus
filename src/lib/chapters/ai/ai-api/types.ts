import type { LessonText } from '../../types';

export interface AiApiPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

/** One question the app can send, with the reply and the token counts the provider reports. */
export interface AiApiAsk {
	question: string;
	reply: string;
	tokensIn: number;
	tokensOut: number;
}

export interface AiApiText extends LessonText {
	/** One panel per scene of the guided picture (nine scenes). */
	panels: AiApiPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** Captions for the app on the phone and the provider's machine. */
	appName: string;
	appLabel: string;
	providerLabel: string;
	modelLabel: string;
	/** Captions over the code card. */
	requestTitle: string;
	responseTitle: string;
	tokensTitle: string;
	/** The default short question, and the long one for the optional play. */
	short: AiApiAsk;
	long: AiApiAsk;
	/** The short question split into tokens, the way the model reads it. */
	tokenChips: string[];
	/** Template with {n}, under the token chips. */
	tokensCount: string;
	/** The taxi meter. */
	meterTitle: string;
	meterTokens: string; // template with {n}
	/** Memory trick tag over the meter. */
	memo: string;
	/** Template with {cost}, the same question asked by 10,000 people a day. */
	perDay: string;
	/** The rule of thumb line under the picture. */
	rule: string;
	/** The optional switch on the last beat. */
	longBtn: string;
	shortBtn: string;
}

import type { LessonText } from '../../types';

/** The two models the learner can pick. Their prices live in the stage. */
export type AiApiModel = 'mini' | 'pro';

export interface AiApiText extends LessonText {
	/** Locale for number formatting, like 'id-ID' or 'en-US'. */
	locale: string;
	appLabel: string; // the learner's backend, the one that calls the provider
	appSub: string;
	providerLabel: string; // the company that runs the model
	providerSub: string;
	promptLabel: string; // caption over the question chips
	/** The questions the learner can send, each with the answer from either model. */
	prompts: { label: string; text: string; answers: Record<AiApiModel, string> }[];
	modelLabel: string; // caption over the model picker
	modelDesc: Record<AiApiModel, string>; // short note under each model name
	keyLabel: string; // the API key switch
	keyOn: string;
	keyOff: string;
	sendBtn: string;
	sending: string;
	requestTitle: string; // caption over the request code
	responseTitle: string; // caption over the response code
	responseEmpty: string; // shown before anything came back
	missingKey: string; // the error message inside the 401 JSON
	billTitle: string; // caption over the bill list
	billEmpty: string;
	tokensIn: string; // template with {n}
	tokensOut: string; // template with {n}
	perDay: string; // template with {cost}, the last request asked by 10,000 people a day
	priceNote: string; // template with {model}, {in}, {out}, the price per 1,000 tokens
}

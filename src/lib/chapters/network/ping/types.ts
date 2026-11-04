import type { LessonText } from '../../types';

/** One part of the picture, explained in the side panel. */
export type GuideStep = { title: string; body: string; tag?: string };

export interface PingText extends LessonText {
	/** Side panel, one entry per part of the story (seven). */
	steps: GuideStep[];
	youLabel: string; // the first node on the road, your laptop
	/** Every stop between your laptop and nimbus.com, in order (six, the last is the server). */
	hops: string[];
	inputLabel: string; // aria label of the command field
	suggestLabel: string; // aria label of the suggestion chips
	// Muted "#" lines the terminal prints
	demoHint: string; // before the stage types anything
	termHint: string; // when the learner's turn starts
	hintUnknownCmd: string;
	hintNeedHost: string;
	didYouMean: string; // template with {word}
	hintTimeout: string;
	hintStars: string;
}

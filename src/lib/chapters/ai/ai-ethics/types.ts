import type { LessonText } from '../../types';

/** The three calls the learner can make about a message. */
export type AiEthicsChoice = 'send' | 'clean' | 'keep';

/** The six messages. Which call is right for each lives in the stage. */
export type AiEthicsCase = 'news' | 'cv' | 'key' | 'friend' | 'art' | 'bank';

export interface AiEthicsText extends LessonText {
	choices: Record<AiEthicsChoice, string>;
	/** The messages, in the order they come up. */
	cases: {
		id: AiEthicsCase;
		context: string; // a short label of who is sending what
		draft: string; // the message as written
		secrets: string[]; // parts of the draft that are risky, highlighted after answering
		cleaned: string; // the safer version, used when cleaning is the right call
	}[];
	composerLabel: string; // caption over the message box
	progress: string; // template with {n} and {total}
	nextBtn: string;
	finishBtn: string; // on the last message, wraps up the lesson
	sentTag: string;
	cleanedTag: string;
	keptTag: string;
	doneNote: string;
	/** Where a sent message goes, as a short row of steps. */
	journey: string[];
}

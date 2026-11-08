import type { LessonText } from '../../types';

/** The zones on the board, from outside (not AI) to the innermost ring. */
export type AiRing = 'out' | 'ai' | 'ml' | 'dl' | 'gen';

/** The everyday things the learner sorts. Which ring each belongs to lives in the stage. */
export type AiCardId = 'chat' | 'calc' | 'face' | 'spam' | 'chess' | 'image' | 'price';

export interface WhatIsAiText extends LessonText {
	/** Label for every zone on the board. */
	rings: Record<AiRing, string>;
	/** The cards, in the order they sit in the tray. */
	cards: { id: AiCardId; name: string; sub: string }[];
	pickHint: string; // nothing selected yet
	ringHint: string; // template with {name}, a card is selected
	doneNote: string; // every card placed
}

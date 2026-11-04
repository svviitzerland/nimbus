import type { LessonText } from '../../types';

/** The circles, from the biggest to the smallest. */
export type AiRing = 'ai' | 'ml' | 'dl' | 'gen';

/** The everyday examples that drop into the picture. Where each one lives is set in the stage. */
export type AiThingId = 'calc' | 'chess' | 'spam' | 'face' | 'chat' | 'image';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface WhatIsAiText extends LessonText {
	/** One panel per beat of the guided visual (nine beats). */
	panels: GuidePanel[];
	/** The name written inside each circle. */
	rings: Record<AiRing, string>;
	/** Short name under each example. */
	things: Record<AiThingId, string>;
	/** Turing's famous question, shown big on the history beat. */
	quote: string;
	/** Small line under the quote (who asked it, and when). */
	quoteBy: string;
	photo: { alt: string; caption: string };
	/** Rule of thumb under the picture on the first memory beat. */
	rule: string;
	/** Rule of thumb on the second memory beat, about the nesting. */
	nest: string;
	/** Hint on the last beat, the examples can be tapped. */
	tapHint: string;
}

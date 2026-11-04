import type { LessonText } from '../../types';

export interface AiEthicsPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

/** The three messages the billboard test runs on. */
export type AiEthicsMsgId = 'news' | 'cv' | 'friend';

/** A piece of a message line. `secret` pieces are private and get flagged. */
export interface AiEthicsSeg {
	t: string;
	secret?: boolean;
}

export interface AiEthicsMsg {
	id: AiEthicsMsgId;
	/** Short button label for the optional replay. */
	label: string;
	/** The message as it would be typed, one array of pieces per line. */
	lines: AiEthicsSeg[][];
}

export interface AiEthicsText extends LessonText {
	/** One panel per scene of the guided picture (eight scenes). */
	panels: AiEthicsPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	youLabel: string;
	providerLabel: string;
	/** What may happen to a message at the provider, kept, read, used for training. */
	fates: [string, string, string];
	/** The question written on the billboard. */
	billboardAsk: string;
	messages: AiEthicsMsg[];
	/** Shown in place of a private piece once the message is cleaned. */
	removed: string;
	/** The three stamps. */
	verdicts: { send: string; clean: string; keep: string };
	/** The rule of thumb line under the picture. */
	rule: string;
}

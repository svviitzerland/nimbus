import type { LessonText } from '../../types';

export interface AgentsPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface AgentsText extends LessonText {
	/** One panel per scene of the guided picture (nine scenes). */
	panels: AgentsPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** What the learner asked the agent. */
	goal: string;
	youLabel: string;
	/** What a plain chatbot answers, words only. */
	chatOnly: string;
	chatbotLabel: string;
	agentLabel: string;
	/** The three steps of the loop, short words drawn around the agent. */
	loop: { think: string; act: string; check: string };
	/** The calendar tool. */
	calendarLabel: string;
	day: string;
	free: string;
	teamSync: string;
	withRaka: string;
	/** What the agent thinks at each step. */
	think1: string;
	think2: string;
	think3: string;
	/** The tool call and the answer it gets back (shown as code, colons allowed there). */
	call: string;
	result: string;
	/** The permission question and its buttons. */
	approvalQ: string;
	allow: string;
	deny: string;
	/** The agent's last message. */
	finalAllow: string;
	finalDeny: string;
	/** Memory trick tag and rule of thumb line. */
	memo: string;
	rule: string;
	/** Optional replay on the last beat. */
	again: string;
}

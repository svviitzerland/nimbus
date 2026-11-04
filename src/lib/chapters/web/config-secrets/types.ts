import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface ConfigSecretsText extends LessonText {
	/** Side panel parts, one per beat (nine). */
	steps: GuideStep[];
	/** The places the code runs and travels to. */
	laptopLabel: string;
	serverLabel: string;
	repoLabel: string;
	/** Tag on the GitHub card, anyone can read it. */
	publicTag: string;
	/** Under the server card when it looks for localhost and finds nothing. */
	noDb: string;
	/** Pops up on the GitHub card when the key leaks. */
	botFound: string;
	/** The environment box around the program, and its caption. */
	envBox: string;
	envCaption: string;
	/** On the push scene, what reached GitHub and what stayed home. */
	sent: string;
	stayed: string;
	/** The host dashboard window and its page title. */
	dashboard: string;
	dashTitle: string;
	/** The leaked key scene. */
	revoked: string;
	fresh: string;
	/** The remember scene, where each kind of file lives. */
	where: { code: string; env: string; dash: string };
	rule: string;
}

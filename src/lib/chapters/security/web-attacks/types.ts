import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/attacks2/types';

export interface WebAttacksText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	browserLabel: string; // caption under the browser window
	serverLabel: string;
	dbLabel: string;
	visitorLabel: string; // another person opening the comments page
	login: {
		title: string;
		userLabel: string;
		passLabel: string;
		submit: string;
		welcome: string; // template with {user}
		wrong: string;
		broken: string; // the database could not read the query
		noMatch: string; // shown on the database when nothing matched
	};
	comments: {
		title: string;
		post: string;
		posted: string;
		seed: string; // a friendly comment already on the page
		popupTitle: string; // pretend popup, shown when a script would have run
		popupBody: string;
	};
	/** Captions over the code strip under the picture. */
	strip: { query: string; params: string; page: string };
	codeTag: string; // marks input that became code
	dataTag: string; // marks input that stayed data
	rule: string; // the rule of thumb line
	fixLabel: string; // caption of the optional switch
	fix: { off: string; on: string };
}

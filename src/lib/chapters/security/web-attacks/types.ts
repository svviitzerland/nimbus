import type { LessonText } from '../../types';

export interface WebAttacksText extends LessonText {
	/** The two simulated pages, the login form and the comment box. */
	tabs: { login: string; comments: string };
	sandboxTag: string; // small badge saying everything here is pretend
	login: {
		userLabel: string;
		passLabel: string;
		submit: string;
		tryLabel: string; // caption above the ready made attack chips
		queryLabel: string; // caption above the query the server builds
		paramsLabel: string; // caption above the separate values, once the fix is on
		fixLabel: string; // the toggle that switches on the parameterized query
		fixOn: string;
		fixOff: string;
		welcome: string; // template with {user}
		wrong: string;
		broken: string; // the database could not read the query
		codeTag: string; // marks the part of the input that became code
	};
	comments: {
		label: string;
		placeholder: string;
		post: string;
		tryLabel: string;
		sentLabel: string; // caption above the HTML the server sends back
		pageLabel: string; // caption above the visitor's page (sandboxed iframe)
		fixLabel: string; // the toggle that escapes the comment
		fixOn: string;
		fixOff: string;
		ranTitle: string; // pretend popup title, shown when a script would have run
		ranBody: string;
		seed: string; // a friendly comment already on the page
	};
}

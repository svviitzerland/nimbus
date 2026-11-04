import type { WebAttacksText } from './types';

export const en: WebAttacksText = {
	title: 'SQL injection and XSS',
	intro: [
		'Almost every website has boxes you can type into, a login, a search bar, a comment box. Whatever you type is meant to be plain <b>data</b>, a name or a sentence, nothing more. Watch a normal login go through.',
		'Behind the scenes the server asks its database a question in [[SQL|web/sql]], find the user with this name and this password. A careless site builds that question by <b>gluing</b> your text right between two quotes.',
		'Now an attacker types a name that starts with a quote. That quote closes the name early, and the rest, OR 1 equals 1, becomes part of the question. One equals one is always true, so the database hands over the first user, the admin. That is <b>SQL injection</b>.',
		'The fix is a <b>parameterized query</b>. The server sends the question with empty slots, and your text travels separately, always as data. The database now looks for a user literally named that strange text, finds nobody, and the door stays shut.',
		"The comment box has a cousin of the same bug. A page is HTML the server sends to every visitor (remember [[HTTP|web/http]]). If a comment holds a script tag and the site sends it out untouched, every visitor's browser runs it. That is <b>XSS</b>, cross site scripting.",
		'The fix here is <b>escaping</b>. Before the comment goes out, the special characters are swapped for harmless look alikes, so the browser draws them as plain text and never treats them as a tag. The comment shows up exactly as typed, and nothing runs.',
		'[ingat] <b>Input is a guest, never the boss.</b> Whatever people type may sit in the room, but it never gives orders. Keep it as data, every single time.',
		'[fyi] Neither bug is new. SQL injection was first written up publicly in 1998 by a researcher named Jeff Forristal. In 2005 Samy Kamkar posted an XSS script on his MySpace profile, and within about twenty hours over a million people had added him as a friend without meaning to.',
		'Want to see the difference again? Switch the fix off and on and watch both attacks replay. Everything here is pretend, nothing touches a real database or runs in your browser.'
	],
	reactions: {
		fixOff:
			'Fix off. The quote breaks out of the name and logs in as admin, and the script tag reaches every visitor. Gluing text into code is the whole problem.',
		fixOn:
			'Fix on. The SQL slots keep the name as data, and escaping keeps the comment as text. Same attacks, nothing happens.'
	},
	steps: [
		{
			tag: 'Normal',
			title: 'Input is data',
			body: 'A name and a password go in, the server checks them, and you are in. Exactly as planned.'
		},
		{
			tag: 'Under the hood',
			title: 'The glued question',
			body: 'Your text is pasted <b>inside quotes</b> in the SQL question. That works, until the text has a quote of its own.'
		},
		{
			tag: 'Attack',
			title: 'SQL injection',
			body: 'A quote ends the name early, and the rest is read as <b>SQL</b>. The question now matches everybody.'
		},
		{
			tag: 'Defense',
			title: 'Parameterized query',
			body: 'The question has <b>slots</b>, the text travels apart. Data can never turn into SQL.'
		},
		{
			tag: 'Attack',
			title: 'XSS',
			body: "A comment with a <b>script tag</b> becomes part of the page, so it runs in every visitor's browser."
		},
		{
			tag: 'Defense',
			title: 'Escaping',
			body: 'Special characters become harmless look alikes. The browser <b>shows</b> the tag instead of running it.'
		},
		{
			tag: 'Make it stick',
			title: 'A guest, never the boss',
			body: 'Input may sit in the room, it never <b>gives orders</b>.'
		},
		{
			tag: 'Side note',
			title: 'Old bugs, still around',
			body: 'Both were described more than twenty years ago, and both still show up in new code today.'
		},
		{
			tag: 'Optional',
			title: 'Fix on, fix off',
			body: 'Flip the switch and watch the same two attacks succeed or fail.'
		}
	],
	browserLabel: 'Your browser',
	serverLabel: 'Server',
	dbLabel: 'Database',
	visitorLabel: 'Another visitor',
	login: {
		title: 'Log in',
		userLabel: 'Username',
		passLabel: 'Password',
		submit: 'Log in',
		welcome: 'Welcome back, {user}',
		wrong: 'Wrong username or password',
		broken: 'The database got confused',
		noMatch: 'no match'
	},
	comments: {
		title: 'Comments',
		post: 'Post',
		posted: 'Comment posted',
		seed: 'Love the new cloud stickers!',
		popupTitle: 'nimbus.com says',
		popupBody: 'Your login cookie was sent away (pretend)'
	},
	strip: {
		query: 'What the server asks the database',
		params: 'Sent separately, as data only',
		page: 'What the server sends to every visitor'
	},
	codeTag: 'became code',
	dataTag: 'stayed data',
	rule: 'Input is a guest, never the boss',
	fixLabel: 'The fix',
	fix: { off: 'Off', on: 'On' }
};

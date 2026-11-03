import type { WebAttacksText } from './types';

export const en: WebAttacksText = {
	title: 'SQL injection and XSS',
	intro: [
		'Almost every website has boxes you can type into. A login form, a search bar, a comment box. Whatever you type is supposed to be plain <b>data</b>, a name, a sentence, nothing more.',
		'Trouble starts when a site glues your text straight into one of its own commands. Then a few clever characters can stop being data and turn into part of the command. That trick is called an <b>injection</b>.',
		'The login on nimbus.com asks its database a question written in [[SQL|web/sql]], something like "find the user with this name and this password". If your name contains a single quote, the quote can close the name early, and everything after it gets read as SQL. That is <b>SQL injection</b>.',
		"The comment box has a cousin of the same bug. A web page is just HTML the server sends to your browser (remember [[HTTP|web/http]]). If a comment holds a &lt;script&gt; tag and the site sends it out untouched, every visitor's browser runs it. That is <b>XSS</b>, cross site scripting.",
		'[fyi] Neither bug is new. SQL injection was first written up publicly in 1998 by a researcher called Jeff Forristal. In 2005 a young developer, Samy Kamkar, posted an XSS script on his MySpace profile, and it added over a million friends to his account in about twenty hours.',
		'Both pages below are fake, they live in a little sandbox and nothing you type ever reaches a real database or runs in your browser. First break in like an attacker, then flip the fix on like a defender and try again.'
	],
	reactions: {
		normal:
			'A normal login. The name and password stayed inside their quotes, so the database only ever saw data. This is how it is supposed to work.',
		wrong:
			'No match, so no entry. Look at the query though, everything you typed sits neatly between the quotes. Try one of the red chips to see what happens when it does not.',
		broken:
			'Oops, the database choked. A stray quote closed the text early and what came after made no sense as SQL. Attackers love this error, it tells them the box is glued straight into the query.',
		sqlIn:
			'You are in, as admin, without the password. The red part of the query is your input acting as code. The quote closed the name, and the rest either rewrote the test or turned the password check into a comment.',
		drop: 'In a real database that would have deleted the whole users table, gone. Nim only pretended here. This exact joke has a famous comic about a boy named Bobby Tables, and sadly it happens for real too.',
		sqlBlocked:
			'Blocked. With a <b>parameterized query</b> the server sends the command with empty slots (the question marks), and your text travels separately as pure data. The database looked for a user literally named that, quotes and all, and found nobody.',
		plain:
			'A normal comment, it shows up as text for everyone. Now try a comment that holds some HTML tags.',
		htmlTag:
			"See how the tags vanished and the text turned bold? The visitor's browser read your comment as part of the page. Harmless for bold text, but it means a script tag would be read as code too.",
		xssRan:
			'That script would now run in the browser of every person who opens this page, and it could quietly send their login cookie to the attacker. Nim only showed a pretend popup, nothing actually ran.',
		xssBlocked:
			'Blocked. <b>Escaping</b> turns the special characters into harmless look alikes, so &lt; becomes &amp;lt;. The browser draws them as plain characters and never treats them as a tag. The comment shows up exactly as typed, and nothing runs.'
	},
	tabs: { login: 'Login', comments: 'Comments' },
	sandboxTag: 'sandbox, nothing here is real',
	login: {
		userLabel: 'Username',
		passLabel: 'Password',
		submit: 'Log in',
		tryLabel: 'Try typing as the username',
		queryLabel: 'What the server asks the database',
		paramsLabel: 'Sent separately, as data only',
		fixLabel: 'Parameterized query',
		fixOn: 'on',
		fixOff: 'off',
		welcome: 'Welcome back, {user}',
		wrong: 'Wrong username or password',
		broken: 'The database could not understand the query',
		codeTag: 'your input became code'
	},
	comments: {
		label: 'Leave a comment on nimbus.com',
		placeholder: 'Write something nice',
		post: 'Post comment',
		tryLabel: 'Try posting',
		sentLabel: 'What the server sends to every visitor',
		pageLabel: 'What a visitor sees',
		fixLabel: 'Escape comments',
		fixOn: 'on',
		fixOff: 'off',
		ranTitle: 'nimbus.com says (pretend)',
		ranBody: "A script just ran in this visitor's browser and sent their login cookie away.",
		seed: 'Love the new cloud stickers!'
	}
};

import type { ConfigSecretsText } from './types';

export const en: ConfigSecretsText = {
	title: 'Config and secrets',
	intro: [
		'The same nimbus.com code runs in two places, on your laptop while you build it and on the server for everyone else. But a few settings must differ. On the laptop the database lives at <b>localhost</b> (this very computer), on the server at db.nimbus.com. Settings like these are called <b>config</b>.',
		'The quick way is to type them straight into the code, called <b>hard coding</b>. Then the code only fits one place. Upload it and the server goes looking for localhost, which for the server means itself, and finds no database there.',
		'Hard coding a <b>secret</b> is worse. An <b>API key</b> is a password that lets your code use a paid service, like taking payments. Push it to GitHub and anyone who reads the repo can spend your money. Bots scan public repos for keys all day long.',
		'So config moves out of the code, into <b>environment variables</b>. The environment is the place a program runs in, and it can hold named values. The code no longer knows the value, it just asks by name, like DATABASE_URL.',
		'On your laptop those values live in a small text file called <b>.env</b>, one NAME=value per line. The code stays the same everywhere, only this little file changes.',
		'And .env is <b>never committed</b>. You write its name in <b>.gitignore</b>, a list of files Git pretends not to see. Push now and app.js travels to GitHub while .env stays home.',
		'The server needs its own values, and there is no file to copy. Your host has a page in its <b>dashboard</b> for environment variables. You type the server values there once, and the host hands them to your app every time it starts.',
		'[ingat] Code is a recipe card you may show anyone. The .env file is the sticky note on your own fridge, with the oven setting and the pantry key. Share the recipe, never the sticky note.',
		'[fyi] Pushed a key by accident? Deleting the line is not enough, because Git history remembers it. <b>Revoke</b> the key at the service so it stops working, then make a fresh one. People call this <b>rotating</b> a key.'
	],
	reactions: {},
	steps: [
		{
			tag: 'Config',
			title: 'Same code, two places',
			body: 'The code is identical, but the <b>database address</b> and the <b>keys</b> differ between laptop and server.'
		},
		{
			tag: 'Hard coding',
			title: 'Values inside the code',
			body: 'A value written into the code ties it to <b>one place</b>. Moving it means editing the code again.'
		},
		{
			tag: 'Danger',
			title: 'A key in public',
			body: 'An <b>API key</b> works like a password. In a public repo it is a password on a billboard.'
		},
		{
			tag: 'The fix',
			title: 'Environment variables',
			body: 'The code asks for a value <b>by name</b>. Whoever runs it decides what the value is.'
		},
		{
			tag: 'Laptop',
			title: 'The .env file',
			body: 'One <b>NAME=value</b> per line. Your laptop values, kept right next to the code.'
		},
		{
			tag: 'Git',
			title: '.env goes in .gitignore',
			body: 'Git skips every file listed in <b>.gitignore</b>, so .env never reaches GitHub.'
		},
		{
			tag: 'Server',
			title: 'The host dashboard',
			body: 'The server values are typed into the <b>host dashboard</b>. Secrets stay hidden on screen, even from you.'
		},
		{
			tag: 'Make it stick',
			title: 'Recipe and sticky note',
			body: 'Share the <b>recipe</b> (the code). Keep the <b>sticky note</b> (.env) on your own fridge.'
		},
		{
			tag: 'Side note',
			title: 'Rotate a leaked key',
			body: 'Revoke the old key so it stops working, then put a new one in .env and in the dashboard.'
		}
	],
	laptopLabel: 'Your laptop',
	serverLabel: 'Server',
	repoLabel: 'GitHub',
	publicTag: 'public',
	noDb: 'no database here',
	botFound: 'a bot found your key',
	envBox: 'The environment',
	envCaption: 'the code only asks by name',
	sent: 'sent',
	stayed: 'stays home',
	dashboard: 'Host dashboard',
	dashTitle: 'Environment variables',
	revoked: 'revoked',
	fresh: 'new',
	where: { code: 'anyone may read', env: 'your laptop only', dash: 'the server only' },
	rule: 'Share the recipe, never the sticky note'
};

import type { CiaText } from './types';

export const en: CiaText = {
	title: 'The CIA triad',
	intro: [
		'Picture your diary. Three bad things could happen to it. Someone reads it, someone quietly rewrites a page, or it is gone right when you need it. Every piece of data in the world, from your chats to a bank balance, can suffer the same three.',
		'The first bad thing is a stranger reading it. Keeping data away from the wrong eyes is called <b>Confidentiality</b>. Only the right people may read.',
		'The second is a sneaky edit. Watch the pencil turn 500 thousand into 5 thousand. Making sure nobody changes data behind your back is called <b>Integrity</b>.',
		'The third is the diary simply not being there when you reach for it. Keeping data reachable whenever it is needed is called <b>Availability</b>. Put the three first letters together and you get the <b>CIA triad</b> (nothing to do with the American spy agency).',
		'[ingat] Three promises for every piece of data. <b>Keep it secret, keep it true, keep it there.</b> Secret is C, true is I, there is A.',
		'Now a few real stories. In 2013 attackers copied data from all three billion Yahoo accounts, names, emails, birthdays, and scrambled passwords. Nothing was changed and nothing went offline. It was simply read by the wrong people, so C broke. Yahoo only told the world in 2016 and 2017.',
		'In April 2013 someone took over the Twitter account of the Associated Press, a big news agency, and posted a fake message about explosions at the White House. Stock prices in America dipped for a few minutes before everyone realised it was false. The account was real, the message was not, so I broke.',
		'In October 2016 a botnet called Mirai, an army of hacked cameras and home routers, flooded a company called Dyn with junk traffic. Dyn runs DNS, the phone book of the internet, so Twitter, Netflix, and Spotify could not be reached for hours in parts of the world. Nothing was stolen, the door was just jammed, so A broke.',
		'[fyi] Almost every security tool you will meet guards one of the letters. [[Identity and Access|networking/iam]] and encryption guard C, digital signatures guard I, backups and spare servers guard A.',
		'One last thing. Guarding one letter can hurt another. Lock the diary too tight and even you cannot open it, so C wins but A loses. Good security is about balance. Want to see a story again? Tap a letter.'
	],
	reactions: {
		c: 'C, Confidentiality. Ask yourself, did the wrong people read it? That was Yahoo, three billion accounts read by strangers while everything kept running.',
		i: 'I, Integrity. Ask yourself, was it changed without permission? That was the fake AP tweet, a real account carrying a false message.',
		a: 'A, Availability. Ask yourself, could people reach it? That was Dyn, nothing stolen, just a door jammed by junk traffic.'
	},
	steps: [
		{
			tag: 'Data',
			title: 'Like a diary',
			body: 'Every piece of data, a chat, a photo, a bank balance, can be <b>read</b>, <b>changed</b>, or <b>lost</b>. Security guards against all three.'
		},
		{
			tag: 'C',
			title: 'Confidentiality',
			body: 'Only the right people can read it. It breaks when a stranger <b>reads</b> what was meant to stay private.'
		},
		{
			tag: 'I',
			title: 'Integrity',
			body: 'Data stays exactly as it was set. It breaks when someone <b>changes</b> it without permission.'
		},
		{
			tag: 'A',
			title: 'Availability',
			body: 'Data is there when you need it. It breaks when nobody can <b>reach</b> it, even if nothing was stolen.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Secret, true, there',
			body: 'Three promises. <b>C</b> keeps it secret, <b>I</b> keeps it true, <b>A</b> keeps it there.'
		},
		{
			tag: 'Yahoo, 2013',
			title: 'C broke',
			body: 'Three billion accounts <b>read</b> by attackers. Nothing changed, nothing went down, and that is exactly why nobody noticed for years.'
		},
		{
			tag: 'AP, 2013',
			title: 'I broke',
			body: 'A real account posted a <b>false</b> message. One fake sentence shook the stock market for a few minutes.'
		},
		{
			tag: 'Dyn, 2016',
			title: 'A broke',
			body: 'A flood of junk traffic from hacked gadgets. Big sites could not be <b>reached</b>, even though nothing leaked.'
		},
		{
			tag: 'The guards',
			title: 'A tool for every letter',
			body: '<b>Encryption</b> guards C, <b>signatures</b> guard I, <b>backups</b> and spare servers guard A.'
		},
		{
			tag: 'Optional',
			title: 'Balance',
			body: 'Too much of one letter can hurt another. Tap a letter in the picture to replay its story.'
		}
	],
	letters: {
		c: { short: 'secret', name: 'Confidentiality' },
		i: { short: 'true', name: 'Integrity' },
		a: { short: 'there', name: 'Availability' }
	},
	diary: { title: 'My diary', line: 'Savings', amount: 'Rp 500.000', amountBad: 'Rp 5.000' },
	news: {
		c: { tag: 'Yahoo, 2013', head: 'Data from three billion accounts copied by attackers' },
		i: {
			tag: 'Associated Press, 2013',
			head: 'A fake tweet about the White House shakes the market'
		},
		a: { tag: 'Dyn, 2016', head: 'Big sites go dark after a flood of junk traffic' }
	},
	tools: { c: 'encryption', i: 'signature', a: 'backup' },
	pickHint: 'Tap a letter to replay its story'
};

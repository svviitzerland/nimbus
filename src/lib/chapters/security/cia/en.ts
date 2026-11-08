import type { CiaText } from './types';

export const en: CiaText = {
	title: 'The CIA triad',
	intro: [
		'Picture your diary. Three bad things could happen to it. Someone reads it, someone quietly rewrites a page, or it vanishes right when you need it.',
		'Security people gave those three a name. <b>Confidentiality</b> means only the right people can read it. <b>Integrity</b> means nobody changes it behind your back. <b>Availability</b> means it is there when you need it. Put the first letters together and you get the <b>CIA triad</b> (nothing to do with the American spy agency).',
		'For nimbus.com it looks like this. Customer data stays secret, prices and orders stay exactly as they were set, and the shop stays open during the big sale.',
		'[fyi] Almost every security tool you will meet guards at least one letter. [[Identity and Access|networking/iam]] and encryption guard C, digital signatures guard I, backups and spare servers guard A.',
		'Sometimes guarding one letter hurts another. Lock things too tight and even the owner cannot get in, so C wins but A loses. Good security is about balance.',
		'[ingat] Three promises for every piece of data. <b>Keep it secret, keep it true, keep it there.</b> Secret is C, true is I, there is A.',
		'Here is a stack of news clippings, some from the real world and some from nimbus.com. Read each one and drop it on the letter that got broken.'
	],
	reactions: {
		yahoo:
			'Right, Confidentiality. In 2013 attackers copied data from all three billion Yahoo accounts, names, emails, birthdays, and old hashed passwords. Yahoo only told the world in 2016 and 2017. Nothing was changed or switched off, it was simply read by the wrong people.',
		laptop:
			'Confidentiality again. Nobody broke in and nothing was changed, but whoever picks up that laptop can read the customer list. An encrypted disk would have kept it unreadable.',
		ap: 'Integrity. In April 2013 someone took over the Associated Press Twitter account and posted a fake tweet about explosions at the White House. US stocks dipped for a few minutes before everyone realised it was false. The account was real, the message was not.',
		price:
			'Integrity. An unauthorized edit changes the price to one rupiah. The main issue is the integrity of the data.',
		dyn: 'Availability. In October 2016 a botnet called Mirai, an army of hacked cameras and home routers, flooded Dyn, a company that runs DNS (the phone book of the internet). Twitter, Netflix, and Spotify went unreachable for hours in parts of the world. No data was stolen, the doors were just jammed.',
		power:
			'Availability, even without any attacker. A power cut still stops customers from reaching the shop. That is why serious sites keep spare servers in other places.',
		miss: 'Hmm, not that one. Ask yourself, was the data read by someone, changed by someone, or made unreachable?'
	},
	buckets: {
		c: { name: 'Confidentiality', sub: 'read by the wrong people' },
		i: { name: 'Integrity', sub: 'changed without permission' },
		a: { name: 'Availability', sub: 'cannot be reached' }
	},
	pickHint: 'Which letter got broken? Tap it.',
	cards: {
		yahoo: { tag: 'Yahoo, 2013', head: 'Data from three billion accounts copied by attackers' },
		laptop: {
			tag: 'nimbus.com',
			head: 'A staff laptop holding the customer list is left on a train'
		},
		ap: {
			tag: 'Associated Press, 2013',
			head: 'A fake tweet about the White House shakes the market'
		},
		price: { tag: 'nimbus.com', head: 'Someone changes every price in the database to Rp 1' },
		dyn: { tag: 'Dyn, 2016', head: 'Big sites go dark after a flood of junk traffic' },
		power: { tag: 'nimbus.com', head: 'The only server loses power on the first day of the sale' }
	},
	progress: '{n} of {total} sorted',
	missTag: 'not this one',
	allDone: 'All sorted. Every incident broke at least one letter.',
	again: 'Sort them again'
};

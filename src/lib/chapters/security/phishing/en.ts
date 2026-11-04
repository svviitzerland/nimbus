import type { PhishingText } from './types';

export const en: PhishingText = {
	title: 'What is phishing',
	intro: [
		'Breaking into a computer is hard work. Tricking the person sitting in front of it is often much easier. Why pick a lock when you can simply ask for the key? Look, a new email just landed.',
		'This is <b>phishing</b>. A fake message pretends to come from someone you trust (your bank, your boss, nimbus.com) and nudges you to tap a link and type your password. The name comes from fishing, throw out bait and wait for a bite. Scammers already did it in the mid 1990s, and it is still the most common way an attack begins.',
		'The good news is that most fakes leave clues. Let us read this one slowly, like a detective, and let the clues light up one by one.',
		'Clue one, the <b>sender</b>. The name says nimbus.com Security, but the address behind it is <b>nimbuss.com</b>, with one extra letter. Anyone can type any name, the address is much harder to fake.',
		'Clue two, the <b>pressure</b>. Close in 24 hours, lose all your data! A fake loves to rush you, because a rushed person skips the thinking part. Real companies rarely threaten you like that.',
		'Clue three, the <b>link</b>. The button says verify, but where does it really go? Rest your finger or mouse on it without tapping. The address starts with nimbus.com, yet the real owner is the name just before the first slash, <b>verify.xyz</b>.',
		'[ingat] <b>Slow down, check the sender, check the link.</b> Three small habits, and most phishing falls apart right there.',
		'[fyi] The same trick travels on other roads. By SMS it is called smishing, by phone call it is vishing. In Indonesia you may have seen the WhatsApp version, a "wedding invitation" file that is really an app. Even if a password does slip out, [[MFA|security/mfa]] can still keep the door shut.',
		'Want to compare? Flip between this fake and a real email from nimbus.com, and watch how the clues change. This inbox is pretend, nothing in it can hurt you.'
	],
	reactions: {
		fake: 'The fake again. An address one letter off, a 24 hour threat, and a button that leads to verify.xyz. Three red flags in one email.',
		real: 'The real one. The address is exactly nimbus.com, nobody rushes you, and the button goes to nimbus.com itself. Still, when in doubt, open the site yourself instead of tapping the button.'
	},
	steps: [
		{
			tag: 'Inbox',
			title: 'A new email',
			body: 'It looks like it comes from nimbus.com. That is exactly what a good fake wants you to think.'
		},
		{
			tag: 'The bait',
			title: 'Phishing',
			body: 'A message that <b>pretends</b> to be someone you trust, to get your password, money, or a tap on a link.'
		},
		{
			tag: 'Detective mode',
			title: 'Look for clues',
			body: 'Fakes nearly always slip up in the same three places. Read slowly, nothing here needs an answer right now.'
		},
		{
			tag: 'Clue one',
			title: 'The sender',
			body: 'The name can say anything. The <b>address</b> after it is the real sender, and here it is one letter off.'
		},
		{
			tag: 'Clue two',
			title: 'The pressure',
			body: "Deadlines and threats are there to make you <b>hurry</b>. Hurry is the attacker's best friend."
		},
		{
			tag: 'Clue three',
			title: 'The link',
			body: 'Read the address <b>before</b> tapping. The name right before the first slash is the true owner, here <b>verify.xyz</b>.'
		},
		{
			tag: 'Remember it',
			title: 'Slow down, check, check',
			body: '<b>Slow down</b>, check the <b>sender</b>, check the <b>link</b>. In that order, every time.'
		},
		{
			tag: 'Side note',
			title: 'Not only email',
			body: 'SMS, phone calls, and chat apps carry the same bait. The same three habits work there too.'
		},
		{
			tag: 'Optional',
			title: 'Fake or real',
			body: 'Flip between the two emails and compare the clues side by side.'
		}
	],
	inboxLabel: 'Inbox',
	olderRows: [
		{ from: 'Mom', subject: 'Dinner on Sunday?' },
		{ from: 'Nimbus Café', subject: 'Your loyalty points this month' }
	],
	goesTo: 'Really goes to',
	clues: {
		fake: { sender: 'one letter off', urgency: 'rushing you', link: 'not nimbus.com' },
		real: { sender: 'exactly nimbus.com', urgency: 'no rush', link: 'nimbus.com itself' }
	},
	rule: 'Slow down, check the sender, check the link',
	pickLabel: 'Show me',
	modes: { fake: 'The fake', real: 'The real one' },
	emails: {
		fake: {
			fromName: 'nimbus.com Security',
			fromAddr: 'security@nimbuss.com',
			time: '09.12',
			subject: 'Your account will be closed',
			body: 'We noticed unusual activity on your nimbus.com account. Please confirm your details to keep it open.',
			urgent: 'Act within 24 hours or lose all your data!',
			cta: 'Verify now',
			url: 'nimbus.com.verify.xyz/login'
		},
		real: {
			fromName: 'nimbus.com',
			fromAddr: 'hello@nimbus.com',
			time: '09.12',
			subject: 'Your receipt for November',
			body: 'Thanks for learning with Nimbus. Your monthly receipt is ready whenever you want to look at it.',
			urgent: '',
			cta: 'View receipt',
			url: 'nimbus.com/account'
		}
	}
};

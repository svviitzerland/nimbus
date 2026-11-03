import type { PhishingText } from './types';

export const en: PhishingText = {
	title: 'What is phishing',
	intro: [
		'Breaking into a computer is hard work. Tricking the person sitting in front of it is often much easier. Why pick a lock when you can simply ask for the key?',
		'<b>Phishing</b> is exactly that. A fake message pretends to come from someone you trust (your bank, your boss, nimbus.com) and nudges you to tap a link, type your password, or send money. The name comes from fishing, throwing out bait and waiting for a bite.',
		'It goes back to the mid 1990s, when scammers posed as staff of AOL (a huge internet provider back then) and asked users for their passwords. Today it is still the most common way an attack begins, because people are busy and a good fake looks just like the real thing.',
		'Luckily most fakes leave clues. Check the <b>sender</b>, the address can be one letter off. Check the <b>link</b>, where the button really goes. And notice the <b>pressure</b>, a fake loves to rush you so you skip the thinking part.',
		'[fyi] Same trick, other channels. Over SMS it is called smishing, over a phone call it is vishing. In Indonesia you have probably seen the WhatsApp version, a "wedding invitation" file that is really a trap.',
		'This inbox is pretend, nothing in it can hurt you. Open each email, peek at where its button really goes, then decide, real or phishing?'
	],
	reactions: {
		peek: 'That is what hovering does on a computer. The button can say anything, but the address underneath tells the truth. Find the part right before the first slash, that is the real site.',
		invoiceRight:
			'Correct, this one is real. The sender ends in nimbus.com, the link goes to nimbus.com, and nobody is rushing you. Calm emails like this are normal.',
		invoiceWrong:
			'Careful, this one was genuine. The sender ends in nimbus.com, the link stays on nimbus.com, and there is no pressure. Being suspicious is good, but check the clues before deciding.',
		lookalikeRight:
			'Sharp eyes. Look closely, it says nirnbus.com, an r and an n squeezed together to look like an m. Scammers buy addresses like this for a few dollars.',
		lookalikeWrong:
			'Got you. Read the sender slowly, it is nirnbus.com, not nimbus.com. The r and n side by side pass for an m at a glance, which is the whole trick.',
		resetRight:
			'Nice. The sender looked fine, but the link goes to accountcheck.xyz. The nimbus.com at the start is only a disguise, the real site is the part just before the first slash.',
		resetWrong:
			'This one was fake. The sender name can be forged, so the link is the better witness, and it leads to accountcheck.xyz. Typing your password there hands it straight to the scammer.',
		bossRight:
			'Right. A boss who suddenly needs gift cards, wants it secret, and says do not call, that is pressure stacked on pressure. The fix is simple, call them on a number you already know.',
		bossWrong:
			'This was a scam. Secret, urgent, gift cards, and "do not call me". Real bosses can wait five minutes while you double check by phone. Gift card codes are gone the moment you send them.',
		signinRight:
			'Correct, it is real. Still, the safest habit is not to tap the button at all, open nimbus.com yourself and check your activity there. That habit beats every clever fake.',
		signinWrong:
			'This one was genuine, sender and link are both nimbus.com and it asks for nothing. Your caution is healthy though. When unsure, skip the button and open nimbus.com yourself.',
		done: 'Inbox cleared. Most fakes lean on the same three clues, the sender, the link, and the rush. And even if a password does leak, [[MFA|security/mfa]] means the password alone is not enough to get in.'
	},
	inboxLabel: 'Inbox',
	counter: 'Email {n} of {total}',
	peek: 'Peek at where the button goes',
	peekLabel: 'Really goes to',
	noLink: 'No link at all, it only wants you to reply',
	markReal: 'Looks real',
	markFake: 'Phishing',
	nextEmail: 'Next email',
	again: 'Sort the inbox again',
	verdictRight: 'You got it',
	verdictWrong: 'Not quite',
	realTag: 'real',
	fakeTag: 'phishing',
	clues: {
		sender: 'Clue, the sender',
		link: 'Clue, the link',
		urgency: 'Clue, the pressure',
		none: 'No clues, all checks pass'
	},
	scoreLabel: '{n} of {total} sorted right',
	safeNote: 'A pretend inbox, every email here is made up',
	emails: {
		invoice: {
			fromName: 'Nimbus Billing',
			fromAddr: 'billing@nimbus.com',
			time: '08.12',
			subject: 'Your receipt for November',
			body: 'Thanks for your payment of Rp 50.000 for the Starter plan. You can find the receipt in your account any time.',
			urgent: '',
			cta: 'View receipt',
			url: 'nimbus.com/billing'
		},
		lookalike: {
			fromName: 'Nimbus Support',
			fromAddr: 'support@nirnbus.com',
			time: '09.40',
			subject: 'Unusual activity on your account',
			body: 'We noticed something odd on your account. Please confirm your details so we can keep it safe.',
			urgent: '',
			cta: 'Confirm my details',
			url: 'nirnbus.com/verify'
		},
		reset: {
			fromName: 'Nimbus',
			fromAddr: 'noreply@nimbus.com',
			time: '11.05',
			subject: 'Your password expires today',
			body: 'To keep using nimbus.com, please confirm your current password.',
			urgent: '',
			cta: 'Keep my password',
			url: 'nimbus.com.accountcheck.xyz/login'
		},
		boss: {
			fromName: 'Raka (CEO)',
			fromAddr: 'raka.ceo.nimbus@quickmail.co',
			time: '13.27',
			subject: 'Quick favour, keep it between us',
			body: "I'm stuck in a meeting. Please buy five gift cards for a client and send me the codes.",
			urgent: 'I need them in 30 minutes, and do not call me.',
			cta: 'Reply',
			url: ''
		},
		signin: {
			fromName: 'Nimbus Security',
			fromAddr: 'security@nimbus.com',
			time: '15.50',
			subject: 'New sign in from Bandung',
			body: 'Someone just signed in to your account from a new phone. If this was you, there is nothing to do.',
			urgent: '',
			cta: 'Review activity',
			url: 'nimbus.com/security'
		}
	}
};

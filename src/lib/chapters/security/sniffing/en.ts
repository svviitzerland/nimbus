import type { SniffingText } from './types';

export const en: SniffingText = {
	title: 'Sniffing and MITM',
	intro: [
		'You sit down in a café, order a coffee, and join the free WiFi. Handy, right? But that WiFi is a shared room. Your phone, the stranger at the next table, and everyone else are all talking through the same air.',
		'Radio waves do not care who they are meant for. Anyone nearby with the right app can quietly record every packet flying past. That is called <b>sniffing</b>, like a dog sniffing out every smell in the room.',
		'Most of the time nobody bothers. But if your data travels as plain readable text (plain <b>HTTP</b>), a sniffer reads it like a postcard, the address, the message, and even your password.',
		'The fix is a locked envelope. With <b>HTTPS</b> everything is scrambled before it leaves your phone, so the sniffer only gets noise. How that lock is built lives in [[SSL and TLS|security/tls]].',
		"A sneakier trick goes one step further. Instead of only listening, the attacker stands <b>in the middle</b> of the conversation, for example by running a fake hotspot named just like the café's. Everything you send passes through their laptop first. That is a <b>man in the middle</b> attack, or MITM for short.",
		'[fyi] Same word, different world. Recording traffic is not only an attacker trick. Network engineers do it on purpose to fix problems, with tools like [[Wireshark|network/wireshark]]. The tool is the same, what matters is whose traffic it is and whether they said yes.',
		'Everything here happens in a pretend café, nobody real gets hurt. Log in to nimbus.com over HTTP, then over HTTPS, and watch what the snooper at the next table gets.'
	],
	reactions: {
		http: 'Ouch. The snooper sees your username and password in plain text, exactly as you typed them. Anyone on this WiFi with a free app could do the same.',
		https:
			'Now the snooper only gets scrambled noise. They can still tell you visited nimbus.com and roughly how much you sent, but not a word of what was inside. That is HTTPS doing its job.',
		real: 'Good instinct, asking the staff which network is really theirs is the safest move. But to see the trick, try the other one, the one with the suspiciously strong signal.',
		twin: "You just joined the snooper's own hotspot. It looks like the café WiFi, but now every packet passes through their laptop before reaching the internet. They are not only listening anymore, they are standing in the middle.",
		mitmHttp:
			'Look at your screen. The snooper slipped a fake box into the page asking for your card number. Over plain HTTP your phone has no way to notice the page was changed along the way.',
		mitmHttps:
			"Your browser refused. The snooper tried to pretend to be nimbus.com, but they cannot show nimbus.com's real certificate, so the browser warns you instead. Go back, never tap past it. On public WiFi a [[VPN|network/vpn]] adds one more lock on top."
	},
	acts: ['Sniffing', 'Man in the middle'],
	actLabel: 'Act {n}',
	nextAct: 'On to the next act',
	youLabel: 'You',
	serverLabel: 'nimbus.com',
	routerLabel: 'Café WiFi',
	snooperLabel: 'Snooper at the next table',
	twinLabel: "Snooper's hotspot",
	sendHttp: 'Log in over HTTP',
	sendHttps: 'Log in over HTTPS',
	loginTitle: 'Log in',
	userLabel: 'Username',
	passLabel: 'Password',
	loginBtn: 'Log in',
	loggedIn: 'Welcome back, Sari',
	captureTitle: 'What the snooper sees',
	captureEmpty: 'Waiting for something to fly past',
	readableTag: 'readable',
	scrambledTag: 'scrambled',
	pickWifi: 'Pick a WiFi network',
	wifiReal: 'Nimbus Cafe',
	wifiTwin: 'Nimbus Cafe Free',
	strongSignal: 'strongest signal',
	openHttp: 'Open nimbus.com over HTTP',
	openHttps: 'Open nimbus.com over HTTPS',
	blankPage: 'Not connected yet',
	pageWelcome: 'Welcome to nimbus.com',
	tamperedTitle: 'Security check',
	tamperedBody: 'Enter your card number to continue',
	tamperedTag: 'added by the snooper',
	warnTitle: 'Your connection is not private',
	warnBody: 'Someone may be pretending to be nimbus.com',
	warnBack: 'Back to safety',
	capture: {
		swapped: 'page changed, card box slipped in',
		refused: 'fake certificate, browser said no'
	},
	notes: {
		idle: 'Same café, same WiFi, same snooper. Only the lock changes',
		http: 'Over HTTP the login flies past as a readable postcard',
		https: 'Over HTTPS the login flies past as a sealed envelope',
		pick: 'Two networks with almost the same name. Which one is the café?',
		real: 'The real café WiFi, the one the staff told you about',
		twin: 'Now every packet stops at the snooper first',
		mitmHttp: 'The page arrived, but not the page nimbus.com sent',
		mitmHttps: 'The browser caught the impostor before anything was sent'
	}
};

import type { WifiSecurityText } from './types';

export const en: WifiSecurityText = {
	title: 'WiFi security',
	intro: [
		'[[WiFi|network/wifi]] is radio. Your router shouts your data into the air, and the walls of your house do not stop it. The neighbour, or someone parked outside, can catch the very same waves.',
		'So the real question is not whether they can hear it, they can. The question is whether what they hear makes any sense. That depends on the security setting on your router.',
		'An <b>open</b> network has no password at all. Anyone can join, and traffic that is not locked by the site itself can simply be read. That is why the free WiFi at a cafe is risky, and why a [[VPN|network/vpn]] helps there.',
		'<b>WPA2</b> locks everything with your WiFi password. It is good, with one weakness. A snooper can record the moment a phone joins, then take it home and guess passwords against it as fast as his computer can go. An easy password falls in seconds.',
		'<b>WPA3</b> is the newer one. That recording trick no longer works, each guess has to be tried live against the router, one by one, and the router can slow that down. Even a recorded session cannot be unlocked later.',
		'One more habit. Give visitors a <b>guest network</b>. Their phones get internet, but they cannot see your laptop or anything else on your home network.',
		'[fyi] WPA stands for WiFi Protected Access. Its grandparent, WEP from 1999, was so weak it could be broken in minutes, so if an old router still offers WEP, skip it.',
		'You are the owner of this router. Try each setting, open, WPA2, and WPA3, and see what the snooper outside gets. Play with the password too.'
	],
	reactions: {
		open: 'No password, no lock. The snooper just joined like any guest and is reading your traffic as it flies by. Fine for a park bench, never for home.',
		wpa2weak:
			'WPA2 was on, yet the snooper still got in. He recorded the handshake, tried a list of common passwords at home, and yours was on it. Make it longer and try again.',
		wpa2: 'Much better. With a long password, guessing from that recording would take him years. WPA2 is fine as long as the password is not easy.',
		wpa3: 'WPA3 shut the trick down. There is nothing useful to take home, every guess must knock on your router live, and it slows him down. This is the one to pick when your devices support it.',
		guest:
			'Guest network on. Your friend still gets internet, but now lives on a separate network, so your laptop and TV are out of reach for anything on their phone.'
	},
	routerTitle: 'Your router settings',
	securityLabel: 'Security',
	modes: { open: 'Open', wpa2: 'WPA2', wpa3: 'WPA3' },
	modeHints: {
		open: 'No password, anyone can join',
		wpa2: 'Locked with your password, the common choice',
		wpa3: 'Locked with your password, the newer and safer choice'
	},
	passwordLabel: 'WiFi password',
	weakTag: 'easy to guess',
	strongTag: 'strong',
	guestLabel: 'Guest network for visitors',
	applyBtn: 'Save and let the snooper try',
	snooperLabel: 'Snooper outside your house',
	snooperIdle: 'Waiting for your router to come online',
	snoop: {
		joinOpen: '> joined the network, no password asked',
		readPlain: '> reading your traffic, GET nimbus.com/login user=nim',
		captured: '> recorded a phone joining the network',
		guessing: '> guessing passwords from a list at home',
		cracked: '> found it, the password is {pw}',
		noLuck: '> 10 million guesses later, still nothing',
		noise: '> all I can read is noise',
		wpa3Live: '> nothing useful to record, every guess must go to the router',
		wpa3Slow: '> the router keeps slowing my guesses down, giving up'
	},
	homeNet: 'home network',
	guestNet: 'guest network',
	devices: { laptop: 'Your laptop', tv: 'Smart TV', friend: "Friend's phone" },
	noteGuestOff: "Your friend's phone sits right next to your laptop",
	noteGuestOn: "Your friend's phone has internet, but cannot see your laptop"
};

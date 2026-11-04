import type { WifiSecurityText } from './types';

export const en: WifiSecurityText = {
	title: 'WiFi security',
	intro: [
		'[[WiFi|network/wifi]] is radio. Your router sends your data into the air as waves, and walls do not stop them. They spill out into the street.',
		'So the neighbour, or a stranger parked outside, can catch the very same waves. The real question is not whether they can hear it (they can), but whether it makes any sense to them.',
		'An <b>open</b> network has no password. Anyone can join, and anything the site itself does not lock can be read as it flies by. That is why free cafe WiFi is risky, and why a [[VPN|network/vpn]] helps there.',
		'<b>WPA2</b> locks everything with your WiFi password, and it is the most common setting today. Its one weakness, a stranger can record the moment a phone joins, take it home, and guess passwords against it very fast. A short password falls quickly, a long one holds for years.',
		'<b>WPA3</b> is the newer lock. That recording trick no longer works. Every guess has to knock on your router live, one at a time, so guessing becomes painfully slow.',
		'One more good habit, a <b>guest network</b>. Visitors still get internet, but they live in a separate room of your network, so their phones cannot reach your laptop or TV.',
		'[ingat] Bigger number, stronger lock. Open is a postcard anyone can read, WPA2 is a sealed envelope (only as strong as its password), and WPA3 is the best seal you can pick.',
		'[fyi] WPA stands for WiFi Protected Access. Its grandparent WEP, from 1999, can be broken in minutes. If an old router still offers WEP, skip it.',
		'If you like, switch your router between Open, WPA2 and WPA3, and see what the stranger outside gets.'
	],
	reactions: {
		open: 'Open. The stranger joined like any guest and reads whatever is not locked by the site. Fine for a park, never for home.',
		wpa2: 'WPA2. He only sees scrambled waves, but he saved a phone joining and is guessing at home. With a long password, he will be guessing for years.',
		wpa3: 'WPA3. Scrambled, and nothing worth taking home. Each guess must knock on your router, one by one. Pick this whenever your devices support it.'
	},
	steps: [
		{
			title: 'Radio waves',
			body: 'Your router turns data into radio waves that spread in every direction. Walls make them weaker, they do not stop them.'
		},
		{
			title: 'Anyone can listen',
			body: 'Any device in range can pick up the waves. Hearing them is easy. Understanding them depends on the lock.'
		},
		{
			tag: 'Open',
			title: 'No lock at all',
			body: 'No password and no scrambling on the WiFi. Whatever the site itself does not lock can be read by anyone nearby.'
		},
		{
			tag: 'WPA2',
			title: 'A lock made from your password',
			body: 'Everything is scrambled with a key built from your WiFi password. Safe with a long password, weak with an easy one.'
		},
		{
			tag: 'WPA3',
			title: 'A lock you cannot crack at home',
			body: 'Recording a phone joining gives the stranger nothing useful. He would have to guess live against your router, very slowly.'
		},
		{
			title: 'Guest network',
			body: 'A second WiFi name on the same router. Guests get internet, but your own devices are out of their reach.'
		},
		{
			tag: 'Remember it',
			title: 'Bigger number, stronger lock',
			body: 'Open, then WPA2, then WPA3. Pick the highest one all your devices support, and give it a long password.'
		}
	],
	homeLabel: 'Your home',
	routerLabel: 'Router',
	laptopLabel: 'Laptop',
	tvLabel: 'TV',
	guestLabel: 'Guest WiFi',
	snooperLabel: 'Stranger outside',
	modes: { open: 'Open', wpa2: 'WPA2', wpa3: 'WPA3' },
	saferLabel: 'safer',
	pickLabel: 'Router security',
	snoop: {
		idle: ['', ''],
		listen: ['catching waves', 'from your house'],
		open: ['reading it all', 'chat "see you at 7"'],
		wpa2: ['scrambled noise', 'saved a join, guessing'],
		wpa3: ['scrambled noise', 'nothing to take home']
	}
};

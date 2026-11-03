import type { TroubleshootText } from './types';

export const en: TroubleshootText = {
	title: 'Network troubleshooting',
	intro: [
		'nimbus.com will not open. Is it the WiFi? The router? The site itself? Many people panic and restart everything at random. Sometimes it works, but nobody learns why.',
		'A network is built in steps, each one standing on the one below. The <b>cable</b> carries the signal, the <b>WiFi</b> joins you to the router, the router gives you an <b>IP address</b>, the <b>gateway</b> (your router again) takes you out to the internet, <b>DNS</b> turns names into addresses, and only then does the <b>site</b> answer.',
		'When a lower step breaks, everything above it breaks too. No WiFi means no address, no address means no DNS, and at the very top the site fails. So "the site will not open" tells you almost nothing about where the problem is.',
		'That is why people troubleshoot <b>bottom up</b>. Check the lowest step first, then climb. The first step that fails is the real culprit, everything above it is just a victim.',
		'[fyi] Every check uses a tool you may already know. A [[ping|network/ping]] to the router tests the gateway, nslookup asks [[DNS|networking/dns]], and an address starting with 169.254 means [[DHCP|network/dhcp]] never handed you one.',
		'There is one hidden fault in this setup. Run the checks, find the lowest red step, then blame the right one.'
	],
	reactions: {
		ok: 'Green, this step works. So the trouble is somewhere above it, move one step up.',
		fail: 'Red. Careful though, a broken step lower down makes everything above it fail too. Is every step under this one green? Then you found it.',
		skip: 'You jumped ahead. That result can fool you, because if something lower is broken this one fails too. Start at the bottom and climb.',
		wrong:
			'Not quite. This one is red only because something further down is broken. Look for the lowest red step.',
		solved:
			'Found it and fixed it! Going bottom up, the first red step you meet is the real cause. Try a new case, the fault moves around.'
	},
	caseLabel: 'Case {n}',
	symptom: 'nimbus.com will not open on your laptop',
	fixedSymptom: 'nimbus.com opens again',
	checkBtn: 'Check',
	blameBtn: 'This is it',
	newCase: 'New case',
	okTag: 'ok',
	failTag: 'broken',
	bottomLabel: 'start here',
	checks: {
		cable: {
			name: 'Cable',
			how: 'look at the router lights',
			ok: 'Power and internet lights are on',
			fail: 'The internet light is off'
		},
		wifi: {
			name: 'WiFi',
			how: 'look at the WiFi icon',
			ok: 'Connected to NimbusHome',
			fail: 'Not connected, password rejected'
		},
		ip: {
			name: 'IP address',
			how: 'ipconfig',
			ok: 'IPv4 192.168.1.23',
			fail: 'IPv4 169.254.37.12, made up by the laptop itself'
		},
		gateway: {
			name: 'Gateway',
			how: 'ping 192.168.1.1',
			ok: 'Reply from the router in 2 ms',
			fail: 'Request timed out'
		},
		dns: {
			name: 'DNS',
			how: 'nslookup nimbus.com',
			ok: 'nimbus.com is at 76.76.21.21',
			fail: 'Cannot find nimbus.com'
		},
		site: {
			name: 'Website',
			how: 'open nimbus.com',
			ok: 'The page loads',
			fail: 'This site cannot be reached'
		}
	},
	fixes: {
		cable:
			'The internet cable behind the router had slipped out. You pushed it back in until it clicked.',
		wifi: 'Someone changed the WiFi password. You typed the new one and the laptop joined again.',
		ip: 'The router stopped handing out addresses, so the laptop made one up. A router restart fixed it.',
		gateway: 'The router had frozen. You restarted it, and it answered again.',
		dns: 'The DNS server your laptop used was down. You switched to another one, like 1.1.1.1.',
		site: 'Your whole road was fine, the nimbus.com server itself was down. Nothing to fix at home, so you told the nimbus team.'
	}
};

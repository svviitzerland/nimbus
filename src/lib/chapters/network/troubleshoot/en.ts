import type { TroubleshootText } from './types';

export const en: TroubleshootText = {
	title: 'Network troubleshooting',
	intro: [
		'nimbus.com will not open. Is it the WiFi? The router? The site itself? Many people panic and restart everything at random. Sometimes it works, but nobody learns why.',
		'A home network is built like a little tower of floors, each one standing on the one below. The <b>cable</b> carries the signal, <b>WiFi</b> joins you to the router, the router gives you an <b>IP address</b>, the <b>gateway</b> (your router again) takes you out to the internet, <b>DNS</b> turns names into addresses, and only then does the <b>website</b> answer.',
		'When a lower floor breaks, everything above it breaks too. Pull the cable and look, every floor above turns red. So "the site will not open" tells you almost nothing about where the problem really is.',
		'That is why people check <b>bottom up</b>. Watch the tower. Cable, fine. WiFi, fine. IP address, fine. Gateway, no answer. Stop right there.',
		'The first red floor is the <b>culprit</b>. DNS and the website above it are only <b>victims</b>, they fail because the floor under them is broken. Poking at them would be a waste of time.',
		'So we fix only the gateway. The router had frozen, a restart brings it back, and every floor above turns green by itself.',
		'[ingat] Start from the cable, end at the website. The first red floor on the way up is the one to fix.',
		'[fyi] Every check uses a tool you may already know. A [[ping|network/ping]] to the router tests the gateway, nslookup asks [[DNS|networking/dns]], and an address starting with 169.254 means [[DHCP|network/dhcp]] never handed you one.',
		'Want to play detective? Tap the button for a new broken network and check the floors from the bottom. Or just carry on, it is optional.'
	],
	reactions: {
		start: 'A new fault is hiding somewhere. Start with the cable at the bottom.',
		ok: 'Green, this floor works. So the trouble is higher up, check the next one.',
		skip: 'Careful, you skipped a floor. A red result up here can be a victim of something lower. Check the floors below first.',
		solved:
			'Found it! Every floor under it is green, so this is the real culprit. Fixed, and the whole tower is green again.'
	},
	steps: [
		{
			title: 'The symptom',
			body: 'All you see is the top floor failing, the website will not load. The real cause could be on any floor below it.'
		},
		{
			title: 'Six floors',
			body: 'Cable, WiFi, IP address, gateway, DNS, website. Each floor needs every floor under it to work.'
		},
		{
			title: 'Falling together',
			body: 'One broken floor turns everything above it red too. Many red lights, but only one real problem.'
		},
		{
			tag: 'Bottom up',
			title: 'Climbing the checklist',
			body: 'Check the lowest floor first, then move up one at a time. Stop at the first one that fails.'
		},
		{
			title: 'Culprit and victims',
			body: 'The first red floor is the <b>culprit</b>. The red floors above it are <b>victims</b>, they heal once the culprit is fixed.'
		},
		{
			title: 'One fix',
			body: 'Restarting the frozen router fixes the gateway, and DNS and the website come back without touching them.'
		},
		{
			tag: 'Remember it',
			title: 'Cable first, website last',
			body: 'Start from the cable, end at the website. The first red on the way up is the culprit.'
		},
		{
			tag: 'Your turn',
			title: 'Find the culprit',
			body: 'Tap the floors from the bottom up. The first red one is the fault.'
		}
	],
	pageError: 'This site cannot be reached',
	culpritTag: 'culprit',
	victimTag: 'victim',
	startHere: 'start here',
	endHere: 'end here',
	playBtn: 'Find a fault yourself',
	newCase: 'Another case',
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

import type { RouterHotspotText } from './types';

export const en: RouterHotspotText = {
	title: 'Hotspot',
	intro: [
		'The office opens a little cafe corner for guests. Guests want WiFi, but you do not want strangers on the office network, and you do not want one guest camping on it all day.',
		'A guest access point (the box that makes the WiFi) is plugged into <b>ether3</b>, a port of its own. So guests get their own network, 10.5.50.x, well away from the office laptops on ether2.',
		'Now the <b>hotspot</b>. When a phone joins, the first page it opens is swapped for a <b>login page</b> (people call it a captive portal). Only after logging in does the internet open up.',
		'One command sets it all up. <b>/ip hotspot setup</b> is a wizard that asks a few questions and builds everything. Watch it answer them, and watch the guest phone.',
		'Logins come from <b>vouchers</b>, a username and password on a little slip, usually with a time limit. Buy a coffee, get one hour of WiFi. Here the terminal prints one with <b>limit-uptime=1h</b>.',
		'A guest types the voucher into the login page, and the internet opens. The router starts counting down the hour by itself, and lists the guest as <b>active</b>.',
		'An hour later (we sped it up for you), time is up. The router sends the phone back to the login page all on its own. No staff had to walk over and switch anything off.',
		'[ingat] A voucher is a cinema ticket. No ticket, no seat, and when the film ends you walk out, no matter how comfy the chair is.',
		'[fyi] The hotspot quietly reuses what you built before. It runs its own [[DHCP server|netlab/router-ip]] for guest addresses and a [[masquerade|netlab/router-nat]] rule to take them online. The wizard just does it all in one go.',
		'Your turn. See the vouchers and how much of their hour is used with <b>/ip hotspot user print</b>.'
	],
	reactions: {
		users:
			'There is kopi42, limit-uptime 1h, and uptime 1h. Its hour is all used up, so the next coffee means a new voucher. This is how plenty of RT RW nets sell WiFi.',
		active:
			'Nobody is online right now, the only guest’s hour ran out. Peek at the vouchers with <b>/ip hotspot user print</b>.',
		error:
			'RouterOS did not get that one. Check the spelling, or tap the suggestion and watch it get typed.'
	},
	steps: [
		{
			title: 'WiFi for guests',
			body: 'Guests need internet, but not the office network, and not forever.'
		},
		{
			tag: 'ether3',
			title: 'A separate door',
			body: 'The guest access point has its own port and its own network, <b>10.5.50.x</b>, apart from the office.'
		},
		{
			tag: 'captive portal',
			title: 'The login page',
			body: 'Every phone on the guest WiFi lands on a login page first. No login, no internet.'
		},
		{
			tag: 'hotspot setup',
			title: 'One wizard',
			body: 'The wizard picks the port, the guest addresses, and a name for the login page, then builds it all.'
		},
		{
			tag: 'user',
			title: 'A voucher',
			body: 'A hotspot <b>user</b> is a voucher. <b>limit-uptime=1h</b> means it works for one hour of being online.'
		},
		{
			tag: 'active',
			title: 'Online',
			body: 'Once logged in, the guest shows up in the <b>active</b> list with the time left on their voucher.'
		},
		{
			title: 'Time is up',
			body: 'When the hour runs out, the router logs the guest out and the login page comes back.'
		},
		{
			tag: 'Make it stick',
			title: 'A cinema ticket',
			body: 'No voucher, no WiFi. When the time ends, back to the login page.'
		},
		{
			title: 'Built from old pieces',
			body: 'A pool, a DHCP server, and a masquerade rule, the same parts you met in the earlier labs.'
		},
		{
			title: 'Your turn',
			body: '<b>uptime</b> is how long a voucher has been used, <b>limit-uptime</b> is how long it may be used.'
		}
	],
	ispLabel: 'ISP',
	apLabel: 'Guest WiFi',
	wifiName: 'nimbus cafe',
	phone: {
		searching: 'Looking for WiFi',
		loginTitle: 'nimbus cafe WiFi',
		loginSub: 'Type the code from your voucher',
		user: 'Username',
		pass: 'Password',
		loginBtn: 'Log in',
		welcome: 'Hi {user}, you are online',
		left: 'Time left',
		siteOk: 'nimbus.com loaded',
		expired: 'Your hour is up, grab another voucher'
	},
	inputLabel: 'command',
	tryLabel: 'Try this',
	termHint: '# your turn, type the command and press Enter',
	hintTry: '# try {cmd}',
	didYouMean: '# maybe you meant {word}',
	hintSetup: '# the wizard also made a pool, a DHCP server, and a masquerade rule',
	hintVoucher: '# voucher slip, user kopi42, password 1234, one hour'
};

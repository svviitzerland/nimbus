import type { RouterHotspotText } from './types';

export const en: RouterHotspotText = {
	title: 'Hotspot',
	intro: [
		'The office opens a little cafe corner for guests. Guests want WiFi, but you do not want strangers on the office network, and you do not want one guest camping on it all day.',
		'Enter the <b>hotspot</b>. When a phone joins, the first page it opens gets redirected to a <b>login page</b> (people call it a captive portal). Only after logging in does the internet open up.',
		'Logins come from <b>vouchers</b>, a username and password on a little slip, usually with a time limit. Buy a coffee, get one hour of WiFi. Plenty of RT RW nets sell exactly these.',
		'The guest access point is plugged into <b>ether3</b>, a port of its own, so guests get their own network (10.5.50.x), well away from the office laptops on ether2.',
		'[fyi] The hotspot quietly reuses what you built in the earlier labs. It runs its own [[DHCP server|netlab/router-ip]] for guest addresses and a [[masquerade|netlab/router-nat]] rule to take them online. The wizard just sets it all up in one go.',
		'Your turn. Run <b>/ip hotspot setup</b> on ether3, make a one hour voucher, then pick up the guest phone and log in.'
	],
	reactions: {
		setup:
			'The hotspot is up on ether3. Behind the scenes the wizard made an address pool, a DHCP server, a masquerade rule, and the login page. That is a whole lab in one command.',
		wizardBad:
			'The wizard did not like that answer. Read the hint line, the guest access point sits on <b>ether3</b>.',
		noHotspot:
			'The phone joined the WiFi, but nobody on ether3 answers yet, so there is no address and no internet. Set up the hotspot first.',
		portal:
			'The phone tried to open a page and landed on the login page instead. That is the captive portal, nobody gets through without a voucher.',
		badLogin:
			'Wrong username or password. Check the voucher you made, the terminal printed it right after you added it.',
		usedUp: 'That voucher has used up its hour. Make a new one, just like selling another coffee.',
		voucher:
			'Voucher printed. One hour of WiFi for whoever has this username and password. Now grab the phone and join the cafe WiFi.',
		otherLimit:
			'A voucher with a different time limit, that works too. Cafes often sell a few sizes. Now grab the phone and join the cafe WiFi.',
		noLimit:
			'That user has no limit-uptime, so it would never run out. Fine for staff, not for guests. Add one with <b>limit-uptime=1h</b>.',
		online:
			'Logged in, the clock is running. nimbus.com loads, and the router counts down the voucher’s hour on its own.',
		onlineNoLimit:
			'Logged in, but with a voucher that never runs out. It works, though a guest could now stay forever. Make one with limit-uptime=1h too.',
		neverEnds:
			'An hour passed and the session is still going. That is what a voucher without a limit does.',
		expired:
			'Time is up! The router kicked the phone back to the login page all by itself. No staff had to walk over and switch anything off.',
		active:
			'This is the list of guests online right now, with how long they have been on and how much time they have left.',
		noActive: 'Nobody is logged in right now. Log the phone in first.',
		error:
			'RouterOS did not get that one. Check the spelling, or type <b>?</b> to see what is there. Help can also type it for you.',
		done: 'The cafe WiFi works, vouchers and all. Across these labs you set up addresses, NAT, a firewall, fair queues, and a hotspot, a real small office network from scratch.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Set up a hotspot on ether3',
		'Make a one hour voucher',
		'Log the guest phone in',
		'See who is online'
	],
	hintBtn: 'Help',
	doneNote: 'The cafe WiFi is open for business',
	ispLabel: 'ISP',
	inputLabel: 'command',
	termHint: '# type a RouterOS command, then press Enter',
	hintUnknown: '# that command does not exist, type ? to see the menu',
	didYouMean: '# maybe you meant {word}',
	apLabel: 'Guest WiFi',
	wifiName: 'Nimbus Cafe',
	phone: {
		joinBtn: 'Join {wifi} WiFi',
		joining: 'Connecting',
		noNet: 'Connected, but no internet',
		retry: 'Try again',
		loginTitle: 'Nimbus Cafe WiFi',
		loginSub: 'Type the voucher from your receipt',
		user: 'Username',
		pass: 'Password',
		loginBtn: 'Log in',
		bad: 'Wrong username or password',
		used: 'This voucher has used up its time',
		welcome: 'You are online, {user}',
		left: 'Time left',
		siteOk: 'nimbus.com loads fine',
		skip: 'Skip ahead one hour',
		expired: 'Your time is up. Another coffee?'
	},
	hintIface: '# ether1 is the ISP and ether2 the office, the guest access point is on ether3',
	hintWizard: '# one question per line, press Enter to keep the value shown',
	hintNeeds: '# this command still needs {keys}',
	hintUptime: '# give guests a time limit, like limit-uptime=1h',
	hintNoActive: '# nobody is logged in right now',
	hintNoHotspot: '# no hotspot yet, run /ip hotspot setup',
	hintVoucher: '# voucher ready, username {user}, password {pass}'
};

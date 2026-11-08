import type { LaptopServerText } from '../../types';

export const en: LaptopServerText = {
	title: 'Your laptop can be a server too',
	intro: [
		'A laptop can act as a server. Run an application that accepts requests, then other devices can reach it when its address and access settings allow.',
		'At home that is dead easy. As long as they share one WiFi, your friend’s phone can open the site running on your laptop. Developers work like this every day, it is called running <b>locally</b>, only inside your own home network.',
		'Serving internet visitors requires network access and a running application. A home IP address may change, upload capacity is limited, and a sleeping laptop stops serving requests.',
		'Your laptop is sitting at home here, with your friend’s phone on the same WiFi. Start from there, then open the laptop to the internet and watch the problems arrive one by one.',
		'[ingat] A laptop can serve requests. Being a server is a job, not a box shape.'
	],
	reactions: {
		lan: 'See, it works. On the same WiFi your laptop really is a server for your friend’s phone. It is that simple.',
		public:
			'The laptop now accepts internet requests in this simulation. Test an IP change, sleep mode, and limited upload capacity.',
		ip: 'Your ISP just changed your home IP, and your site’s address changed with it. Every visitor holding the old address is instantly lost.',
		sleep:
			'The laptop is asleep and the application no longer serves requests. A server must remain active while its service is expected to be available.',
		slow: 'Home internet has a tiny upload allowance. The moment visitors crowd in, everyone gets the slow lane.'
	},
	laptopLabel: 'Your laptop',
	friendLabel: 'Friend’s phone',
	worldLabel: 'Internet visitors',
	houseLabel: 'Your home',
	lanLabel: 'same WiFi',
	ipLabel: 'Home IP',
	tryLan: 'Try from the friend’s phone',
	goPublic: 'Open to the internet',
	probIp: 'ISP changes the IP',
	probSleep: 'Laptop closes',
	probSlow: 'Visitors crowd in',
	recover: 'Recover',
	statusLocal: 'Running on home WiFi',
	statusOk: 'Site is up',
	statusLost: 'Old address unreachable',
	statusDown: 'Site is down',
	statusSlow: 'Site is slow',
	noteIdle: 'Your friend’s phone is on the same WiFi',
	noteLan: 'One WiFi, opens right up. Next, the internet.',
	notePublic: 'The site is now accessible from the internet. Try the faults below.',
	noteIp: 'The IP changed; the old address no longer works',
	noteSleep: 'The laptop entered sleep mode; the service stopped',
	noteSlow: 'Upload capacity is limited; requests queue up'
};

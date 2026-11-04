import type { LaptopServerText } from '../../types';

export const en: LaptopServerText = {
	title: 'Your laptop can be a server too',
	intro: [
		'Here is a little secret, a server is not a magical box. The laptop you are using right now can be a server too. Run your app on it, and other computers can open it.',
		'At home that is dead easy. As long as they share one WiFi, your friend’s phone can open the site running on your laptop. Developers work like this every day, it is called running <b>locally</b>, only inside your own home network.',
		'Trouble starts when the whole world should be able to open it. Your home <b>IP</b> address (its number on the internet) is on loan from your ISP, your internet provider, and can change at any moment, so your site’s address changes with it. The laptop also has to stay on 24 hours a day, and home internet has a tiny upload allowance that chokes the moment visitors pour in.',
		'Your laptop is sitting at home here, with your friend’s phone on the same WiFi. Start from there, then open the laptop to the internet and watch the problems arrive one by one.'
	],
	reactions: {
		lan: 'See, it works. On the same WiFi your laptop really is a server for your friend’s phone. It is that simple.',
		public:
			'Now people from anywhere can reach your laptop. Cool for a moment, until the problems start arriving. Summon them one by one.',
		ip: 'Your ISP just changed your home IP, and your site’s address changed with it. Every visitor holding the old address is instantly lost.',
		sleep:
			'Laptop closed, site completely dead. A server has to stay on around the clock, and laptops were never built for that.',
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
	statusLost: 'Visitors lost',
	statusDown: 'Site is down',
	statusSlow: 'Site is slow',
	noteIdle: 'Your friend’s phone is on the same WiFi',
	noteLan: 'One WiFi, opens right up. Next, the internet.',
	notePublic: 'The world can now drop by your laptop, and the problems are waiting.',
	noteIp: 'The address changed, old visitors lose the trail',
	noteSleep: 'Close the lid for a moment and every visitor is cut off',
	noteSlow: 'Tiny home upload, the queue piles up'
};

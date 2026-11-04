import type { RouterIntroText } from './types';

export const en: RouterIntroText = {
	title: 'What is MikroTik',
	intro: [
		'At home, at the office, or in a neighbourhood network (in Indonesia people call it an RT RW net), the internet does not reach every laptop by itself. One small box in the middle hands it out to everyone, the <b>router</b>.',
		'A router brand you will meet a lot is <b>MikroTik</b>, from Latvia. It runs its own system called <b>RouterOS</b>. You can click around in an app called Winbox, or type in its terminal, the same two ways as [[CLI vs GUI|foundations/cli-gui]]. Watch, the terminal asks the router its name.',
		'Right now it is just called MikroTik, like every new one out of the box. Let us give it a real name, so one day, with ten routers, you always know which one you are typing into. Keep an eye on the prompt.',
		'Now look at the front of the box. Those holes are <b>physical ports</b>, where LAN cables plug in. RouterOS calls them ether1 to ether5, and the <b>R</b> in the list means running, a live cable is plugged in.',
		'Careful, these are not the numbered [[ports|foundations/port]] like 80 or 443. Those are <b>logical ports</b>, doors inside a service. ether2 is a hole you can touch, 443 is only a number a web server listens on.',
		'ether1 takes the cable from the ISP (your internet provider), and ether2 goes to the office. Give ether2 an address, and it becomes the door every office laptop walks through to reach the internet.',
		'[ingat] Read a RouterOS command like a street address. First the place (/ip address), then the job (add), then the details (address= and interface=).',
		'Your turn. Ask the router for its address list with <b>/ip address print</b>. Type it yourself, or tap the suggestion.'
	],
	reactions: {
		addrPrint:
			'There it is, your 192.168.88.1 on ether2. The line marked <b>D</b> is dynamic, the ISP handed that address to ether1 all by itself.',
		interfaces:
			'The port list again. ether1 and ether2 have the R, the other three holes are still empty. Want the addresses? Try <b>/ip address print</b>.',
		identity: 'Still called nimbus. Now ask for the addresses with <b>/ip address print</b>.',
		error:
			'RouterOS did not get that one. Check the spelling, or just tap the suggestion and watch it get typed.'
	},
	steps: [
		{
			title: 'The box in the middle',
			body: 'A <b>router</b> joins two networks. Here it joins the internet from the ISP with the office.'
		},
		{
			tag: 'RouterOS',
			title: 'Talking to the router',
			body: 'Every command starts with a menu, like <b>/system identity</b>, and ends with a job, like <b>print</b> (show me).'
		},
		{
			tag: 'identity',
			title: 'A name on the door',
			body: 'The identity is the name in the prompt, <b>[admin@nimbus]</b>. It changes nothing in the traffic, it only keeps you from typing into the wrong router.'
		},
		{
			tag: 'interface',
			title: 'Physical ports',
			body: 'Each port is an <b>interface</b>. <b>R</b> means running, a cable is in and alive. Here that is ether1 and ether2.'
		},
		{
			title: 'Two kinds of port',
			body: 'A <b>physical</b> port is a hole for a cable (ether2). A <b>logical</b> port is a number inside a service (443 for HTTPS).'
		},
		{
			tag: 'ip address',
			title: 'The office door',
			body: '<b>192.168.88.1/24</b> on ether2 means the router answers at .1, and the whole 192.168.88.x street is the office.'
		},
		{
			tag: 'Remember it',
			title: 'Place, job, details',
			body: '<b>/ip address</b> is the place, <b>add</b> is the job, the <b>key=value</b> pairs are the details.'
		},
		{
			title: 'Your turn',
			body: '<b>print</b> works in almost every menu. It is the safest command there is, it only looks.'
		}
	],
	ispLabel: 'ISP',
	laptopLabel: 'Office laptop',
	inputLabel: 'command',
	tryLabel: 'Try this',
	termHint: '# your turn, type the command and press Enter',
	hintTry: '# try {cmd}',
	didYouMean: '# maybe you meant {word}',
	hintRunning: '# R means running, a live cable is plugged in',
	hintDynamic: '# D means dynamic, the ISP gave that one to ether1'
};

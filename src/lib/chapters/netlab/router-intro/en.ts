import type { RouterIntroText } from './types';

export const en: RouterIntroText = {
	title: 'What is MikroTik',
	intro: [
		'At home, at the office, or in a neighbourhood network (in Indonesia people call it an RT RW net), the internet does not reach every phone and laptop by itself. One small box sits in the middle and hands it out to everyone, that box is the <b>router</b>.',
		'One router brand you will meet a lot is <b>MikroTik</b>, from Latvia. Its routers run their own system called <b>RouterOS</b>. ISPs, offices, and RT RW net owners love it because it is cheap but can do a lot.',
		'Look at the front of the box. Those holes are <b>physical ports</b>, where you plug in a LAN cable. MikroTik names them <b>ether1</b>, <b>ether2</b>, and so on, and ether1 usually takes the cable from the ISP.',
		'Careful, these are not the same as a numbered [[port|foundations/port]] like 80 or 443. Those are <b>logical ports</b>, doors inside a service. ether2 is a real hole you can touch, while 443 is just a number a web server waits on.',
		'You can control RouterOS by clicking around in an app called <b>Winbox</b>, or by typing in its terminal. The same two ways as [[CLI vs GUI|foundations/cli-gui]]. Today we type.',
		'[fyi] Cisco, Juniper, and other brands work the same way, a box with physical ports and a terminal to manage it. Only the commands are different, so what you learn here carries over.',
		'Your turn. Finish the missions, name the router nimbus, peek at its physical ports, then give ether2 an address. Stuck? Tap Help and the command gets typed for you.'
	],
	reactions: {
		identity:
			'Look at the prompt, it now says <b>[admin@nimbus]</b>. The router has a name, so when you look after many routers later you always know which one you are typing into.',
		otherName:
			'That works, RouterOS takes any name. But the mission wants it called <b>nimbus</b>, so try again with name=nimbus.',
		interfaces:
			'There they are, ether1 to ether5. The <b>R</b> means running, a cable is plugged in and alive. Only ether1 (from the ISP) and ether2 (to the laptop) have it, the other three holes are empty.',
		address:
			'ether2 has its own address now. That is the router as seen from the office side, the laptop will send everything to this address to get out to the internet.',
		wrongPort:
			'Oops, that address landed on another port. ether1 faces the ISP and the office laptop sits on <b>ether2</b>, so use interface=ether2.',
		badAddress:
			'Almost. An address is four numbers from 0 to 255 joined by dots, then a slash with the network size, like <b>192.168.88.1/24</b>.',
		addrPrint:
			'Your address is on the list. The one marked D is dynamic, the ISP handed it to ether1 all by itself.',
		error:
			'RouterOS did not get that one. Check the spelling, or type <b>?</b> to see what is there. You can also tap Help to have it typed for you.',
		done: 'All missions done! You named the router, checked its physical ports, and gave ether2 an address, just by typing. This is how ISP and office admins set up MikroTik every day.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Name the router nimbus',
		'List its physical ports',
		'Give ether2 an address',
		'Check the address list'
	],
	hintBtn: 'Help',
	doneNote: 'All missions done, the router is ready',
	ispLabel: 'ISP',
	laptopLabel: 'Office laptop',
	portsCaption: 'ether1 to ether5 are physical ports, holes for LAN cables',
	logicalCaption: 'Port 443 is not here, it is only a number inside a service',
	inputLabel: 'command',
	termHint: '# type a RouterOS command, then press Enter',
	hintUnknown: '# that command does not exist, type ? to see the menu',
	didYouMean: '# maybe you meant {word}',
	hintName: '# the mission wants name=nimbus',
	hintAddr: '# a valid address looks like 192.168.88.1/24',
	hintIface: '# the ports are ether1 to ether5',
	hintNeeds: '# this command needs address= and interface=',
	hintWrongPort: '# the office laptop is plugged into ether2',
	hintAddFirst: '# ether2 has no address yet, add one first',
	hintDynamic: '# D means dynamic, the ISP gave that one to ether1',
	hintRunning: '# R means running, a live cable is plugged in'
};

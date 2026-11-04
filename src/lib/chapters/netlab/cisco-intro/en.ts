import type { CiscoIntroText } from './types';

export const en: CiscoIntroText = {
	title: 'What is Cisco',
	intro: [
		'Walk into the server room of a bank, a campus, or a big office, and the routers and switches there very often carry one name, <b>Cisco</b>. Every Cisco box runs a system called <b>IOS</b> (nothing to do with the iPhone).',
		'Look at the front of this router. The holes are <b>physical ports</b>, where real cables plug in. Cisco calls them <b>GigabitEthernet0/0</b>, <b>GigabitEthernet0/1</b>, and so on. Here 0/0 goes to the ISP and 0/1 goes to the office.',
		'[fyi] Do not mix them up with a numbered [[port|foundations/port]] like 443. That one is a <b>logical port</b>, a door inside a program. GigabitEthernet0/1 is a hole you can touch, 443 is just a number a web server listens on.',
		'You talk to IOS by typing. The first prompt is <b>Router&gt;</b>, and that little arrow means you may only look around. Watch it list its ports.',
		'To do more, you climb one step with <b>enable</b>. The prompt turns into <b>Router#</b>, and the hash means you are the boss now.',
		'Changing things needs one more step, <b>configure terminal</b>. The prompt says <b>(config)#</b>, so we give the router its name, nimbus. Watch the prompt change right away.',
		'[ingat] Read the end of the prompt. <b>&gt;</b> means you can only look. <b>#</b> means you are the boss. <b>(config)#</b> means you are changing things. And <b>end</b> always walks you back to #.',
		'One catch. Changes live in the <b>running config</b>, in memory, and a power cut wipes them. <b>copy running-config startup-config</b> keeps them for the next boot. Admins usually type the short version, <b>wr</b>.',
		'[fyi] Same idea, different words. On [[MikroTik|netlab/router-intro]] the ports are ether1 and ether2, and the name is set with /system identity. Cisco says GigabitEthernet0/0 and hostname. Learn one and the other feels familiar. Cisco is also what the famous <b>CCNA</b> certificate is all about.',
		'Your turn. Type <b>show running-config</b> (or just <b>sh run</b>) and find the name you gave the router.'
	],
	reactions: {
		task: 'There it is, the whole configuration, line by line. <b>hostname nimbus</b> sits near the top, and every command you type in config mode ends up in this list.',
		reloaded:
			'The router rebooted! Because you saved, it still says nimbus. Without saving it would be called Router again, that is what saving is for.',
		needEnable: 'That command needs the boss prompt. Type <b>enable</b> first, then try again.',
		needConfig:
			'That one changes the router, so it only works in config mode. Type <b>conf t</b> first.',
		needDo:
			'You are in config mode, where show commands do not live. Put <b>do</b> in front, like <b>do sh run</b>, or type <b>end</b> first.',
		error:
			'IOS did not understand that one. The little ^ points at the word it tripped on. Type <b>?</b> to see what fits.'
	},
	steps: [
		{
			title: 'Cisco and IOS',
			body: 'Cisco has built network gear since 1984. <b>IOS</b> is the software inside each box, and you steer it by typing commands in a console.'
		},
		{
			title: 'Physical ports',
			body: '<b>G0/0</b> is short for GigabitEthernet0/0. The first 0 is the slot, the second is the port number. The light blue hole on the right is the console, for a setup cable.'
		},
		{
			title: 'Logical is not physical',
			body: 'A physical port carries a cable. A logical port like 443 is a number inside software. Same word, two different worlds.'
		},
		{
			title: 'User mode, Router&gt;',
			body: '<code>show ip interface brief</code> lists every port. <b>up</b> means a cable is in and working. <b>administratively down</b> means it is switched off on purpose, Cisco ships router ports switched off.'
		},
		{
			title: 'Privileged mode, Router#',
			body: '<code>enable</code> unlocks the commands that can see everything, like the whole configuration. In a later lesson we put a password on this step.'
		},
		{
			title: 'Config mode, (config)#',
			body: '<code>configure terminal</code> means configure from this keyboard. <code>hostname nimbus</code> renames the router, and the prompt follows instantly.'
		},
		{
			title: 'Three prompts',
			tag: 'Remember it',
			body: '<b>&gt;</b> look, <b>#</b> boss, <b>(config)#</b> change. Every line you type starts from one of these.'
		},
		{
			title: 'Running versus startup',
			body: 'The <b>running config</b> sits in RAM, like papers on a desk. The <b>startup config</b> sits in NVRAM, a drawer that survives a power cut. Saving copies the desk into the drawer.'
		},
		{
			title: 'Shortcuts',
			body: 'IOS accepts a shortened word as long as no other command starts the same way, so <code>conf t</code>, <code>sh ip int br</code>, and <code>wr</code> all work. Type <code>?</code> anytime to see what fits.'
		},
		{
			title: 'Your turn',
			tag: 'Try it',
			body: 'Tap the console, type <code>sh run</code>, and press Enter. Look for the line <code>hostname nimbus</code> near the top.'
		}
	],
	modes: { look: 'look', boss: 'boss', change: 'change', port: 'one port' },
	portsCaption: 'Gi0/0 to the ISP, Gi0/1 to the office, real holes for real cables',
	logicalCaption: 'Port 443 is not on this box, it is a number inside software',
	ramTitle: 'running config',
	ramSub: 'RAM, the desk',
	nvramTitle: 'startup config',
	nvramSub: 'NVRAM, the drawer',
	unsaved: 'not saved yet',
	saved: 'saved',
	ispLabel: 'ISP',
	inputLabel: 'command',
	doneNote: 'Done',
	termHint: '! Nim types here first, your turn comes at the end',
	hintInvalid: '! IOS got lost at the ^ mark, check that word or type ? to see what fits there',
	hintIncomplete: '! almost, the command needs more words, add a space and ? to see them',
	hintAmbiguous: '! too short, more than one command starts like that, add a letter or two',
	hintUnknown: '! that is not a command here, type ? to see the list',
	didYouMean: '! maybe you meant {word}',
	hintNeedEnable: '! that needs the boss prompt, type enable first',
	hintNeedConfig: '! that changes the router, type conf t first',
	hintDo: '! you are in config mode, put do in front, like do sh run',
	hintSub: '! that one goes inside an interface, pool, or line, enter it first',
	hintMask: '! Cisco wants the mask spelled out, like 255.255.255.0',
	hintWild: '! careful, a wildcard is the mask flipped, 255.255.255.0 becomes 0.0.0.255'
};

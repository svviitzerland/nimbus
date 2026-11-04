import type { CiscoNatText } from './types';

export const en: CiscoNatText = {
	title: 'NAT overload',
	intro: [
		'The laptops have addresses now, but they are <b>private</b>, 192.168.88.something, house numbers that only mean something inside this office. Watch Sari try to open nimbus.com. The ISP throws the packet away.',
		'The ISP gave the office exactly one usable address, <b>10.20.30.2</b> on Gi0/0. So the router plays mailroom. Every letter going out gets the company address stamped on it, and the mailroom notes who sent it, so replies find the right desk. That trick is <b>NAT</b>, see [[What is NAT|network/nat]].',
		'First the router must know which side is which. Gi0/1 faces the office, so it is <b>ip nat inside</b>. Gi0/0 faces the internet, so it is <b>ip nat outside</b>. Look at the little tags under the ports.',
		'Next, who is allowed to be translated? We write that in an <b>access list</b>, a short list of addresses. access-list 1 permits the whole office, 192.168.88.0 with <b>0.0.0.255</b>.',
		'[ingat] That 0.0.0.255 is a <b>wildcard</b>, the subnet mask flipped around. 0 means this part must match, 255 means anything goes. So 255.255.255.0 becomes 0.0.0.255.',
		'Now the rule that ties it together. Translate the inside sources in list 1 into the address of g0/0, and <b>overload</b> it. Overload means many laptops share that one address, told apart by port numbers.',
		'Everyone opens nimbus.com at once. Watch the label on each packet change at the router, and watch a new line appear in the table for every laptop.',
		'IOS shows the same table with <b>show ip nat translations</b>. Inside local is the laptop’s own address, inside global is what the internet sees.',
		'[fyi] On [[MikroTik|netlab/router-nat]] this whole lesson is one masquerade rule. Same idea, different words. And in the cloud, a NAT gateway does this job for a private network.',
		'Your turn. Ask the router for its table yourself, with the short version <b>sh ip nat tr</b>.'
	],
	reactions: {
		task: 'There they are. Three laptops on the left, one public address on the right, each with its own port number. That port is how the router knows which desk a reply belongs to.',
		cleared:
			'You wiped the table. Nothing breaks, the next time someone opens a page the router simply writes a new line.',
		needEnable: 'That needs the boss prompt. Type <b>enable</b> first.',
		needConfig: 'That changes the router, type <b>conf t</b> first.',
		needDo:
			'In config mode, put <b>do</b> in front, like <b>do sh ip nat tr</b>, or type <b>end</b> first.',
		needSub:
			'That command goes inside an interface. Enter it first, for example <b>interface g0/1</b>.',
		wild: 'Careful, an access list wants a wildcard, the flipped mask. For the office that is <b>0.0.0.255</b>.',
		error:
			'IOS did not understand that one. The ^ points at the word it tripped on, and <b>?</b> shows what fits.'
	},
	steps: [
		{
			title: 'Private addresses',
			body: '192.168.x.x addresses are reused by millions of offices, so the internet never delivers to them. A packet that leaves with one gets dropped.'
		},
		{
			title: 'The mailroom trick',
			body: 'NAT means Network Address Translation. The router swaps the private sender for its public one on the way out, and swaps it back on the way in.'
		},
		{
			title: 'Inside and outside',
			body: '<code>ip nat inside</code> on the office port, <code>ip nat outside</code> on the internet port. Think of your front door, inside is home, outside is the street.'
		},
		{
			title: 'Access list 1',
			body: '<code>access-list 1 permit 192.168.88.0 0.0.0.255</code> matches every address from 192.168.88.0 to 192.168.88.255.'
		},
		{
			title: 'Wildcards',
			tag: 'Make it stick',
			body: 'Flip the mask. <b>0</b> must match, <b>255</b> anything. 255.255.255.0 becomes <b>0.0.0.255</b>.'
		},
		{
			title: 'Overload',
			body: '<code>ip nat inside source list 1 interface g0/0 overload</code>. Inside sources in list 1 get the address of g0/0, shared by everyone.'
		},
		{
			title: 'Many to one',
			body: 'Every laptop leaves as 10.20.30.2. Only the port number tells them apart, so it is also called PAT (Port Address Translation).'
		},
		{
			title: 'The table',
			body: '<b>Inside local</b> is the laptop, <b>inside global</b> is its public face. <b>Outside</b> is the website, here nimbus.com on port 443.'
		},
		{
			title: 'Same idea elsewhere',
			body: 'MikroTik calls it masquerade, home routers do it silently, and cloud networks rent it as a NAT gateway.'
		},
		{
			title: 'Your turn',
			tag: 'Try it',
			body: 'Tap the console and type <code>sh ip nat tr</code>. Match each laptop’s address to its port.'
		}
	],
	tagFrom: 'from {ip}',
	tagTo: 'to {ip}',
	tagDropped: 'private, dropped',
	insideTag: 'inside',
	outsideTag: 'outside',
	tableTitle: 'NAT table',
	thLocal: 'inside local',
	thGlobal: 'inside global',
	tableEmpty: 'Empty, nobody went out through NAT yet',
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

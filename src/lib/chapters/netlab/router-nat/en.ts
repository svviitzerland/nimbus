import type { RouterNatText } from './types';

export const en: RouterNatText = {
	title: 'NAT and masquerade',
	intro: [
		'The laptops have addresses now, 192.168.88.something. But those are <b>private addresses</b>, house numbers that only mean something inside this office. Thousands of other offices use the very same ones.',
		'The internet only delivers to <b>public addresses</b>, and the ISP gave this office exactly one, sitting on ether1. Watch the terminal list both. Three laptops, one public address.',
		'So what happens if Sari opens nimbus.com right now? Her packet leaves with a private sender address. The ISP takes one look at it and throws it away, because no reply could ever find its way back.',
		'The fix is <b>NAT</b>. When a laptop sends something out, the router crosses out the laptop’s address and writes its own, like a mailroom stamping the company address on every letter. The idea is in [[What is NAT|network/nat]].',
		'Read the rule from left to right. <b>srcnat</b> means change the source (the sender), <b>out-interface=ether1</b> means only when leaving to the internet, and <b>masquerade</b> means use whatever address ether1 has right now. Watch the label on the packet change at the router.',
		'The mailroom also writes down who sent what, so when a reply comes back to the company address it goes to the right desk. That notebook is the <b>connection table</b>.',
		'[ingat] Masquerade means everyone leaves wearing the office’s name tag. From outside they all look like one office, and the doorman’s notebook knows who is behind each tag.',
		'[fyi] Sharp eyes might spot that 10.20.30.2 is a private range too. Many ISPs do NAT again on their side (called CGNAT), so the office shares an address with the neighbours as well. In the cloud, a NAT gateway does this same job for a [[VPC|networking/vpc]].',
		'Your turn. Look at the rule the office now runs on with <b>/ip firewall nat print</b>.'
	],
	reactions: {
		natPrint:
			'There it is, rule 0, chain srcnat, action masquerade. That one line is on almost every MikroTik in the world.',
		conntrack:
			'The doorman’s notebook again. Each laptop gets its own port number on the outside, so replies never get mixed up.',
		error:
			'RouterOS did not get that one. Check the spelling, or tap the suggestion and watch it get typed.'
	},
	steps: [
		{
			tag: 'private',
			title: 'House numbers inside',
			body: '<b>192.168.x.x</b>, <b>10.x.x.x</b> and <b>172.16 to 172.31</b> are private. Anyone may use them, so the internet ignores them.'
		},
		{
			tag: 'public',
			title: 'One address outside',
			body: 'The ISP gave the router one address on <b>ether1</b>. Everything the office sends out has to use it.'
		},
		{
			title: 'Lost on the way',
			body: 'A packet that leaves with a private sender gets thrown away, nobody outside could ever answer it.'
		},
		{
			tag: 'NAT',
			title: 'Swap the sender',
			body: '<b>Network Address Translation</b> rewrites the sender on the way out and puts it back on the way in.'
		},
		{
			tag: 'masquerade',
			title: 'One rule, three parts',
			body: '<b>chain=srcnat</b> (change the sender), <b>out-interface=ether1</b> (only towards the internet), <b>action=masquerade</b> (use ether1’s address).'
		},
		{
			tag: 'connection',
			title: 'The notebook',
			body: 'Every swap is written down. The <b>s</b> flag means srcnat, and the port number tells the replies apart.'
		},
		{
			tag: 'Make it stick',
			title: 'The office name tag',
			body: 'Going out, everyone wears the office tag. Coming back, the notebook says who it really was.'
		},
		{
			title: 'NAT twice',
			body: 'Behind CGNAT the office address is shared again by the ISP. In the cloud, the <b>NAT gateway</b> is this rule as a service.'
		},
		{
			title: 'Your turn',
			body: 'NAT rules live in <b>/ip firewall nat</b>, next to the firewall, because both look at every packet.'
		}
	],
	ispLabel: 'ISP',
	serverLabel: 'nimbus.com',
	tagFrom: 'from {ip}',
	tagTo: 'to {ip}',
	tagDropped: 'dropped',
	inputLabel: 'command',
	tryLabel: 'Try this',
	termHint: '# your turn, type the command and press Enter',
	hintTry: '# try {cmd}',
	didYouMean: '# maybe you meant {word}',
	hintPublic: '# ether1 holds the one address the ISP gave us',
	hintSrcnat: '# s means srcnat, the router swapped the sender'
};

import type { RouterNatText } from './types';

export const en: RouterNatText = {
	title: 'NAT and masquerade',
	intro: [
		'The laptops have addresses now, 192.168.88.something. But those are <b>private addresses</b>, house numbers that only mean something inside this office. Thousands of other offices use the very same 192.168.88.x.',
		'The internet only delivers to <b>public addresses</b>, and the ISP gave this office exactly one, sitting on ether1. Three laptops, one public address. Hmm.',
		'So the router does a trick called <b>NAT</b>. When a laptop sends something out, the router crosses out the laptop’s address and writes its own, like an office mailroom stamping the company address on every letter. The idea is in [[What is NAT|network/nat]].',
		'The mailroom also writes down who sent what. When the reply comes back to the company address, it knows which desk to carry it to. That list is the <b>connection table</b>.',
		'On MikroTik the usual way is a <b>masquerade</b> rule. Masquerade means stamp whatever address ether1 has right now, handy because many ISPs change it every now and then.',
		'[fyi] Sharp eyes might spot that 10.20.30.2 is a private range too. Many ISPs do NAT again on their side (called CGNAT), so your office shares an address with the neighbours as well. In the cloud, a NAT gateway does this same job for a [[VPC|networking/vpc]].',
		'Your turn. Open nimbus.com first and watch the packet get lost, then add the masquerade rule and try again.'
	],
	reactions: {
		noNet:
			'The packet left with sender <b>192.168.88.254</b>, a private address. The ISP threw it away, and even if it had gone further, no reply could ever find its way back to a house number that thousands of offices share.',
		noNetAgain:
			'Same story, the sender is still a private address. The router needs a srcnat rule to swap it for its own public one.',
		masq: 'Rule added. Every packet leaving through ether1 now gets the router’s public address stamped on it. Open nimbus.com again and watch the label on the packet.',
		srcnat:
			'That works too, src-nat with a fixed address. Masquerade does the same but picks the address by itself, which saves you when the ISP changes it. Now open nimbus.com again.',
		wrongChain:
			'Close, but <b>dstnat</b> is for traffic coming in (like opening a door to a server inside). Going out to the internet is <b>srcnat</b>, because we change the source.',
		wrongOut:
			'That rule watches the wrong door. The internet is out through <b>ether1</b>, so use out-interface=ether1.',
		wrongAction:
			'The rule needs a job to do. For sharing one public address, the job is <b>action=masquerade</b>.',
		loaded:
			'It loaded! At the router the sender changed from 192.168.88.254 to 10.20.30.2, the site answered that address, and on the way back the router swapped it again and handed the reply to the right laptop.',
		shared:
			'Another laptop, the same public address on the outside. That is how one ISP connection serves the whole office.',
		conntrack:
			'This is the mailroom logbook. The little <b>s</b> means srcnat, the router swapped the sender. Each laptop gets its own port number on the outside, so replies never get mixed up.',
		noConn:
			'The table is empty, no packet has gone out through NAT yet. Add the rule and open nimbus.com first.',
		error:
			'RouterOS did not get that one. Check the spelling, or type <b>?</b> to see what is there. Help can also type it for you.',
		done: 'The whole office shares one public address now. That one masquerade rule is on almost every MikroTik in the world. Next, the office needs some rules about what may pass at all.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Try opening nimbus.com',
		'Add a masquerade rule',
		'Open nimbus.com again',
		'Peek at the connection table'
	],
	hintBtn: 'Help',
	doneNote: 'The office is online through one public address',
	ispLabel: 'ISP',
	inputLabel: 'command',
	termHint: '# type a RouterOS command, then press Enter',
	hintUnknown: '# that command does not exist, type ? to see the menu',
	didYouMean: '# maybe you meant {word}',
	openBtn: 'Open nimbus.com on {name}’s laptop',
	busy: 'Packet on its way',
	serverLabel: 'nimbus.com',
	tagFrom: 'from {ip}',
	tagTo: 'to {ip}',
	tagDropped: 'private, dropped',
	capIdle: 'Three laptops with private addresses, one public address on ether1',
	capFail: '{name}’s laptop could not reach nimbus.com',
	capOk: 'nimbus.com loaded on {name}’s laptop',
	hintChain: '# going out to the internet means chain=srcnat',
	hintOut: '# the internet is behind ether1, use out-interface=ether1',
	hintAction: '# to share the public address use action=masquerade',
	hintNeeds: '# this command still needs {keys}',
	hintSrcnat: '# s means srcnat, outside these all look like {ip}',
	hintNoConn: '# nothing has gone out through NAT yet',
	hintTryAgain: '# rule added, now open nimbus.com again'
};

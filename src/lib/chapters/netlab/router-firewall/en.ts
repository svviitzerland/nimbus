import type { RouterFirewallText } from './types';

export const en: RouterFirewallText = {
	title: 'Firewall filters',
	intro: [
		'The office is online, and that brings new problems. Sari spends half the day on an online game, and anyone in the office can open Winbox and start changing the router. Watch both packets get through.',
		'Remember the [[firewall|networking/firewall]], the guard with a guest list? On MikroTik that guard is the <b>firewall filter</b>, a list of rules the router checks for every single packet.',
		'Rules live in <b>chains</b>. Traffic passing <i>through</i> the router (a laptop going to a website) is the <b>forward</b> chain. Traffic going <i>to</i> the router itself (someone opening Winbox, which knocks on port 8291) is the <b>input</b> chain.',
		'First, the game. The game server is out on the internet, so Sari’s game passes through the router, chain forward. Watch the terminal write a rule with her address, the game server’s address, and what to do.',
		'Every rule ends with an action. <b>accept</b> lets the packet through, <b>drop</b> quietly throws it away, no reply at all. Look at Sari’s game now, it waits and waits, then gives up.',
		'Now protect the router itself. Two input rules, first accept Winbox from Budi (he is the admin), then drop Winbox from everyone else. Watch the rule list light up as each packet is checked.',
		'[ingat] Rules are read from top to bottom and the first match wins, like a guard who stops reading the guest list the moment he finds your name. So the exception (Budi may) always sits above the general rule (nobody may).',
		'[fyi] Locking yourself out is a rite of passage for router admins. Add the drop before your own accept and your Winbox goes dark mid click. That is why Winbox has a <b>Safe Mode</b> button that rolls everything back if you lose the connection.',
		'Your turn. See the whole list, in order, with <b>/ip firewall filter print</b>.'
	],
	reactions: {
		filterPrint:
			'Three rules, numbered from 0. The router walks down this list for every packet and stops at the first match. Swap 1 and 2 and Budi would be locked out too.',
		error:
			'RouterOS did not get that one. Check the spelling, or tap the suggestion and watch it get typed.'
	},
	steps: [
		{
			title: 'Two problems',
			body: 'Sari’s game eats her day, and anyone can reach the router’s settings. Right now nothing stops either.'
		},
		{
			tag: 'filter',
			title: 'The guard’s list',
			body: 'The <b>firewall filter</b> is a numbered list of rules. Every packet is checked against it.'
		},
		{
			tag: 'chain',
			title: 'Through or to',
			body: '<b>forward</b> is traffic passing through the router. <b>input</b> is traffic meant for the router itself.'
		},
		{
			tag: 'forward',
			title: 'Block the game',
			body: '<b>src-address</b> is who sends (Sari), <b>dst-address</b> is where it goes (the game server).'
		},
		{
			tag: 'action',
			title: 'Accept or drop',
			body: '<b>accept</b> lets it pass. <b>drop</b> throws it away without a word, so the game just times out.'
		},
		{
			tag: 'input',
			title: 'Guard the router',
			body: 'Winbox knocks on <b>tcp port 8291</b>. Budi’s address is accepted, everyone else is dropped.'
		},
		{
			tag: 'Remember it',
			title: 'First match wins',
			body: 'Top to bottom, stop at the first match. Special cases on top, the general rule below.'
		},
		{
			tag: 'Safe Mode',
			title: 'Do not lock yourself out',
			body: 'Always add the rule that lets <b>you</b> in before the one that keeps everyone out.'
		},
		{
			title: 'Your turn',
			body: 'The number in front of each rule is its place in line. Lower numbers are checked first.'
		}
	],
	ispLabel: 'ISP',
	gameLabel: 'Game server',
	tagGame: 'game',
	tagWinbox: 'Winbox',
	rulesLabel: 'Filter rules',
	rules: ['Sari to the game, drop', 'Budi to Winbox, accept', 'Anyone to Winbox, drop'],
	inputLabel: 'command',
	tryLabel: 'Try this',
	termHint: '# your turn, type the command and press Enter',
	hintTry: '# try {cmd}',
	didYouMean: '# maybe you meant {word}',
	hintOrder: '# read from the top, the first rule that matches decides'
};

import type { RouterFirewallText } from './types';

export const en: RouterFirewallText = {
	title: 'Firewall filters',
	intro: [
		'The office is online, and that brings new problems. Sari spends half the day on an online game, and anyone in the office could open Winbox and start changing the router.',
		'Remember the [[firewall|networking/firewall]], the guard with a guest list? On MikroTik that guard is the <b>firewall filter</b>, a list of rules read from top to bottom. The first rule that matches decides, and anything no rule mentions is let through.',
		'Rules live in <b>chains</b>. Traffic passing <i>through</i> the router (a laptop going to a website) goes through the <b>forward</b> chain. Traffic going <i>to</i> the router itself (someone opening Winbox, which knocks on port 8291) goes through the <b>input</b> chain.',
		'Each rule says who it is about (the source address), where the traffic is headed (an address or a port), and what to do. <b>Accept</b> lets it through, <b>drop</b> quietly throws it away.',
		'[fyi] Locking yourself out is a rite of passage for router admins. Drop all input before allowing your own laptop, and your Winbox goes dark mid click. That is why Winbox has a <b>Safe Mode</b> button that rolls everything back if you lose the connection.',
		'Today we click, like in Winbox, and the window shows the command it types for you. Build the rules, mind their order, then run the tests until all four pass.'
	],
	reactions: {
		added:
			'Rule added at the bottom of the list. Look at the command under the window, that is exactly what Winbox sends to the router. Run the tests whenever you like.',
		mismatch:
			'That rule will never match anything. Game traffic passes <i>through</i> the router (forward), while Winbox traffic goes <i>to</i> the router (input). Check the chain.',
		moved:
			'Order changed. The router reads from the top and stops at the first match, so position matters as much as the rule itself.',
		gameOpen:
			'Sari is still playing. Add a <b>forward</b> rule with her address and the game server as the destination, action drop.',
		overBlock:
			'Oops, Sari cannot open nimbus.com anymore either. A rule that drops everything from her is too wide. Point it at the game server only.',
		winboxOpen:
			'Sari can still open Winbox on the router. Traffic to the router itself is the <b>input</b> chain, drop tcp port 8291 there.',
		order:
			'Budi has an accept rule, but a drop rule above it catches him first. First match wins, so move the accept above the drop.',
		lockedOut:
			'You just locked the admin out too, nobody can open Winbox now. In real life you would be driving to the office. Add an accept rule for Budi above the drop.',
		allPass: 'All four tests still pass. Your rules are solid.',
		done: 'All four pass! The game is blocked for Sari, nimbus.com still works, and only Budi can manage the router. Accept the few, drop the rest, and always mind the order.'
	},
	missionsLabel: 'Tests',
	missions: [
		'Sari cannot reach the game server',
		'Sari can still open nimbus.com',
		'Sari cannot open Winbox',
		'Budi (admin) can still open Winbox'
	],
	hintBtn: 'Help',
	doneNote: 'Every test passes',
	ispLabel: 'ISP',
	inputLabel: 'command',
	termHint: '# every rule you add shows up here as a command',
	hintUnknown: '# that command does not exist',
	didYouMean: '# maybe you meant {word}',
	runBtn: 'Run the tests',
	running: 'Testing',
	staffName: 'Sari',
	adminName: 'Budi (admin)',
	netLabel: 'internet',
	builderTitle: 'New Firewall Rule',
	chainLabel: 'Chain',
	srcLabel: 'From',
	targetLabel: 'Going to',
	actionLabel: 'Action',
	anyone: 'any',
	targets: { game: 'game server', winbox: 'Winbox (8291)', any: 'anything' },
	actions: { accept: 'accept', drop: 'drop' },
	addBtn: 'Add rule',
	rulesTitle: 'Filter Rules',
	emptyRules: 'No rules yet, so everything is let through.',
	defaultRow: 'Anything no rule matches is accepted.',
	packetsLabel: 'hits',
	upLabel: 'Move up',
	downLabel: 'Move down',
	removeLabel: 'Remove',
	logTitle: 'Terminal'
};

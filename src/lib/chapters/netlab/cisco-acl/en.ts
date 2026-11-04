import type { CiscoAclText } from './types';

export const en: CiscoAclText = {
	title: 'Access control lists',
	intro: [
		'The boss has two wishes. Nobody plays the game site during work hours, and only Budi, the admin, may log into the router from his laptop. Right now the router lets everything through, watch.',
		'Cisco handles wishes like these with an <b>access control list</b>, ACL for short. It is a numbered list of lines, each one says <b>permit</b> or <b>deny</b>. IOS reads it from the top and stops at the first line that fits.',
		'[ingat] Think of a bouncer with a guest list. He reads from the top, the first line that fits you decides, and if your name is nowhere on the list, you do not get in. That last part is the invisible <b>deny any</b> at the bottom of every list.',
		'There are two kinds. A <b>standard</b> list (numbers 1 to 99) only looks at who is sending. An <b>extended</b> list (100 to 199) also looks at where it goes and which port. Blocking one website needs an extended one, so list 100 denies tcp to the game server on port 443.',
		'A list does nothing until it is hung on a port. <b>ip access-group 100 in</b> on Gi0/1 checks every packet coming in from the office. Now watch closely, something goes wrong.',
		'Everything is blocked, even nimbus.com and Budi! The invisible deny at the bottom caught them. The fix is one more line under the deny, <b>permit ip any any</b>, which lets everything else through.',
		'Now the remote login. A small standard list 10 permits only Budi’s address, and <b>access-class 10 in</b> hangs it on the <b>vty lines</b>, the virtual doors people use to log in over the network.',
		'<b>show access-lists</b> shows every line with a counter of how many packets it matched. Great for checking that a rule really does its job.',
		'[fyi] Same idea, different words. On [[MikroTik|netlab/router-firewall]] these are firewall filter rules, and in the cloud they are security groups, see [[firewall|networking/firewall]]. Always top down, always first match.',
		'Your turn. Dewi becomes an admin too. Type <b>conf t</b>, then <b>access-list 10 permit host 192.168.88.13</b>, and watch her test.'
	],
	reactions: {
		task: 'Dewi is in! Her new line sits under Budi’s in list 10, and Sari still hits the invisible deny at the bottom. That is an ACL doing exactly what the boss wanted.',
		tooOpen:
			'Dewi gets in now, but so does Sari. That line lets too many people through. Use <b>host 192.168.88.13</b> so it fits only Dewi.',
		needEnable: 'That needs the boss prompt. Type <b>enable</b> first.',
		needConfig:
			'Access lists change the router, so type <b>conf t</b> first, then the access list line.',
		needDo: 'In config mode, put <b>do</b> in front, like <b>do sh access-lists</b>.',
		needSub:
			'That command goes inside an interface or a line. Enter it first, for example <b>line vty 0 4</b>.',
		error:
			'IOS did not understand that one. The ^ points at the word it tripped on, and <b>?</b> shows what fits.'
	},
	steps: [
		{
			title: 'Two wishes',
			body: 'Each card is a test packet. With no list at all, the router lets every one of them through, including the two that should be stopped.'
		},
		{
			title: 'An ordered list',
			body: 'Every line is a <b>permit</b> or a <b>deny</b>. The router checks line 10, then 20, and so on, and acts on the <b>first</b> match.'
		},
		{
			title: 'The bouncer',
			tag: 'Make it stick',
			body: 'Top down, first match wins, and not on the list means <b>no entry</b>. That last rule is the invisible deny.'
		},
		{
			title: 'Extended list 100',
			body: '<code>access-list 100 deny tcp any host 45.76.10.20 eq 443</code> reads like a sentence. Deny tcp from anyone to the game server on port 443.'
		},
		{
			title: 'Hang it on a port',
			body: '<code>ip access-group 100 in</code> checks packets as they come <b>in</b> through Gi0/1. One list per port and direction.'
		},
		{
			title: 'Permit the rest',
			body: 'The new line lands at the bottom, as line 20. Order matters, a permit any above the deny would let the game through.'
		},
		{
			title: 'Lock the login doors',
			body: '<code>line vty 0 4</code> picks the five remote login doors. <code>access-class 10 in</code> lets only list 10 knock on them.'
		},
		{
			title: 'Counters',
			body: 'Each line shows how many packets it caught. A rule with zero matches is either not needed or in the wrong place.'
		},
		{
			title: 'Everywhere',
			body: 'Firewalls, cloud security groups, and Cisco ACLs all read rules top down. Learn the order trick once and it works everywhere.'
		},
		{
			title: 'Your turn',
			tag: 'Try it',
			body: 'Type <code>conf t</code>, press Enter, then <code>access-list 10 permit host 192.168.88.13</code>.'
		}
	],
	targets: { game: 'game site', web: 'nimbus.com', router: 'router login' },
	allowed: 'through',
	blocked: 'blocked',
	waiting: 'waiting',
	wantAllow: 'should pass',
	wantBlock: 'should stop',
	implicitNote: 'invisible, always last',
	on100: 'on Gi0/1, in',
	on10: 'on the login lines',
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

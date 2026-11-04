import type { CiscoVlanText } from './types';

export const en: CiscoVlanText = {
	title: 'VLANs and trunks',
	intro: [
		'The office now has a guest WiFi in the lobby, plugged into the same Cisco <b>switch</b> as Sari, Budi, and Dewi. A switch is the box with many ports that joins the devices of one network. Watch a guest phone shout a broadcast, a message for everyone. Every staff laptop hears it.',
		'One switch means one big room, so a curious guest could see the staff laptops. A <b>VLAN</b> (virtual LAN) splits that one switch into separate rooms without buying a second one. The idea is in [[What is a VLAN|network/vlan]].',
		'First we make the rooms. <b>vlan 10</b> named STAFF and <b>vlan 20</b> named GUEST. Each VLAN is just a number with a name tag.',
		'Next we put the staff ports into room 10. <b>interface range fa0/1-3</b> picks three ports at once, <b>switchport mode access</b> says one device, one room, and <b>switchport access vlan 10</b> says which room. Watch them turn blue.',
		'The guest WiFi on Fa0/8 goes into room 20 the same way. Now the switch has two rooms that cannot hear each other.',
		'[ingat] An <b>access</b> port is a door into one room, one color. A <b>trunk</b> is the hallway that carries every color, each packet wearing a small name tag (802.1Q) so the other end knows which room it belongs to.',
		'The cable up to the router must carry both rooms, so Gi0/1 becomes a <b>trunk</b>. Look at the uplink, two colors in one cable.',
		'Time to test. <b>show vlan brief</b> lists every room and its ports, then the guest shouts again. This time only the guest room hears it.',
		'[fyi] Same idea, different words. MikroTik builds VLANs with VLAN interfaces, and in the cloud the same splitting is done with subnets inside a [[VPC|networking/vpc]]. The router can still pass traffic between rooms, but only where you allow it.',
		'Your turn. A new staff laptop just got plugged into Fa0/4. Type <b>conf t</b>, then <b>int fa0/4</b>, then <b>switchport access vlan 10</b>.'
	],
	reactions: {
		task: 'Fa0/4 just turned blue. The new laptop is in the staff room now, it hears Sari, Budi, and Dewi, and the guests cannot see it.',
		wrongVlan:
			'That port went into another room. Staff live in <b>vlan 10</b>, so use switchport access vlan 10.',
		needEnable: 'That needs the boss prompt. Type <b>enable</b> first.',
		needConfig: 'That changes the switch, type <b>conf t</b> first.',
		needDo: 'In config mode, put <b>do</b> in front, like <b>do sh vlan brief</b>.',
		needSub: 'That one goes inside a port. Enter it first with <b>int fa0/4</b>.',
		error:
			'IOS did not understand that one. The ^ points at the word it tripped on, and <b>?</b> shows what fits.'
	},
	steps: [
		{
			title: 'One big room',
			body: 'A <b>broadcast</b> is a message for everyone on the network. Without VLANs, every port of the switch is in the same room, so everyone receives it.'
		},
		{
			title: 'Virtual rooms',
			body: 'A VLAN is a room made of switch ports. Ports in different VLANs behave as if they sat on different switches.'
		},
		{
			title: 'Make the rooms',
			body: '<code>vlan 10</code> opens <b>(config-vlan)#</b> and <code>name STAFF</code> labels it. VLAN 1 is the default room every port starts in.'
		},
		{
			title: 'Access ports',
			body: '<code>interface range</code> configures several ports in one go. <code>switchport access vlan 10</code> moves them into room 10.'
		},
		{
			title: 'The guest room',
			body: 'Fa0/8 joins VLAN 20. Same three ideas, pick the port, make it access, choose the room.'
		},
		{
			title: 'Door and hallway',
			tag: 'Make it stick',
			body: '<b>Access</b> is a door into one room. <b>Trunk</b> is a hallway for all rooms, with name tags on every packet.'
		},
		{
			title: 'The trunk',
			body: '<code>switchport mode trunk</code> on Gi0/1 lets both VLANs travel to the router on a single cable.'
		},
		{
			title: 'Rooms that stay quiet',
			body: 'The table shows STAFF on Fa0/1 to Fa0/3 and GUEST on Fa0/8. The trunk port is not listed, it belongs to every room.'
		},
		{
			title: 'Elsewhere',
			body: 'Splitting one network into rooms is everywhere, VLANs in offices, subnets in the cloud. Only the words change.'
		},
		{
			title: 'Your turn',
			tag: 'Try it',
			body: 'Type <code>conf t</code>, then <code>int fa0/4</code>, then <code>switchport access vlan 10</code>, pressing Enter after each.'
		}
	],
	apLabel: 'Guest WiFi',
	newLabel: 'New laptop',
	heard: 'heard it',
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
	hintNeedConfig: '! that changes the switch, type conf t first',
	hintDo: '! you are in config mode, put do in front, like do sh vlan brief',
	hintSub: '! that one goes inside a port, enter it first with int fa0/4',
	hintMask: '! Cisco wants the mask spelled out, like 255.255.255.0',
	hintWild: '! careful, a wildcard is the mask flipped, 255.255.255.0 becomes 0.0.0.255'
};

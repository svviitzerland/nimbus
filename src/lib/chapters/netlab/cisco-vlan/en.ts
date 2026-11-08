import type { CiscoVlanText } from './types';

export const en: CiscoVlanText = {
	title: 'VLANs and trunks',
	intro: [
		'Staff laptops and the guest access point connect to the same switch. With all ports in VLAN 1, a guest device’s broadcast also reaches staff ports.',
		'A <b>VLAN</b> logically separates broadcast domains on a switch. Staff and guest ports can be assigned to different VLANs. See the basics in [[VLAN|network/vlan]].',
		'First we make the rooms. <b>vlan 10</b> named STAFF and <b>vlan 20</b> named GUEST. Each VLAN is just a number with a name tag.',
		'Select staff ports with <b>interface range fa0/1-3</b>. Set <b>switchport mode access</b>, then <b>switchport access vlan 10</b>. Blue indicates membership in VLAN 10.',
		'Assign the guest access point on Fa0/8 to VLAN 20. Staff and guest broadcasts now occupy different domains.',
		'[ingat] An access port carries one data VLAN. A trunk can carry several VLANs using 802.1Q tags, except native VLAN traffic as configured.',
		'Gi0/1 becomes a <b>trunk</b> carrying both VLANs over one router connection. VLAN tags distinguish their traffic.',
		'Run <b>show vlan brief</b> to see VLANs and their access ports. Send another guest broadcast and observe which ports receive it.',
		'[fyi] VLANs separate broadcast domains at the link layer. [[Subnets|network/subnet]] divide IP address space. They are often used together but are different concepts.',
		'Your turn. A new staff laptop just got plugged into Fa0/4. Type <b>conf t</b>, then <b>int fa0/4</b>, then <b>switchport access vlan 10</b>.'
	],
	reactions: {
		task: 'Fa0/4 now belongs to VLAN 10 with the other staff ports. Guest VLAN broadcasts are not forwarded to it.',
		wrongVlan: 'The port is not in the staff VLAN. Use <b>switchport access vlan 10</b>.',
		needEnable: 'This command requires privileged EXEC mode. Run <b>enable</b>, then try again.',
		needConfig: 'That changes the switch, type <b>conf t</b> first.',
		needDo: 'In config mode, put <b>do</b> in front, like <b>do sh vlan brief</b>.',
		needSub: 'That one goes inside a port. Enter it first with <b>int fa0/4</b>.',
		error:
			'IOS did not understand that one. The ^ points at the word it tripped on, and <b>?</b> shows what fits.'
	},
	steps: [
		{
			title: 'One broadcast domain',
			body: 'Initially, all access ports belong to VLAN 1. Broadcasts are forwarded to other ports in that VLAN.'
		},
		{
			title: 'Separating networks with VLANs',
			body: 'VLANs create separate broadcast domains on a switch. Traffic between VLANs requires routing.'
		},
		{
			title: 'Creating VLANs',
			body: '<code>vlan 10</code> opens configuration for VLAN 10. <code>name STAFF</code> gives it a recognizable name.'
		},
		{
			title: 'Access ports',
			body: '<code>interface range</code> configures several ports in one go. <code>switchport access vlan 10</code> moves them into room 10.'
		},
		{
			title: 'Guest VLAN',
			body: 'Fa0/8 joins VLAN 20. Same three ideas, pick the port, make it access, choose the room.'
		},
		{
			title: 'Access and trunk ports',
			tag: 'Remember it',
			body: 'An access port connects a device to one data VLAN. A trunk can carry several VLANs over one connection.'
		},
		{
			title: 'The trunk',
			body: '<code>switchport mode trunk</code> on Gi0/1 lets both VLANs travel to the router on a single cable.'
		},
		{
			title: 'Limiting broadcast traffic',
			body: 'The table lists STAFF and GUEST access ports. Check VLAN membership, then test broadcast reach.'
		},
		{
			title: 'VLANs on other devices',
			body: 'VLANs limit link-layer broadcasts. Subnets divide IP address space. Both can be used together.'
		},
		{
			title: 'Configure VLANs',
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
	hintNeedEnable: '! use enable to enter privileged EXEC',
	hintNeedConfig: '! that changes the switch, type conf t first',
	hintDo: '! you are in config mode, put do in front, like do sh vlan brief',
	hintSub: '! that one goes inside a port, enter it first with int fa0/4',
	hintMask: '! write the full subnet mask, for example 255.255.255.0',
	hintWild: '! careful, a wildcard is the mask flipped, 255.255.255.0 becomes 0.0.0.255'
};

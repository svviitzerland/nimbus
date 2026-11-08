import type { PortText } from '../../types';

export const en: PortText = {
	title: 'What is a port?',
	intro: [
		'A server has just one address, but behind that address are many numbered doors. Each door is a <b>port</b>, and each service waits at its own one.',
		'Picture the server as a building with one address but many doors. So when you connect, you name not just the address but which door you are heading to.',
		'[fyi] Quick heads up so they never get mixed up. These ports are <b>logical</b> doors, just numbers inside a server. A router or switch, like [[MikroTik|netlab/router-intro]] or [[Cisco|netlab/cisco-intro]], also has <b>physical</b> ports, the holes you plug a LAN cable into (on MikroTik they are named ether1, ether2, and so on). Both are called ports, but they live in different worlds.',
		'Tap each door to see which service is waiting behind it.',
		'[ingat] IP selects the computer; a port selects a service on it.'
	],
	reactions: {
		'22': 'Port 22 is the <b>SSH</b> door, for getting into a Linux server terminal from afar.',
		'80': 'Port 80 is the <b>plain web</b> door (HTTP), where a web page is sent to the browser.',
		'443': 'Port 443 is the <b>secure web</b> door (HTTPS), same as 80 but encrypted.',
		'3389': 'Port 3389 is the <b>RDP</b> door, for remote desktop into a Windows server.',
		'5432':
			'Port 5432 is the <b>Postgres database</b> door, where an app reads and writes data. Each database has its own port, MySQL for instance is on 3306.',
		all: 'There it is, one address, many doors, each service on its own port. That is why when you enter a cloud server, <b>SSH goes through port 22</b> and <b>RDP through port 3389</b>. These numbers are just the common defaults, and you can change them yourself.'
	},
	addrLabel: 'One address',
	address: 'nimbus.com',
	tapHint: 'Tap each door to see its service.',
	ports: [
		{ port: '22', name: 'SSH', desc: 'the remote terminal door for managing a Linux server.' },
		{ port: '80', name: 'Web', desc: 'the plain website door (HTTP).' },
		{ port: '443', name: 'Secure web', desc: 'the encrypted website door (HTTPS).' },
		{ port: '3389', name: 'RDP', desc: 'the remote desktop door for a Windows server.' },
		{ port: '5432', name: 'Postgres', desc: 'where an app connects to a Postgres database.' }
	]
};

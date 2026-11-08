import type { FirewallText } from '../types';

export const en: FirewallText = {
	title: 'Firewalls',
	intro: [
		'Network-reachable services need to restrict incoming traffic. Access rules help determine which connections are allowed.',
		'A <b>firewall</b> checks traffic against rules such as source, destination, protocol, and port. Traffic can be allowed or denied.',
		'In this exercise, allow the traffic the site needs and deny the rest. Rules must suit the service so legitimate users can still access it.',
		'[fyi] Traffic filtering can run on computers, routers, and cloud services. Examples include [[MikroTik firewalls|netlab/router-firewall]], [[Cisco ACLs|netlab/cisco-acl]], and AWS security groups. Their rule details differ.',
		'Send web traffic and disallowed traffic. Observe the firewall’s decision for each request.',
		'[ingat] A firewall checks traffic rules. Overly broad rules also admit unwanted traffic.'
	],
	reactions: {
		allow: 'The traffic matches an allow rule, so the firewall forwards it to the server.',
		deny: 'The snoop is not on the list and gets turned away at the door, before ever touching the server. That is a firewall, deny first, allow only what is needed.'
	},
	guardLabel: 'Firewall',
	guardSub: 'Checks traffic against rules',
	serverLabel: 'Server',
	rulesTitle: 'Traffic rules',
	ruleAllow: 'Allow web traffic',
	ruleDeny: 'Deny other traffic',
	guestWeb: 'Web traffic',
	guestBad: 'Blocked traffic',
	sendWeb: 'Send web traffic',
	sendBad: 'Send blocked traffic',
	allowedTag: 'in',
	deniedTag: 'denied',
	noteIdle: 'The firewall is ready to check traffic',
	noteAllow: 'Traffic matches an allow rule',
	noteDeny: 'Traffic matches a deny rule'
};

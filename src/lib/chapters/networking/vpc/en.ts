import type { NetworkText } from '../types';

export const en: NetworkText = {
	title: 'Private networks and subnets',
	intro: [
		'A <b>VPC</b> is a logically isolated virtual network in the cloud. You configure its IP range, subnets, routes, and access rules.',
		'A <b>subnet</b> divides the VPC’s address range. Here the public subnet has a route to an internet gateway. The web server also needs suitable addressing and access rules to be reachable.',
		'The one at the back is the <b>private subnet</b>, with no door to the street at all. The database lives here, and only the web server may talk to it from inside.',
		'[fyi] Offices build similar boundaries with subnets, [[VLANs|network/vlan]], and firewalls on equipment such as [[MikroTik|netlab/router-intro]] or [[Cisco|netlab/cisco-intro]]. In a cloud, you configure virtual networks backed by the provider’s physical infrastructure.',
		'Open the site through the web server. Then try reaching the database directly from the internet and compare the results.',
		'[ingat] A private network creates a boundary. Routes and firewalls control paths and access.'
	],
	reactions: {
		web: 'The web server receives the request and retrieves data from the database over the private network. The visitor receives the result from the web server.',
		blocked:
			'This database has no direct internet access path. A private subnet still needs suitable access rules for other sources.'
	},
	vpcLabel: 'VPC',
	vpcSub: 'your private network',
	internetLabel: 'Internet',
	publicLabel: 'Public subnet',
	publicSub: 'Has a route to an internet gateway',
	privateLabel: 'Private subnet',
	privateSub: 'No direct route to an internet gateway',
	webLabel: 'Web server',
	dbLabel: 'Database',
	visitSite: 'Visit the site',
	attackDb: 'Try accessing the database from the internet',
	noteIdle: 'The web server and database are in different subnets',
	noteWeb: 'The web server receives the request and retrieves data from the database',
	noteBlocked: 'This database has no direct access path from the internet'
};

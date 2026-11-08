import type { IngressEgressText } from '../types';

export const en: IngressEgressText = {
	title: 'Ingress and egress',
	intro: [
		'Your server works both ways, some data comes in and some goes out.',
		'What comes into the server, like requests and photo uploads, is called <b>ingress</b>. What leaves the server, like photos and video sent back to visitors, is called <b>egress</b>.',
		'Try both, people upload photos (in) then people download photos (out), and watch the bill.',
		'[ingat] Ingress comes in; egress goes out. First choose the side you are measuring.'
	],
	reactions: {
		in: 'That is <b>ingress</b>, data coming into your server. In the cloud, ingress is usually <b>free</b>, so the bill does not move.',
		out: 'That is <b>egress</b>, data leaving your server. In the cloud, egress is <b>billed</b>, so the bill goes up every time the server sends to a visitor.',
		both: 'So ingress comes in (free), egress goes out (billed). The more visitors download or watch, the bigger the egress bill. This is why <b>caching</b> and a <b>CDN</b> matter later, so not everything has to leave your server.'
	},
	visitorLabel: 'Visitors',
	serverLabel: 'Your cloud server',
	billLabel: 'Egress bill',
	pickIn: 'Upload photos',
	pickOut: 'Download photos',
	inTag: 'In, free',
	outTag: 'Out, billed'
};

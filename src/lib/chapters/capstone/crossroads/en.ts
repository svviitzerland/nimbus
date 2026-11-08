import type { CrossroadsText } from '../types';

export const en: CrossroadsText = {
	title: 'Choose a learning track',
	intro: [
		'You made it to the end of the From Zero track. Computers, the web, networks, the cloud, security, all the way to AI, you have had a taste of every one.',
		'Now that you know the big map, pick the one you want to go deeper in. Every branch has more advanced lessons, and whatever you already finished stays ticked there.',
		'Tap a branch to see what is inside, then step in when you are sure. No need to worry about picking wrong, you can switch branches any time from the menu.',
		'[ingat] The foundations connect. Choose a track by the work you want to try next.'
	],
	reactions: {
		network:
			'The <b>Network</b> branch goes deeper into subnets, routing, VLANs, VPNs, and hands on practice in the router lab, on <b>MikroTik</b> or <b>Cisco</b>. Great if you want to run an office or ISP network.',
		web: 'The <b>Web</b> branch has you build a real site, from HTML, CSS, and JavaScript, on to frameworks, backends, databases, and finally putting it online.',
		cloud:
			'The <b>Cloud & DevOps</b> branch moves on to Linux, Kubernetes, infrastructure as code, and at the very end you pick a provider, <b>AWS</b>, <b>Google Cloud</b>, or <b>Azure</b>.',
		security:
			'The <b>Security</b> branch takes apart how attackers think, cryptography, the kinds of attacks, and how to defend, always from the side that protects.',
		ai: 'The <b>AI & ML</b> branch starts with machine learning and neural networks, then shows how chatbots and AI agents work behind the scenes.'
	},
	hint: 'Tap a branch to see what is inside',
	enter: 'Enter the {name} branch'
};

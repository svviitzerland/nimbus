import type { CloudText } from '../../types';

export const en: CloudText = {
	title: 'What is the cloud?',
	intro: [
		'Your laptop failed as a public server, and tunneling is only a borrowed door. A real site needs a serious home. There are two ways, run it yourself (called <b>on premise</b>) or rent it in the <b>cloud</b>.',
		'Many people think the cloud is something magical in the sky. But the cloud is... <b>just servers</b>, living in a company’s <i>data center</i> instead of your house. Usually you rent them and never see the machines, though some companies build their own, a <b>private cloud</b>.',
		'The two stand side by side here, the server at your home and the server in the cloud. Visit each and feel the difference.'
	],
	reactions: {
		home: 'Running it yourself at home or the office is <b>on premise</b>. Look above, when the power cuts, your site goes down with it.',
		cloud:
			'You picked the <b>cloud</b>. The server runs 24/7 in a data center, so it rarely goes down. Now compare it with <b>on premise</b>.',
		both: 'See the difference? <b>On premise</b> can fail on its own, while the <b>cloud</b> is far more stable and you pay as you go.'
	},
	homeTitle: 'Server at your home',
	homeSub: 'On premise (you manage it)',
	cloudTitle: 'Server in the cloud',
	cloudSub: 'Cloud (rented data center)',
	homePoints: [
		'If the power cuts, the server dies and your website disappears',
		'Home internet is not as fast as a data center',
		'The computer is hot, noisy, and expensive to buy'
	],
	cloudPoints: [
		'Backup power and internet 24/7, so it rarely goes down',
		'Rent by the hour, pay only for what you use',
		'Need more power? Add computers in seconds'
	],
	onpremTerm: 'On premise',
	cloudTerm: 'Cloud',
	offline: 'Power out'
};

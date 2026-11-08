import type { CloudText } from '../../types';

export const en: CloudText = {
	title: 'What is the cloud?',
	intro: [
		'To run nimbus.com, you can manage infrastructure yourself or use cloud services. Infrastructure at your own site is called <b>on premises</b>.',
		'<b>Cloud</b> offers computing, storage, and networking through services you can request as needed. The hardware lives in [[data centers|cloud/data-center]]. A public cloud serves multiple customers, while a private cloud serves one organization.',
		'The two stand side by side here, the server at your home and the server in the cloud. Visit each and feel the difference.',
		'[ingat] Cloud uses real computers. You access their resources through services.'
	],
	reactions: {
		home: 'Running it yourself at home or the office is <b>on premise</b>. Look above, when the power cuts, your site goes down with it.',
		cloud:
			'You are using the provider’s resources. In this example, its data center has backup power. Compare it with the home server.',
		both: 'In this example, the home server has no backup power. The provider’s data center has extra protection, but cloud services can fail too. We will learn to prepare backups instead of expecting one machine to stay up forever.'
	},
	homeTitle: 'Server at your home',
	homeSub: 'On premise (you manage it)',
	cloudTitle: 'Server in the cloud',
	cloudSub: 'Cloud (rented resources)',
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

import type { CableText } from '../../types';

export const en: CableText = {
	title: 'How does data travel?',
	intro: [
		'The data center holding your rented server can be in another country, even another continent. What does data actually cross to get that far?',
		'Many people think it goes through satellites in the sky. In reality almost all data between continents, around 99%, travels through <b>fiber optic cables on the seabed</b>. The data is sent as pulses of light through glass as thin as a hair.',
		'The thin lines on this map are real undersea cables that are live right now.',
		'Each cable comes ashore at a spot called a <b>landing station</b> (those little dots). From there the data enters the land network, then reaches the data center.',
		'Your users in Argentina are ready to send. Pick them a destination, then ride along as the data dives across.',
		'[ingat] Much intercontinental internet traffic travels through undersea fiber as light.'
	],
	reactions: {
		leaving: 'Your data leaves the phone, through the router and ISP, heading for the coast...',
		undersea: 'Now it dives, crossing the seabed through cable, thousands of kilometers...',
		near: 'Arrived! The destination is close, the cable is short, so the data gets there fast.',
		far: 'It arrived. But your data just crossed half the planet through cable. That is why farther means slower.'
	},
	users: 'Your users',
	prompt: 'Click a destination to send data',
	again: 'Click again to resend',
	phases: {
		leaving: 'Leaving the phone toward the coast',
		undersea: 'Crossing the seabed',
		arrived: 'Arrived at the data center'
	},
	cablesNote: 'The thin lines are live undersea cables',
	routeNote: 'Example route, the real path can vary by carrier.',
	credit: 'Cable data by TeleGeography',
	compare: {
		near: 'Near',
		far: 'Far',
		hint: 'Send to one near and one far place to feel the difference'
	},
	dests: { 'sa-east-1': 'São Paulo', 'eu-central-1': 'Frankfurt', 'ap-northeast-1': 'Tokyo' }
};

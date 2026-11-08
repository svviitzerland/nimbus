import type { WifiText } from './types';

export const en: WifiText = {
	title: 'What is WiFi',
	intro: [
		'<b>WiFi</b> is radio. The same kind of invisible waves that carry FM music to a car, only the router uses them to carry data to your phone, and your phone answers back.',
		'Most routers talk on two <b>bands</b>. <b>2.4 GHz</b> is the older one, its waves are longer, so they slip through walls and reach further, but they carry less data. <b>5 GHz</b> is much faster, but its shorter waves get stopped by walls and fade sooner.',
		'Each band is split into lanes called <b>channels</b>. On 2.4 GHz there are really only three lanes that do not overlap (1, 6, and 11). If your neighbour’s router sits on the same lane as yours, the two take turns talking, and both get slower.',
		'[fyi] WiFi only covers the last few metres, between your phone and the router. From the router onward, everything rides on [[cables|network/cabling]]. And your microwave oven heats food with waves around 2.4 GHz too, which is why the WiFi can stutter while it runs.',
		'[ingat] Under similar conditions, 2.4 GHz usually reaches farther. 5 GHz offers more channel choices. Interference and device capabilities also affect speed.',
		'Here is a house with the router in the living room. Drag the phone around and watch the speed. Lose 5 GHz behind the walls, rescue it with 2.4 GHz, then put your router on the neighbour’s channel.'
	],
	reactions: {
		near5:
			'Right next to the router on 5 GHz, it flies. Nothing in the way, so the fast band gets to show off.',
		weak5:
			'5 GHz is struggling here. Every wall swallows a big chunk of the short waves, and the distance does the rest. Try switching the band.',
		through24:
			'Back in business. 2.4 GHz is slower at its best, but its longer waves push through the walls that stopped 5 GHz. That is why far rooms often feel better on 2.4.',
		clash:
			'Ouch, the speed dropped. Your router and the neighbour’s are now shouting on channel 6, so they have to take turns. Move to channel 1 or 11 to get your own lane.',
		clear:
			'Your own lane again, no more taking turns with the neighbour. Routers can pick a quiet channel by themselves, but sometimes they need a nudge.'
	},
	routerLabel: 'Router',
	phoneLabel: 'Phone',
	neighbourLabel: 'Neighbour, ch {n}',
	rooms: ['Living room', 'Kitchen', 'Bedroom', 'Study', 'Garden'],
	bandLabel: 'Band',
	bands: {
		b24: { name: '2.4 GHz', sub: 'reaches further' },
		b5: { name: '5 GHz', sub: 'faster, shorter' }
	},
	channelLabel: 'Channel',
	channel5Note: '5 GHz has plenty of lanes, no crowding',
	dragHint: 'Drag the phone, or tap anywhere in the house',
	noSignal: 'No signal',
	walls: { none: 'nothing in the way', one: '1 wall in the way', many: '{n} walls in the way' },
	goals: ['Lose 5 GHz behind walls', 'Rescue it with 2.4 GHz', 'Share the neighbour’s channel']
};

import type { WifiText } from './types';

export const en: WifiText = {
	title: 'What is WiFi',
	intro: [
		'<b>WiFi</b> is radio. The same kind of invisible waves that carry FM music to a car radio, only the router uses them to carry data to your phone, and your phone answers back.',
		'Most routers talk on two <b>bands</b>. The first is <b>2.4 GHz</b>. Its waves are long, so they slip through walls and reach far, but they carry less data.',
		'The second is <b>5 GHz</b>. It is much faster, but its short waves get stopped by walls and fade sooner. Two walls away, it is often gone.',
		'[ingat] Low number, long reach. You can hear the neighbour’s bass through the wall, but never their whistle. 2.4 GHz is the bass, 5 GHz is the whistle.',
		'Each band is split into lanes called <b>channels</b>. On 2.4 GHz only three lanes do not overlap (1, 6, and 11). If the neighbour’s router sits in your lane, the two take turns talking and both get slower.',
		'[fyi] WiFi only covers the last few metres, between your phone and the router. From the router onward, everything rides on [[cables|network/cabling]]. Fun fact, a microwave oven also uses waves around 2.4 GHz, which is why WiFi can stutter while it runs.',
		'Want to walk around? Tap a room to carry the phone there and watch both bands.'
	],
	reactions: {
		near: 'Right next to the router, both bands are strong, and 5 GHz is the fastest by far. Nothing in the way.',
		mid: 'One wall in the way. 2.4 GHz barely notices, but 5 GHz already lost a good chunk.',
		far: 'Too many walls for 5 GHz, it is gone. 2.4 GHz still gets through, slower but alive. That is why far rooms often feel better on 2.4.'
	},
	steps: [
		{
			title: 'Radio waves',
			body: 'The router sends data through the air as radio waves. Your phone listens, and answers the same way.'
		},
		{
			title: '2.4 GHz',
			body: 'Long waves. They pass through walls and reach far, but carry less data.'
		},
		{
			title: '5 GHz',
			body: 'Short waves. Much faster up close, but every wall swallows a big chunk of them.'
		},
		{
			tag: 'Make it stick',
			title: 'Bass and whistle',
			body: 'Low number, long reach. <b>2.4</b> goes far but slow, <b>5</b> goes fast but near.'
		},
		{
			title: 'Channels',
			body: 'Lanes inside a band. Two routers in the same lane must take turns. On 2.4 GHz, pick <b>1</b>, <b>6</b>, or <b>11</b>.'
		},
		{
			tag: 'FYI',
			title: 'Only the last few metres',
			body: 'From the router onward, data travels on cables. WiFi is just the short hop to your phone.'
		},
		{
			tag: 'Try it',
			title: 'Walk around',
			body: 'Tap a room. Watch 5 GHz drop off behind the walls while 2.4 GHz holds on.'
		}
	],
	routerLabel: 'Router',
	neighbourLabel: 'Neighbour',
	rooms: ['Living room', 'Kitchen', 'Study', 'Bedroom', 'Garden'],
	bands: { b24: '2.4 GHz', b5: '5 GHz' },
	noSignal: 'no signal',
	laneLabel: 'Channels on 2.4 GHz',
	clashTag: 'taking turns',
	clearTag: 'own lane',
	toInternet: 'to the internet',
	tapHint: 'Tap a room to carry the phone there'
};

import type { CablingText } from './types';

export const en: CablingText = {
	title: 'Network cables',
	intro: [
		'Data travels between devices as ones and zeros. Inside a cable, those become quick pulses, of <b>electricity</b> or of <b>light</b>, depending on what the cable is made of.',
		'The cable you plug into a laptop or a router is a <b>LAN cable</b>. Inside are eight thin copper wires twisted in pairs. Copper carries electricity, and it is cheap, tough, and easy to plug in.',
		'Electricity has a weakness though. The further it goes, the weaker it gets, and it picks up noise from other wires along the way. So a LAN cable tops out at about 100 metres.',
		'<b>Fibre optic</b> cable is a strand of glass as thin as a hair. It carries light instead, flashing on and off. Light barely fades and ignores electrical noise, so one fibre can run for tens of kilometres.',
		'[ingat] Copper for the room, fibre for the road. A LAN cable reaches about the length of a football pitch, and anything longer than that, like the line coming into your house, is fibre.',
		'[fyi] The twists in a LAN cable are not for looks. Twisting each pair makes outside noise hit both wires equally, so it cancels out. Cat5e, Cat6, and Cat6a on the label tell you how tight and how fast the cable is.',
		'Want to stretch it? Drag the distance and watch where copper gives up while fibre keeps going.'
	],
	reactions: {
		copperOk:
			'Short again, and copper is happy. Over short runs a LAN cable is cheap, easy, and plenty fast, which is why there is one behind almost every desk.',
		copperFail:
			'Copper just gave up. The electricity faded and got buried in noise, so the far end could not tell the ones from the zeros. Past about 100 metres you need a switch in between to boost it, or fibre.',
		fibreFar:
			'Kilometres away and fibre is still crisp. Light in glass barely fades, which is why the [[cables under the sea|cloud/cable]] that connect continents are fibre too.'
	},
	steps: [
		{
			title: 'Pulses in a cable',
			body: 'A cable carries data as quick pulses. On, off, on, off, billions of times every second.'
		},
		{
			title: 'LAN cable',
			body: 'Eight thin <b>copper</b> wires twisted in pairs, with a clear plastic plug on each end. It carries electricity.'
		},
		{
			title: 'The 100 metre limit',
			body: 'Electricity fades and picks up noise as it travels. Past about <b>100 metres</b> the far end cannot read it anymore.'
		},
		{
			title: 'Fibre optic',
			body: 'A strand of <b>glass</b> as thin as a hair, carrying flashes of light. It barely fades, so it runs for kilometres.'
		},
		{
			tag: 'Remember it',
			title: 'Copper for the room, fibre for the road',
			body: 'A LAN cable reaches about one football pitch (100 metres). Anything longer, like the line to your house, is fibre.'
		},
		{
			tag: 'FYI',
			title: 'Why the twists',
			body: 'Twisting each pair makes outside noise hit both wires equally, so it cancels out. Tighter twists mean a faster cable.'
		},
		{
			tag: 'Try it',
			title: 'Stretch the cable',
			body: 'Drag the distance above. Copper fades and then breaks, fibre stays bright.'
		}
	],
	copper: 'Copper LAN cable',
	fibre: 'Fibre optic',
	pairLabel: 'twisted pair',
	glassLabel: 'light in glass',
	youLabel: 'Your laptop',
	farLabel: 'Server',
	distLabel: 'Distance',
	okTag: 'arrived',
	brokenTag: 'unreadable',
	limitTag: '100 m'
};

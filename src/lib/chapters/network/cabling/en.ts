import type { CablingText } from './types';

export const en: CablingText = {
	title: 'Network cables',
	intro: [
		'Data travels between devices as a stream of ones and zeros. Inside a cable, those ones and zeros become pulses of <b>electricity</b> or pulses of <b>light</b>, depending on what the cable is made of.',
		'The cable you plug into a laptop or a router is a <b>LAN cable</b>. Inside are eight thin copper wires twisted in pairs, with a clear plastic plug on each end. Copper carries electricity, and it is cheap, tough, and easy to plug in.',
		'Electricity has a weakness though. The further it travels, the weaker it gets, and it picks up noise from other wires nearby. That is why a LAN cable officially tops out at about 100 metres.',
		'<b>Optical fiber</b> carries data as light through glass. Its signal still weakens with distance, but it avoids the electromagnetic interference affecting copper. Range depends on fiber type and optical equipment.',
		'[fyi] The twists in a LAN cable are not for looks. Twisting each pair makes outside noise hit both wires equally, so it cancels out. Tighter twists and better shielding mean a faster cable, which is what Cat5e, Cat6, and Cat6a on the label tell you.',
		'[ingat] <b>Check medium, speed, and distance.</b> Common copper Ethernet channels are designed for up to 100 meters. Fiber supports many longer links, with limits set by its standards and equipment.',
		'Send the same file over copper and over fibre, and keep stretching the distance. Find where copper gives up, then see how far fibre can go.'
	],
	reactions: {
		copperOk:
			'Arrived in one piece. Over short runs a copper LAN cable is cheap, easy, and plenty fast, which is why there is one behind almost every desk.',
		copperFail:
			'The file broke on the way. The electricity faded and got buried in noise, so the far end could no longer tell the ones from the zeros. Past about 100 metres, copper needs a switch in between to boost the signal, or a different cable.',
		fibreOk:
			'Fibre handles short runs easily too, and ten times faster here. It costs more though, and the glass needs gentler handling than copper, so short hops inside a room usually stay copper.',
		fibreFar:
			'This simulated fiber link still delivers data at that distance. Real limits depend on signal strength and transceiver capabilities. Fiber also carries data in [[submarine cables|cloud/cable]].'
	},
	copper: { name: 'Copper', sub: 'LAN cable, electricity' },
	fibre: { name: 'Fibre optic', sub: 'glass, light' },
	distLabel: 'How far',
	places: [
		'across one room',
		'across an office floor',
		'down a long corridor',
		'to the next building',
		'across town',
		'to the next city'
	],
	sendBtn: 'Send the file',
	fileLabel: 'nimbus.zip (1 GB)',
	youLabel: 'Your laptop',
	farLabel: 'Server',
	signalLabel: 'Signal left at the far end',
	limitLabel: 'readable',
	okNote: 'Arrived safely in {t}',
	failNote: 'Signal too weak, the file arrived broken',
	times: { copper: 'about 8 seconds', fibre: 'under a second' },
	idleNote: 'Pick a cable and a distance, then send'
};

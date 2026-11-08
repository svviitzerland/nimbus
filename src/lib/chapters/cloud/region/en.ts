import type { RegionText } from '../../types';

export const en: RegionText = {
	title: 'What is a Region?',
	intro: [
		'A <b>region</b> is a geographic area where a provider operates cloud infrastructure in multiple [[data centers|cloud/data-center]]. In this lab, nimbus.com users are in Argentina. Choose a server location for them.',
		'The map shows a selection of regions for this experiment. We compare locations on the same continent with locations across oceans; this is not a map of every data center.',
		'But why would distance change the speed? The key is <b>latency</b>. Think back to playing an online game, you usually have to choose a server first, Asia, America, or Europe. The farther the server, the longer the data takes to travel back and forth, and the game (or website) starts to feel laggy.',
		'Here, <b>latency</b> estimates round trip time in milliseconds. These are simulation values, not live ping measurements. Real network routes and congestion also matter.',
		'Pick a provider above first, then place your server in a few of its cities and compare the <b>latency</b>. The closer to Argentina, the smaller it should get.',
		'[ingat] A region is a geographic area. Being nearer users often shortens the data journey.'
	],
	reactions: {
		near: 'See, this region is not in Argentina, but it sits on the <b>same continent</b>, so it has the lowest latency of the options.',
		mid: 'Fairly far, the latency climbs. There is still a region closer to your users.',
		far: 'Way too far. The data has to cross <b>half the world</b>, so it lags. That is exactly why picking the nearest region matters.'
	},
	users: 'Your users',
	readoutPrompt: 'Pick a city to measure its speed',
	pickProvider: 'Pick a cloud provider to see its regions',
	drag: 'Drag to spin the globe',
	flatLabel: 'Map',
	globeLabel: 'Globe',
	ms: 'ms',
	verdicts: { instant: 'Instant', fast: 'Fast', ok: 'Okay', slow: 'A bit slow', laggy: 'Laggy' },
	compare: {
		near: 'Near',
		far: 'Far',
		hint: 'Test one near city and one far city to feel the difference'
	}
};

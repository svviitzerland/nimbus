import type { RegionText } from '../../types';

export const en: RegionText = {
	title: 'What is a Region?',
	intro: [
		'Say most of your users live in <b>Argentina</b>. Your cloud server has to sit in one of a provider’s data center locations, and such a location is called a <b>region</b>. Each big cloud provider has its own list of regions.',
		'The catch is, Argentina has no data center of its own yet. But there is one on the same continent, and that choice of location decides how fast the site feels for your users.',
		'But why would distance change the speed? The key is <b>latency</b>. Think back to playing an online game, you usually have to choose a server first, Asia, America, or Europe. The farther the server, the longer the data takes to travel back and forth, and the game (or website) starts to feel laggy.',
		'That round trip time of data between your users and the server is what we call <b>latency</b>. It is measured in milliseconds (ms), and the smaller the number, the faster.',
		'Pick a provider above first, then place your server in a few of its cities and compare the <b>latency</b>. The closer to Argentina, the smaller it should get.'
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

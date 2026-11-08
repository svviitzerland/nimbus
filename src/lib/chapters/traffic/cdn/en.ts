import type { CdnText } from '../types';

export const en: CdnText = {
	title: 'Caching and CDNs',
	intro: [
		'Remember the latency lesson from the Cloud chapter? The farther the server, the longer data takes to arrive. The nimbus.com origin server lives in one place, in America, while your visitors are everywhere.',
		'Yet much of a site is exactly the same for everyone, like images, the logo, and videos. Instead of everyone fetching them all the way from America, keep copies at a point near the visitors. That is called <b>caching</b>. The first time it is asked, that point fetches from the origin once, after that the copy stays there.',
		'A <b>CDN</b> (Content Delivery Network) is that same caching spread worldwide, a network of points that hold copies across hundreds of cities. Visitors are automatically served by the nearest point, you never pick cities one by one.',
		'The spread depends on the provider. Cloudflare sits in over 300 cities, AWS CloudFront has over 600 points, others differ again. Big cities are almost always covered, remote areas get served by the nearest point a bit farther away. And it has a price, a CDN is a paid service, so your bill goes up.',
		'On this map the CDN is still off, so every visitor travels all the way to the origin. Click a few people and feel the lag, then switch the CDN on, click again, and watch the nearest green point deliver the copy.',
		'[ingat] A CDN brings content copies closer. A nearby cache reduces trips to the origin.'
	],
	reactions: {
		origin:
			'Look at that path, all the way from the origin server in America. Visitors near America are fine, but the rest of the world waits hundreds of milliseconds. Switch the CDN on.',
		enabled:
			'There, those green dots are the CDN network, spread across many cities at once. It does raise your bill, but what you buy is speed. Click a visitor and see which point delivers.',
		cached:
			'See, the origin is not the sender anymore, the nearest green point is. From hundreds of milliseconds down to a dozen. That is what a CDN is paid for.'
	},
	cdnOn: 'Turn the CDN on',
	cdnOff: 'Turn the CDN off',
	statusOff: 'CDN off',
	statusOn: 'CDN on, {n} points',
	originLabel: 'Origin server',
	edgeLabel: 'CDN point',
	visitorsLabel: 'Visitors',
	servedOrigin: 'from the origin in America',
	servedEdge: 'from the {city} point',
	hitChip: 'Delivered by the nearest point',
	verdictFast: 'Snappy',
	verdictOk: 'Decent',
	verdictSlow: 'Sluggish',
	readoutPrompt: 'Click a visitor on the map',
	compare: {
		off: 'Without CDN',
		on: 'With CDN',
		hint: 'Try a visitor without the CDN, then turn it on'
	},
	ms: 'ms',
	cities: {
		surabaya: 'Surabaya',
		jayapura: 'Jayapura',
		brisbane: 'Brisbane',
		manchester: 'Manchester',
		riodejaneiro: 'Rio de Janeiro',
		boston: 'Boston',
		jakarta: 'Jakarta',
		sydney: 'Sydney',
		london: 'London',
		saopaulo: 'São Paulo',
		newyork: 'New York',
		seattle: 'Seattle',
		losangeles: 'Los Angeles',
		dallas: 'Dallas',
		miami: 'Miami',
		toronto: 'Toronto',
		mexicocity: 'Mexico City',
		bogota: 'Bogotá',
		lima: 'Lima',
		buenosaires: 'Buenos Aires',
		santiago: 'Santiago',
		paris: 'Paris',
		frankfurt: 'Frankfurt',
		madrid: 'Madrid',
		milan: 'Milan',
		stockholm: 'Stockholm',
		warsaw: 'Warsaw',
		johannesburg: 'Johannesburg',
		lagos: 'Lagos',
		nairobi: 'Nairobi',
		dubai: 'Dubai',
		mumbai: 'Mumbai',
		singapore: 'Singapore',
		bangkok: 'Bangkok',
		hongkong: 'Hong Kong',
		tokyo: 'Tokyo',
		seoul: 'Seoul',
		auckland: 'Auckland'
	}
};

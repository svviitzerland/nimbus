import type { CacheText } from './types';

export const en: CacheText = {
	title: 'Caching and Redis',
	intro: [
		'Opening a product page on nimbus.com looks simple, but behind it the app server asks the database for the name, the price, the photos, and the stock. A busy database can take most of a second to answer. Watch one visit.',
		'Yet most visitors open the very same few pages, again and again. Every single visit makes the database do the whole job from scratch. Keep an eye on how many times it gets asked.',
		'So we keep the answer the first time and reuse it. That is a <b>cache</b>. You already met one in [[Caching and CDNs|traffic/cdn]]. A CDN keeps copies of files near the visitors, this cache keeps ready made answers right next to the app server.',
		'A popular tool for it is <b>Redis</b>, a tiny database that lives in memory (RAM) instead of on disk. Reading from memory takes a millisecond or two, way faster than running a big query on disk.',
		'The first visit is a <b>miss</b>. Redis does not have the answer yet, so the server asks the database the slow way and saves a copy in Redis on the way back.',
		'Every visit after that is a <b>hit</b>, served straight from memory in a couple of milliseconds. The database does not even notice, and the counter under it stops climbing.',
		'[ingat] A cache is a water bottle on your desk. The first time you are thirsty you walk to the kitchen (a miss). After that you just reach for the bottle (a hit). Miss once, hit many times.',
		'[fyi] There is a catch. When the price changes in the database, Redis may still hold the old one, which is called <b>stale</b> data. Real apps clear the key when the data changes, or give every key an expiry time (a TTL). An old joke says the two hardest things in computer science are cache invalidation and naming things.',
		'If you like, open the page a few times yourself, starting from an empty cache. Totally optional.'
	],
	reactions: {
		miss: 'A miss. Redis was empty, so the server went to the database the slow way and kept a copy. Open it again.',
		hit: 'A hit, a couple of milliseconds, and the database never heard about it.'
	},
	panels: [
		{
			tag: 'One visit',
			title: 'The slow way',
			body: 'Your phone asks the <b>app server</b>, the server asks the <b>database</b>, and the answer travels all the way back.'
		},
		{
			tag: 'Again and again',
			title: 'Same question, same work',
			body: 'Each visit to the same page asks the database the same thing. The counter under it keeps climbing.'
		},
		{
			tag: 'Cache',
			title: 'Keep the answer',
			body: 'A <b>cache</b> is a place to store answers you already have, so you do not have to work them out again.'
		},
		{
			tag: 'Redis',
			title: 'Memory is fast',
			body: 'Redis keeps everything in RAM, so an answer comes back in about a millisecond. The database keeps its data on disk, much slower to reach.'
		},
		{
			tag: 'Miss',
			title: 'Not there yet',
			body: 'Redis is checked first. It is empty, so the server falls back to the database, then saves the answer under a <b>key</b>.'
		},
		{
			tag: 'Hit',
			title: 'Served from memory',
			body: 'The key is there, so the answer comes straight back from Redis. The database is not asked at all.'
		},
		{
			tag: 'Make it stick',
			title: 'Miss once, hit many times',
			body: 'The first visit pays the full price. Every visit after it gets the answer almost for free.'
		},
		{
			tag: 'Stale',
			title: 'An old copy',
			body: 'The database has a new price, but Redis still serves the old one until the key is cleared or expires.'
		},
		{
			tag: 'Try it',
			title: 'Open the page',
			body: 'The cache starts empty. Open the page and watch the first visit miss and the next ones hit.'
		}
	],
	locale: 'en-US',
	currency: 'Rp',
	keyName: 'product_1',
	product: { name: 'Nimbus Tee', price: 89000, salePrice: 59000 },
	serverLabel: 'App server',
	redisLabel: 'Redis',
	redisSub: 'in memory',
	dbLabel: 'Database',
	dbSub: 'on disk',
	emptyCache: 'empty',
	asked: 'asked {n} times',
	ms: 'ms',
	hitTag: 'hit',
	missTag: 'miss',
	directTag: 'no cache',
	staleTag: 'old price',
	saleTag: 'on sale',
	rule: 'Miss once, hit many times.',
	open: 'Open the page'
};

import type { CacheText } from './types';

export const en: CacheText = {
	title: 'Caching and Redis',
	intro: [
		'Opening a product page on nimbus.com looks simple, but behind it the server asks the database for the name, the price, the photos, the reviews, and the stock. That is a lot of queries, and a busy database can take most of a second to answer them all.',
		'Yet most visitors open the very same few pages, again and again. Asking the database the same question a thousand times a minute is a lot of wasted work.',
		'So we keep the answer the first time and reuse it. That is a <b>cache</b>, and you already met one in [[Caching and CDNs|traffic/cdn]]. A CDN keeps copies of files close to the visitors, this cache keeps ready made answers right next to the server.',
		'A popular tool for it is <b>Redis</b>, a tiny database that lives entirely in memory (RAM) instead of on disk. Reading from memory takes a millisecond or two, way faster than running a big query.',
		'The first visit is a <b>miss</b>. Redis does not have the answer yet, so the server asks the database and saves the answer in Redis on the way back. Every visit after that is a <b>hit</b>, served straight from memory.',
		'[fyi] There is a catch. When the real price changes, the cache may still hold the old one, which is called <b>stale</b> data. An old joke says there are only two hard things in computer science, cache invalidation and naming things.',
		'Your turn. Open a product page with the cache off and feel the wait. Then switch Redis on and open the same page twice.'
	],
	reactions: {
		slow: 'Feel that? Almost a second, every single time, because each visit makes the database do the whole job all over again. Switch the cache on.',
		miss: 'A miss. Redis had nothing yet, so the server went to the database the slow way and saved the answer on the way back. Open the same page again.',
		hit: 'A hit! Same page, a couple of milliseconds. The database did not even notice you. On a busy sale day, this is what keeps the database from melting.',
		stale:
			'Uh oh. The price changed in the database, but the page still shows the old one. Redis has no idea the truth moved. Clear that key from the cache.',
		fresh:
			'Fresh again. Clearing the key forced one more miss, and Redis now holds the new price. Real apps clear the key whenever the data changes, or give every key an expiry time (a TTL) so old answers fade away by themselves.'
	},
	keyPrefix: 'product_',
	locale: 'en-US',
	currency: 'Rp',
	products: [
		{ name: 'Nimbus Tee', price: 89000 },
		{ name: 'Cloud Cap', price: 65000 },
		{ name: 'Nimbus Mug', price: 45000 }
	],
	openBtn: 'Open {name}',
	cacheLabel: 'Redis cache',
	cacheOn: 'on',
	cacheOff: 'off',
	youLabel: 'You',
	appLabel: 'App server',
	redisLabel: 'Redis',
	redisSub: 'in memory',
	dbLabel: 'Database',
	dbSub: 'on disk',
	emptyCache: 'empty',
	loading: 'loading',
	idleScreen: 'Pick a product to open',
	visitsLabel: 'Recent visits',
	ms: 'ms',
	hitTag: 'hit',
	missTag: 'miss',
	directTag: 'no cache',
	staleTag: 'old price',
	saleBtn: 'Put {name} on sale in the database',
	clearBtn: 'Clear {key} from Redis',
	saleNote: 'The database now has a new price'
};

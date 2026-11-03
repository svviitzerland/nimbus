import type { LessonText } from '../../types';

export interface CacheProduct {
	name: string;
	price: number;
}

export interface CacheText extends LessonText {
	locale: string;
	/** Redis key prefix, the product id is appended (no spaces). */
	keyPrefix: string;
	currency: string;
	/** The three product pages a visitor can open, ids come from their position. */
	products: CacheProduct[];
	/** Template with {name}, the button that opens a product page. */
	openBtn: string;
	cacheLabel: string;
	cacheOn: string;
	cacheOff: string;
	youLabel: string;
	appLabel: string;
	redisLabel: string;
	redisSub: string; // in memory
	dbLabel: string;
	dbSub: string; // on disk
	emptyCache: string;
	loading: string;
	idleScreen: string;
	visitsLabel: string;
	ms: string;
	hitTag: string;
	missTag: string;
	directTag: string; // a visit with the cache switched off
	staleTag: string;
	/** Template with {name}, puts a product on sale in the database. */
	saleBtn: string;
	/** Template with {key}, deletes one key from Redis. */
	clearBtn: string;
	saleNote: string;
}

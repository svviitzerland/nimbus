import type { LessonText } from '../../types';

export interface CachePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface CacheText extends LessonText {
	/** One panel per scene of the guided visual (nine scenes). */
	panels: CachePanel[];
	locale: string;
	currency: string;
	/** The Redis key the answer is saved under (no spaces). */
	keyName: string;
	/** The product page every visitor opens, and its price after it goes on sale. */
	product: { name: string; price: number; salePrice: number };
	serverLabel: string;
	redisLabel: string;
	redisSub: string; // in memory
	dbLabel: string;
	dbSub: string; // on disk
	emptyCache: string;
	/** Template with {n}, how often the database had to answer. */
	asked: string;
	ms: string;
	hitTag: string;
	missTag: string;
	directTag: string; // a visit with no cache at all
	staleTag: string;
	saleTag: string;
	rule: string;
	/** The optional button on the last scene. */
	open: string;
}

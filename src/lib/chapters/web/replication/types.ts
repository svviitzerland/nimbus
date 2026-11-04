import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface ReplicationText extends LessonText {
	/** Side panel parts, one per beat (ten). */
	steps: GuideStep[];
	/** The app server on top of the picture. */
	appLabel: string;
	/** Names under the database cylinders. */
	dbLabel: string;
	primary: string;
	replica: string;
	/** The legend for the two kinds of traffic dots, and the copy dots. */
	read: string;
	write: string;
	copy: string;
	/** Small word next to each load meter. */
	load: string;
	/** The failover scene. */
	down: string;
	promoted: string;
	/** The sharding scenes. */
	tooBig: string;
	shard: string;
	/** The letter range each shard holds, left then right. */
	ranges: [string, string];
	/** Two users routed by the shard key, the first goes to shard 1, the second to shard 2. */
	users: [string, string];
	/** The remember scene, one word per idea. */
	memory: { copy: string; cut: string };
	/** The lag scene, a replica that has not received the newest change yet, then has. */
	lag: string;
	caughtUp: string;
}

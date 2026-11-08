import type { ReplicationText } from './types';

export const en: ReplicationText = {
	title: 'Replication and sharding',
	intro: [
		'nimbus.com keeps growing. Every visitor, every page, every order goes through <b>one database</b>. Watch its load meter climb. One machine can only answer so many questions at once.',
		'Look at what people actually do. Most of them just browse, reading products (the blue dots). Only a few place an order, which writes something new (the amber dots). Reads easily outnumber writes ten to one.',
		'So we make copies. One database becomes the <b>primary</b>, the boss. It is the only one allowed to take writes, so every order still lands in exactly one place.',
		'Next to it sit <b>replicas</b>. Each one copies every change from the primary, a moment after it happens. Keeping copies in step like this is called <b>replication</b>.',
		'Now the reads go to the replicas, which is why they are called <b>read replicas</b>. The load is shared, every meter calms down, and the primary has time for the orders.',
		'Copies help when things break too. If the primary dies, one replica is <b>promoted</b> to be the new primary and the shop keeps selling. Switching over like this is called <b>failover</b>.',
		'Replicas share the work, but each one still holds <b>all</b> the data. One day the users table is too big for any single machine. Then we split the rows themselves. That is <b>sharding</b>, and each part is a <b>shard</b>.',
		'The app picks the shard with a <b>shard key</b>, here the first letter of the name. Users A to M live on shard 1, N to Z on shard 2. Bima goes left, Nadia goes right, every time.',
		'[ingat] Replication is a <b>photocopier</b>, more copies of the same book so more people can read at once. Sharding is a pair of <b>scissors</b>, one book cut into volumes because it got too thick to hold.',
		'[fyi] Copies take a moment to arrive, called <b>replication lag</b>. Post a comment, refresh right away, and a replica may not have it yet. That is why apps often read your own fresh changes from the primary.'
	],
	reactions: {},
	steps: [
		{
			tag: 'One database',
			title: 'Everything in one place',
			body: 'Every read and every write hits the <b>same machine</b>. Busy days push it to its limit.'
		},
		{
			tag: 'Traffic',
			title: 'Reads and writes',
			body: '<b>Reads</b> look at data, <b>writes</b> change it. A shop gets far more looks than orders.'
		},
		{
			tag: 'Primary',
			title: 'The only one that writes',
			body: 'All writes go to the <b>primary</b>. One place for every change keeps the data from disagreeing.'
		},
		{
			tag: 'Replication',
			title: 'Copies that follow along',
			body: 'Each <b>replica</b> repeats every change the primary makes, a moment later.'
		},
		{
			tag: 'Read replicas',
			title: 'Share the reading',
			body: 'Reads are spread over the replicas. When reads grow again, just add another replica.'
		},
		{
			tag: 'Failover',
			title: 'A replica takes over',
			body: 'The primary is down, so a replica is <b>promoted</b>. Visitors barely notice.'
		},
		{
			tag: 'Sharding',
			title: 'Split the rows',
			body: 'Each <b>shard</b> holds only part of the rows, so no machine has to hold them all.'
		},
		{
			tag: 'Shard key',
			title: 'Which shard?',
			body: 'The <b>shard key</b> (here the first letter of the name) always sends a user to the same shard.'
		},
		{
			tag: 'Remember it',
			title: 'Photocopier and scissors',
			body: '<b>Replication</b> copies the whole book. <b>Sharding</b> cuts it into volumes.'
		},
		{
			tag: 'Side note',
			title: 'Replication lag',
			body: 'A replica can be a moment behind. Your own fresh writes are safest read from the <b>primary</b>.'
		}
	],
	appLabel: 'nimbus.com app',
	dbLabel: 'database',
	primary: 'primary',
	replica: 'replica',
	read: 'read',
	write: 'write',
	copy: 'copy',
	load: 'load',
	down: 'down',
	promoted: 'new primary',
	tooBig: 'too big for one machine',
	shard: 'shard',
	ranges: ['A to M', 'N to Z'],
	users: ['Bima', 'Nadia'],
	memory: { copy: 'Photocopier', cut: 'Scissors' },
	lag: 'not here yet',
	caughtUp: 'copied'
};

import type { BackupText } from './types';

export const en: BackupText = {
	title: 'Backup and recovery',
	intro: [
		'This is the nimbus.com database server, sitting in a data center in Jakarta. Every order a buyer places lands on the <b>disk</b> inside it, the part that remembers things even when the power is off.',
		'Disks are machines, and machines wear out. One day this one simply stops. Every order and every account on it, gone with one broken part. Somewhere in every data center, a disk dies like this every single day.',
		'So teams keep a <b>backup</b>, a copy of the data stored somewhere else. Here a second box in the same building quietly copies the database on a schedule, like a photocopy of your notebook.',
		'Now watch the bad day again. The disk dies, a fresh disk slides in, and the copy flows back. Putting the copy back is called <b>recovery</b>, or a <b>restore</b>. The orders are home again.',
		'But a backup is only as fresh as the last copy. Anything written after it is lost. Copy once a day and a crash late in the afternoon loses the whole day. Copy every hour and you lose minutes.',
		'[fyi] Same word, different world. A backup is not the standby region from [[failover|resilience/failover]]. Failover keeps the site running, a backup brings data back, even data someone deleted by mistake or [[ransomware|security/malware]] locked up.',
		'Where the copies live matters just as much. Experienced teams follow the <b>3 2 1 rule</b>. Three copies of the data, on two kinds of storage, with one kept off site, far away in another city.',
		'[ingat] Count it on your fingers. <b>3 copies, 2 kinds, 1 far away.</b> If one bad day can reach every copy at once, you do not really have a backup.',
		'Here is why the far copy matters. A fire takes the whole Jakarta building, the server and the backup box together. The copy in Singapore never felt a thing, and it brings nimbus.com back.',
		'Want to see the schedule make a difference? Pick how often to back up and watch one busy day end with a dead disk. Or just enjoy the show, that works too.'
	],
	reactions: {
		daily:
			'Ouch. The only copy was made at midnight, so every order placed since then died with the disk. Try every hour and watch the gap shrink.',
		hourly:
			'Much better. The newest copy was from four in the afternoon, so only the last forty minutes of orders were lost. That gap has a name, the <b>RPO</b>, how much data you can afford to lose.'
	},
	steps: [
		{
			tag: 'The original',
			title: 'Database server',
			body: 'One server, one <b>disk</b>, every order nimbus.com ever took. Right now it is the only place they live.'
		},
		{
			tag: 'The danger',
			title: 'A disk dies',
			body: 'No warning, no undo. Without another copy, the data goes down with the disk.'
		},
		{
			tag: 'The copy',
			title: 'Backup',
			body: 'A copy kept somewhere else, made again and again on a schedule, usually by itself at night or every hour.'
		},
		{
			tag: 'Getting it back',
			title: 'Restore',
			body: 'New disk in, copy flows back, orders return. A backup you never restored is only a hope, so teams practise this.'
		},
		{
			tag: 'Freshness',
			title: 'How often',
			body: 'Everything after the last copy is lost. The gap you can live with is called the <b>RPO</b>.'
		},
		{
			tag: 'Not the same',
			title: 'Backup is not failover',
			body: 'Failover keeps the site up. A backup brings old data back, even after a mistake.'
		},
		{
			tag: 'Where to keep it',
			title: 'The 3 2 1 rule',
			body: '<b>3</b> copies, on <b>2</b> kinds of storage, <b>1</b> of them off site.'
		},
		{
			tag: 'Rule of thumb',
			title: '3, 2, 1',
			body: 'Three copies, two kinds, one far away. One bad day should never reach them all.'
		},
		{
			tag: 'Off site',
			title: 'The far copy',
			body: 'Fire, flood, or theft hit a whole building. A copy in another city survives it.'
		},
		{
			tag: 'Optional',
			title: 'One busy day',
			body: 'Pick a schedule. The day runs, the disk dies, and the restore shows what was lost.'
		}
	],
	siteLabel: 'Jakarta data center',
	dbLabel: 'nimbus.com database',
	ordersLabel: 'orders',
	boxLabel: 'Backup box',
	offLabel: 'Singapore region',
	offSub: 'off site',
	deadTag: 'disk died',
	newTag: 'new disk',
	lostTag: '{n} lost',
	backTag: '{n} back',
	fireTag: 'fire',
	rule: ['3 copies', '2 kinds', '1 far away'],
	dailyLabel: 'Once a day',
	hourlyLabel: 'Every hour',
	startTime: '00.00',
	crashTime: '16.40',
	gapLabel: 'no copy',
	pickLabel: 'Back up how often?',
	plans: { daily: 'Once a day', hourly: 'Every hour' }
};

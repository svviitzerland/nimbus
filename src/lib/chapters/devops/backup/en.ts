import type { BackupText } from './types';

export const en: BackupText = {
	title: 'Backup and recovery',
	intro: [
		'Picture the hard drive inside the nimbus.com database server suddenly dying. Every order and every account, gone with one broken disk. And disks do die, every single day, somewhere in every data center.',
		'A <b>backup</b> is a copy of your data kept somewhere else. <b>Recovery</b>, also called a restore, is putting that copy back after something breaks.',
		'But a backup is only as fresh as the last time you made it. Anything written after that last copy is simply gone. So how often you back up decides how much you can lose.',
		'[fyi] Same word, different world. A backup is not the standby region from [[failover|resilience/failover]]. Failover keeps the site running, a backup brings data back, even data someone deleted by mistake or [[ransomware|security/malware]] locked up.',
		'Where the copies live matters just as much. Experienced teams follow the <b>3 2 1 rule</b>. Three copies of your data, on two kinds of storage, with one kept off site, far from the rest.',
		'Let us try it for real. Run a busy day at nimbus.com, pull the plug on the server, and see what the backup can bring back.'
	],
	reactions: {
		daily:
			'Ouch. The only copy was made at midnight, so every order placed since then died with the disk. Switch to a backup every hour and run the day again.',
		hourly:
			'Much better. The newest copy was from four in the afternoon, so only the last forty minutes of orders were lost. That gap has a name, the <b>RPO</b>, how much data you can afford to lose. Now the second act, where to keep the copies.',
		rule: 'That ticks every box of the 3 2 1 rule. Now see whether it holds when the whole building has a very bad day.',
		fireLost:
			'Every copy lived in the same building, so one fire took them all. Three copies look safe on paper, but not when they sit side by side. Try again and send one copy far away.',
		fireSafe:
			'The Jakarta data center is gone, but the copy in Singapore survived. Restore from it and nimbus.com lives again. That one off site copy is the whole point of the rule.'
	},
	acts: ['A bad day', 'The 3 2 1 rule'],
	nextAct: 'On to the 3 2 1 rule',
	dbLabel: 'nimbus.com database',
	ordersLabel: 'orders saved',
	backupLabel: 'Backup drive',
	lastCopy: 'newest copy {t}',
	noCopy: 'no copy yet',
	scheduleLabel: 'Back up',
	daily: 'once a day',
	hourly: 'every hour',
	runBtn: 'Run the day',
	crashBtn: 'The disk dies',
	restoreBtn: 'Restore from backup',
	againBtn: 'Run the day again',
	lostTag: '{n} orders lost',
	backTag: '{n} orders back',
	noteIdle: 'Pick how often to back up, then let the shop open',
	noteRunning: 'Orders keep coming in all day long',
	noteLive: 'Twenty to five, and the shop is busy',
	noteDead: 'The disk is dead and every order on it with it',
	noteDaily: 'Everything after midnight was never copied',
	noteHourly: 'Only the last few minutes slipped through',
	siteLabel: 'Jakarta data center',
	siteSub: 'where nimbus.com runs',
	offLabel: 'Singapore region',
	offSub: 'far away, off site',
	places: {
		original: 'Server disk',
		disk2: 'Second disk',
		nas: 'Backup box',
		cloud: 'Cloud storage'
	},
	kinds: {
		original: 'disk in the server',
		disk2: 'disk in the same server',
		nas: 'a separate storage box',
		cloud: 'object storage'
	},
	originalTag: 'original',
	pickHint: 'Pick two places for your extra copies',
	checkCopies: '{n} copies',
	checkKinds: '{n} kinds of storage',
	checkOff: 'one off site',
	fireBtn: 'Start a fire in Jakarta',
	resetBtn: 'Rebuild and try again',
	fireTag: 'fire',
	noteLost: 'Nothing left to restore from',
	noteSafe: 'One copy far away was enough'
};

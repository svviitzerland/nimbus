import type { VcCommandsText } from '../types';

export const en: VcCommandsText = {
	title: 'What is Git?',
	intro: [
		'Picture writing an assignment and saving it as <i>final.doc</i>. Tomorrow you revise it, so <i>final_real.doc</i>. The day after, <i>final_fix2.doc</i>. It gets messy fast, and you are still nervous about overwriting the old one.',
		'Git was made for exactly this. Every time you say save this version, Git takes a full <b>snapshot</b> of your file (its real name is a <b>commit</b>) with a short note. You still keep one file, yet every version is tucked away safely in the history.',
		'Behind that Commit button are a few everyday commands. <b>git status</b> shows what changed, <b>git add</b> puts it in the <b>staging area</b> (a table where you pick what goes in the photo), then <b>git commit</b> takes the snapshot. Later, <b>git push</b> sends snapshots to an online place and <b>git pull</b> brings the newest ones back.',
		'Try it yourself. Press Commit to snapshot the version, do it a few times, then open an old snapshot and see, nothing is ever lost.'
	],
	reactions: {
		firstCommit:
			'First snapshot saved. Your file is captured whole in the history now, and it is still the same single file.',
		grew: 'One more snapshot. Each commit stores a new version without erasing the old ones, so your history keeps growing.',
		checkout:
			'This is the whole point. You jumped back to an old snapshot and it looks exactly like it used to. Git keeps them all, so you can look back any time.',
		latest:
			'Back to the newest version. Looking back changed nothing, every version of yours is safe.'
	},
	docLabel: 'No snapshots yet',
	commitBtn: 'Commit',
	historyLabel: 'History',
	snapshotLabel: 'Snapshot {n}',
	commitMsgs: ['First draft', 'Tidy the intro', 'Add the ending', 'Fix a typo'],
	latestChip: 'Latest',
	viewingChip: 'Viewing snapshot {n}',
	backLatest: 'Back to latest',
	folderLabel: 'Your folder',
	stagingLabel: 'Staging area',
	onlineLabel: 'Online place',
	changedTag: 'changed',
	cmdHints: { status: 'look', add: 'pick', commit: 'snap', push: 'send', pull: 'fetch' }
};

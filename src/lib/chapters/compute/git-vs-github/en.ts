import type { GitRemoteText } from '../../types';

export const en: GitRemoteText = {
	title: 'Git is not GitHub',
	intro: [
		'Lots of people think Git and GitHub are the same thing. They are not. <b>Git</b> is the tool running on your laptop, the one that just made those snapshots. <b>GitHub</b> is an online place to keep and share the result.',
		'While your commits live only on your laptop, they are safe but alone. If the laptop is lost, they are gone with it. So you <b>push</b>, sending those commits to GitHub, so there is an online copy and other people can see them too.',
		'Walk the flow. Commit on the laptop first, then push to GitHub, and finally let a teammate <b>clone</b> the copy. Feel which part is local and which is already online.'
	],
	reactions: {
		committed:
			'Git made that commit, right on your laptop. It is still local, only on your machine, and has gone nowhere yet.',
		pushed:
			'You pushed to GitHub. Your commits now have an online copy, safe even if the laptop dies, and ready to share.',
		cloned:
			'Your teammate cloned from GitHub. They pulled the whole repo and its history onto their own laptop. This is how a team works on one project.'
	},
	laptopLabel: 'Your laptop',
	gitChip: 'Git',
	remoteLabel: 'GitHub',
	remoteSub: 'an online place',
	mateLabel: 'Teammate laptop',
	commitBtn: 'Commit on laptop',
	pushBtn: 'Push to GitHub',
	cloneBtn: 'Teammate clones',
	again: 'Again',
	localChip: 'only on your laptop',
	onlineChip: 'online, shareable'
};

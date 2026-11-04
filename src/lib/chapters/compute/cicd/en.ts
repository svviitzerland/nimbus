import type { CicdText } from '../types';

export const en: CicdText = {
	title: 'From commit to live',
	intro: [
		'Your app is running and watched. But how does each new change on your laptop reach the site people use (called <b>live</b>, or production) without breaking anything? The manual way is scary. You log into the server, copy the files, restart, and hope. One typo at two in the morning and the site is down.',
		'The calm way is a <b>pipeline</b>. You just push your change. The same steps run automatically every time. Build, test, then deploy.',
		'A pipeline has two halves. <b>CI</b> (continuous integration) builds your change into an app and tests it. That is the build and test part. <b>CD</b> (continuous delivery) ships the ones that pass to production. That is the deploy part. So CI makes sure your change is not broken, and CD puts it live.',
		'If a test fails, the pipeline stops right there. A broken change never reaches your users. Ship a good change, then a broken one. Watch the log in the console below.'
	],
	reactions: {
		pass: 'Clean run. Build passed, tests passed, deploy went on its own. Production moved to the new version. No late night, no copying files.',
		caught:
			'The test failed, and the pipeline stopped right there. Deploy never ran. Your users kept the working version. That is exactly the point.',
		both: 'That is CI and CD. CI keeps building and testing every change. CD deploys the ones that pass to live. You move faster precisely because the broken ones never get through.'
	},
	goodBtn: 'Ship a good change',
	badBtn: 'Ship a broken change',
	commitLabel: 'Commit',
	buildLabel: 'Build',
	testLabel: 'Test',
	deployLabel: 'Deploy',
	liveLabel: 'Production',
	safeNote: 'safe',
	ciSub: 'build and test',
	cdSub: 'deploy what passes',
	goodNote: 'Shipped. It passed every test and went live on its own.',
	badNote: 'Blocked. The test caught the broken change, so production stayed safe.',
	tryBothHint: 'Ship a good one and a broken one'
};

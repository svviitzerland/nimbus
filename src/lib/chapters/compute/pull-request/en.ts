import type { PullRequestText } from './types';

export const en: PullRequestText = {
	title: 'Pull requests and code review',
	intro: [
		'In a team, nobody quietly merges into main on their own. Citra built a Contact button on the branch <b>citra</b>, but before it joins main she wants a teammate to look first. On GitHub, you do that with a <b>pull request</b>.',
		'Citra pushes her branch to GitHub, then opens a pull request (often shortened to <b>PR</b>). It basically says, here is the branch citra, please check it, then merge it into main. A PR is a proposal, not an official change yet.',
		'The PR shows exactly what changed. Added lines are green with a plus sign, removed lines are red. So a teammate never has to guess, they only read the part that is different.',
		'Adi reads the change and leaves a comment on the button line, saying the button is too small on a phone. This is <b>code review</b>, teammates checking each other’s code before it joins main. It is not about judging, four eyes simply see more than two.',
		'Citra makes the button bigger, commits, and pushes again to the same branch. The PR updates by itself, no need for a new one. The talk and the fixes stay together on one page.',
		'Meanwhile, a few automatic tests run by themselves on every PR, called <b>checks</b>. A machine builds the site and runs its tests, then gives a green tick or a red cross. You will meet this machine later in [[CI/CD|compute/cicd]].',
		'The code looks good and the checks are green, so Adi presses <b>Approve</b>, his way of saying yes. Many teams set a rule, a PR can only be merged once someone approves and every check passes.',
		'Citra presses <b>Merge</b>. The branch citra joins main, the PR is marked as done, and the bigger Contact button goes live on nimbus.com. The whole discussion stays readable any time.',
		'[ingat] A PR is like handing your essay to a friend before you submit it. They mark it with a red pen (review), a spellchecker looks too (checks), you fix it, they sign it (approve), and only then it goes in (merge).',
		'[fyi] On GitLab it is called a <b>merge request</b>, but the idea is exactly the same. Usually main is locked too, so everyone, even the repo owner, has to go through a PR first.'
	],
	reactions: {},
	steps: [
		{
			tag: 'Before the PR',
			title: 'A waiting branch',
			body: 'Citra’s change is still on the branch <b>citra</b>. Main and the site know nothing about it yet.'
		},
		{
			tag: 'Pull request',
			title: 'A proposal',
			body: 'A PR says, please merge <b>citra</b> into <b>main</b>. Nothing changes until the PR is merged.'
		},
		{
			tag: 'Diff',
			title: 'What changed',
			body: 'Green with <b>+</b> means a new line, red with <b>&minus;</b> means a removed line. The rest is just context.'
		},
		{
			tag: 'Code review',
			title: 'A teammate reads along',
			body: 'A comment can sit right on the line it is about, so everyone knows which part is being discussed.'
		},
		{
			tag: 'The fix',
			title: 'Push again, the PR follows',
			body: 'A new commit on the same branch shows up in the PR right away. One PR, one conversation.'
		},
		{
			tag: 'Checks',
			title: 'Automatic checkers',
			body: 'A machine builds and tests every PR. A green tick means safe, a red cross means something broke.'
		},
		{
			tag: 'Approve',
			title: 'A yes from a teammate',
			body: 'The reviewer presses <b>Approve</b>. With an approval and green checks, the PR is ready to merge.'
		},
		{
			tag: 'Merge',
			title: 'Into main',
			body: 'The <b>Merge</b> button brings the branch into main. The site follows, and the PR closes as done.'
		},
		{
			tag: 'Remember it',
			title: 'The essay and the red pen',
			body: 'Review is the red pen, checks are the spellchecker, approve is the signature, merge is handing it in.'
		},
		{
			tag: 'Another name',
			title: 'Merge request',
			body: 'GitLab calls it a <b>merge request</b>. A locked main makes every change go this way.'
		}
	],
	prTitle: 'Add a Contact button',
	openBadge: 'Open',
	mergedBadge: 'Merged',
	notMerged: 'not in main yet',
	opened: 'Citra wants to merge citra into main',
	pageTitle: 'Cloud made easy',
	oldBtn: 'Sign up',
	newBtn: 'Contact',
	reviewer: 'Adi',
	comment: 'The button is tiny on a phone, can it be bigger?',
	fixCommit: 'Make the button bigger',
	checksLabel: 'Checks',
	checkNames: ['Build', 'Tests'],
	running: 'running',
	passed: 'passed',
	approved: 'Adi approved these changes',
	mergeBtn: 'Merge',
	mergedText: 'citra is now part of main',
	liveText: 'live on nimbus.com',
	lockNote: 'main is locked, everything goes through a PR',
	timeline: ['Opened', 'Review', 'Checks', 'Approve', 'Merge']
};

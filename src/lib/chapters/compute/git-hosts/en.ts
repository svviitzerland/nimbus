import type { GitHostsText } from '../../types';

export const en: GitHostsText = {
	title: 'Git hosting services',
	intro: [
		'GitHub is the most famous, but it is not the only one. Git is the tool, and the place you keep it can vary. There is <b>GitLab</b>, <b>Bitbucket</b>, even <b>Gitea</b> that you install on your own server.',
		'The key thing is they all speak the same Git. You can move the same repo from one to another without changing how you commit or push. Tap each service to see its own flavour.',
		'Then one question, if any of them works, why do most people still pick GitHub? Open the answer.',
		'[ingat] Git stays Git even when the repository host changes.'
	],
	reactions: {
		github:
			'GitHub, the busiest one. It is home to most open source projects, and it ships Actions for built in automation.',
		gitlab:
			'GitLab is strong at built in CI/CD pipelines and popular with companies that want to host it themselves.',
		bitbucket:
			'Bitbucket sits close to Atlassian tools like Jira and Trello, so it is handy for teams already on those.',
		gitea:
			'Gitea is lightweight and you run it on your own server, so your data stays fully in your hands.',
		why: 'Here is the gist. What wins is not the Git part, it is the crowd. The more people and projects on GitHub, the easier it is to be found, to learn, and to get hired from there.'
	},
	sameGitChip: 'They all speak the same Git',
	exploreHint: 'Tap each service to compare',
	hosts: [
		{
			id: 'github',
			name: 'GitHub',
			tagline:
				'The busiest place to keep code, home to countless open source projects and the largest community.',
			traits: ['Largest community', 'Actions built in', 'Free for public']
		},
		{
			id: 'gitlab',
			name: 'GitLab',
			tagline:
				'A full kit with CI/CD built in, a favourite of teams that want to run everything themselves.',
			traits: ['Strong CI/CD', 'Self hostable', 'Enterprise focus']
		},
		{
			id: 'bitbucket',
			name: 'Bitbucket',
			tagline: 'Tightly tied to Atlassian tools, comfy for teams already living in Jira.',
			traits: ['Ties into Jira', 'Good for small teams', 'By Atlassian']
		},
		{
			id: 'gitea',
			name: 'Gitea',
			tagline: 'Lightweight and installed on your own server, full control in your hands.',
			traits: ['Lightweight', 'Self hosted', 'Open source']
		}
	],
	whyBtn: 'Why mostly GitHub?',
	whyLabel: 'Why most people pick GitHub',
	whyPoints: [
		'<b>Network effect</b>. The most people and projects are here, so your friends and future teammates most likely are too.',
		'<b>Open source</b>. Most of the world open projects live on GitHub, so learning and contributing is easiest here.',
		'<b>Portfolio</b>. A GitHub profile often doubles as your technical resume, and many companies look at it.',
		'<b>Built in automation</b>. Actions runs your build and deploy with no extra tool.'
	]
};

import type { GitBranchText } from './types';

export const en: GitBranchText = {
	title: 'Branch, merge, and conflicts',
	intro: [
		'The nimbus.com site is kept in Git, and its main history has a name, <b>main</b>. Whatever is on main is what the site shows. Right now the homepage title says <i>Welcome to Nimbus</i>.',
		'Adi wants to try adding a Sign up button. If he edits main directly, one typo could go live. So he makes a <b>branch</b>, a copy line that splits off from main, a safe place to try things.',
		'Adi commits the button on the branch <b>adi</b>. Look at the site, nothing has changed. A commit on a branch lives only on that branch, and main stays untouched.',
		'The button is checked and fine. So Adi <b>merges</b>, which means bringing his branch back into main. Now the Sign up button is officially on main and goes live.',
		'The next day Adi and Citra work at the same time, each on their own branch. If they change different lines, Git combines both by itself. But this time they both change the same line, the homepage title.',
		'Adi merges first and it goes smoothly, the title becomes <i>Learn cloud from zero</i>. Then Citra merges, and Git stops. This is a <b>merge conflict</b>, two people changed the same line in different ways.',
		'Git will not guess who is right. It puts both versions inside the file, wrapped in special markers, and asks a human to choose. The top part is from main, the bottom part is from Citra.',
		'Citra has a quick chat with Adi, and they agree on <i>Cloud made easy</i>. Citra deletes the markers, keeps one title, and commits. The conflict is solved and main is tidy again.',
		'[ingat] Picture a photocopy of grandma’s recipe. A <b>branch</b> is the photocopy, scribble all you like without hurting the original. A <b>merge</b> copies your scribbles onto the real recipe. A <b>conflict</b> is two people crossing out the same word with different words, so someone has to decide.',
		'[fyi] Conflicts are normal, not a sign you messed up. To keep them rare, make small branches and merge often. The commands are short, <b>git switch -c adi</b> makes a new branch and <b>git merge adi</b> brings it back.'
	],
	reactions: {},
	steps: [
		{
			tag: 'Main',
			title: 'The main line',
			body: '<b>main</b> is the official history of the project. Whatever it holds is what nimbus.com shows.'
		},
		{
			tag: 'Branch',
			title: 'A copy line',
			body: 'A <b>branch</b> splits off from main. Changes made there do not touch main at all.'
		},
		{
			tag: 'Commit',
			title: 'Trying things safely',
			body: 'A commit on the branch <b>adi</b> exists only there. The live site still shows main.'
		},
		{
			tag: 'Merge',
			title: 'Back into main',
			body: 'A <b>merge</b> brings the commits from a branch into main. Only now does the change go live.'
		},
		{
			tag: 'Teamwork',
			title: 'Two branches at once',
			body: 'Adi and Citra each have a branch. Different lines combine by themselves, the same line can clash.'
		},
		{
			tag: 'Conflict',
			title: 'Git stops',
			body: 'Two different changes on <b>the same line</b>. Git cannot tell which one to keep.'
		},
		{
			tag: 'Conflict markers',
			title: 'A human chooses',
			body: 'Above <b>=======</b> is the main version, below it is Citra’s. Git writes the markers, they are not part of the site.'
		},
		{
			tag: 'Solved',
			title: 'One title left',
			body: 'The markers go, one title stays, then a commit. Main is clean again and the site follows.'
		},
		{
			tag: 'Make it stick',
			title: 'The recipe photocopy',
			body: 'A branch is the photocopy, a merge copies the scribbles back, a conflict is two scribbles on the same word.'
		},
		{
			tag: 'Commands',
			title: 'Small branches, merge often',
			body: '<b>git switch -c</b> makes a branch, <b>git merge</b> brings it back. Conflicts are normal, you just solve them.'
		}
	],
	siteTitles: {
		start: 'Welcome to Nimbus',
		adi: 'Learn cloud from zero',
		citra: 'Cloud made easy'
	},
	signupBtn: 'Sign up',
	liveChip: 'live from main',
	buttonCommit: 'button',
	titleCommit: 'title',
	conflictTag: 'conflict',
	resolvedTag: 'solved'
};

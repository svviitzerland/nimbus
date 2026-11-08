import type { TestingText } from './types';

export const en: TestingText = {
	title: 'Automated testing',
	intro: [
		'Every time you change the code of nimbus.com, something that used to work might break. Checking every page by hand after each change is slow, and one day you will forget one. Luckily, a computer can check the code by itself.',
		'You do it with a <b>test</b>, a small piece of code whose job is to check your code. Say there is a function called <b>total</b> that adds up a shopping cart. A test calls it with numbers you already know the answer to, 3 items at 10000 each must make 30000.',
		'When the test runs, the computer compares the function’s answer with the answer you expected. If they match, the test is <b>green</b> (it passes). If not, it is <b>red</b> (it fails) and you know right away that something is wrong.',
		'A test that checks one small piece on its own, like a single function, is called a <b>unit test</b>. It runs very fast, so one project can have hundreds of them.',
		'There is also the <b>integration test</b>, which checks several pieces working together. For example the signup form sends data to the server, and the server saves it in the database. It is slower, but it catches problems where the pieces connect.',
		'One day someone adds a discount feature but makes a typo, and the total gets divided by ten. The test turns red right away, expected 30000 but got 3000. A mistake like this is called a <b>bug</b>, and this one was caught before a single user saw it.',
		'The code gets fixed and the test is green again. Most importantly, tests run automatically on <b>every change</b>, not only when you remember. So the old code stays safe while you are busy writing new code.',
		'[ingat] A test is like the smoke alarm in a kitchen. Small and quiet every day, but it beeps the moment there is smoke, before the fire grows. Red is the beep, and you still have time to put it out.',
		'[fyi] Every language has its own test tools, like <b>Vitest</b> or <b>Jest</b> for JavaScript and <b>pytest</b> for Python. Tests are usually named like sentences, so when one fails you know straight away what broke.',
		'Your turn, if you like. Slip a bug into the function and watch the test catch it. Fix it, and it goes green again.'
	],
	reactions: {
		broke:
			'Red. The test caught the bug in a blink, and nimbus.com is still safe because this change never reached users.',
		fixed:
			'Green again. The code is right once more, and the test keeps watch on every change after this.'
	},
	steps: [
		{
			tag: 'The problem',
			title: 'Checking by hand',
			body: 'Opening every page one by one after every change is slow, boring, and easy to skip.'
		},
		{
			tag: 'Test',
			title: 'Code that checks code',
			body: 'A <b>test</b> calls your code with a clear input, then checks the answer.'
		},
		{
			tag: 'The result',
			title: 'Green or red',
			body: 'An answer that matches what you expected <b>passes</b>. Off by even a little, it <b>fails</b>.'
		},
		{
			tag: 'Unit test',
			title: 'One small piece',
			body: 'Checks one function on its own, with no server or database. Fast, and lots of them.'
		},
		{
			tag: 'Integration test',
			title: 'Pieces working together',
			body: 'Checks the form, the server, and the database at once. Slower, but it tests the joins.'
		},
		{
			tag: 'Bug',
			title: 'Red stops a bug',
			body: 'The test fails before the change ships, so users never see the wrong price.'
		},
		{
			tag: 'Every change',
			title: 'Runs by itself, always',
			body: 'Tests run automatically on every change, so nothing depends on someone remembering.'
		},
		{
			tag: 'Remember it',
			title: 'The smoke alarm',
			body: 'Quiet when all is well, loud the moment something is wrong, and always earlier than the fire.'
		},
		{
			tag: 'The tools',
			title: 'Test names read like sentences',
			body: 'Vitest, Jest, and pytest run your tests and show which are green and which are red.'
		},
		{
			tag: 'Try it',
			title: 'Break it, then fix it',
			body: 'Slip in a bug, see the test go red. Fix it, see it go green again.'
		}
	],
	handLabel: 'Checking by hand',
	pages: ['Home', 'Sign up', 'Cart', 'Pay'],
	forgotTag: 'forgot',
	testName: '3 items make 30000',
	idle: 'not run yet',
	running: 'running tests',
	passed: '1 test passed',
	failed: 'expected {exp}, got {got}',
	parts: ['Form', 'Server', 'Database'],
	unitLabel: 'unit test',
	integrationLabel: 'integration test',
	usersSafe: 'users not affected',
	everyChange: 'every change tested',
	toolsLabel: 'Popular test tools',
	breakBtn: 'Slip in a bug',
	fixBtn: 'Fix it'
};

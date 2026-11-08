import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'Application testing',
	intro: [
		'Our shop has one rule. Spending <b>100 coins or more</b> earns a 10 coin discount. But a customer spending exactly 100 gets none.',
		'A <b>test</b> compares code output with the expected result. Run the three examples here, below, exactly at, and above the boundary.',
		'<b>&gt;</b> means greater than, so 100 is excluded. Choose the comparison that matches the rule, then rerun. Do not change the expected result just to get green tests.',
		'This is a <b>unit test</b>, checking one small function. Integration tests check parts together. End to end tests exercise a user journey, such as browsing through checkout.',
		'[ingat] <b>Test below, at, and above.</b> Boundaries often hide bugs. Passing tests add evidence, but do not prove every possible case is correct.'
	],
	reactions: {
		failed:
			'Look at FAIL. Actual output differs from the shop rule. Change the operator, not the expected answer.',
		passed:
			'All three examples match. Keep the exact 100 case as a regression test to catch this bug if it returns.'
	},
	labLabel: 'Your experiment',
	goal: 'Get the discount boundary right',
	tasks: ['Find a failing test', 'Make every test pass'],
	hintLabel: 'Hint',
	hint: 'Run with > first. Try >= and rerun. Watch the 100 case.',
	scope: 'Local simulation. All examples run in this page without contacting nimbus.com.',
	labels: {
		rule: 'Spend at least 100 coins to get 10 coins off.',
		run: 'Run tests',
		operator: 'Comparison in code',
		results: 'Test results',
		waiting: 'Run tests to compare results',
		expected: 'Expected'
	}
};

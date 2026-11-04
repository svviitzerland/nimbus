import type { EvaluationText } from './types';

export const en: EvaluationText = {
	title: 'Model evaluation',
	intro: [
		"A clinic gets a new AI helper. It reads each patient's blood test and gives them a <b>risk score</b> from 0 to 100. The higher the score, the more likely that person is sick. Here come twenty patients, lined up by their score.",
		'Someone has to draw a line, called the <b>threshold</b>. Everyone to the right of it gets flagged and called back for a proper check. Everyone to the left goes home.',
		'Now the truth, which the AI never knew. Only three of these patients are really sick (the red ones). The score is a good hint, but it is not perfect, a few healthy people score high too.',
		'So the AI can be wrong in two ways. A <b>false alarm</b> flags a healthy person, who gets a scary phone call for nothing. A <b>missed case</b> sends a sick person home. Watch the line slide by itself.',
		'Slide it left and every sick person is caught, but false alarms pile up. Slide it right and the false alarms fade, but sick people slip through. You cannot remove both, so you choose which mistake hurts more. A clinic usually keeps the line low, because a second test can clear the healthy ones later.',
		'Here is a trap. Grading a model only by <b>accuracy</b> (how many answers were right) can fool you. A lazy AI that sends everyone home is right 17 times out of 20, that is 85%, and it catches nobody at all.',
		'[ingat] Think of a fishing net. A wide net catches every fish, plus a few old boots (false alarms). A tight net stays clean, but some fish slip away (missed cases). Picking the threshold is picking your net.',
		'[fyi] Your spam filter faces the same choice. A false alarm hides a real email from your boss in the spam folder, a missed case lets one more scam into your inbox. Email apps prefer a tighter net than a clinic does.',
		'Want to pick your own net? Drag the line and watch who gets caught, who gets missed, and who gets a scare for nothing. Totally optional.'
	],
	reactions: {
		catch:
			'Every sick person caught, and only a handful of false alarms. For a first check at a clinic, that is a good net.',
		noisy:
			'Everyone sick is caught, but look at all those false alarms. Half the clinic is getting a worrying call for nothing.',
		miss: 'Someone sick slipped under the line and went home. Fewer false alarms, sure, but at a clinic a missed case can be serious.'
	},
	panels: [
		{
			tag: 'Risk score',
			title: 'A number for every patient',
			body: 'The AI does not say yes or no. It gives each person a score from 0 to 100, and they are placed along the line by that score.'
		},
		{
			tag: 'Threshold',
			title: 'Where to draw the line',
			body: 'Anyone at or right of the line is <b>flagged</b> and called back. The model gives the score, people choose the line.'
		},
		{
			tag: 'The truth',
			title: 'Who is really sick',
			body: 'Red means truly sick. Most sick people score high, but one healthy person scores 80 and one sick person only 52.'
		},
		{
			tag: 'Two mistakes',
			title: 'False alarm and missed case',
			body: 'An amber ring is a <b>false alarm</b> (healthy, but flagged). A red ring is a <b>missed case</b> (sick, but sent home). A green ring is a sick person rightly caught.'
		},
		{
			tag: 'The choice',
			title: 'Which mistake hurts more',
			body: 'For an illness, missing someone is worse than a scare, so the line goes low. The right line depends on the job, not on a magic number.'
		},
		{
			tag: 'Accuracy',
			title: 'The 85% trap',
			body: 'When one group is rare, a model can score high by ignoring it. Always ask how many of the cases you care about were caught.'
		},
		{
			tag: 'Make it stick',
			title: 'Pick your net',
			body: 'A wide net (low line) catches everything, junk included. A tight net (high line) is clean but lets some through.'
		},
		{
			tag: 'Try it',
			title: 'Your own line',
			body: 'Drag the line left and right. Watch the three counts change together, you can never push all the mistakes to zero.'
		}
	],
	axis: 'Risk score from the test',
	flagged: 'called back',
	home: 'sent home',
	caught: 'Caught',
	missed: 'Missed',
	falseAlarm: 'False alarms',
	ofSick: '{n} of {total}',
	accuracy: '{n}% of answers right',
	wide: 'Wide net',
	tight: 'Tight net',
	rule: 'Wide net, catch it all plus junk. Tight net, clean but some slip away',
	thresholdAria: 'Threshold',
	thresholdValue: 'Flag from a score of {n}',
	patient: 'Patient with score {score}, {truth}',
	sick: 'actually sick',
	healthy: 'actually healthy',
	chartLabel: 'Twenty patients placed by risk score'
};

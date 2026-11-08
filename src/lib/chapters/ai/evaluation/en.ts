import type { EvaluationText } from './types';

export const en: EvaluationText = {
	title: 'Model evaluation',
	intro: [
		'A clinic gets a new AI that reads a blood test and gives every patient a <b>risk score</b> from 0 to 100. The higher the score, the more likely that person is sick. Now someone has to decide where to draw the line.',
		'That line is the <b>threshold</b>. Everyone scoring above it gets flagged as sick and called back for a proper check. Everyone below it goes home.',
		'The obvious way to grade a model is <b>accuracy</b>, the share of answers it got right. But there is a trap. Out of 20 patients only 3 are sick, so a lazy model that tells everyone they are fine is right 17 times out of 20 (that is 85%) without catching a single sick person.',
		'So we count the two kinds of mistakes separately. A <b>false alarm</b> (also called a false positive) flags a healthy person. A <b>missed case</b> (a false negative) sends a sick person home. Push one down and the other usually goes up.',
		'[fyi] Your spam filter faces the same choice. A false alarm hides a real email from your boss in the spam folder, a missed case lets one more scam into your inbox. Email apps would rather miss a little spam, while a clinic would rather have a few false alarms.',
		'[ingat] The threshold changes how many predictions are positive. Check false positives and false negatives to choose a suitable threshold.',
		'Here are the 20 patients, placed by their score, with the truly sick ones in red. Try the lazy model first, then drag the threshold and see who gets caught, who gets missed, and who gets a scare for nothing.'
	],
	reactions: {
		lazy: '85% accurate and completely useless. All three sick people went home. When one group is rare, accuracy alone can fool you badly.',
		low: 'Every sick person is caught, but look at all those false alarms. Half the clinic is getting a worrying phone call for nothing.',
		catch_all:
			'All three sick people caught, at the price of a few false alarms. For a first screening that is usually the right deal, a second test clears the healthy ones later.',
		miss: 'Someone sick slipped under the line and went home. Fewer false alarms, sure, but in a clinic a missed case can be serious.',
		best_acc:
			'Look, accuracy just hit 90%, the best number yet, while two of the three sick people are missed. The highest score is not always the best model.',
		done: 'You have seen the whole picture. Accuracy is a single number, but mistakes come in two kinds, and you pick the threshold by asking which mistake hurts more. Every serious model gets judged this way, from medicine to fraud checks.'
	},
	modeReal: 'Real test',
	modeLazy: 'Says everyone is fine',
	threshold: 'Flag as sick from a score of {n}',
	thresholdAria: 'Threshold',
	lazyNote: 'This model ignores the score and sends everyone home',
	accuracy: 'accuracy',
	caught: 'Caught',
	missed: 'Missed',
	falseAlarm: 'False alarm',
	cleared: 'Rightly sent home',
	axis: 'Risk score from the test',
	flagged: 'flagged as sick',
	sick: 'actually sick',
	healthy: 'actually healthy',
	patient: 'Patient with score {score}, {truth}',
	chartLabel: 'Twenty patients placed by risk score'
};

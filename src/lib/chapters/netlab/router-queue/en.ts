import type { RouterQueueText } from './types';

export const en: RouterQueueText = {
	title: 'Bandwidth management',
	intro: [
		'Monday morning. Sari is on a video call with a client, Dewi is reading her email, and Budi just started downloading a huge game update. Suddenly Sari’s call freezes.',
		'The office line from the ISP is 20 Mbps, like a road with a fixed number of lanes. Budi’s download opens many connections at once, so it grabs most of the lanes and squeezes everyone else onto the shoulder. You met this in [[bottleneck|trafficflow/bottleneck]].',
		'The fix is a <b>queue</b>. A simple queue on MikroTik says this address may use at most this much, its <b>max-limit</b>. Whatever Budi cannot use is left for the others.',
		'Sharing a line fairly, or giving some traffic priority, is called <b>QoS</b> (quality of service). The idea is in [[What is QoS|network/qos]].',
		'[fyi] Almost every RT RW net in Indonesia runs on this. Ten houses share one line, and a queue per house is what stops one family’s downloads from ruining the whole street’s evening.',
		'Your turn. Find who is hogging the line with torch, give Budi a queue, then slide the limits until everyone gets a fair slice.'
	],
	reactions: {
		torch:
			'Torch shows the traffic on ether2 right now, biggest first. 192.168.88.253 is Budi, eating most of the 20 Mbps by himself.',
		wrongUser:
			'That queue is on someone else. Budi is still free to take everything, so the call stays choppy. Put a queue on <b>192.168.88.253</b>.',
		tooHarsh:
			'Easy there, Budi has work to do too. Squeezing him that hard wastes a line the others are not even using. Give him at least 4M.',
		notYet:
			'Better, but Budi still takes too much. Sari’s call needs 3 Mbps, slide his limit a bit lower.',
		fair: 'Everyone fits now. Budi still downloads quickly, Sari’s call is smooth, and Dewi’s pages load. That is a fair slice for each.',
		tuned: 'Still fair for everyone. Feel free to play with the limits and watch the bars move.',
		noQueue: 'There are no queues yet. Add one first, for Budi.',
		stats:
			'The stats show each queue’s rate right now and how much it has moved so far. Admins check this to see who uses the line, and when.',
		error:
			'RouterOS did not get that one. Check the spelling, or type <b>?</b> to see what is there. Help can also type it for you.',
		done: 'The line is shared fairly. One queue per user is how offices and RT RW nets keep the peace. Next, a cafe style hotspot for guests.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Find the hog with torch',
		'Give Budi a queue',
		'Everyone gets a fair slice',
		'See the queues at work'
	],
	hintBtn: 'Help',
	doneNote: 'Nobody hogs the line anymore',
	ispLabel: 'ISP',
	inputLabel: 'command',
	termHint: '# type a RouterOS command, then press Enter',
	hintUnknown: '# that command does not exist, type ? to see the menu',
	didYouMean: '# maybe you meant {word}',
	lineLabel: 'ISP line, {n} Mbps shared by everyone',
	users: [
		{ name: 'Sari', doing: 'video call' },
		{ name: 'Budi', doing: 'huge download' },
		{ name: 'Dewi', doing: 'email and browsing' }
	],
	status: {
		smooth: 'smooth',
		choppy: 'choppy',
		fine: 'loads fine',
		slow: 'slow',
		downloading: 'downloading'
	},
	addQueue: 'Add queue',
	limitLabel: 'Max limit for {name}',
	unlimited: 'no queue, unlimited',
	hintTorch: '# the office is on ether2, try /tool torch interface=ether2',
	hintTarget: '# target is a laptop address, like 192.168.88.253/32 for Budi',
	hintLimit: '# max-limit looks like 10M/10M (upload/download)',
	hintNeeds: '# this command still needs {keys}',
	hintNoQueue: '# no such queue, see /queue simple print',
	hintStats: '# RATE is right now, BYTES is everything so far',
	hintExists: '# that laptop already has a queue, use /queue simple set'
};

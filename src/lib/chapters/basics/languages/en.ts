import type { LanguagesText } from './types';

export const en: LanguagesText = {
	title: 'Programming languages',
	intro: [
		'Here is a secret about every computer. The chip that does the real work, the <b>CPU</b> (the brain of the computer), cannot read words at all. It only understands <b>0 and 1</b>.',
		'Instructions written as pure 0 and 1 are called <b>machine code</b>. Long ago people really wrote programs like this, by hand. Slow, painful, and one wrong digit broke everything.',
		'So people invented friendlier ways to write instructions, <b>programming languages</b>. You write with words and symbols, and a translator (a [[compiler|basics/compiler]]) turns them into 0 and 1 for the CPU.',
		'Meet <b>C</b>, one of the classics, born in the 1970s. Same job, add 2 and 3 and show the answer. It is a little fussy with brackets and semicolons, but it runs very close to the machine, so it is fast.',
		'And here is <b>Python</b>. The exact same job, in one line. It reads almost like plain English, which is why so many people learn it first.',
		'Notice the trade. The higher up, the easier for people to write. The lower down, the closer to the machine, faster but fussier. No language wins at everything.',
		'So people pick a language the way you pick a tool from a toolbox. A hammer is not better than a screwdriver, it just fits nails.',
		'[fyi] Same word, different world. Spoken languages have grammar and slang, programming languages have rules too, only much stricter. Forget one bracket and the translator refuses to understand you, no matter how obvious it looks.',
		'[ingat] Pick by where the code lives. Web gets JavaScript, data and AI get Python, speed gets C, phones get Kotlin and Swift.',
		'That is the whole idea. If you like, tap any version of the code and watch it write itself again.'
	],
	reactions: {
		machine:
			'Nine bytes of 0 and 1, and this is only the adding part. Showing the answer on screen would take hundreds more rows. Nobody misses writing this by hand.',
		c: 'C asks you to spell things out, which library to use, where the program starts, a semicolon after each line. In return it runs fast.',
		python:
			'One line, and Python handles the fussy parts for you. It still gets translated into 0 and 1 before the CPU can run it.'
	},
	panels: [
		{
			tag: 'Machine code',
			title: 'All the CPU understands',
			body: 'The CPU reads 0 and 1 in groups of eight (each group is a <b>byte</b>). These nine bytes only put 2 in a box and add 3 to it.'
		},
		{
			tag: 'C',
			title: 'Close to the machine',
			body: 'Words and symbols instead of bits. A compiler turns this into machine code before it runs.'
		},
		{
			tag: 'Python',
			title: 'Close to people',
			body: 'The same job in a single line. Python hides the fussy details, and pays for it with a little speed.'
		},
		{
			tag: 'The trade',
			title: 'Easy or fast',
			body: 'Languages higher up are easier to read and write. Lower ones leave the machine less work to figure out, so they run faster.'
		},
		{
			tag: 'Toolbox',
			title: 'A language for each job',
			body: 'Most languages can do almost anything, but each one has the jobs it is famous for.'
		},
		{
			tag: 'Remember',
			title: 'Where does the code live?',
			body: 'In a browser, JavaScript. On a phone, Kotlin for Android or Swift for iPhone. Data and AI, Python. Raw speed, C.'
		},
		{
			tag: 'Look again',
			title: 'Same job, three ways',
			body: 'Tap any version to watch it write itself again.'
		}
	],
	taskLabel: 'Same job, add 2 and 3 and show the answer',
	langs: {
		machine: { name: 'Machine code', sub: 'what the CPU runs' },
		c: { name: 'C', sub: 'close to the machine' },
		python: { name: 'Python', sub: 'close to people' }
	},
	people: 'Easier for people',
	machine: 'Closer to the machine',
	cpu: 'CPU',
	jobs: {
		data: { lang: 'Python', job: 'Data and AI' },
		web: { lang: 'JavaScript', job: 'Websites' },
		speed: { lang: 'C', job: 'Speed, like games and operating systems' },
		phone: { lang: 'Kotlin and Swift', job: 'Phone apps' }
	},
	rule: 'Web gets JavaScript, data gets Python, speed gets C, phones get Kotlin and Swift.'
};

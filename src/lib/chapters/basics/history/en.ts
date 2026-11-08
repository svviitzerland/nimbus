import type { HistoryText } from './types';

export const en: HistoryText = {
	title: 'The story of computers',
	intro: [
		'Long before any machine, people counted on their fingers. Then came pebbles, and then the <b>abacus</b>, beads sliding on rods. With a few flicks a shopkeeper could add up a whole day of sales.',
		'Here is a fun surprise. For hundreds of years, a <b>computer</b> was not a machine at all, it was a person. Computers were people whose whole job was doing long calculations by hand, page after page.',
		'In the 1830s an English inventor, <b>Charles Babbage</b>, designed the Analytical Engine, a machine of brass gears that could follow instructions punched into cards. His friend <b>Ada Lovelace</b> wrote a plan for it to work out a tricky series of numbers, and that plan is often called the very first computer program.',
		'In 1936 a young mathematician, <b>Alan Turing</b>, imagined a simple machine that reads and writes symbols on a long strip of paper, following a list of rules. His big idea was that one machine could follow <i>any</i> list of rules you give it. That is exactly what every computer does today.',
		'Then came World War II. At Bletchley Park in England, Turing and his teammates designed machines that helped crack Enigma, the secret code of the German forces. This, plus his 1936 idea, is why he is often called a father of computer science.',
		'In 1945 the <b>ENIAC</b> was finished in the United States. It filled a whole room, weighed about 27 tonnes, and used around 18,000 glowing vacuum tubes as its switches. Programming it meant plugging cables by hand, and some of its very first programmers were women like Betty Snyder.',
		'Vacuum tubes were big, hot, and burned out often. In 1947 scientists at Bell Labs invented the <b>transistor</b>, a tiny switch with no glass and no glow. Same job, a fraction of the size.',
		'Machines still only understood numbers, which was hard work for people. <b>Grace Hopper</b> believed computers should understand words closer to English. In 1952 she built one of the first <b>compilers</b> (programs that turn words into machine numbers), and her ideas later grew into a language called COBOL. Her team once found a real moth stuck inside a computer and taped it in their logbook, a real life bug.',
		'In 1958 and 1959, Jack Kilby and Robert Noyce each found a way to put many transistors on one small piece of material, the <b>microchip</b>. Today a chip the size of your fingernail holds billions of them.',
		'Chips made computers small and cheap enough for a desk. In 1977 the Apple II arrived, then the IBM PC in 1981, and the <b>personal computer</b> moved into homes and schools.',
		'Computers were already talking over the internet, and in 1991 Tim Berners-Lee at CERN (a big science lab in Europe) opened the first website to the world. The <b>World Wide Web</b> turned the network into pages anyone could visit with a click.',
		'A smartphone combines a computer, touchscreen, camera, and cellular connection in one device. The iPhone introduced in 2007 is one example of the shift to touch interfaces.',
		'[ingat] <b>Room, desk, pocket.</b> ENIAC needed a room, a PC fits on a desk, and a smartphone fits in a pocket. Smaller components made new device shapes possible.',
		'The machines changed a lot, yet inside, the parts still do the same jobs. Next, we will [[open one up|basics/hardware]] and see what is in there. Tap a dot on the timeline if you want to visit an era again.'
	],
	reactions: {
		peek: 'You can revisit this part anytime. After this journey, we will open a laptop and meet the parts inside it.'
	},
	eras: [
		{
			mark: 'Long ago',
			title: 'The abacus',
			body: 'Beads on rods, where each rod stands for ones, tens, hundreds. Sliding a bead is like counting on a finger, just faster. People have used it for thousands of years.'
		},
		{
			mark: '1613',
			title: 'Human computers',
			body: 'The word <b>computer</b> is first found in writing in 1613, meaning a person who computes. Rooms full of them worked out tables for ships, science, and later space flights, all with paper and pencil.'
		},
		{
			mark: '1843',
			title: 'The Analytical Engine',
			body: 'A design for a machine of gears that reads instructions from punched cards, an idea borrowed from weaving looms. It was never fully built, but Ada Lovelace saw it could do much more than sums.'
		},
		{
			mark: '1936',
			title: 'Turing machine',
			body: 'Turing described a machine with a long tape and a head that reads, writes, and moves, one rule at a time. A <b>universal</b> machine can follow the rules of any other machine. That is the idea of software.'
		},
		{
			mark: '1940s',
			title: 'Bletchley Park',
			body: 'During the war, codebreakers there used machines called <b>Bombes</b> to test thousands of possible Enigma settings quickly, building on earlier work by Polish mathematicians.'
		},
		{
			mark: '1945',
			title: 'ENIAC',
			body: 'One of the first electronic, general purpose computers. It did about 5,000 additions every second, amazing then. Its switches were <b>vacuum tubes</b>, glass bulbs that got hot and burned out.'
		},
		{
			mark: '1947',
			title: 'The transistor',
			body: 'A tiny switch made from a solid material instead of a glass bulb. It turns on and off with far less heat, so machines could become smaller, cooler, and far more reliable.'
		},
		{
			mark: '1952',
			title: 'Early compilers',
			body: 'A <b>compiler</b> is a program that turns words people can read into the numbers a machine runs. Grace Hopper was one of the first to build one, and helped shape the COBOL language.'
		},
		{
			mark: '1958',
			title: 'The microchip',
			body: 'Many transistors and their wires made together on one small slice of material. One chip replaced a whole box of separate parts, which is why computers kept shrinking.'
		},
		{
			mark: '1977',
			title: 'The personal computer',
			body: 'A computer for one person, with a keyboard and a screen, on an ordinary desk. In the 1970s and 1980s families and schools started buying their own.'
		},
		{
			mark: '1991',
			title: 'The World Wide Web',
			body: 'Pages connected by links, that anyone can open in a browser. The <b>internet</b> is the roads between computers, the <b>web</b> is the pages travelling on them.'
		},
		{
			mark: '2007',
			title: 'The smartphone',
			body: 'A full computer with a touch screen, a camera, and the internet, small enough for a pocket. Inside its chip sit billions of transistors.'
		},
		{
			mark: 'Today',
			title: 'Computer size',
			body: 'Rule of thumb, <b>room, desk, pocket</b>. Each new switch was smaller than the last, so more of them fit, and more switches means more power.'
		}
	],
	photos: {
		babbage: { alt: 'Portrait photo of Charles Babbage', caption: 'Charles Babbage, 1860' },
		lovelace: { alt: 'Painted portrait of Ada Lovelace', caption: 'Ada Lovelace, about 1840' },
		turing: { alt: 'Photo of Alan Turing as a teenager', caption: 'Alan Turing, about 1928' },
		eniac: {
			alt: 'Glen Beck and Betty Snyder programming the ENIAC, a wall of cabinets and cables',
			caption: 'Glen Beck and Betty Snyder at ENIAC, about 1947'
		},
		hopper: { alt: 'Portrait photo of Grace Hopper in uniform', caption: 'Grace Hopper, 1984' }
	},
	timeline: 'Timeline of computers'
};

import type { KeysText } from './types';

export const en: KeysText = {
	title: 'Symmetric and asymmetric keys',
	intro: [
		'People have always wanted to send notes only the receiver could read. About 2000 years ago, Julius Caesar wrote to his generals by sliding every letter three places along the alphabet, so A became D and B became E.',
		'Whoever knew the secret "slide by three" could undo it and read the note. One secret that both locks and unlocks is called a <b>symmetric key</b>. It still powers the fast [[encryption|networking/encryption]] you use every day.',
		'In World War II, Germany used a machine called <b>Enigma</b>. Its spinning rotors scrambled every letter, and its settings changed every day. Alan Turing and his team at Bletchley Park built machines that cracked it, and that helped end the war sooner.',
		'But one shared key has a weak spot. Before your friend can open your note, the key has to travel to them. Watch the road. Someone in the middle quietly copies the key, and later opens your note with it.',
		'In 1976, Whitfield Diffie and Martin Hellman published an idea that sounded impossible. Split the key in two. A <b>public key</b> you may hand to anyone, and a <b>private key</b> that never leaves its owner. Two different keys, so it is called an <b>asymmetric key</b>.',
		"Watch the same road again. This time your friend sends you an open padlock. The eavesdropper can copy it, but a padlock can only lock. You snap it shut on your note, and only your friend's private key opens it.",
		'[ingat] The public key is an <b>open padlock anyone can snap shut</b>. The private key is <b>the only key that opens it</b>. Hand out padlocks freely, never the key.',
		'In 1977, three researchers at MIT (Ron Rivest, Adi Shamir and Leonard Adleman) made it work for real, and named it <b>RSA</b> after their initials. The trick hides in prime numbers. Multiplying two primes is instant, but finding them again from the answer is painfully slow.',
		'[fyi] Plot twist. Clifford Cocks, a mathematician at GCHQ (a British intelligence agency), found the very same idea in 1973. It was a state secret, so the world only heard about it in 1997.',
		'Today both kinds work as a team every time you open [[HTTPS|security/tls]], and the private key also powers [[digital signatures|security/signature]]. If you like, switch the road between one shared key and a padlock and watch the difference.'
	],
	reactions: {
		shared:
			'One shared key again. It has to travel first, the eavesdropper copies it on the way, and your note is not secret anymore.',
		padlock:
			"Padlock again. The eavesdropper copies an open padlock, which is useless for opening anything. Only your friend's private key gets the note out."
	},
	steps: [
		{
			tag: 'About 50 BC',
			title: 'A secret note',
			body: 'Caesar slid every letter three places. <b>HELLO</b> turns into <b>KHOOR</b>, and only someone who knows the slide can read it.'
		},
		{
			tag: 'One key',
			title: 'Symmetric key',
			body: 'The <b>same</b> secret locks the note and opens it again. Sender and receiver both need a copy.'
		},
		{
			tag: '1939 to 1945',
			title: 'Enigma and Bletchley Park',
			body: 'Enigma was still one shared key, just a very complicated one. Turing proved that even a clever machine can be cracked.'
		},
		{
			tag: 'The weak spot',
			title: 'The key has to travel',
			body: 'Whoever copies the key on the way can open <b>every</b> note sent with it. Sharing the key safely is the real headache.'
		},
		{
			tag: '1976',
			title: 'Split the key in two',
			body: 'A <b>public key</b> that anyone may hold, and a <b>private key</b> that stays home. They work as a pair.'
		},
		{
			tag: 'Two keys',
			title: 'Asymmetric key',
			body: 'Only the open padlock travels. Copying it gains nothing, because locking is all a padlock can do.'
		},
		{
			tag: 'Remember it',
			title: 'Padlock and key',
			body: 'Public key, an open padlock <b>anyone can snap shut</b>. Private key, the <b>only key that opens it</b>.'
		},
		{
			tag: '1977',
			title: 'RSA and prime numbers',
			body: 'A <b>prime</b> can only be divided by 1 and itself. Multiplying two is quick, going back means trying number after number. Real keys use primes hundreds of digits long.'
		},
		{
			tag: 'Side story',
			title: 'Found first, kept secret',
			body: 'Clifford Cocks had it in 1973, but spies keep their secrets. Diffie, Hellman and RSA still get the credit for sharing it with the world.'
		},
		{
			tag: 'Optional',
			title: 'Try both roads',
			body: 'Switch between one shared key and a padlock. Real HTTPS uses the padlock to pass a shared key safely, then the fast shared key for everything else.'
		}
	],
	youLabel: 'You',
	friendLabel: 'Your friend',
	snooperLabel: 'Eavesdropper',
	message: 'Meet at 7',
	tags: {
		copiedKey: 'key copied',
		copiedLock: 'padlock copied',
		read: 'note read',
		stuck: 'cannot open it'
	},
	sharedKey: 'one shared key',
	publicKey: 'public key',
	privateKey: 'private key',
	rule: { anyone: 'anyone can snap it shut', only: 'only this key opens it' },
	rsa: {
		easy: 'instant',
		hard: 'going back takes ages',
		tries: '{n} tries'
	},
	secret: 'SECRET',
	enigma: {
		alt: 'Photo of a real Enigma machine with its rotors, letter lamps, and keyboard',
		caption: 'A real Enigma machine'
	},
	turing: {
		alt: 'A black and white photo of a young Alan Turing in a suit',
		caption: 'Alan Turing, about 1928'
	},
	modes: { label: 'Send the note with', shared: 'One shared key', padlock: 'A padlock' }
};

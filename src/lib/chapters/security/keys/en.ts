import type { KeysText } from './types';

export const en: KeysText = {
	title: 'Symmetric and asymmetric keys',
	intro: [
		'People have always wanted to send messages only the receiver could read. About 2000 years ago, Julius Caesar wrote to his generals by shifting every letter three places, so A became D, B became E, and so on.',
		'Anyone who knew the "shift by three" secret could undo it and read the letter. One shared secret both locks and unlocks, and that is a <b>symmetric key</b>. It is the base of the [[Encryption|networking/encryption]] you already know.',
		'In World War II, Germany used the <b>Enigma</b> machine, far more complex, with its settings changed every day. Alan Turing and his team at Bletchley Park eventually broke it, and that helped shorten the war.',
		'But there was a bigger headache. How do you hand the same key to everyone safely? Enigma codebooks had to travel by courier and by ship, and more than once they were captured. Once the key leaks, every message can be read.',
		'In 1976, Whitfield Diffie and Martin Hellman published an idea that sounded impossible back then. Split the key in two. A <b>public key</b> you can hand to anyone, and a <b>private key</b> that never leaves its owner.',
		'<b>Asymmetric</b> encryption uses a public and private key pair. The public key can be shared for encrypting a message. Its paired private key decrypts it.',
		'A year later, in 1977, three researchers at MIT (Ron Rivest, Adi Shamir, and Leonard Adleman) built a working version, called <b>RSA</b> after their initials. The trick lives in prime numbers, numbers only divisible by 1 and themselves. Multiplying two big primes is easy, but splitting the result back into those two primes is extremely hard.',
		'[fyi] It turns out Clifford Cocks, a mathematician at the British GCHQ (an intelligence agency), had found the same idea in 1973. It was a state secret, so the world only heard about it in 1997.',
		'[ingat] For asymmetric encryption in this example, the public key encrypts and the private key decrypts. Keep the private key secret.',
		'Today both kinds work together every time you open [[HTTPS|security/tls]], and asymmetric keys are also the base of [[digital signatures|security/signature]]. Try it yourself in three acts. Send a secret note to your friend at nimbus.com, and watch out, someone is listening in the middle.'
	],
	reactions: {
		symKey:
			'The key reached your friend, but look at the eavesdropper. He quietly copied it as it went past. Now three people hold the very same key.',
		symRead:
			'Caught. The note was locked, but the eavesdropper has a copy of the key, so he opened it and read everything. That is the big problem with symmetric keys, the key has to travel too.',
		padlock:
			'The public key may be copied and shared. That copy does not provide the private key needed to decrypt messages in this example.',
		sealed:
			"Safe. The eavesdropper holds the box and the padlock, yet he cannot open a thing. Only your friend's private key fits. No secret key ever travelled the road.",
		multiply:
			'Instant, right? Multiplying two primes is a tiny job, even for the cheapest phone calculator.',
		factor1: 'Easy one. A small number splits in a try or two. Now the number gets bigger.',
		factor2:
			'Feel it yet? You had to test more primes before one fit. Try the last one, it is the number we just multiplied.',
		factor3:
			'61 times 53 is 3233. This small example shows multiplication is easier than trial factoring. RSA uses much larger numbers and needs suitable key sizes and implementation.'
	},
	acts: ['One key', 'Asymmetric keys', 'Primes'],
	actLabel: 'Act {n}',
	nextAct: 'On to the next act',
	youLabel: 'You',
	friendLabel: 'Your friend',
	friendSub: 'nimbus.com',
	snooperLabel: 'Eavesdropper',
	message: 'Meet at 7',
	cipher: 'Phhw dw 7',
	keyChip: 'key',
	padlockChip: 'public key',
	boxChip: 'locked box',
	privateKey: 'private key',
	sym: {
		sendKey: 'Send the key first',
		sendBox: 'Send the locked note',
		copiedTag: 'key copied',
		readTag: 'read',
		noteIdle: 'To open your note, your friend needs the same key',
		noteKey: 'Your friend has the key now, and so does the eavesdropper',
		noteRead: 'The eavesdropper opens your note with his stolen key'
	},
	asym: {
		askLock: 'Request the public key',
		sendBox: 'Lock the box and send it',
		copiedTag: 'public key copied',
		stuckTag: 'cannot open it',
		noteIdle: 'The recipient shares their public key',
		noteLock: 'Use the public key to encrypt the message',
		noteSafe: "Only your friend's private key can open this box"
	},
	rsa: {
		multiplyBtn: 'Multiply 61 × 53',
		instant: 'instant',
		prompt: 'Which prime times which prime makes {n}?',
		pickHint: 'Tap a prime to try dividing by it',
		tries: '{n} tries',
		triesOne: '1 try',
		autoBtn: 'Let Nim try them one by one',
		nextBtn: 'Next number',
		effortLabel: 'How hard it is to go back',
		realLabel: 'The size of a number in a real RSA key',
		realDigits: 'and hundreds of digits more (about 617 in total)',
		forever: 'longer than the age of the universe'
	}
};

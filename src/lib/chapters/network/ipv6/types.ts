import type { LessonText } from '../../types';

export interface Ipv6Text extends LessonText {
	growBtn: string; // template with {year}, hands out addresses to the next era
	switchBtn: string; // move the world to IPv6
	sandBtn: string; // give every grain of sand an address
	yearLabel: string; // template with {year}
	devicesLabel: string; // template with {n}, how many devices want an address
	billion: string; // template with {n}
	poolV4: string; // heading over the pool in IPv4 mode
	poolV6: string; // heading over the pool in IPv6 mode
	seatHint: string; // what one square in the IPv4 grid stands for
	outside: string; // template with {n}, devices left without an address
	dotLabel: string; // caption on the tiny dot all devices use in IPv6
	sandLabel: string; // caption once sand has addresses too
	sampleLabel: string; // heading over the sample address
	totalLabel: string; // heading over the total count
	bits: string; // template with {n}
	scale: string; // the closing size comparison in IPv6 mode
	decimal: string; // decimal mark for this language, '.' or ','
	thousands: string; // thousands separator for this language
	notes: {
		idle: string;
		growing: string;
		tight: string;
		full: string;
		v6: string;
		sand: string;
	};
}

import type { LessonText } from '../../types';

export interface DhcpText extends LessonText {
	routerLabel: string;
	routerSub: string; // what the router is doing here, the DHCP server
	boardLabel: string; // heading over the board of keys (the address pool)
	keyFree: string;
	keyLent: string;
	keyCooling: string; // the lease is running out after someone left
	arriveBtn: string;
	guestLabel: string; // template with {n}
	doorLabel: string; // the spot where a newcomer waits
	noAddress: string; // tag on a newcomer who got nothing
	tapToLeave: string; // hint under the seats
	/** The four DHCP messages, short name and a plain caption each. */
	steps: { name: string; say: string }[];
	slipTitle: string; // template with {n}, what that guest received
	slip: { address: string; gateway: string; dns: string; lease: string; leaseValue: string };
	notes: {
		idle: string;
		asking: string;
		joined: string;
		empty: string;
		cooling: string;
		rejoin: string;
	};
}

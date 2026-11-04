import type { LessonText } from '../../types';

export interface DhcpText extends LessonText {
	/** What the side panel says, one entry per beat of `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	sceneLabel: string; // accessible name of the cafe drawing
	routerLabel: string;
	routerSub: string; // what the router is doing here, the DHCP server
	boardLabel: string; // heading over the board of keys (the address pool)
	noAddress: string; // tag on a newcomer who has no address yet
	/** The four DHCP messages, short name and a plain line each. */
	dora: { name: string; say: string }[];
	slipTitle: string; // heading over what the phone received
	slip: { address: string; gateway: string; dns: string; lease: string; leaseValue: string };
	leaving: string; // tag while the lease runs out after the phone left
	arriveBtn: string; // optional play, another guest walks in
	emptyLabel: string; // tag on a guest who finds the board empty
}

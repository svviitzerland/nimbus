import type { LessonText } from '../../types';

export interface Ipv6Text extends LessonText {
	/** What the side panel says, one entry per beat of `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	v4Label: string; // caption over an IPv4 address
	v6Label: string; // caption over an IPv6 address
	partHint: string; // under each IPv4 number, its range
	poolLabel: string; // heading over the IPv4 pool
	poolCount: string; // how many addresses the pool holds
	yearLabel: string; // template with {year}
	outsideLabel: string; // tag on devices left without an address
	fieldLabel: string; // heading over the IPv6 space
	fieldCount: string; // how many addresses IPv6 holds
	dotLabel: string; // caption on the tiny dot that is all of IPv4
	ruleV4: string; // the memory trick line for IPv4
	ruleV6: string; // the memory trick line for IPv6
	skipped: string; // caption on the version 5 that never shipped
	bothLabel: string; // a device holding both kinds of address
	sandBtn: string; // optional play, give every grain of sand an address
	sandLabel: string; // caption once the sand has addresses
}

import type { LessonText } from '../../types';

export interface RoutingText extends LessonText {
	laptopLabel: string; // the sender, your office laptop
	routerA: string; // the router whose table the learner edits
	routerB: string;
	routerC: string;
	knowsB: string; // tiny caption under Router B, what its table knows
	knowsC: string; // tiny caption under Router C
	serverLabel: string; // the nimbus.com server
	serverSub: string; // its address
	filesLabel: string; // the other server, behind Router C
	packetChip: string; // label on the travelling packet
	tableTitle: string; // template with {name}, heading over the editable table
	destCol: string; // column heading, destination
	hopCol: string; // column heading, next hop
	destValue: string; // the destination network, a real looking prefix
	emptyRow: string; // shown while the table has no route
	pickHop: string; // prompt over the next hop chips
	viaB: string;
	viaC: string;
	deleteBtn: string;
	sendBtn: string;
	noteIdle: string;
	noteDelivered: string;
	noteNoRoute: string; // template with {name}
	noteWrong: string; // template with {name}
	lostTag: string; // badge where a packet is dropped
	okTag: string; // badge when the packet arrives
}

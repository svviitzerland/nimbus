import type { LessonText } from '../../types';

export interface RoutingText extends LessonText {
	/** One side panel step per beat, in the same order as `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	laptopLabel: string; // you, the sender
	homeRouter: string; // the router at home
	ispRouter: string; // the ISP's router, the one with the big signpost
	nextRouter: string; // the router near the nimbus.com server
	otherLabel: string; // the cloud of other networks
	serverLabel: string; // nimbus.com
	serverSub: string; // its address
	packetTo: string; // the address label shown on the packet
	signNimbus: string; // signpost arm towards nimbus.com
	signOther: string; // signpost arm towards other networks
	signDefault: string; // the home router's one arm, the default route
	droppedTag: string; // badge where a packet is dropped
	knockBtn: string; // optional play, knocks the signpost over
	fixBtn: string; // puts it back
}

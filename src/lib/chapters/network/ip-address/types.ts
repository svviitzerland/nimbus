import type { LessonText } from '../../types';

export interface IpAddressText extends LessonText {
	internetLabel: string; // the zone above the house
	strangerLabel: string; // someone out on the internet
	houseLabel: string; // the home network
	phoneLabel: string;
	laptopLabel: string;
	routerLabel: string;
	/** The addresses, kept the same in every language so the reactions can quote them. */
	ips: { phone: string; laptop: string; routerIn: string; routerOut: string };
	insideTag: string; // marks the router's private face
	outsideTag: string; // marks the router's public face
	privateTag: string; // chip on a private address
	publicTag: string; // chip on the public address
	tapHint: string; // before every device is revealed
	knockPrompt: string; // once all three are revealed, asks to pick an address
	knockLabel: string; // heading over the address buttons
	lostNote: string; // template with {ip}
	hitNote: string; // template with {ip}
	lostTag: string; // small tag where the knock fizzles out
	hitTag: string; // small tag on the router when the knock lands
}

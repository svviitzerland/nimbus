import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterHotspotText extends RouterLabText {
	// missions, in order: hotspot setup, a one hour voucher, the phone logs in, active list
	apLabel: string; // the guest WiFi access point on ether3
	wifiName: string; // the network name the phone joins
	phone: {
		joinBtn: string; // join the guest WiFi
		joining: string;
		noNet: string; // joined, but nothing answers (no hotspot yet)
		retry: string;
		loginTitle: string; // heading on the captive portal
		loginSub: string; // line under the heading
		user: string; // field labels
		pass: string;
		loginBtn: string;
		bad: string; // wrong voucher
		used: string; // voucher already used up
		welcome: string; // template with {user}
		left: string; // label before the countdown
		siteOk: string; // nimbus.com loaded line
		skip: string; // jump one hour ahead
		expired: string; // shown after the hour is up
	};
	// Muted "#" lines the terminal prints to help after a command
	hintIface: string;
	hintWizard: string;
	hintNeeds: string; // template with {keys}
	hintUptime: string;
	hintNoActive: string;
	hintNoHotspot: string;
	hintVoucher: string; // template with {user} and {pass}, printed after a voucher is made
}

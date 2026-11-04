import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterHotspotText extends RouterLabText {
	apLabel: string; // the guest WiFi access point on ether3
	wifiName: string; // the network name the phone joins
	phone: {
		searching: string; // before the hotspot exists
		loginTitle: string; // heading on the captive portal
		loginSub: string; // line under the heading
		user: string; // field labels
		pass: string;
		loginBtn: string;
		welcome: string; // template with {user}
		left: string; // label before the countdown
		siteOk: string; // nimbus.com loaded line
		expired: string; // shown on the login page after the hour is up
	};
	// Muted "#" lines the terminal prints next to real output
	hintSetup: string; // after the wizard, says what it built
	hintVoucher: string; // after the voucher, like printing the slip
}

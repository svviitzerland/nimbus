import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterIpText extends RouterLabText {
	// missions, in order: plug a laptop, pool, dhcp network, dhcp server, lease list
	plugCaption: string; // under the drawing, invites tapping a laptop
	gotCaption: string; // under the drawing once laptops have addresses
	// Muted "#" lines the terminal prints to help after a command
	hintApipa: string; // a laptop gave up and picked 169.254.x.x
	hintPoolRange: string; // the range is outside 192.168.88.0/24 or covers .1
	hintGateway: string; // gateway should be the router, 192.168.88.1
	hintIface: string; // the office is on ether2
	hintDisabled: string; // the new server is still disabled
	hintNoPool: string; // address-pool does not exist yet
	hintNeeds: string; // template with {keys}
	hintNoLease: string; // lease list is empty
	hintBound: string; // explains "bound"
	hintWizard: string; // printed before the setup wizard starts
}

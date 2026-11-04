// Pure pieces of the simulated Cisco IOS shared by the Cisco Lab lessons (cisco-intro, cisco-ip,
// cisco-nat, cisco-acl, cisco-vlan, cisco-ssh): the device model, the command grammar per mode,
// the parser with IOS style abbreviations, and the factory configs. No browser APIs here, so it
// is safe on the server.
import { closest, intToIp, ipToInt, isIp, pad } from '../routerlab/ros';

export { closest, intToIp, ipToInt, isIp, pad };

// ---- Device model ----
export type Dev = 'router' | 'switch';
export type Mode = 'user' | 'priv' | 'config' | 'if' | 'range' | 'line' | 'dhcp' | 'vlan';
export const MODE_SUFFIX: Record<Mode, string> = {
	user: '>',
	priv: '#',
	config: '(config)#',
	if: '(config-if)#',
	range: '(config-if-range)#',
	line: '(config-line)#',
	dhcp: '(dhcp-config)#',
	vlan: '(config-vlan)#'
};
export const isConfig = (m: Mode) => m !== 'user' && m !== 'priv';

export type Iface = {
	name: string;
	ip?: string;
	mask?: string;
	dhcp?: boolean;
	shut: boolean;
	/** A live cable is plugged in (set by the stage, not by config). */
	cable: boolean;
	desc?: string;
	nat?: 'inside' | 'outside';
	aclIn?: string;
	aclOut?: string;
	swMode?: 'access' | 'trunk';
	vlan: number;
};
export type Pool = { name: string; network?: string; mask?: string; gw?: string; dns: string[] };
export type AclAddr = { any: true } | { ip: string; wild: string };
export type Ace = {
	seq: number;
	action: 'permit' | 'deny';
	proto: string; // 'ip' for standard lists
	src: AclAddr;
	dst?: AclAddr;
	port?: number;
};
export type Acl = { id: string; ext: boolean; aces: Ace[] };
export type LineCfg = {
	acl?: string;
	login?: 'local' | 'line';
	pass?: string;
	transport?: string[];
};
export type Cfg = {
	hostname: string;
	ifaces: Iface[];
	pools: Pool[];
	excluded: [string, string][];
	acls: Acl[];
	nat?: { list: string; iface: string; overload: boolean };
	enableSecret?: string;
	enablePassword?: string;
	domain?: string;
	users: { name: string; secret: string; kind: 'secret' | 'password' }[];
	vty: LineCfg;
	con: LineCfg;
	vlans: { id: number; name: string }[];
	sshVer?: number;
	rsa?: number;
	pwEncrypt?: boolean;
	noLookup?: boolean;
};

export const PORT_NAMES: Record<Dev, string[]> = {
	router: ['GigabitEthernet0/0', 'GigabitEthernet0/1', 'GigabitEthernet0/2'],
	switch: [
		...Array.from({ length: 8 }, (_, i) => `FastEthernet0/${i + 1}`),
		'GigabitEthernet0/1',
		'GigabitEthernet0/2'
	]
};
/** GigabitEthernet0/1 into Gi0/1, the short form IOS prints in tables. */
export const short = (n: string) =>
	n.replace('GigabitEthernet', 'Gi').replace('FastEthernet', 'Fa');

const iface = (name: string, o: Partial<Iface> = {}): Iface => ({
	name,
	shut: false,
	cable: false,
	vlan: 1,
	...o
});

/**
 * The office router at a given point of the lab. 0 is factory fresh (hostname Router), each level
 * adds what the previous lesson built: 1 named nimbus, 2 the office LAN and its DHCP pool,
 * 3 NAT overload to the ISP.
 */
export function officeRouter(level: 0 | 1 | 2 | 3): Cfg {
	const lan = level >= 2;
	return {
		hostname: level >= 1 ? 'nimbus' : 'Router',
		ifaces: [
			iface('GigabitEthernet0/0', {
				dhcp: true,
				ip: '10.20.30.2',
				mask: '255.255.255.0',
				cable: true,
				nat: level >= 3 ? 'outside' : undefined
			}),
			iface('GigabitEthernet0/1', {
				shut: !lan,
				cable: true,
				ip: lan ? '192.168.88.1' : undefined,
				mask: lan ? '255.255.255.0' : undefined,
				nat: level >= 3 ? 'inside' : undefined
			}),
			iface('GigabitEthernet0/2', { shut: true })
		],
		pools: lan
			? [
					{
						name: 'OFFICE',
						network: '192.168.88.0',
						mask: '255.255.255.0',
						gw: '192.168.88.1',
						dns: ['8.8.8.8']
					}
				]
			: [],
		excluded: lan ? [['192.168.88.1', '192.168.88.10']] : [],
		acls:
			level >= 3
				? [
						{
							id: '1',
							ext: false,
							aces: [
								{
									seq: 10,
									action: 'permit',
									proto: 'ip',
									src: { ip: '192.168.88.0', wild: '0.0.0.255' }
								}
							]
						}
					]
				: [],
		nat: level >= 3 ? { list: '1', iface: 'GigabitEthernet0/0', overload: true } : undefined,
		users: [],
		vty: {},
		con: {},
		vlans: [],
		noLookup: level >= 1
	};
}

/** The office access switch (a small Catalyst with eight FastEthernet ports and two uplinks). */
export function officeSwitch(): Cfg {
	return {
		hostname: 'nimbus-sw',
		ifaces: PORT_NAMES.switch.map((n) => iface(n)),
		pools: [],
		excluded: [],
		acls: [],
		users: [],
		vty: {},
		con: {},
		vlans: [],
		noLookup: true
	};
}

// ---- Address helpers ----
export function maskBits(mask: string): number | null {
	if (!isIp(mask)) return null;
	const n = ipToInt(mask);
	const bits = n.toString(2).padStart(32, '0');
	if (!/^1*0*$/.test(bits)) return null;
	return bits.indexOf('0') < 0 ? 32 : bits.indexOf('0');
}
export const prefixMask = (p: number) => intToIp(p === 0 ? 0 : (2 ** 32 - 2 ** (32 - p)) >>> 0);
export function networkOf(ip: string, mask: string) {
	const p = maskBits(mask) ?? 32;
	const size = 2 ** (32 - p);
	return intToIp(Math.floor(ipToInt(ip) / size) * size);
}
export function inNet(ip: string, net: string, mask: string) {
	return networkOf(ip, mask) === networkOf(net, mask);
}
/** Does a wildcard style ACL address match this IP? */
export function aclHit(a: AclAddr, ip: string) {
	if ('any' in a) return true;
	const care = ~ipToInt(a.wild);
	return (ipToInt(ip) & care) >>> 0 === (ipToInt(a.ip) & care) >>> 0;
}
export function aclAddrText(a: AclAddr, forShow = false) {
	if ('any' in a) return 'any';
	if (a.wild === '0.0.0.0') return forShow ? a.ip : `host ${a.ip}`;
	return `${a.ip} ${a.wild}`;
}
export const PORT_NAMES_TCP: Record<string, number> = {
	www: 80,
	telnet: 23,
	ftp: 21,
	smtp: 25,
	domain: 53
};
export function aceText(a: Ace, ext: boolean, forShow = false) {
	if (!ext) return `${a.action} ${aclAddrText(a.src, forShow)}`;
	const name = Object.entries(PORT_NAMES_TCP).find(([, v]) => v === a.port)?.[0];
	const port = a.port === undefined ? '' : ` eq ${name ?? a.port}`;
	return `${a.action} ${a.proto} ${aclAddrText(a.src)} ${aclAddrText(a.dst ?? { any: true })}${port}`;
}

/** A believable but fake type 9 hash, so secrets never show up as plain text. */
export function fakeHash(s: string) {
	const abc = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	let h = 2166136261;
	let out = '';
	for (let i = 0; i < 57; i++) {
		h = Math.imul(h ^ s.charCodeAt(i % Math.max(1, s.length)) ^ i, 16777619) >>> 0;
		out += abc[h % abc.length];
	}
	return `$9$${out.slice(0, 14)}$${out.slice(14)}`;
}

// ---- Grammar ----
/** One word of the IOS grammar. A keyword when `p` is missing, otherwise a parameter. */
export type G = {
	w: string;
	help: string;
	p?: (t: string) => boolean;
	k?: G[];
	/** Command id when the line may end here (shown as <cr> in help). */
	id?: string;
	/** Swallows the rest of the line (descriptions, passwords). */
	rest?: boolean;
};
const kw = (w: string, help: string, k?: G[], id?: string): G => ({ w, help, k, id });
const arg = (w: string, help: string, p: (t: string) => boolean, k?: G[], id?: string): G => ({
	w,
	help,
	p,
	k,
	id
});
const rest = (w: string, help: string, id: string): G => ({
	w,
	help,
	p: () => true,
	rest: true,
	id
});
const num = (a: number, b: number) => (t: string) => /^\d+$/.test(t) && +t >= a && +t <= b;
const word = (t: string) => /^[^\s?]+$/.test(t);
const IP = 'A.B.C.D';

function ifTypes(dev: Dev) {
	return dev === 'router'
		? [{ type: 'GigabitEthernet', help: 'GigabitEthernet IEEE 802.3z', slot: '<0-0>/<0-2>' }]
		: [
				{ type: 'FastEthernet', help: 'FastEthernet IEEE 802.3', slot: '<0-0>/<1-8>' },
				{ type: 'GigabitEthernet', help: 'GigabitEthernet IEEE 802.3z', slot: '<0-0>/<1-2>' }
			];
}
/** "interface X" style references, any existing port of this device. */
function ifRef(dev: Dev, k: G[] | undefined, id: string | undefined): G[] {
	return ifTypes(dev).map((t) =>
		kw(t.type, t.help, [
			arg(t.slot, `${t.type} interface number`, (v) => PORT_NAMES[dev].includes(t.type + v), k, id)
		])
	);
}
function ifRange(dev: Dev): G[] {
	return ifTypes(dev).map((t) => {
		const valid = (v: string) => {
			const r = /^(\d+\/)(\d+)(?:-(\d+))?$/.exec(v);
			if (!r) return false;
			const a = t.type + r[1] + r[2];
			const b = t.type + r[1] + (r[3] ?? r[2]);
			return PORT_NAMES[dev].includes(a) && PORT_NAMES[dev].includes(b) && +(r[3] ?? r[2]) >= +r[2];
		};
		return kw(t.type, t.help, [
			arg(
				t.slot,
				`${t.type} interface number`,
				valid,
				[
					kw('-', 'hyphen', [
						arg('<1-8>', 'Ending interface number', num(1, 8), undefined, 'range')
					])
				],
				'range'
			)
		]);
	});
}

/** any, host A.B.C.D, or A.B.C.D wildcard, each followed by `next`. */
function aclAddr(
	side: 'source' | 'destination',
	next: G[] | undefined,
	id: string | undefined
): G[] {
	return [
		kw('any', `Any ${side} host`, next, id),
		kw('host', `A single ${side} host`, [
			arg(IP, `${side === 'source' ? 'Source' : 'Destination'} address`, isIp, next, id)
		]),
		arg(IP, `${side === 'source' ? 'Source' : 'Destination'} address`, isIp, [
			arg(IP, `${side === 'source' ? 'Source' : 'Destination'} wildcard bits`, isIp, next, id)
		])
	];
}
function aclTree(): G {
	const stdAddr: G[] = [
		kw('any', 'Any source host', undefined, 'acl'),
		kw('host', 'A single host address', [arg(IP, 'Host address', isIp, undefined, 'acl')]),
		arg(IP, 'Address to match', isIp, [arg(IP, 'Wildcard bits', isIp, undefined, 'acl')], 'acl')
	];
	const ports: G[] = [
		kw('eq', 'Match only packets on a given port number', [
			arg('<0-65535>', 'Port number', num(0, 65535), undefined, 'acl'),
			kw('domain', 'Domain Name Service (53)', undefined, 'acl'),
			kw('ftp', 'File Transfer Protocol (21)', undefined, 'acl'),
			kw('smtp', 'Simple Mail Transport Protocol (25)', undefined, 'acl'),
			kw('telnet', 'Telnet (23)', undefined, 'acl'),
			kw('www', 'World Wide Web (HTTP, 80)', undefined, 'acl')
		])
	];
	const ext = (proto: string, help: string, withPorts: boolean) =>
		kw(
			proto,
			help,
			aclAddr('source', aclAddr('destination', withPorts ? ports : undefined, 'acl'), undefined)
		);
	const extAct = (w: string, help: string) =>
		kw(w, help, [
			ext('icmp', 'Internet Control Message Protocol', false),
			ext('ip', 'Any Internet Protocol', false),
			ext('tcp', 'Transmission Control Protocol', true),
			ext('udp', 'User Datagram Protocol', true)
		]);
	const remark = kw('remark', 'Access list entry comment', [
		rest('LINE', 'Comment up to 100 characters', 'acl.remark')
	]);
	return kw('access-list', 'Add an access list entry', [
		arg(
			'<1-99>',
			'IP standard access list',
			num(1, 99),
			[
				kw('deny', 'Specify packets to reject', stdAddr),
				kw('permit', 'Specify packets to forward', stdAddr),
				remark
			],
			'acl'
		),
		arg(
			'<100-199>',
			'IP extended access list',
			num(100, 199),
			[
				extAct('deny', 'Specify packets to reject'),
				extAct('permit', 'Specify packets to forward'),
				remark
			],
			'acl'
		)
	]);
}

const showIp = (dev: Dev, priv: boolean): G =>
	kw('ip', 'IP information', [
		...(priv ? [kw('access-lists', 'List IP access lists', undefined, 'show.acl')] : []),
		...(priv && dev === 'router'
			? [
					kw('dhcp', 'Show items in the DHCP database', [
						kw('binding', 'DHCP address bindings', undefined, 'show.binding'),
						kw('pool', 'DHCP pools information', undefined, 'show.pool')
					])
				]
			: []),
		kw('interface', 'IP interface status and configuration', [
			kw('brief', 'Brief summary of IP status and configuration', undefined, 'show.ipib')
		]),
		...(priv && dev === 'router'
			? [
					kw('nat', 'IP NAT information', [
						kw('translations', 'Translation entries', undefined, 'show.nat')
					])
				]
			: []),
		...(priv ? [kw('ssh', 'Information on SSH', undefined, 'show.ssh')] : [])
	]);

function showTree(dev: Dev, priv: boolean): G {
	return kw('show', 'Show running system information', [
		...(priv ? [kw('access-lists', 'List access lists', undefined, 'show.acl')] : []),
		...(dev === 'switch'
			? [
					kw('interfaces', 'Interface status and configuration', [
						kw('trunk', 'Show interface trunk information', undefined, 'show.trunk')
					])
				]
			: []),
		showIp(dev, priv),
		...(priv
			? [
					kw('running-config', 'Current operating configuration', undefined, 'show.run'),
					kw('startup-config', 'Contents of startup configuration', undefined, 'show.start')
				]
			: []),
		kw('version', 'System hardware and software status', undefined, 'show.ver'),
		...(dev === 'switch' && priv
			? [
					kw(
						'vlan',
						'VTP VLAN status',
						[kw('brief', 'VTP all VLAN status in brief', undefined, 'show.vlan')],
						'show.vlan'
					)
				]
			: [])
	]);
}

const ping = kw('ping', 'Send echo messages', [
	arg('WORD', 'Ping destination address or hostname', word, undefined, 'ping')
]);

export type Trees = Record<Mode, G[]>;

/** Every mode's command list for one device. */
export function buildTrees(dev: Dev): Trees {
	const exitCfg = kw('exit', 'Exit from configure mode', undefined, 'exit');
	const end = kw('end', 'Exit from configure mode', undefined, 'end');
	const user: G[] = [
		kw('enable', 'Turn on privileged commands', undefined, 'enable'),
		kw('exit', 'Exit from the EXEC', undefined, 'logout'),
		kw('logout', 'Exit from the EXEC', undefined, 'logout'),
		ping,
		showTree(dev, false)
	];
	const priv: G[] = [
		kw('clear', 'Reset functions', [
			kw('access-list', 'Clear access list statistical information', [
				kw('counters', 'Clear access list counters', undefined, 'clear.acl')
			]),
			...(dev === 'router'
				? [
						kw('ip', 'IP', [
							kw('nat', 'Clear NAT', [
								kw('translation', 'Clear dynamic translation', [
									kw('*', 'Delete all dynamic translations', undefined, 'clear.nat')
								])
							])
						])
					]
				: [])
		]),
		kw('configure', 'Enter configuration mode', [
			kw('terminal', 'Configure from the terminal', undefined, 'conf')
		]),
		kw('copy', 'Copy from one file to another', [
			kw('running-config', 'Copy from current system configuration', [
				kw('startup-config', 'Copy to startup configuration', undefined, 'copy')
			])
		]),
		kw('disable', 'Turn off privileged commands', undefined, 'disable'),
		kw('enable', 'Turn on privileged commands', undefined, 'enable'),
		kw('exit', 'Exit from the EXEC', undefined, 'logout'),
		kw('logout', 'Exit from the EXEC', undefined, 'logout'),
		ping,
		kw('reload', 'Halt and perform a cold restart', undefined, 'reload'),
		showTree(dev, true),
		kw(
			'write',
			'Write running configuration to memory, network, or terminal',
			[kw('memory', 'Write to NV memory', undefined, 'write')],
			'write'
		)
	];
	const modulus = kw('modulus', 'Provide number of modulus bits on the command line', [
		arg('<360-4096>', 'size of the key modulus [360-4096]', num(360, 4096), undefined, 'crypto')
	]);
	const lineRef = kw('line', 'Configure a terminal line', [
		kw('console', 'Primary terminal line', [
			arg('<0-0>', 'First Line number', num(0, 0), undefined, 'line.con')
		]),
		kw('vty', 'Virtual terminal', [
			arg(
				'<0-15>',
				'First Line number',
				num(0, 15),
				[arg('<1-15>', 'Last Line number', num(1, 15), undefined, 'line.vty')],
				'line.vty'
			)
		])
	]);
	const config: G[] = [
		aclTree(),
		...(dev === 'router'
			? [
					kw('crypto', 'Encryption module', [
						kw('key', 'Long term key operations', [
							kw('generate', 'Generate new keys', [
								kw(
									'rsa',
									'Generate RSA keys',
									[
										kw(
											'general-keys',
											'Generate a general purpose RSA key pair for signing and encryption',
											[modulus],
											'crypto'
										),
										modulus
									],
									'crypto'
								)
							])
						])
					])
				]
			: []),
		kw('do', 'To run exec commands in config mode', undefined, undefined),
		kw('enable', 'Modify enable password parameters', [
			kw('password', 'Assign the privileged level password (MAX of 25 characters)', [
				rest('LINE', "The UNENCRYPTED (cleartext) 'enable' password", 'en.pass')
			]),
			kw('secret', 'Assign the privileged level secret (MAX of 25 characters)', [
				rest('LINE', "The UNENCRYPTED (cleartext) 'enable' secret", 'en.secret')
			])
		]),
		end,
		exitCfg,
		kw('hostname', "Set system's network name", [
			arg('WORD', "This system's network name", word, undefined, 'hostname')
		]),
		kw('interface', 'Select an interface to configure', [
			...ifRef(dev, undefined, 'if'),
			kw('range', 'interface range command', ifRange(dev))
		]),
		kw('ip', 'Global IP configuration subcommands', [
			...(dev === 'router'
				? [
						kw('dhcp', 'Configure DHCP server and relay parameters', [
							kw('excluded-address', 'Prevent DHCP from assigning certain addresses', [
								arg(
									IP,
									'Low IP address',
									isIp,
									[arg(IP, 'High IP address', isIp, undefined, 'excl')],
									'excl'
								)
							]),
							kw('pool', 'Configure DHCP address pools', [
								arg('WORD', 'Pool name', word, undefined, 'pool')
							])
						])
					]
				: []),
			kw('domain', 'IP DNS Resolver', [
				kw('lookup', 'Enable IP Domain Name System hostname translation', undefined, 'lookup'),
				kw('name', 'Define the default domain name', [
					arg('WORD', 'Default domain name', word, undefined, 'domain')
				])
			]),
			kw('domain-lookup', 'Enable IP Domain Name System hostname translation', undefined, 'lookup'),
			kw('domain-name', 'Define the default domain name', [
				arg('WORD', 'Default domain name', word, undefined, 'domain')
			]),
			...(dev === 'router'
				? [
						kw('nat', 'NAT configuration commands', [
							kw('inside', 'Inside address translation', [
								kw('source', 'Source address translation', [
									kw('list', 'Specify access list describing local addresses', [
										arg('<1-199>', 'Access list number for local addresses', num(1, 199), [
											kw(
												'interface',
												'Specify interface for global address',
												ifRef(
													dev,
													[kw('overload', 'Overload an address translation', undefined, 'natrule')],
													'natrule'
												)
											)
										])
									])
								])
							])
						])
					]
				: []),
			kw('ssh', 'Configure ssh options', [
				kw('version', 'Specify protocol version supported', [
					arg('<1-2>', 'Protocol version', num(1, 2), undefined, 'sshver')
				])
			])
		]),
		lineRef,
		kw('no', 'Negate a command or set its defaults'),
		kw('service', 'Modify use of network based services', [
			kw('password-encryption', 'Encrypt system passwords', undefined, 'pwenc')
		]),
		kw('username', 'Establish User Name Authentication', [
			arg('WORD', 'User name', word, [
				kw('password', 'Specify the password for the user', [
					rest('LINE', 'The UNENCRYPTED (cleartext) user password', 'user')
				]),
				kw('secret', 'Specify the secret for the user', [
					rest('LINE', 'The UNENCRYPTED (cleartext) user secret', 'user')
				])
			])
		]),
		...(dev === 'switch'
			? [
					kw('vlan', 'Vlan commands', [
						arg('<1-4094>', 'ISL VLAN IDs 1-1005', num(1, 4094), undefined, 'vlan')
					])
				]
			: [])
	];
	const ifMode: G[] = [
		kw('description', 'Interface specific description', [
			rest('LINE', 'Up to 240 characters describing this interface', 'if.desc')
		]),
		end,
		kw('exit', 'Exit from interface configuration mode', undefined, 'exit'),
		...(dev === 'router'
			? [
					kw('ip', 'Interface Internet Protocol config commands', [
						kw('access-group', 'Specify access control for packets', [
							arg('<1-199>', 'IP access list (standard or extended)', num(1, 199), [
								kw('in', 'inbound packets', undefined, 'if.acg'),
								kw('out', 'outbound packets', undefined, 'if.acg')
							])
						]),
						kw('address', 'Set the IP address of an interface', [
							arg(IP, 'IP address', isIp, [arg(IP, 'IP subnet mask', isIp, undefined, 'if.ip')]),
							kw('dhcp', 'IP Address negotiated via DHCP', undefined, 'if.ipdhcp')
						]),
						...(dev === 'router'
							? [
									kw('nat', 'NAT interface commands', [
										kw('inside', 'Inside interface for address translation', undefined, 'if.nat'),
										kw('outside', 'Outside interface for address translation', undefined, 'if.nat')
									])
								]
							: [])
					])
				]
			: []),
		kw('no', 'Negate a command or set its defaults'),
		kw('shutdown', 'Shutdown the selected interface', undefined, 'if.shut'),
		...(dev === 'switch'
			? [
					kw('switchport', 'Set switching mode characteristics', [
						kw('access', 'Set access mode characteristics of the interface', [
							kw('vlan', 'Set VLAN when interface is in access mode', [
								arg(
									'<1-4094>',
									'VLAN ID of the VLAN when this port is in access mode',
									num(1, 4094),
									undefined,
									'if.vlan'
								)
							])
						]),
						kw('mode', 'Set trunking mode of the interface', [
							kw('access', 'Set trunking mode to ACCESS unconditionally', undefined, 'if.mode'),
							kw('trunk', 'Set trunking mode to TRUNK unconditionally', undefined, 'if.mode')
						])
					])
				]
			: [])
	];
	const transport = (id: string, others: string[]): G[] =>
		others.map((o) =>
			kw(o, o === 'ssh' ? 'TCP/IP SSH protocol' : 'TCP/IP Telnet protocol', undefined, id)
		);
	const line: G[] = [
		kw('access-class', 'Filter connections based on an IP access list', [
			arg('<1-199>', 'IP access list', num(1, 199), [
				kw('in', 'Filter incoming connections', undefined, 'line.acl'),
				kw('out', 'Filter outgoing connections', undefined, 'line.acl')
			])
		]),
		end,
		kw('exit', 'Exit from line configuration mode', undefined, 'exit'),
		kw(
			'login',
			'Enable password checking',
			[kw('local', 'Local password checking', undefined, 'line.login')],
			'line.login'
		),
		kw('no', 'Negate a command or set its defaults'),
		kw('password', 'Set a password', [
			rest('LINE', 'The UNENCRYPTED (cleartext) line password', 'line.pass')
		]),
		kw('transport', 'Define transport protocols for line', [
			kw('input', 'Define which protocols to use when connecting to the terminal server', [
				kw('all', 'All protocols', undefined, 'line.trans'),
				kw('none', 'No protocols', undefined, 'line.trans'),
				kw('ssh', 'TCP/IP SSH protocol', transport('line.trans', ['telnet']), 'line.trans'),
				kw('telnet', 'TCP/IP Telnet protocol', transport('line.trans', ['ssh']), 'line.trans')
			])
		])
	];
	const dhcp: G[] = [
		kw('default-router', 'Default routers', [
			arg(IP, "Router's IP address", isIp, undefined, 'dhcp.gw')
		]),
		kw('dns-server', 'DNS servers', [
			arg(
				IP,
				"Server's name or IP address",
				isIp,
				[arg(IP, "Server's name or IP address", isIp, undefined, 'dhcp.dns')],
				'dhcp.dns'
			)
		]),
		kw('domain-name', 'Domain name', [arg('WORD', 'Domain name', word, undefined, 'dhcp.domain')]),
		end,
		kw('exit', 'Exit from DHCP pool configuration mode', undefined, 'exit'),
		kw('network', 'Network number and mask', [
			arg(IP, 'Network number in dotted-decimal notation', isIp, [
				arg(IP, 'Network mask', isIp, undefined, 'dhcp.net'),
				arg(
					'/nn',
					'Network mask or prefix length',
					(t) => /^\/\d{1,2}$/.test(t) && +t.slice(1) <= 32,
					undefined,
					'dhcp.net'
				)
			])
		]),
		kw('no', 'Negate a command or set its defaults')
	];
	const vlan: G[] = [
		end,
		kw('exit', 'Apply changes, bump revision number, and exit mode', undefined, 'exit'),
		kw('name', 'Ascii name of the VLAN', [
			arg('WORD', 'The ascii name for the VLAN', word, undefined, 'vlan.name')
		]),
		kw('no', 'Negate a command or set its defaults')
	];
	return { user, priv, config, if: ifMode, range: ifMode, line, dhcp, vlan };
}

// ---- Parser ----
export type Tok = { w: string; col: number };
export type Parsed =
	| { ok: true; id: string; words: string[]; vals: string[] }
	| {
			ok: false;
			kind: 'invalid' | 'incomplete' | 'ambiguous';
			col: number;
			tok: string;
			at: number;
	  };

/** Split a line into words with their columns, and "g0/1" into "g" plus "0/1" like IOS does. */
export function tokenize(line: string): Tok[] {
	const out: Tok[] = [];
	const re = /\S+/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(line))) {
		const t = m[0];
		const col = m.index + 1;
		const s = /^([a-zA-Z]+)(\d+\/\d+(?:-\d+)?)$/.exec(t);
		if (s) {
			out.push({ w: s[1], col });
			out.push({ w: s[2], col: col + s[1].length });
		} else out.push({ w: t, col });
	}
	return out;
}

function step(level: G[], t: string): G | 'ambiguous' | null {
	const lower = t.toLowerCase();
	const kws = level.filter((g) => !g.p);
	const exact = kws.find((g) => g.w.toLowerCase() === lower);
	if (exact) return exact;
	const hits = kws.filter((g) => g.w.toLowerCase().startsWith(lower));
	if (hits.length > 1) return 'ambiguous';
	if (hits.length === 1) return hits[0];
	return level.find((g) => g.p && g.p(t)) ?? null;
}

export function parse(tree: G[], toks: Tok[], line: string): Parsed {
	let level = tree;
	let node: G | null = null;
	const words: string[] = [];
	const vals: string[] = [];
	for (let i = 0; i < toks.length; i++) {
		const t = toks[i];
		const g = step(level, t.w);
		if (g === 'ambiguous') return { ok: false, kind: 'ambiguous', col: t.col, tok: t.w, at: i };
		if (!g) return { ok: false, kind: 'invalid', col: t.col, tok: t.w, at: i };
		node = g;
		words.push(g.w);
		if (g.rest) {
			vals.push(line.slice(t.col - 1).trim());
			break;
		}
		vals.push(g.p ? t.w : g.w);
		level = g.k ?? [];
	}
	if (!node) return { ok: false, kind: 'incomplete', col: 1, tok: '', at: 0 };
	if (!node.id)
		return { ok: false, kind: 'incomplete', col: line.length + 1, tok: '', at: toks.length };
	return { ok: true, id: node.id, words, vals };
}

/** The grammar level reached after these words, for "?" and Tab. */
export function levelAfter(tree: G[], toks: Tok[]): { level: G[]; node: G | null } | null {
	let level = tree;
	let node: G | null = null;
	for (const t of toks) {
		const g = step(level, t.w);
		if (!g || g === 'ambiguous') return null;
		node = g;
		if (g.rest) return { level: [], node: g };
		level = g.k ?? [];
	}
	return { level, node };
}

export function helpLines(level: G[], node: G | null): string[] {
	const width = Math.max(14, ...level.map((g) => g.w.length + 3));
	const rows = level.map((g) => `  ${pad(g.w, width)}${g.help}`);
	if (node?.id) rows.push('  <cr>');
	return rows;
}

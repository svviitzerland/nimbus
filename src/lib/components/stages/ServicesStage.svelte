<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { ServicesText } from '$lib/chapters/linux/services/types';
	import Server from '$lib/components/Server.svelte';
	import LinuxTerminal from './linux/LinuxTerminal.svelte';
	import Missions from './linux/Missions.svelte';
	import { LinuxShell, type Cmd, type ShellEvent } from './linux/shell.svelte';
	import { dir, file, mine, myDir, type FNode } from './linux/fs';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as ServicesText);

	// The server and its caretaker show from the beat that introduces systemd; the unit beat
	// lights up the Restart line.
	const SYSTEMD_BEAT = 1;
	const UNIT_BEAT = 2;
	const live = $derived(beat >= tx.intro.length - 1);
	$effect(() => {
		onshow?.(beat >= SYSTEMD_BEAT);
	});

	const UNIT_PATH = '/etc/systemd/system/nimbus.service';
	const UNIT = [
		'[Unit]',
		'Description=nimbus.com web app',
		'After=network.target',
		'',
		'[Service]',
		'ExecStart=/usr/bin/node /var/www/nimbus/server.js',
		'User=nim',
		'Restart=always',
		'',
		'[Install]',
		'WantedBy=multi-user.target'
	];
	function makeFs(): FNode {
		return dir({
			etc: dir({ systemd: dir({ system: dir({ 'nimbus.service': file(UNIT) }) }) }),
			home: dir({
				nim: myDir({ 'notes.txt': mine(['The site died at 3 am again. Nobody noticed.']) })
			}),
			tmp: dir({}, { mode: 0o777 }),
			usr: dir({ bin: dir({ node: file([], { mode: 0o755 }) }) }),
			var: dir({
				www: dir({
					nimbus: dir({ 'server.js': file(["require('http').createServer(app).listen(80)"]) })
				})
			})
		});
	}

	// ---- The service ----
	type State = 'inactive' | 'active' | 'dead' | 'restarting';
	let svc = $state<State>('inactive');
	let enabled = $state(false);
	let pid = $state(0);
	let restarts = $state(0);
	let power = $state<'on' | 'booting'>('on');
	let since = $state(0);
	let clock = 0;
	let nextPid = 1187;
	const up = $derived(svc === 'active' && power === 'on');

	type Note = { tone: 'ok' | 'bad' | 'wait'; text: string };
	let journal = $state<string[]>([]);
	let lastNote = $state<Note | null>(null);
	const stamp = () => {
		const s = 9 * 3600 + 12 * 60 + Math.floor(clock / 1000);
		const hh = String(Math.floor(s / 3600)).padStart(2, '0');
		const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
		const ss = String(s % 60).padStart(2, '0');
		return `Nov 03 ${hh}:${mm}:${ss}`;
	};
	function log(text: string, tone: Note['tone'], who = 'systemd[1]') {
		journal = [...journal, `${stamp()} nimbus ${who}: ${text}`].slice(-14);
		lastNote = { tone, text };
	}
	function boot(reason: 'start' | 'restart' | 'boot') {
		svc = 'active';
		pid = nextPid;
		nextPid += 37 + Math.floor(Math.random() * 40);
		since = clock;
		if (reason === 'restart') restarts += 1;
		log('Started nimbus.service, nimbus.com web app.', 'ok');
	}

	// ---- Missions ----
	type MId = 'status' | 'started' | 'revived' | 'boot';
	const ORDER: MId[] = ['status', 'started', 'revived', 'boot'];
	let done = $state<Record<MId, boolean>>({
		status: false,
		started: false,
		revived: false,
		boot: false
	});
	let finished = false;
	function complete(m: MId) {
		if (done[m]) return false;
		done[m] = true;
		if (ORDER.every((x) => done[x])) {
			if (!finished) {
				finished = true;
				onstate?.('done');
				oncomplete?.();
			}
		} else onstate?.(m);
		return true;
	}
	const say = (t: string) => onstate?.(t);

	// ---- Crashing and rebooting ----
	function crash(by: 'button' | 'kill') {
		if (power !== 'on') return;
		if (svc !== 'active') {
			if (by === 'button') say('nothingToCrash');
			return;
		}
		svc = 'dead';
		pid = 0;
		log('nimbus.service, main process exited, code=killed, status=9/KILL', 'bad');
		say('crashed');
		shell.after(1300, () => {
			if (svc !== 'dead') return;
			svc = 'restarting';
			log(`nimbus.service, scheduled restart job, restart counter is at ${restarts + 1}.`, 'wait');
			shell.after(1000, () => {
				if (svc !== 'restarting') return;
				boot('restart');
				if (!complete('revived')) say('revivedAgain');
			});
		});
	}

	function reboot() {
		if (power !== 'on' || shell.busy) return;
		power = 'booting';
		const was = svc;
		svc = 'inactive';
		pid = 0;
		say('rebooting');
		log('Stopping nimbus.service, shutting down for reboot.', 'wait');
		shell.play(
			[
				{ tone: 'err', text: 'Connection to nimbus.com closed by remote host.' },
				1400,
				{ tone: 'muted', text: '$ ssh nim@nimbus.com' },
				900,
				{ tone: 'ok', text: 'Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-45-generic x86_64)' }
			],
			() => {
				power = 'on';
				shell.cwd = shell.home;
				journal = [...journal, '-- Boot 2b7e --'];
				if (enabled) {
					boot('boot');
					if (!complete('boot')) say('bootAgain');
				} else {
					log('nimbus.service is disabled, not starting.', 'bad');
					say(was === 'active' ? 'bootDown' : 'bootIdle');
				}
			}
		);
	}

	// ---- systemctl, journalctl, kill, ps ----
	const UNIT_NAMES = ['nimbus', 'nimbus.service'];
	function statusLines(sh: LinuxShell) {
		const dot = up ? 'ok' : svc === 'restarting' ? 'warn' : svc === 'dead' ? 'err' : 'out';
		sh.segs([{ text: '● ', tone: dot }, { text: 'nimbus.service - nimbus.com web app' }]);
		sh.pre(
			`     Loaded: loaded (${UNIT_PATH}; ${enabled ? 'enabled' : 'disabled'}; preset: enabled)`
		);
		const ago = Math.max(1, Math.round((clock - since) / 1000));
		const active =
			svc === 'active'
				? `active (running) since Tue 2026-11-03; ${ago}s ago`
				: svc === 'restarting'
					? 'activating (auto-restart) (Result: signal)'
					: svc === 'dead'
						? 'failed (Result: signal)'
						: 'inactive (dead)';
		sh.segs([{ text: '     Active: ' }, { text: active, tone: dot }], true);
		if (svc === 'active') {
			sh.pre(`   Main PID: ${pid} (node)`);
			sh.pre('     Memory: 38.2M');
		}
	}
	function needAuth(sh: LinuxShell, verb: string) {
		sh.err(`Failed to ${verb} nimbus.service: Interactive authentication required.`);
		sh.hint(tx.hintSudo);
		say('needSudo');
	}

	function systemctl(c: Cmd, sh: LinuxShell) {
		const [sub, unitRaw] = c.args;
		if (!sub) {
			sh.pre('  UNIT                 LOAD   ACTIVE   SUB      DESCRIPTION');
			sh.pre(
				`  nimbus.service       loaded ${pad(up ? 'active' : 'inactive', 8)} ${pad(up ? 'running' : 'dead', 8)} nimbus.com web app`
			);
			sh.pre('  ssh.service          loaded active   running  OpenBSD Secure Shell server');
			return;
		}
		if (!unitRaw) {
			sh.err(`Too few arguments.`);
			sh.hint(tx.hintSystemctl);
			say('error');
			return;
		}
		if (!UNIT_NAMES.includes(unitRaw)) {
			const u = unitRaw.endsWith('.service') ? unitRaw : `${unitRaw}.service`;
			sh.err(
				sub === 'status'
					? `Unit ${u} could not be found.`
					: `Failed to ${sub} ${u}: Unit ${u} not found.`
			);
			sh.hint(tx.hintUnit);
			say('noUnit');
			return;
		}
		switch (sub) {
			case 'status':
				statusLines(sh);
				if (!complete('status')) {
					if (svc === 'restarting' || svc === 'dead') say('statusRestarting');
				}
				return;
			case 'is-active':
				sh.out(
					up
						? 'active'
						: svc === 'restarting'
							? 'activating'
							: svc === 'dead'
								? 'failed'
								: 'inactive'
				);
				return;
			case 'is-enabled':
				sh.out(enabled ? 'enabled' : 'disabled');
				return;
			case 'start':
			case 'restart':
				if (!c.sudo) return needAuth(sh, sub);
				if (sub === 'restart' && svc === 'active') {
					log('Stopping nimbus.service, nimbus.com web app.', 'wait');
					boot('start');
					say('restarted');
					return;
				}
				if (svc === 'active') return;
				boot('start');
				if (!complete('started')) say('startedAgain');
				return;
			case 'stop':
				if (!c.sudo) return needAuth(sh, 'stop');
				if (svc === 'inactive') return;
				svc = 'inactive';
				pid = 0;
				log('Stopped nimbus.service, nimbus.com web app.', 'bad');
				say('stopped');
				return;
			case 'enable':
				if (!c.sudo) return needAuth(sh, 'enable');
				if (!enabled)
					sh.out(
						'Created symlink /etc/systemd/system/multi-user.target.wants/nimbus.service → /etc/systemd/system/nimbus.service.'
					);
				enabled = true;
				say('enabled');
				return;
			case 'disable':
				if (!c.sudo) return needAuth(sh, 'disable');
				if (enabled)
					sh.out('Removed "/etc/systemd/system/multi-user.target.wants/nimbus.service".');
				enabled = false;
				say('disabled');
				return;
		}
		sh.err(`Unknown command verb '${sub}'.`);
		sh.hint(tx.hintSystemctl);
		say('error');
	}
	const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));

	function handler(c: Cmd, sh: LinuxShell): boolean {
		if (c.name === 'systemctl') {
			systemctl(c, sh);
			return true;
		}
		if (c.name === 'journalctl') {
			if (!journal.length) sh.out('-- No entries --');
			for (const l of journal) sh.pre(l);
			say('journal');
			return true;
		}
		if (c.name === 'ps' || c.name === 'top') {
			sh.pre('    PID USER     COMMAND');
			sh.pre('      1 root     /sbin/init (systemd)');
			sh.pre('    842 root     sshd: nim [priv]');
			if (up) sh.pre(`${String(pid).padStart(7)} nim      node /var/www/nimbus/server.js`);
			return true;
		}
		if (c.name === 'kill' || c.name === 'pkill' || c.name === 'killall') {
			const target = c.args.filter((a) => !a.startsWith('-'))[0];
			if (!target) {
				sh.err(`${c.name}: usage: ${c.name} [-9] ${c.name === 'kill' ? 'pid' : 'name'}`);
				return true;
			}
			const hit =
				c.name === 'kill' ? up && Number(target) === pid : up && /^(node|nimbus)$/.test(target);
			if (!hit) {
				if (c.name === 'kill') sh.err(`-bash: kill: (${target}) - No such process`);
				else if (c.name === 'killall') sh.err(`${target}: no process found`);
				sh.hint(tx.hintKill);
				return true;
			}
			crash('kill');
			return true;
		}
		if (c.name === 'reboot' || (c.name === 'shutdown' && c.args.includes('-r'))) {
			if (!c.sudo) {
				sh.err('Call to Reboot failed: Interactive authentication required.');
				sh.hint(tx.hintSudo);
				say('needSudo');
				return true;
			}
			reboot();
			return true;
		}
		return false;
	}
	function onevent(e: ShellEvent) {
		if (e.type === 'read' && e.path === UNIT_PATH) {
			say('unitFile');
			return true;
		}
		return false;
	}

	const shell = new LinuxShell({
		fs: makeFs(),
		text: () => tx,
		react: (t) => onstate?.(t),
		handler,
		onevent,
		commands: ['systemctl', 'journalctl', 'ps', 'kill', 'pkill', 'reboot']
	});
	$effect(() => () => shell.destroy());

	const help: Record<MId, () => void> = {
		status: () => shell.typeFor('systemctl status nimbus'),
		started: () => shell.typeFor('sudo systemctl start nimbus'),
		revived: () =>
			svc === 'active' ? crash('button') : shell.typeFor('sudo systemctl start nimbus'),
		boot: () => (enabled ? reboot() : shell.typeFor('sudo systemctl enable nimbus'))
	};
	const items = $derived(
		ORDER.map((m, i) => ({ label: tx.missions[i], done: done[m], help: help[m] }))
	);

	// ---- What visitors see, sampled into a little uptime strip ----
	const SAMPLES = 36;
	const SLOTS = Array.from({ length: SAMPLES }, (_, i) => i);
	let strip = $state<boolean[]>([]);
	$effect(() => {
		const t = setInterval(() => {
			clock += 400;
			strip = [...strip, up].slice(-SAMPLES);
		}, 400);
		return () => clearInterval(t);
	});
	const pill = $derived(
		power === 'booting'
			? { tone: 'wait', label: tx.states.booting }
			: up
				? { tone: 'ok', label: tx.states.active }
				: svc === 'restarting'
					? { tone: 'wait', label: tx.states.restarting }
					: svc === 'dead'
						? { tone: 'bad', label: tx.states.dead }
						: { tone: 'off', label: tx.states.inactive }
	);
	const busy = $derived(!live || shell.typing || shell.busy);
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		{items}
		hintBtn={tx.hintBtn}
		doneNote={tx.doneNote}
		disabled={busy}
	/>

	<div class="acts">
		<button
			type="button"
			class="act bad"
			disabled={busy || power !== 'on' || svc !== 'active'}
			onclick={() => crash('button')}>{tx.crashBtn}</button
		>
		<button type="button" class="act" disabled={busy || power !== 'on'} onclick={reboot}
			>{tx.rebootBtn}</button
		>
	</div>

	<div class="card">
		<div class="top">
			<div class="rack" class:off={power === 'booting'}>
				<Server slots={3} active={up} />
				<span class="rlab">{tx.serverLabel}</span>
			</div>
			<div class="guard">
				<div class="ghead">
					<span class="sd">systemd</span>
					<span class="unit">nimbus.service</span>
				</div>
				<span class="pill {pill.tone}">{pill.label}</span>
				<dl>
					<dt>{tx.bootLabel}</dt>
					<dd class:yes={enabled}>{enabled ? tx.yes : tx.no}</dd>
					<dt>{tx.restartsLabel}</dt>
					<dd>{restarts}</dd>
					<dt>PID</dt>
					<dd class="mono">{pid || '...'}</dd>
				</dl>
				<p class="rule" class:lit={beat === UNIT_BEAT}>Restart=always</p>
			</div>
		</div>
		<div class="seen">
			<div class="slab">
				<span>{tx.visitorsLabel}</span>
				<b class:down={!up}>{up ? tx.siteUp : tx.siteDown}</b>
			</div>
			<div class="strip" aria-hidden="true">
				{#each SLOTS as i (i)}
					{@const v = strip[strip.length - SAMPLES + i]}
					<i class:u={v === true} class:d={v === false}></i>
				{/each}
			</div>
		</div>
		{#if lastNote}<p class="note {lastNote.tone}">{lastNote.text}</p>{/if}
	</div>

	<LinuxTerminal {shell} {live} inputLabel={tx.inputLabel} short />
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 420px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}
	.acts {
		display: flex;
		gap: 8px;
		width: 100%;
	}
	.act {
		flex: 1;
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 12.5px;
		font-weight: 800;
		padding: 7px 10px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.act:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.act.bad {
		color: var(--color-danger);
	}
	.act.bad:hover:not(:disabled) {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.act:disabled {
		opacity: 0.45;
	}
	.card {
		width: 100%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 10px 12px;
	}
	.top {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.rack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		transition: opacity 0.3s ease;
	}
	.rack.off {
		opacity: 0.35;
	}
	.rack :global(.server) {
		width: 70px;
		padding: 7px;
		gap: 5px;
	}
	.rack :global(.slot) {
		height: 12px;
	}
	.rlab {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.guard {
		flex: 1;
		min-width: 0;
	}
	.ghead {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 5px;
	}
	.sd {
		font-size: 12.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.unit {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		color: var(--color-muted);
	}
	.pill {
		display: inline-block;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 800;
		padding: 2px 10px;
		margin-bottom: 6px;
	}
	.pill.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.pill.wait {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.pill.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.pill.off {
		background: var(--color-paper);
		color: var(--color-muted);
		border: 1px solid var(--color-line);
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1px 10px;
		margin: 0;
		font-size: 11.5px;
	}
	dt {
		color: var(--color-muted);
	}
	dd {
		margin: 0;
		font-weight: 700;
		color: var(--color-ink);
	}
	dd.yes {
		color: var(--color-grass);
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}
	.rule {
		display: inline-block;
		margin: 6px 0 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		color: var(--color-faint);
		border: 1px solid transparent;
		border-radius: 6px;
		padding: 0 5px;
	}
	.rule.lit {
		color: var(--color-amber);
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.seen {
		margin-top: 9px;
	}
	.slab {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		color: var(--color-muted);
		margin-bottom: 4px;
	}
	.slab b {
		color: var(--color-grass);
	}
	.slab b.down {
		color: var(--color-danger);
	}
	.strip {
		display: grid;
		grid-template-columns: repeat(36, 1fr);
		gap: 2px;
		height: 14px;
	}
	.strip i {
		border-radius: 2px;
		background: var(--color-line);
	}
	.strip i.u {
		background: var(--color-grass);
	}
	.strip i.d {
		background: var(--color-danger);
		opacity: 0.75;
	}
	.note {
		margin: 7px 0 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.note.ok {
		color: var(--color-grass);
	}
	.note.bad {
		color: var(--color-danger);
	}
	.note.wait {
		color: var(--color-amber);
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
	}
</style>

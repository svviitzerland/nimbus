<script lang="ts">
	// A guided terminal lab. A server rack runs the nimbus.com app, systemd (a little gear) looks
	// after it, and a browser shows whether the site is up. Nim narrates while the terminal types
	// systemctl status, start, a crash that systemd heals by itself, and enable. On the last beat
	// the learner types sudo systemctl restart nimbus.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { ServicesText } from '$lib/chapters/linux/services/types';
	import GuidedLab from './linux/GuidedLab.svelte';
	import { LinuxShell, type Cmd } from './linux/shell.svelte';
	import { dir, file, myDir, type FNode } from './linux/fs';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as ServicesText);

	const SCRIPT: string[][] = [
		[],
		[],
		['systemctl status nimbus'],
		['sudo systemctl start nimbus'],
		['sudo pkill nimbus', 'systemctl status nimbus'],
		['sudo systemctl enable nimbus'],
		[],
		[],
		[]
	];
	const LAST = SCRIPT.length - 1;
	const TRY = 'sudo systemctl restart nimbus';
	const UNIT = '/etc/systemd/system/nimbus.service';

	let peek = $state<number | null>(null);
	const scene = $derived(peek ?? Math.min(beat, LAST));
	const live = $derived(scene === LAST);

	type Svc = 'inactive' | 'active' | 'dead' | 'restarting';
	let svc = $state<Svc>('inactive');
	let enabled = $state(false);
	let restarts = $state(0);
	let quiet = false;
	const say = (t: string) => {
		if (!quiet && live) onstate?.(t);
	};

	function status(sh: LinuxShell) {
		const dot =
			svc === 'active' ? 'ok' : svc === 'dead' ? 'err' : svc === 'restarting' ? 'warn' : 'out';
		sh.segs([{ text: '● ', tone: dot }, { text: 'nimbus.service, nimbus.com web app' }]);
		sh.pre(`     Loaded: loaded (${UNIT}; ${enabled ? 'enabled' : 'disabled'})`);
		const active =
			svc === 'active'
				? 'active (running) since Tue 2026-11-03 09:12:00 UTC'
				: svc === 'restarting'
					? 'activating (auto-restart)'
					: svc === 'dead'
						? 'failed (Result: signal)'
						: 'inactive (dead)';
		sh.segs([{ text: '     Active: ' }, { text: active, tone: dot }], true);
		if (restarts > 0) sh.pre(`   Restarts: ${restarts}`);
		say('status');
	}

	function crash(sh: LinuxShell) {
		if (svc !== 'active') {
			say('nothingToCrash');
			return;
		}
		svc = 'dead';
		say('crashed');
		sh.after(1500, () => {
			svc = 'restarting';
			sh.after(1300, () => {
				svc = 'active';
				restarts += 1;
			});
		});
	}

	function systemctl(c: Cmd, sh: LinuxShell) {
		const [verb, raw] = c.args;
		if (!verb || !['status', 'start', 'stop', 'restart', 'enable', 'disable'].includes(verb)) {
			sh.err(`Unknown command verb '${verb ?? ''}'.`);
			sh.hint(tx.hintSystemctl);
			say('error');
			return;
		}
		const unit = (raw ?? '').replace(/\.service$/, '');
		if (unit !== 'nimbus') {
			sh.err(`Unit ${unit || '(none)'}.service could not be found.`);
			sh.hint(tx.hintSystemctl);
			say('noUnit');
			return;
		}
		if (verb === 'status') return status(sh);
		if (!c.sudo) {
			sh.err(`Failed to ${verb} nimbus.service, Interactive authentication required.`);
			sh.hint(tx.hintSudo);
			say('needSudo');
			return;
		}
		if (verb === 'start') {
			svc = 'active';
			say('started');
		} else if (verb === 'stop') {
			svc = 'inactive';
			say('stopped');
		} else if (verb === 'restart') {
			svc = 'restarting';
			say('restarted');
			sh.after(1100, () => (svc = 'active'));
		} else if (verb === 'enable') {
			if (!enabled)
				sh.out(
					`Created symlink /etc/systemd/system/multi-user.target.wants/nimbus.service → ${UNIT}.`
				);
			enabled = true;
			say('enabled');
		} else {
			if (enabled) sh.out('Removed "/etc/systemd/system/multi-user.target.wants/nimbus.service".');
			enabled = false;
			say('disabled');
		}
	}

	function handler(c: Cmd, sh: LinuxShell) {
		if (c.name === 'systemctl') {
			systemctl(c, sh);
			return true;
		}
		if (c.name === 'pkill' || c.name === 'kill') {
			if (!c.sudo) {
				sh.err(`${c.name}: killing nimbus failed, Operation not permitted`);
				sh.hint(tx.hintSudo);
				say('needSudo');
				return true;
			}
			crash(sh);
			return true;
		}
		return false;
	}

	function makeFs(): FNode {
		return dir({
			etc: dir({
				systemd: dir({
					system: dir({
						'nimbus.service': file([
							'[Unit]',
							'Description=nimbus.com web app',
							'',
							'[Service]',
							'ExecStart=/usr/bin/node /var/www/nimbus/server.js',
							'Restart=always',
							'',
							'[Install]',
							'WantedBy=multi-user.target'
						])
					})
				})
			}),
			home: dir({ nim: myDir() })
		});
	}

	const shell = new LinuxShell({
		fs: makeFs(),
		text: () => tx,
		react: say,
		handler,
		commands: ['systemctl', 'pkill', 'kill']
	});
	shell.speed = 55;

	function direct(sc: number) {
		svc = 'inactive';
		enabled = false;
		restarts = 0;
		shell.reset(makeFs());
		quiet = true;
		shell.quick(SCRIPT.slice(0, sc).flat());
		quiet = false;
		shell.typeSeq(SCRIPT[sc]);
	}

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		return () => shell.destroy();
	});
	$effect(() => {
		void beat;
		peek = null;
	});
	$effect(() => {
		const sc = scene;
		untrack(() => direct(sc));
	});

	const up = $derived(svc === 'active');
	const gearFocus = $derived(scene === 1 || svc === 'dead' || svc === 'restarting');
	const stateText = $derived(tx.states[svc]);
	// Eight gear teeth.
	const TEETH = [0, 45, 90, 135, 180, 225, 270, 315];
</script>

{#snippet art(i: number)}
	<svg viewBox="0 0 360 200" class="art-svg" aria-hidden="true">
		<!-- the server rack -->
		<rect x="18" y="22" width="120" height="156" rx="10" class="frame" />
		{#each [0, 1, 2] as k (k)}
			<rect
				x="28"
				y={36 + k * 46}
				width="100"
				height="36"
				rx="6"
				class="unit"
				class:app={k === 1}
			/>
		{/each}
		<circle cx="44" cy="100" r="6" class="lamp {svc}" />
		<text x="58" y="104" class="unit-label">nimbus</text>
		<circle cx="44" cy="54" r="2.6" class="led on" />
		<circle cx="44" cy="146" r="2.6" class="led on" />
		<text x="78" y="194" class="label">{tx.serverLabel}</text>

		<!-- systemd, the caretaker -->
		<g class="gear" class:focus={gearFocus} transform="translate(196 62)">
			<g class:spin={svc === 'restarting'}>
				{#each TEETH as a (a)}
					<rect x="-4" y="-22" width="8" height="9" rx="2" transform="rotate({a})" />
				{/each}
				<circle r="16" />
				<circle r="6" class="hole" />
			</g>
		</g>
		<text x="196" y="102" class="label">systemd</text>
		<path d="M176 70 C150 76 140 90 136 98" class="care" class:on={gearFocus} />

		<!-- the browser with nimbus.com -->
		<g transform="translate(236 112)">
			<rect width="110" height="70" rx="8" class="browser" />
			<path d="M0 16 H110" class="bar" />
			<circle cx="10" cy="8" r="2.4" class="dot" />
			<circle cx="18" cy="8" r="2.4" class="dot" />
			<circle cx="26" cy="8" r="2.4" class="dot" />
			<text x="55" y="38" class="site">nimbus.com</text>
			<text x="55" y="57" class="site-state" class:up>{up ? tx.siteUp : tx.siteDown}</text>
		</g>
	</svg>
	<div class="rows">
		<span class="state {svc}">{stateText}</span>
		<span class="boot">
			{tx.bootLabel}
			<i class="switch" class:on={enabled}><b></b></i>
		</span>
	</div>
	{#if i === 6}
		<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
	{/if}
{/snippet}

<GuidedLab {tx} {shell} active={scene} {live} tryCmd={TRY} onselect={(i) => (peek = i)} {art} />

<style>
	.art-svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 32vh;
	}
	.frame {
		fill: var(--color-ink);
		opacity: 0.9;
	}
	.unit {
		fill: var(--color-card);
		opacity: 0.12;
	}
	.unit.app {
		opacity: 0.22;
	}
	.unit-label {
		fill: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12px;
		font-weight: 700;
	}
	.led {
		fill: var(--color-grass);
	}
	.lamp {
		fill: var(--color-faint);
		transition: fill 0.4s;
	}
	.lamp.active {
		fill: var(--color-grass);
		animation: breathe 2.4s ease-in-out infinite;
	}
	.lamp.dead {
		fill: var(--color-danger);
	}
	.lamp.restarting {
		fill: var(--color-amber);
	}
	@keyframes breathe {
		50% {
			opacity: 0.55;
		}
	}
	.label {
		fill: var(--color-muted);
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
	}
	.gear rect,
	.gear circle {
		fill: var(--color-paper);
		stroke: var(--color-faint);
		stroke-width: 1.5;
		transition:
			stroke 0.4s,
			fill 0.4s;
	}
	.gear .hole {
		fill: var(--color-card);
	}
	.gear.focus rect,
	.gear.focus circle {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.spin {
		animation: spin 1.3s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.care {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
		transition: stroke 0.4s;
	}
	.care.on {
		stroke: var(--color-brand);
	}
	.browser {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.bar {
		stroke: var(--color-line);
	}
	.dot {
		fill: var(--color-line);
	}
	.site {
		fill: var(--color-ink);
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
	}
	.site-state {
		fill: var(--color-danger);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.site-state.up {
		fill: var(--color-grass);
	}
	.rows {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 2px 6px 0;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.state {
		border-radius: 999px;
		background: var(--color-paper);
		padding: 3px 10px;
	}
	.state.active {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.state.dead {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.state.restarting {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.boot {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.switch {
		position: relative;
		display: block;
		height: 20px;
		width: 36px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.35s;
	}
	.switch b {
		position: absolute;
		top: 3px;
		left: 3px;
		height: 14px;
		width: 14px;
		border-radius: 999px;
		background: var(--color-card);
		box-shadow: 0 1px 3px rgba(15, 32, 48, 0.25);
		transition: transform 0.35s cubic-bezier(0.3, 0.7, 0.3, 1);
	}
	.switch.on {
		background: var(--color-grass);
	}
	.switch.on b {
		transform: translateX(16px);
	}
	.rule {
		margin: 6px 0 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-grass);
	}
	@media (prefers-reduced-motion: reduce) {
		.lamp.active,
		.spin {
			animation: none;
		}
		.lamp,
		.switch,
		.switch b,
		.care,
		.gear rect,
		.gear circle {
			transition: none;
		}
	}
</style>

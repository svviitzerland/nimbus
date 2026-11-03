<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { ConfigMgmtText } from '$lib/chapters/devops/config-mgmt/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as ConfigMgmtText);

	const N = 10;
	const COMMAND = 'ansible-playbook update.yml';
	// the manual run slips on this server (the third one you visit)
	const TYPO_AT = 2;
	// Ansible works on five servers at a time by default (its "forks" setting)
	const FORKS = 5;

	type St = 'v1' | 'v2' | 'typo' | 'busy';
	let servers = $state<St[]>(Array(N).fill('v1'));
	let nextManual = $state(0);
	let minutes = $state(0);
	let manualBusy = $state(false);
	let running = $state(false);
	let input = $state('');
	let last = $state<'idle' | 'manual' | 'typo' | 'playbook' | 'again'>('idle');
	let done = false;
	type Line = { tone: 'cmd' | 'dim' | 'ok' | 'chg' | 'bad'; text: string };
	let lines = $state<Line[]>([]);
	let consoleEl: HTMLDivElement | undefined;
	let timers: ReturnType<typeof setTimeout>[] = [];
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
	const log = (tone: Line['tone'], text: string) => (lines = [...lines, { tone, text }]);

	$effect(() => {
		void lines.length;
		if (consoleEl) consoleEl.scrollTop = consoleEl.scrollHeight;
	});

	const host = (i: number) => `web${i + 1}`;

	function manual() {
		if (manualBusy || running || nextManual >= N) return;
		const i = nextManual;
		manualBusy = true;
		servers[i] = 'busy';
		at(650, () => {
			const slip = i === TYPO_AT;
			servers[i] = slip ? 'typo' : 'v2';
			minutes += 5;
			nextManual = i + 1;
			manualBusy = false;
			last = slip ? 'typo' : 'manual';
			onstate?.(slip ? 'typo' : 'manual');
		});
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const cmd = input.trim().replace(/\s+/g, ' ');
		if (!cmd || running || manualBusy) return;
		input = '';
		lines = [{ tone: 'cmd', text: `$ ${cmd}` }];
		if (cmd.startsWith('ansible-playbook') && cmd.includes('update.yml')) play();
		else log('bad', tx.unknown.replace('{cmd}', cmd.split(' ')[0]));
	}

	function play() {
		running = true;
		const again = servers.every((s) => s === 'v2');
		log('dim', 'PLAY [web servers]');
		log('dim', 'TASK [install nimbus app v2]');
		let changed = 0;
		const waves = Math.ceil(N / FORKS);
		for (let w = 0; w < waves; w++) {
			at(500 + w * 900, () => {
				for (let i = w * FORKS; i < Math.min(N, (w + 1) * FORKS); i++) {
					if (servers[i] !== 'v2') servers[i] = 'busy';
				}
			});
			at(1100 + w * 900, () => {
				const ok: string[] = [];
				const chg: string[] = [];
				for (let i = w * FORKS; i < Math.min(N, (w + 1) * FORKS); i++) {
					if (servers[i] === 'v2') ok.push(host(i));
					else {
						servers[i] = 'v2';
						chg.push(host(i));
						changed += 1;
					}
				}
				if (chg.length) log('chg', `changed: ${chg.join(' ')}`);
				if (ok.length) log('ok', `ok: ${ok.join(' ')}`);
			});
		}
		at(1300 + waves * 900, () => {
			log('ok', `PLAY RECAP  web1 to web${N}  changed=${changed}  failed=0`);
			running = false;
			nextManual = N;
			last = again ? 'again' : 'playbook';
			onstate?.(again ? 'again' : 'playbook');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		});
	}

	const left = $derived(servers.filter((s) => s !== 'v2').length);
	const note = $derived(
		last === 'idle'
			? tx.noteIdle
			: last === 'manual'
				? tx.noteManual.replace('{n}', String(left))
				: last === 'typo'
					? tx.noteTypo
					: last === 'playbook'
						? tx.notePlaybook
						: tx.noteAgain
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<p class="mission"><b>{tx.missionLabel}</b> {tx.mission}</p>

	<!-- the control machine's terminal, where the playbook is run -->
	<div class="term">
		<div class="tbar">
			<span class="tdot"></span><span class="tdot"></span><span class="tdot"></span>
			<span class="ttitle">ansible@nimbus</span>
		</div>
		<div class="console" bind:this={consoleEl}>
			{#if lines.length === 0}
				<div class="ln dim"># update.yml is ready</div>
			{/if}
			{#each lines as l, i (i)}
				<div class="ln {l.tone}">{l.text}</div>
			{/each}
		</div>
		<form class="prompt" onsubmit={submit}>
			<span class="dollar">$</span>
			<input
				bind:value={input}
				placeholder={tx.placeholder}
				aria-label={tx.placeholder}
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				disabled={running}
			/>
		</form>
	</div>
	<button type="button" class="hintchip" disabled={running} onclick={() => (input = COMMAND)}>
		<span>{tx.hintLabel}</span>
		<code>{COMMAND}</code>
	</button>

	<!-- the playbook itself (real YAML) -->
	<div class="file">
		<div class="fbar">update.yml</div>
		<pre class="yaml"><span class="dash">- </span><span class="key">hosts</span>: web
  <span class="key">tasks</span>:
    <span class="dash">- </span><span class="key">name</span>: install nimbus app v2
      <span class="key">apt</span>: name=nimbus-app state=latest</pre>
	</div>

	<!-- the ten servers -->
	<div class="grid">
		{#each servers as s, i (i)}
			<div class="srv {s}">
				<span class="lights"><i></i><i></i></span>
				<span class="hname">{host(i)}</span>
				<span class="ver"
					>{s === 'v2'
						? tx.newTag
						: s === 'typo'
							? tx.typoTag
							: s === 'busy'
								? '...'
								: tx.oldTag}</span
				>
			</div>
		{/each}
	</div>

	<div class="manual">
		<button
			type="button"
			class="line"
			disabled={manualBusy || running || nextManual >= N}
			onclick={manual}
		>
			{nextManual >= N ? tx.manualDone : `${tx.manualBtn} (${host(nextManual)})`}
		</button>
		{#if minutes > 0}
			<span class="mins">{tx.minutesTag.replace('{n}', String(minutes))}</span>
		{/if}
	</div>

	<p class="note">{note}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 420px);
		flex-direction: column;
		align-items: center;
		gap: 9px;
	}
	.mission {
		margin: 0;
		text-align: center;
		font-size: 12px;
		color: var(--color-ink);
	}
	.mission b {
		margin-right: 4px;
		border-radius: 6px;
		background: var(--color-brand-soft);
		padding: 1px 7px;
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.term {
		width: 100%;
		overflow: hidden;
		border-radius: 11px;
		border: 1px solid #1d3547;
		background: #10212f;
		box-shadow: 0 10px 24px rgba(16, 33, 47, 0.2);
	}
	.tbar {
		display: flex;
		align-items: center;
		gap: 5px;
		border-bottom: 1px solid #1d3547;
		background: #16293a;
		padding: 5px 10px;
	}
	.tdot {
		height: 7px;
		width: 7px;
		border-radius: 50%;
		background: #2f4a5e;
	}
	.ttitle {
		margin-left: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		font-weight: 700;
		color: #8aa2b3;
	}
	.console {
		height: 72px;
		overflow-y: auto;
		padding: 7px 11px 2px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		line-height: 1.6;
	}
	.ln {
		white-space: pre-wrap;
		word-break: break-word;
	}
	.ln.cmd {
		color: #eaf1f6;
	}
	.ln.dim {
		color: #5c7384;
	}
	.ln.ok {
		color: #6fd39a;
	}
	.ln.chg {
		color: #e0b65b;
	}
	.ln.bad {
		color: #ef8b80;
	}
	.prompt {
		display: flex;
		align-items: center;
		gap: 7px;
		border-top: 1px solid #1d3547;
		padding: 6px 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.dollar {
		color: #5bbd84;
		font-weight: 700;
	}
	.prompt input {
		min-width: 0;
		flex: 1;
		border: none;
		background: transparent;
		color: #eaf1f6;
		font: inherit;
		font-size: 12px;
		outline: none;
	}
	.prompt input::placeholder {
		color: #5c7384;
	}
	.hintchip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 11px;
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.hintchip code {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.hintchip:disabled {
		opacity: 0.5;
	}

	.file {
		width: 100%;
		overflow: hidden;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.fbar {
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 3px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.yaml {
		margin: 0;
		padding: 6px 10px;
		overflow-x: auto;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		line-height: 1.55;
		color: var(--color-ink);
	}
	.key {
		color: var(--color-brand);
		font-weight: 700;
	}
	.dash {
		color: var(--color-faint);
	}

	.grid {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
	}
	.srv {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		border-radius: 9px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 2px 4px;
		transition:
			border-color 0.3s ease,
			background 0.3s ease;
	}
	.lights {
		display: flex;
		gap: 3px;
	}
	.lights i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-muted);
	}
	.hname {
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.ver {
		border-radius: 5px;
		background: var(--color-paper);
		padding: 0 6px;
		font-size: 9px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.srv.v2 {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.srv.v2 .lights i {
		background: var(--color-grass);
	}
	.srv.v2 .ver {
		background: var(--color-grass);
		color: #fff;
	}
	.srv.typo {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.srv.typo .lights i {
		background: var(--color-danger);
	}
	.srv.typo .ver {
		background: var(--color-danger);
		color: #fff;
	}
	.srv.busy {
		border-color: var(--color-amber);
	}
	.srv.busy .lights i {
		background: var(--color-amber);
		animation: blink 0.5s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.3;
		}
	}

	.manual {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.line {
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 8px 14px;
		font-size: 12px;
		font-weight: 700;
	}
	.line:disabled {
		opacity: 0.5;
	}
	.mins {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-amber);
	}
	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.srv.busy .lights i {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
			gap: 11px;
		}
		.console {
			height: 108px;
			font-size: 11.5px;
		}
		.hname {
			font-size: 11px;
		}
		.note {
			font-size: 13.5px;
		}
	}
</style>

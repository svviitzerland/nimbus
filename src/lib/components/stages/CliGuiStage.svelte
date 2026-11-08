<script lang="ts">
	import { tick } from 'svelte';
	import type { LessonText, CliGuiText } from '$lib/chapters/types';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onlock,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onlock?: (v: boolean) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as CliGuiText);

	let tab = $state<'gui' | 'cli'>('gui');

	// One task, two ways. Each side completes once the files become visible. The flow is gated:
	// you finish the side you are on before you can move on (and the same the other way around).
	let guiDone = $state(false);
	let cliDone = $state(false);
	let done = false;

	function finish(which: 'gui' | 'cli') {
		if (which === 'gui') {
			if (guiDone) return;
			guiDone = true;
		} else {
			if (cliDone) return;
			cliDone = true;
		}
		if (guiDone && cliDone) {
			if (!done) {
				done = true;
				onstate?.('both');
				oncomplete?.();
			}
		} else {
			onstate?.(which);
		}
	}

	// GUI: a Windows desktop. Click the Documents icon to open a folder window of files.
	let folderOpen = $state(false);
	function openFolder() {
		folderOpen = true;
		finish('gui');
	}
	const FILE_TONE: Record<string, string> = {
		pdf: '#d3584a',
		jpg: '#3a9c64',
		jpeg: '#3a9c64',
		png: '#3a9c64',
		txt: '#2e6fe0',
		doc: '#2e6fe0',
		docx: '#2e6fe0'
	};
	function ext(name: string) {
		return (name.split('.').pop() ?? '').toUpperCase();
	}
	function tone(name: string) {
		return FILE_TONE[(name.split('.').pop() ?? '').toLowerCase()] ?? '#7a8794';
	}

	// CLI: a real terminal you type into. cd to move, ls to list, errors when wrong.
	type Ln = {
		tone: 'cmd' | 'out' | 'dir' | 'file' | 'err' | 'muted';
		text: string;
		prompt?: string;
	};
	let cwd = $state<'~' | 'documents'>('~');
	let history = $state<Ln[]>([]);
	let input = $state('');
	let lsInDocs = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);
	let started = false;

	const cwdPath = $derived(cwd === '~' ? '~' : '~/documents');
	const promptStr = $derived(`${tx.promptUser}:${cwdPath}$`);
	const suggest = $derived(
		cwd === '~' ? `cd ${tx.folderName.toLowerCase()}` : lsInDocs ? '' : 'ls'
	);

	function add(kind: Ln['tone'], text: string) {
		history = [...history, { tone: kind, text }];
	}
	function run(raw: string) {
		const cmd = raw.trim();
		if (!cmd) return;
		if (!started) {
			started = true;
			history = []; // clear the helper hint on the first real command
		}
		history = [...history, { tone: 'cmd', text: cmd, prompt: promptStr }];
		const parts = cmd.split(/\s+/);
		const name = parts[0].toLowerCase();
		const arg = parts.slice(1).join(' ').replace(/\/+$/, '');
		const argl = arg.toLowerCase();

		if (name === 'clear') {
			history = [];
			return;
		}
		if (name === 'pwd') {
			add('out', cwd === '~' ? '/home/nim' : '/home/nim/documents');
			return;
		}
		if (name === 'ls' || name === 'dir' || name === 'll') {
			if (cwd === '~') {
				add('dir', tx.folderName);
			} else {
				add('file', tx.files.join('   '));
				if (!lsInDocs) {
					lsInDocs = true;
					finish('cli');
				}
			}
			return;
		}
		if (name === 'cd') {
			const target = argl.replace(/^~\//, '').replace(/^\/home\/nim\/?/, '');
			if (target === '' || argl === '~' || argl === '..') {
				cwd = '~';
				return;
			}
			if (target === tx.folderName.toLowerCase()) {
				cwd = 'documents';
				return;
			}
			add('err', `cd: no such file or directory: ${arg}`);
			return;
		}
		add('err', `command not found: ${name}`);
	}
	function submit(e: Event) {
		e.preventDefault();
		const v = input;
		input = '';
		run(v);
		inputEl?.focus();
	}
	function runChip() {
		if (!suggest) return;
		run(suggest);
		inputEl?.focus();
	}
	// Switching to the CLI is locked until the GUI task is done (do the click first).
	async function pick(t: 'gui' | 'cli') {
		if (t === 'cli' && !guiDone) return;
		tab = t;
		if (t === 'cli') {
			await tick();
			inputEl?.focus();
		}
	}

	// Seed the terminal with a friendly hint line (and keep it language synced until typing starts).
	$effect(() => {
		if (started) return;
		const hint = tx.cliHint;
		if (history.length === 0) history = [{ tone: 'muted', text: hint }];
		else if (history.length === 1 && history[0].tone === 'muted' && history[0].text !== hint)
			history = [{ tone: 'muted', text: hint }];
	});
	// Keep the newest line in view.
	$effect(() => {
		void history.length;
		if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
	});
	// Follow the narrative and gate "Next": on the GUI beat it stays locked until the folder is
	// clicked, on the CLI beat until the command is run. Then it opens, and the same in reverse.
	let staged = -1;
	$effect(() => {
		const b = beat;
		onshow?.(b >= 1);
		if (b !== staged) {
			staged = b;
			if (b === 1) tab = 'gui';
			else if (b === 2 && guiDone) tab = 'cli';
		}
		if (b === 1) onlock?.(!guiDone);
		else if (b === 2) onlock?.(!cliDone);
		else onlock?.(false);
	});
</script>

<div class="wrap">
	<div class="task">
		<svg class="ti" viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="12" cy="12" r="9" fill="none" stroke="#c8842a" stroke-width="1.7" />
			<path
				d="M8 12.2l2.6 2.6L16 9"
				fill="none"
				stroke="#c8842a"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<span>{tx.taskLabel}</span>
	</div>

	<div class="seg">
		<button
			type="button"
			class="sgi"
			class:act={tab === 'gui'}
			class:ok={guiDone}
			onclick={() => pick('gui')}
		>
			{#if guiDone}<svg class="chk" viewBox="0 0 16 16" aria-hidden="true"
					><path
						d="M3 8.5l3 3 7-7"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/></svg
				>{/if}{tx.guiTab}
		</button>
		<button
			type="button"
			class="sgi"
			class:act={tab === 'cli'}
			class:ok={cliDone}
			disabled={!guiDone}
			onclick={() => pick('cli')}
		>
			{#if cliDone}<svg class="chk" viewBox="0 0 16 16" aria-hidden="true"
					><path
						d="M3 8.5l3 3 7-7"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/></svg
				>{:else if !guiDone}<svg class="lk" viewBox="0 0 16 16" aria-hidden="true"
					><rect x="3.2" y="7" width="9.6" height="7" rx="1.6" fill="currentColor" /><path
						d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
					/></svg
				>{/if}{tx.cliTab}
		</button>
	</div>

	<div class="panel">
		{#if tab === 'gui'}
			<div class="desktop">
				<button
					type="button"
					class="dicon"
					class:pulse={!guiDone}
					onclick={openFolder}
					aria-label={tx.folderName}
				>
					<span class="difolder">
						<svg viewBox="0 0 48 38" aria-hidden="true"
							><path
								d="M2 7a3 3 0 0 1 3-3h11l4 4h25a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z"
								fill="#f5c14e"
								stroke="#dca12f"
								stroke-width="1.5"
							/><path d="M2 13h44" stroke="#dca12f" stroke-width="1.1" opacity=".45" /></svg
						>
					</span>
					<span class="dilabel">{tx.folderName}</span>
				</button>

				{#if folderOpen}
					<div class="window">
						<div class="wbar">
							<span class="wtitle">
								<svg viewBox="0 0 20 16" aria-hidden="true"
									><path
										d="M1 3.5A1.5 1.5 0 0 1 2.5 2h4.2l1.6 1.6h8.2A1.5 1.5 0 0 1 18 5.1v8.4A1.5 1.5 0 0 1 16.5 15h-14A1.5 1.5 0 0 1 1 13.5z"
										fill="#f5c14e"
										stroke="#dca12f"
										stroke-width="1.1"
									/></svg
								>
								{tx.folderName}
							</span>
							<span class="wctl">
								<span class="wbtn"
									><svg viewBox="0 0 12 12" aria-hidden="true"
										><path d="M2 6h8" stroke="currentColor" stroke-width="1.4" /></svg
									></span
								>
								<span class="wbtn"
									><svg viewBox="0 0 12 12" aria-hidden="true"
										><rect
											x="2.2"
											y="2.2"
											width="7.6"
											height="7.6"
											rx="1"
											fill="none"
											stroke="currentColor"
											stroke-width="1.4"
										/></svg
									></span
								>
								<button
									type="button"
									class="wbtn cls"
									onclick={() => (folderOpen = false)}
									aria-label={tx.backLabel}
									><svg viewBox="0 0 12 12" aria-hidden="true"
										><path
											d="M3 3l6 6M9 3l-6 6"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
										/></svg
									></button
								>
							</span>
						</div>
						<div class="waddr">
							<svg viewBox="0 0 20 16" aria-hidden="true"
								><path
									d="M1 3.5A1.5 1.5 0 0 1 2.5 2h4.2l1.6 1.6h8.2A1.5 1.5 0 0 1 18 5.1v8.4A1.5 1.5 0 0 1 16.5 15h-14A1.5 1.5 0 0 1 1 13.5z"
									fill="#f5c14e"
									stroke="#dca12f"
									stroke-width="1"
								/></svg
							>
							<span class="wpath"
								>{tx.homeCrumb} <span class="sep">›</span> <b>{tx.folderName}</b></span
							>
						</div>
						<div class="wfiles">
							{#each tx.files as f, eachIndex9164 (eachIndex9164)}
								<div class="fcard">
									<span class="fico">
										<svg viewBox="0 0 36 44" aria-hidden="true"
											><path
												d="M7 3h16l8 8v28a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
												fill="#fff"
												stroke="#cbd5df"
												stroke-width="1.5"
											/><path d="M23 3v8h8" fill="none" stroke="#cbd5df" stroke-width="1.5" /></svg
										>
										<span class="ext" style="background:{tone(f)}">{ext(f)}</span>
									</span>
									<span class="fname">{f}</span>
								</div>
							{/each}
						</div>
						<p class="wnote">{tx.guiOpened}</p>
					</div>
				{:else}
					<p class="dhint">{tx.guiHint}</p>
				{/if}

				<div class="taskbar">
					<span class="tstart"
						><svg viewBox="0 0 16 16" aria-hidden="true"
							><rect x="1" y="1" width="6" height="6" fill="#2e6fe0" /><rect
								x="9"
								y="1"
								width="6"
								height="6"
								fill="#2e6fe0"
							/><rect x="1" y="9" width="6" height="6" fill="#2e6fe0" /><rect
								x="9"
								y="9"
								width="6"
								height="6"
								fill="#2e6fe0"
							/></svg
						></span
					>
					<span class="tapp"></span>
					<span class="tapp"></span>
					<span class="tclock">9:41</span>
				</div>
			</div>
		{:else}
			<div class="cliside">
				<div class="term">
					<div class="tbar">
						<span class="dots"><i></i><i></i><i></i></span>
						<span class="thost">{tx.promptUser}</span>
					</div>
					<div class="tbody" bind:this={bodyEl}>
						{#each history as l, eachIndex10693 (eachIndex10693)}
							<div class="ln {l.tone}">
								{#if l.tone === 'cmd'}<span class="pr">{l.prompt}</span>{/if}{l.text}
							</div>
						{/each}
						<form class="ln cmd active" onsubmit={submit}>
							<span class="pr">{promptStr}</span>
							<input
								class="tin"
								bind:this={inputEl}
								bind:value={input}
								placeholder={suggest}
								spellcheck="false"
								autocapitalize="off"
								autocorrect="off"
								autocomplete="off"
								aria-label="command"
							/>
						</form>
					</div>
				</div>
				{#if suggest}
					<button type="button" class="chip" onclick={runChip}>
						<svg class="cplay" viewBox="0 0 12 12" aria-hidden="true"
							><path d="M3 2l6 4-6 4z" fill="currentColor" /></svg
						><span class="ccmd">{suggest}</span>
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 13px;
		width: min(94vw, 380px);
		height: 100%;
	}
	.task {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		max-width: 100%;
		border-radius: 999px;
		border: 1px solid #ecddbf;
		background: #fbf3e2;
		color: #8a5a17;
		font-size: 11.5px;
		font-weight: 700;
		padding: 6px 13px 6px 10px;
		text-align: left;
	}
	.ti {
		width: 15px;
		height: 15px;
		flex: none;
	}

	/* GUI | CLI toggle, a check once each side is done, a lock on CLI until the GUI is done */
	.seg {
		display: inline-flex;
		gap: 4px;
		padding: 4px;
		border-radius: 999px;
		background: #efeae1;
	}
	.sgi {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		padding: 7px 22px;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0.05em;
		color: var(--color-faint);
		background: transparent;
		transition:
			background 0.25s ease,
			color 0.25s ease,
			box-shadow 0.25s ease;
	}
	.sgi.act {
		background: #fff;
		color: var(--color-ink);
		box-shadow: 0 2px 7px rgba(22, 40, 60, 0.12);
	}
	.sgi.ok {
		color: #2f7d54;
	}
	.sgi.act.ok {
		color: #2f7d54;
	}
	.sgi:disabled {
		opacity: 0.55;
	}
	.chk {
		width: 13px;
		height: 13px;
	}
	.lk {
		width: 12px;
		height: 12px;
		opacity: 0.75;
	}

	.panel {
		width: 100%;
		min-height: 300px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
	}

	/* ---- GUI: a small Windows desktop ---- */
	.desktop {
		position: relative;
		width: 100%;
		height: 272px;
		border-radius: 13px;
		overflow: hidden;
		background: radial-gradient(135% 110% at 26% 16%, #5d92d8, #356ab9 46%, #244a86);
		border: 1px solid #21407a;
		box-shadow: 0 16px 36px rgba(22, 40, 60, 0.2);
	}
	.dicon {
		position: absolute;
		top: 12px;
		left: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		width: 76px;
		padding: 8px 4px;
		border-radius: 9px;
		background: transparent;
		transition: background 0.18s ease;
	}
	.dicon:hover {
		background: rgba(255, 255, 255, 0.16);
	}
	.dicon.pulse::after {
		content: '';
		position: absolute;
		inset: -2px;
		border-radius: 11px;
		border: 2px solid rgba(255, 255, 255, 0.85);
		animation: invite 1.6s ease-in-out infinite;
		pointer-events: none;
	}
	@keyframes invite {
		0%,
		100% {
			opacity: 0.22;
			transform: scale(0.97);
		}
		50% {
			opacity: 0.85;
			transform: scale(1.03);
		}
	}
	.difolder svg {
		width: 50px;
		height: 40px;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}
	.dilabel {
		font-size: 11.5px;
		font-weight: 700;
		color: #fff;
		text-align: center;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
	}
	.dhint {
		position: absolute;
		left: 50%;
		bottom: 48px;
		transform: translateX(-50%);
		margin: 0;
		border-radius: 999px;
		background: rgba(14, 26, 40, 0.74);
		color: #fff;
		font-size: 11.5px;
		font-weight: 600;
		padding: 6px 14px;
		white-space: nowrap;
	}

	.window {
		position: absolute;
		top: 14px;
		left: 14px;
		right: 14px;
		bottom: 44px;
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		overflow: hidden;
		background: #fff;
		border: 1px solid #d7dde4;
		box-shadow: 0 18px 40px rgba(10, 22, 40, 0.4);
		animation: winpop 0.26s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes winpop {
		from {
			opacity: 0;
			transform: scale(0.94) translateY(8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.wbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 11px;
		height: 36px;
		background: #f3f5f8;
		border-bottom: 1px solid #e7ebf0;
	}
	.wtitle {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 12.5px;
		font-weight: 800;
		color: #2b3640;
	}
	.wtitle svg {
		width: 17px;
		height: 14px;
	}
	.wctl {
		display: inline-flex;
		align-items: stretch;
		height: 100%;
	}
	.wbtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		color: #5a6670;
		background: transparent;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}
	.wbtn svg {
		width: 12px;
		height: 12px;
	}
	.wbtn.cls:hover {
		background: #e3564a;
		color: #fff;
	}
	.waddr {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 12px;
		background: #fbfbfc;
		border-bottom: 1px solid #eef1f4;
	}
	.waddr svg {
		width: 15px;
		height: 12px;
		flex: none;
	}
	.wpath {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11.5px;
		font-weight: 600;
		color: #7c8893;
	}
	.wpath b {
		color: var(--color-ink);
		font-weight: 800;
	}
	.wpath .sep {
		color: #b7c0c9;
	}
	.wfiles {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		justify-content: center;
		gap: 16px;
		padding: 14px;
		background: #fff;
		overflow-y: auto;
	}
	.wnote {
		margin: 0;
		padding: 7px 12px 9px;
		text-align: center;
		font-size: 11.5px;
		font-weight: 700;
		color: #2f7d54;
		background: #f1f8f3;
		border-top: 1px solid #e3efe8;
	}

	.taskbar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 13px;
		background: rgba(238, 243, 250, 0.86);
		border-top: 1px solid rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(8px);
	}
	.tstart {
		display: inline-flex;
	}
	.tstart svg {
		width: 17px;
		height: 17px;
	}
	.tapp {
		width: 16px;
		height: 16px;
		border-radius: 4px;
		background: rgba(46, 111, 224, 0.35);
	}
	.tclock {
		position: absolute;
		right: 11px;
		font-size: 10.5px;
		font-weight: 700;
		color: #3a4650;
		font-variant-numeric: tabular-nums;
	}

	/* file cards inside the open window */
	.fcard {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		width: 80px;
	}
	.fico {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.fico svg {
		width: 40px;
		height: 49px;
		filter: drop-shadow(0 3px 7px rgba(22, 40, 60, 0.12));
	}
	.ext {
		position: absolute;
		left: 50%;
		bottom: 6px;
		transform: translateX(-50%);
		border-radius: 4px;
		color: #fff;
		font-size: 8.5px;
		font-weight: 800;
		letter-spacing: 0.04em;
		padding: 2px 5px;
	}
	.fname {
		font-size: 11.5px;
		font-weight: 700;
		color: #2b3640;
		text-align: center;
		word-break: break-word;
	}

	/* ---- CLI terminal ---- */
	.cliside {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 11px;
		width: 100%;
	}
	.term {
		width: 100%;
		border-radius: 13px;
		overflow: hidden;
		background: #0f2030;
		border: 1px solid #1d3547;
		box-shadow: 0 16px 36px rgba(15, 32, 48, 0.3);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-align: left;
	}
	.tbar {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 8px 12px;
		background: #15293a;
		border-bottom: 1px solid #1d3547;
	}
	.dots {
		display: inline-flex;
		gap: 5px;
	}
	.dots i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #2f4a5e;
	}
	.dots i:nth-child(1) {
		background: #e06a5b;
	}
	.dots i:nth-child(2) {
		background: #e0b65b;
	}
	.dots i:nth-child(3) {
		background: #5bbd84;
	}
	.thost {
		font-size: 11px;
		font-weight: 600;
		color: #8aa2b3;
		letter-spacing: 0.02em;
	}
	.tbody {
		display: flex;
		flex-direction: column;
		gap: 4px;
		height: 214px;
		overflow-y: auto;
		padding: 13px 14px;
		font-size: 13.5px;
		line-height: 1.5;
	}
	.ln {
		color: #93a7b6;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.ln.cmd {
		color: #eaf1f6;
	}
	.ln.dir {
		color: #6fb6ff;
		font-weight: 700;
	}
	.ln.file {
		color: #d2e2ee;
	}
	.ln.err {
		color: #ff9d92;
	}
	.ln.muted {
		color: #5c7384;
		font-style: italic;
	}
	.pr {
		color: #5bbd84;
		font-weight: 600;
		margin-right: 0.6ch;
	}
	.active {
		display: flex;
		align-items: baseline;
	}
	.tin {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: transparent;
		color: #eaf1f6;
		font: inherit;
		caret-color: #6fd39a;
		padding: 0;
	}
	.tin::placeholder {
		color: #51697b;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		border-radius: 10px;
		border: 1px solid #b9c8d4;
		background: #f2f6fa;
		color: #5c6b77;
		font-size: 11.5px;
		font-weight: 700;
		padding: 6px 12px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.chip:hover {
		border-color: #2e6fe0;
		background: var(--color-brand-soft);
	}
	.cplay {
		width: 11px;
		height: 11px;
		color: #2e6fe0;
	}
	.ccmd {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 800;
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.window {
			animation: none;
		}
		.dicon.pulse::after {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
			gap: 15px;
		}
		.task {
			font-size: 12.5px;
		}
		.panel {
			min-height: 320px;
		}
		.desktop {
			height: 296px;
		}
		.tbody {
			font-size: 14.5px;
			height: 230px;
		}
		.fname {
			font-size: 12.5px;
		}
	}

	/* ---- Dark mode ---- */
	:global(.dark) .task {
		border-color: #5a4a2c;
		background: #2a2418;
		color: #c8942a;
	}
	:global(.dark) .seg {
		background: #2c3746;
	}
	:global(.dark) .sgi.act {
		background: #1b2533;
		box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3);
	}
	:global(.dark) .sgi.ok {
		color: #5bb87e;
	}
	:global(.dark) .sgi.act.ok {
		color: #5bb87e;
	}
	:global(.dark) .desktop {
		background: radial-gradient(135% 110% at 26% 16%, #1a3a5c, #142a44 46%, #0f1f33);
		border-color: #1a3050;
		box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
	}
	:global(.dark) .window {
		background: #1b2533;
		border-color: #2c3746;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
	}
	:global(.dark) .wbar {
		background: #141c2a;
		border-bottom-color: #2c3746;
	}
	:global(.dark) .wtitle {
		color: #e0dcd4;
	}
	:global(.dark) .wbtn {
		color: #97a3ae;
	}
	:global(.dark) .waddr {
		background: #141c2a;
		border-bottom-color: #2c3746;
	}
	:global(.dark) .wpath {
		color: #97a3ae;
	}
	:global(.dark) .wpath .sep {
		color: #6b7885;
	}
	:global(.dark) .wfiles {
		background: #1b2533;
	}
	:global(.dark) .wnote {
		color: #5bb87e;
		background: #142a1e;
		border-top-color: #2a4a38;
	}
	:global(.dark) .fname {
		color: #e0dcd4;
	}
	:global(.dark) .fico svg {
		fill: #1b2533;
		stroke: #3a4a5c;
	}
	:global(.dark) .fico svg path:nth-child(2) {
		fill: none;
		stroke: #3a4a5c;
	}
	:global(.dark) .taskbar {
		background: rgba(14, 22, 33, 0.86);
		border-top-color: rgba(255, 255, 255, 0.08);
	}
	:global(.dark) .tclock {
		color: #97a3ae;
	}
	:global(.dark) .chip {
		border-color: #3a4a5c;
		background: #1b2533;
		color: #97a3ae;
	}
	:global(.dark) .chip:hover {
		border-color: #2e6fe0;
	}
</style>

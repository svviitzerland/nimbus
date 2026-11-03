<script lang="ts">
	import { onDestroy } from 'svelte';
	import Server from '$lib/components/Server.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { IacText } from '$lib/chapters/devops/iac/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as IacText);

	const range = (n: number) => Array.from({ length: n }, (_v, i) => i);
	let act = $state(0);
	let codeUnlocked = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	// ---- Act 1, by hand ----
	type Built = { size: number; region: number };
	const HAND_TARGET = 3;
	let handServers = $state<Built[]>([]);
	let pickSize = $state(-1);
	let pickRegion = $state(-1);
	let clicks = $state(0);
	let handLost = $state(false);
	const handFull = $derived(handServers.length >= HAND_TARGET);
	const handSame = $derived(
		handServers.every((s) => s.size === handServers[0].size && s.region === handServers[0].region)
	);

	function choose(kind: 'size' | 'region', i: number) {
		if (handFull) return;
		clicks += 1;
		if (kind === 'size') pickSize = i;
		else pickRegion = i;
	}
	function create() {
		if (handFull || pickSize < 0 || pickRegion < 0) return;
		clicks += 1;
		handServers = [...handServers, { size: pickSize, region: pickRegion }];
		// the console forgets the form after each server, like a real one
		pickSize = -1;
		pickRegion = -1;
		if (handServers.length === HAND_TARGET) onstate?.('hand');
	}
	function handDisaster() {
		handLost = true;
		codeUnlocked = true;
		onstate?.('handLost');
	}

	// ---- Act 2, as code ----
	let count = $state(3);
	let live = $state(0);
	let applying = $state(false);
	let everApplied = false;
	let codeLost = $state(false);
	let lostCount = $state(0);
	let rebuilt = $state(false);
	let done = false;
	type Line = { text: string; tone?: 'cmd' | 'out' | 'ok' | 'muted' };
	let lines = $state<Line[]>([{ text: '# main.tf is ready', tone: 'muted' }]);

	function apply() {
		if (applying) return;
		applying = true;
		const add = Math.max(0, count - live);
		const del = Math.max(0, live - count);
		const wasLost = codeLost;
		const first = !everApplied;
		lines = [{ text: 'terraform apply', tone: 'cmd' }];
		at(350, () => {
			if (add === 0 && del === 0) {
				lines = [
					...lines,
					{ text: 'No changes. Your infrastructure matches the configuration.', tone: 'ok' }
				];
				applying = false;
				return;
			}
			lines = [...lines, { text: `Plan: ${add} to add, 0 to change, ${del} to destroy.` }];
			// servers come and go one at a time
			const steps = add + del;
			for (let i = 0; i < steps; i++) {
				at(280 * (i + 1), () => (live += add > 0 ? 1 : -1));
			}
			at(280 * (steps + 1), () => {
				lines = [
					...lines,
					{
						text: `Apply complete! Resources: ${add} added, 0 changed, ${del} destroyed.`,
						tone: 'ok'
					}
				];
				applying = false;
				codeLost = false;
				everApplied = true;
				if (wasLost) {
					rebuilt = true;
					onstate?.('rebuilt');
					if (!done) {
						done = true;
						oncomplete?.();
					}
				} else onstate?.(first ? 'applied' : 'diff');
			});
		});
	}
	function codeDisaster() {
		lostCount = live;
		live = 0;
		codeLost = true;
		lines = [...lines, { text: 'data center offline, 0 servers running', tone: 'muted' }];
	}

	const note = $derived.by(() => {
		if (act === 0) {
			if (handLost) return tx.noteHandLost;
			if (handFull) return tx.noteHandDone;
			return tx.noteHand.replace('{n}', String(HAND_TARGET - handServers.length));
		}
		if (codeLost) return tx.noteCodeLost;
		if (rebuilt && live > 0) return tx.noteRebuilt;
		if (live > 0) return tx.noteCodeLive;
		return tx.noteCode;
	});

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet rack(lost: boolean, label: string, sub: string)}
	<div class="rack" class:lost>
		<Server active={!lost} slots={2} />
		<span class="rname">{label}</span>
		<span class="rsub">{sub}</span>
	</div>
{/snippet}

<div class="wrap">
	<div class="tabs" role="tablist">
		{#each tx.acts as a, i (i)}
			<button
				type="button"
				role="tab"
				aria-selected={act === i}
				class:on={act === i}
				disabled={i === 1 && !codeUnlocked}
				onclick={() => (act = i)}>{a}</button
			>
		{/each}
	</div>

	{#if act === 0}
		<!-- a pretend cloud console, one form per server -->
		<div class="console">
			<div class="chead">
				<b>{tx.consoleTitle}</b>
				<span class="clicks">{tx.clicksTag.replace('{n}', String(clicks))}</span>
			</div>
			<div class="row">
				<span class="flabel">{tx.sizeLabel}</span>
				<div class="chips">
					{#each tx.sizes as s, i (i)}
						<button
							type="button"
							class="chip"
							class:on={pickSize === i}
							disabled={handFull}
							onclick={() => choose('size', i)}>{s}</button
						>
					{/each}
				</div>
			</div>
			<div class="row">
				<span class="flabel">{tx.regionLabel}</span>
				<div class="chips">
					{#each tx.regions as r, i (i)}
						<button
							type="button"
							class="chip"
							class:on={pickRegion === i}
							disabled={handFull}
							onclick={() => choose('region', i)}>{r}</button
						>
					{/each}
				</div>
			</div>
			<button
				type="button"
				class="cta"
				disabled={handFull || pickSize < 0 || pickRegion < 0}
				onclick={create}>{tx.createBtn}</button
			>
		</div>

		<div class="racks">
			{#each range(HAND_TARGET) as i (i)}
				{#if handServers[i]}
					{@render rack(
						handLost,
						tx.serverLabel.replace('{n}', String(i + 1)),
						`${tx.sizes[handServers[i].size]}, ${tx.regions[handServers[i].region]}`
					)}
				{:else}
					<div class="rack empty"><span class="ghost"></span></div>
				{/if}
			{/each}
		</div>
		{#if handFull && !handLost}
			<span class="verdict" class:bad={!handSame}>{handSame ? tx.sameTag : tx.driftTag}</span>
		{/if}

		<div class="acts">
			{#if handFull && !handLost}
				<button type="button" class="danger" onclick={handDisaster}>{tx.disasterBtn}</button>
			{:else if handLost}
				<button type="button" class="cta" onclick={() => (act = 1)}>{tx.nextAct}</button>
			{/if}
		</div>
	{:else}
		<!-- the Terraform file, with an editable count -->
		<div class="editor">
			<div class="ebar"><span>main.tf</span></div>
			<pre class="code"><span class="k">resource</span> <span class="s">"nimbus_server"</span> <span
					class="s">"web"</span
				> &#123;
  count  = <span class="stepper"
					><button
						type="button"
						aria-label="minus"
						disabled={applying || count <= 1}
						onclick={() => (count -= 1)}>−</button
					><b class="n">{count}</b><button
						type="button"
						aria-label="plus"
						disabled={applying || count >= 5}
						onclick={() => (count += 1)}>+</button
					></span
				>
  size   = <span class="s">"small"</span>
  region = <span class="s">"jakarta"</span>
&#125;</pre>
			<span class="hint">{tx.countHint}</span>
		</div>

		<div class="acts">
			<button type="button" class="cmd" disabled={applying} onclick={apply}>
				<span class="dollar">$</span>
				{tx.applyBtn}
			</button>
			<button type="button" class="danger" disabled={applying || live === 0} onclick={codeDisaster}
				>{tx.disasterBtn}</button
			>
		</div>

		<div class="term">
			<Terminal prompt="$" {lines} bare />
		</div>

		<div class="racks">
			{#each range(Math.max(live, codeLost ? lostCount : 0)) as i (i)}
				{@render rack(i >= live, tx.serverLabel.replace('{n}', String(i + 1)), 'small, jakarta')}
			{/each}
		</div>
	{/if}

	<p class="note">{note}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 11px;
	}
	.tabs {
		display: flex;
		gap: 4px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.tabs button {
		border-radius: 9px;
		padding: 6px 14px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.tabs button.on {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.tabs button:disabled {
		opacity: 0.4;
	}

	.console {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 8px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 11px 13px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
	}
	.chead {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.chead b {
		font-size: 13px;
		color: var(--color-ink);
	}
	.clicks {
		border-radius: 999px;
		background: var(--color-amber-soft);
		padding: 2px 9px;
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-amber);
		font-variant-numeric: tabular-nums;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.flabel {
		width: 52px;
		flex-shrink: 0;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
	.chip {
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 4px 10px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.chip:disabled {
		opacity: 0.5;
	}
	.cta {
		align-self: center;
		border-radius: 11px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 9px 20px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.cta:disabled {
		opacity: 0.45;
	}
	.danger {
		border-radius: 11px;
		background: var(--color-danger);
		color: #fff;
		padding: 9px 16px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.danger:disabled {
		opacity: 0.4;
	}

	.racks {
		display: flex;
		min-height: 78px;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}
	.rack {
		display: flex;
		width: 64px;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		animation: pop 0.3s ease both;
		transition: opacity 0.3s ease;
	}
	.rack :global(.server) {
		width: 48px;
		gap: 4px;
		padding: 5px;
		border-radius: 8px;
	}
	.rack :global(.server .slot) {
		height: 8px;
	}
	.rack.lost {
		opacity: 0.3;
	}
	.rack.lost :global(.server) {
		border-color: var(--color-danger);
	}
	.rname {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.rsub {
		font-size: 8.5px;
		color: var(--color-faint);
		text-align: center;
		line-height: 1.2;
	}
	.rack.empty {
		justify-content: flex-start;
		animation: none;
	}
	.ghost {
		width: 48px;
		height: 38px;
		border-radius: 8px;
		border: 1.5px solid var(--color-line);
		background: var(--color-paper);
		opacity: 0.6;
	}
	@keyframes pop {
		from {
			transform: scale(0.6);
			opacity: 0;
		}
	}
	.verdict {
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 2px 10px;
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-grass);
	}
	.verdict.bad {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	.editor {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.ebar {
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 5px 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.code {
		margin: 0;
		padding: 9px 12px 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		line-height: 1.75;
		color: var(--color-ink);
		white-space: pre;
		overflow-x: auto;
	}
	.k {
		color: var(--color-brand);
		font-weight: 700;
	}
	.s {
		color: var(--color-grass);
	}
	.stepper {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border-radius: 7px;
		background: var(--color-amber-soft);
		padding: 0 3px;
		vertical-align: middle;
	}
	.stepper button {
		width: 20px;
		height: 20px;
		border-radius: 5px;
		background: var(--color-card);
		color: var(--color-ink);
		font-weight: 800;
		line-height: 1;
	}
	.stepper button:disabled {
		opacity: 0.35;
	}
	.n {
		min-width: 12px;
		text-align: center;
		color: var(--color-amber);
	}
	.hint {
		display: block;
		padding: 0 12px 7px;
		font-size: 10px;
		color: var(--color-faint);
	}
	.cmd {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 11px;
		background: #10212f;
		color: #eaf1f6;
		padding: 9px 16px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		font-weight: 600;
	}
	.cmd:disabled {
		opacity: 0.55;
	}
	.dollar {
		color: #5bbd84;
	}
	.term {
		width: 100%;
	}
	.term :global(.body) {
		min-height: 64px;
		padding: 9px 12px;
		font-size: 11px;
		gap: 2px;
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
		.rack {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 13px;
		}
		.code {
			font-size: 13px;
		}
		.note {
			font-size: 13.5px;
		}
	}
</style>

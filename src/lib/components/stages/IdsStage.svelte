<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { IdsPacket, IdsText } from '$lib/chapters/security/ids/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as IdsText);

	// The raw requests are real wire text, so they stay the same in every language.
	// The score is how suspicious the guard finds each one, out of 100.
	const packets: { id: IdsPacket; req: string; score: number; attack: boolean }[] = [
		{ id: 'home', req: 'GET /', score: 8, attack: false },
		{ id: 'products', req: 'GET /products', score: 14, attack: false },
		{ id: 'login', req: 'POST /login', score: 30, attack: false },
		{ id: 'sqli', req: "GET /search?q=' OR 1=1", score: 86, attack: true },
		{ id: 'cart', req: 'POST /cart', score: 11, attack: false },
		{ id: 'abroad', req: 'GET / (Brazil)', score: 47, attack: false },
		{ id: 'traversal', req: 'GET /../../etc/passwd', score: 77, attack: true },
		{ id: 'fast', req: 'GET /search x30', score: 58, attack: false },
		{ id: 'portscan', req: 'SYN ports 1 to 1000', score: 93, attack: true },
		{ id: 'blog', req: 'GET /blog', score: 6, attack: false }
	];
	const ATTACKS = packets.filter((p) => p.attack).length;
	const STEP = 420;

	let mode = $state<'ids' | 'ips'>('ids');
	// Strictness on the slider, the line the score must cross is its mirror.
	let strict = $state(10);
	const line = $derived(100 - strict);

	type Verdict = 'pass' | 'alert' | 'block';
	let results = $state<{ id: IdsPacket; verdict: Verdict }[]>([]);
	let runLine = $state(90);
	let running = $state(false);
	let ran = $state(false);
	let current = $state(-1);
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function run() {
		if (running) return;
		timers.forEach(clearTimeout);
		timers = [];
		results = [];
		running = true;
		ran = false;
		runLine = line;
		const runMode = mode;
		packets.forEach((p, i) => {
			timers.push(
				setTimeout(() => {
					current = i;
					const flagged = p.score >= runLine;
					results.push({
						id: p.id,
						verdict: !flagged ? 'pass' : runMode === 'ips' ? 'block' : 'alert'
					});
				}, i * STEP)
			);
		});
		timers.push(
			setTimeout(
				() => {
					running = false;
					ran = true;
					current = -1;
					judge(runMode);
				},
				packets.length * STEP + 200
			)
		);
	}

	const byId = Object.fromEntries(packets.map((p) => [p.id, p])) as Record<
		IdsPacket,
		(typeof packets)[number]
	>;
	const stopped = $derived(
		results.filter((r) => byId[r.id].attack && r.verdict === 'block').length
	);
	const wrongBlocks = $derived(
		results.filter((r) => !byId[r.id].attack && r.verdict === 'block').length
	);
	const flaggedAttacks = $derived(
		results.filter((r) => byId[r.id].attack && r.verdict !== 'pass').length
	);
	const wrongFlags = $derived(
		results.filter((r) => !byId[r.id].attack && r.verdict !== 'pass').length
	);

	function judge(runMode: 'ids' | 'ips') {
		if (runMode === 'ids') {
			onstate?.('ids');
			return;
		}
		if (flaggedAttacks < ATTACKS) onstate?.('loose');
		else if (wrongFlags > 0) onstate?.('strict');
		else {
			onstate?.('perfect');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		}
	}

	const live = $derived(current >= 0 ? packets[current] : null);
	const liveVerdict = $derived(live ? results[current]?.verdict : undefined);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<div class="top">
		<CallToActionButton onclick={run} disabled={running}>
			{ran ? tx.runAgain : tx.runBtn}
		</CallToActionButton>
	</div>

	<div class="controls">
		<div class="seg" role="radiogroup" aria-label={tx.guardLabel}>
			<button
				type="button"
				role="radio"
				aria-checked={mode === 'ids'}
				class:on={mode === 'ids'}
				disabled={running}
				onclick={() => (mode = 'ids')}>{tx.modeIds}</button
			>
			<button
				type="button"
				role="radio"
				aria-checked={mode === 'ips'}
				class:on={mode === 'ips'}
				disabled={running}
				onclick={() => (mode = 'ips')}>{tx.modeIps}</button
			>
		</div>
		<label class="slider">
			<span class="slabel">{tx.strictLabel}</span>
			<input type="range" min="0" max="100" step="5" bind:value={strict} disabled={running} />
			<span class="ends"><span>{tx.strictLow}</span><span>{tx.strictHigh}</span></span>
		</label>
	</div>

	<!-- visitors, the guard, and the server, with the request that is passing right now -->
	<div class="lane">
		<div class="actor">
			<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<rect
					x="7"
					y="3"
					width="10"
					height="18"
					rx="2.5"
					stroke="currentColor"
					stroke-width="1.8"
				/>
				<path d="M11 18h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			</svg>
			<span>{tx.youLabel}</span>
		</div>
		<div class="actor guard" class:ips={mode === 'ips'}>
			<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M12 2 4 5.5v5.2c0 5 3.4 9 8 11.3 4.6-2.3 8-6.3 8-11.3V5.5Z"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linejoin="round"
				/>
				{#if mode === 'ids'}
					<circle cx="12" cy="11" r="2.6" stroke="currentColor" stroke-width="1.8" />
				{:else}
					<path d="M8.5 11h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				{/if}
			</svg>
			<span>{mode === 'ids' ? 'IDS' : 'IPS'}</span>
		</div>
		<div class="actor srv">
			<Server slots={2} active={liveVerdict === 'pass' || liveVerdict === 'alert'} />
			<span>{tx.serverLabel}</span>
		</div>
		{#if live}
			{#key current}
				<span
					class="pkt"
					class:bad={liveVerdict !== 'pass'}
					class:stop={liveVerdict === 'block'}
					aria-hidden="true"
				></span>
				{#if liveVerdict === 'alert' || liveVerdict === 'block'}
					<span class="bell">!</span>
				{/if}
			{/key}
		{/if}
	</div>

	<p class="hint">
		{#if ran}
			<span class="res" class:good={stopped === ATTACKS}
				>{tx.resultAttacks
					.replace('{n}', String(stopped))
					.replace('{total}', String(ATTACKS))}</span
			>
			<span class="res" class:good={wrongBlocks === 0}
				>{tx.resultVisitors.replace('{n}', String(wrongBlocks))}</span
			>
		{:else}
			{tx.hintIdle}
		{/if}
	</p>

	<ul class="feed">
		{#each packets as p, i (p.id)}
			{@const r = results[i]}
			<li class="row" class:shown={!!r} class:atk={ran && p.attack}>
				<div class="rtop">
					<code>{p.req}</code>
					{#if r}
						<span class="tag {r.verdict}"
							>{r.verdict === 'pass'
								? tx.tagPass
								: r.verdict === 'alert'
									? tx.tagAlert
									: tx.tagBlock}</span
						>
					{/if}
				</div>
				<div class="rbot">
					<span class="desc">
						{#if ran && p.attack}<b class="atag">{tx.attackTag}</b>{/if}
						{tx.packets[p.id]}
					</span>
					<span class="bar" title="{tx.scoreLabel} {p.score}">
						<span
							class="bfill"
							class:over={p.score >= (r ? runLine : line)}
							style="width:{p.score}%"
						></span>
						<span class="mark" style="left:{r ? runLine : line}%"></span>
					</span>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 390px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		overflow-y: auto;
	}
	.top {
		display: flex;
		min-height: 46px;
		align-items: center;
	}
	.top :global(.cta) {
		padding: 10px 20px;
		font-size: 13px;
	}
	.controls {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 8px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 11px;
	}
	.seg {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
		border-radius: 10px;
		background: var(--color-paper);
		padding: 3px;
	}
	.seg button {
		border-radius: 8px;
		padding: 6px 4px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.seg button.on {
		background: var(--color-card);
		color: var(--color-ink);
		box-shadow: 0 1px 4px rgba(22, 40, 60, 0.12);
	}
	.slider {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.slabel {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.slider input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.ends {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-faint);
	}

	.lane {
		position: relative;
		display: flex;
		width: 100%;
		align-items: flex-end;
		justify-content: space-between;
		padding: 4px 6px 0;
	}
	.actor {
		z-index: 1;
		display: flex;
		width: 74px;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		color: var(--color-muted);
	}
	.actor span {
		font-size: 10px;
		font-weight: 700;
	}
	.actor.guard {
		color: var(--color-amber);
	}
	.actor.guard.ips {
		color: var(--color-brand);
	}
	.actor.srv :global(.server) {
		width: 40px;
		padding: 5px;
		gap: 4px;
		border-radius: 8px;
	}
	.actor.srv :global(.server .slot) {
		height: 8px;
	}
	.pkt {
		position: absolute;
		top: 16px;
		left: 14%;
		width: 12px;
		height: 12px;
		border-radius: 4px;
		background: var(--color-grass);
		animation: travel 0.4s linear forwards;
	}
	.pkt.bad {
		background: var(--color-danger);
	}
	.pkt.stop {
		animation-name: halt;
	}
	@keyframes travel {
		to {
			left: 84%;
		}
	}
	@keyframes halt {
		to {
			left: 44%;
			opacity: 0.4;
		}
	}
	.bell {
		position: absolute;
		top: -4px;
		left: 50%;
		display: grid;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-danger);
		color: #fff;
		font-size: 10px;
		font-weight: 900;
		transform: translateX(-50%);
	}

	.hint {
		display: flex;
		min-height: 1.4em;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 10px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.res {
		color: var(--color-danger);
	}
	.res.good {
		color: var(--color-grass);
	}

	.feed {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.row {
		display: flex;
		flex-direction: column;
		gap: 3px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 9px;
		opacity: 0.45;
		transition:
			opacity 0.2s,
			border-color 0.2s;
	}
	.row.shown {
		opacity: 1;
	}
	.row.atk {
		border-color: color-mix(in srgb, var(--color-danger) 45%, var(--color-line));
	}
	.rtop {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
	}
	code {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.tag {
		flex: none;
		border-radius: 999px;
		font-size: 9px;
		font-weight: 800;
		padding: 1px 7px;
	}
	.tag.pass {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.tag.alert {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.tag.block {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.rbot {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.desc {
		min-width: 0;
		flex: 1;
		font-size: 10px;
		line-height: 1.25;
		color: var(--color-muted);
	}
	.atag {
		margin-right: 3px;
		font-weight: 800;
		color: var(--color-danger);
	}
	.bar {
		position: relative;
		flex: none;
		width: 70px;
		height: 7px;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
	}
	.bfill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		background: var(--color-faint);
	}
	.bfill.over {
		background: var(--color-danger);
	}
	.mark {
		position: absolute;
		top: -3px;
		bottom: -3px;
		width: 2px;
		border-radius: 1px;
		background: var(--color-ink);
		transform: translateX(-1px);
		transition: left 0.15s ease;
	}

	@media (prefers-reduced-motion: reduce) {
		.pkt {
			animation-duration: 0.01s;
		}
		.mark,
		.row {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
		code {
			font-size: 11.5px;
		}
		.desc {
			font-size: 11px;
		}
		.bar {
			width: 96px;
		}
		.seg button {
			font-size: 12px;
		}
	}
</style>

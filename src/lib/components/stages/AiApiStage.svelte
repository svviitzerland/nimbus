<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { AiApiModel, AiApiText } from '$lib/chapters/ai/ai-api/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Server from '$lib/components/Server.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as AiApiText);

	// Made up but realistic prices, in US dollars per 1,000 tokens. Output costs more than input.
	const MODELS: Record<AiApiModel, { name: string; inP: number; outP: number }> = {
		mini: { name: 'nim-mini', inP: 0.0002, outP: 0.0008 },
		pro: { name: 'nim-pro', inP: 0.003, outP: 0.015 }
	};
	const KEY = 'sk_nimbus_8f3a…';

	// A rough rule of thumb, one token is about four characters of text.
	const tokensOf = (s: string) => Math.max(1, Math.ceil(s.length / 4));

	let promptIdx = $state(0);
	let model = $state<AiApiModel>('mini');
	let withKey = $state(true);

	type Phase = 'idle' | 'out' | 'think' | 'back' | 'done';
	let phase = $state<Phase>('idle');
	type Result = {
		model: AiApiModel;
		prompt: number;
		ok: boolean;
		inTok: number;
		outTok: number;
		cost: number;
		reply: string;
	};
	let result = $state<Result | null>(null);
	let shown = $state(0); // how many characters of the reply have streamed in
	let history = $state<Result[]>([]);

	let saidModel = false;
	let saidSent = false;
	let completed = false;

	const busy = $derived(phase !== 'idle' && phase !== 'done');
	const prompt = $derived(tx.prompts[promptIdx]);

	const money = (v: number, sig = 2) =>
		new Intl.NumberFormat(tx.locale, {
			style: 'currency',
			currency: 'USD',
			maximumSignificantDigits: sig
		}).format(v);
	const moneyDay = (v: number) =>
		new Intl.NumberFormat(tx.locale, {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(v);

	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	let timers: ReturnType<typeof setTimeout>[] = [];
	let streamTimer: ReturnType<typeof setInterval> | undefined;
	function later(ms: number, fn: () => void) {
		timers.push(setTimeout(fn, ms));
	}
	function clearAll() {
		timers.forEach(clearTimeout);
		timers = [];
		clearInterval(streamTimer);
		streamTimer = undefined;
	}
	onDestroy(clearAll);

	function pickModel(m: AiApiModel) {
		if (busy || m === model) return;
		model = m;
		if (!saidModel) {
			saidModel = true;
			onstate?.('model');
		}
	}

	function send() {
		if (busy) return;
		clearAll();
		const m = model;
		const p = promptIdx;
		const reply = tx.prompts[p].answers[m];
		const inTok = tokensOf(tx.prompts[p].text) + 6; // plus a few tokens of message wrapping
		const outTok = tokensOf(reply);
		const ok = withKey;
		const cost = ok ? (inTok / 1000) * MODELS[m].inP + (outTok / 1000) * MODELS[m].outP : 0;
		const r: Result = { model: m, prompt: p, ok, inTok, outTok, cost, reply };
		result = null;
		shown = 0;

		const fast = reduced();
		const go = fast ? 0 : 650;
		const think = fast ? 0 : ok ? 700 : 250;
		phase = 'out';
		later(go, () => (phase = 'think'));
		later(go + think, () => (phase = 'back'));
		later(go * 2 + think, () => {
			phase = 'done';
			result = r;
			if (!ok) {
				onstate?.('nokey');
				return;
			}
			history = [...history, r].slice(-4);
			if (fast) shown = reply.length;
			else {
				streamTimer = setInterval(() => {
					shown = Math.min(reply.length, shown + 4);
					if (shown >= reply.length) {
						clearInterval(streamTimer);
						streamTimer = undefined;
					}
				}, 18);
			}
			const models = new Set(history.map((h) => h.model));
			if (models.size > 1 && !completed) {
				completed = true;
				onstate?.('compare');
				oncomplete?.();
			} else if (!saidSent) {
				saidSent = true;
				onstate?.('sent');
			}
		});
	}

	const maxCost = $derived(Math.max(...history.map((h) => h.cost), 0.000001));
	const last = $derived(history.length ? history[history.length - 1] : null);
	const fill = (s: string, vars: Record<string, string | number>) =>
		Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), s);
	const priceLine = $derived(
		fill(tx.priceNote, {
			model: MODELS[model].name,
			in: money(MODELS[model].inP),
			out: money(MODELS[model].outP)
		})
	);

	// The code panes, built as lines of coloured pieces so formatting tools can not shift them.
	type Piece = { t: string; c?: string };
	const q = (s: string) => `"${s}"`;
	const pair = (indent: string, key: string, val: string, cls: string, comma = true): Piece[] => [
		{ t: indent },
		{ t: q(key), c: 'h' },
		{ t: ': ' },
		{ t: val, c: cls },
		{ t: comma ? ',' : '' }
	];
	const requestLines = $derived.by(() => {
		const ls: Piece[][] = [[{ t: 'POST', c: 'k' }, { t: ' /v1/chat' }]];
		if (withKey) ls.push([{ t: 'Authorization', c: 'h' }, { t: `: Bearer ${KEY}` }]);
		ls.push(
			[{ t: '{' }],
			pair('  ', 'model', q(MODELS[model].name), 's'),
			pair('  ', 'message', q(prompt.text), 's', false),
			[{ t: '}' }]
		);
		return ls;
	});
	const responseLines = $derived.by((): Piece[][] => {
		if (!result) return [];
		if (!result.ok)
			return [
				[{ t: '401 Unauthorized', c: 'bad' }],
				[{ t: '{' }],
				pair('  ', 'error', q(tx.missingKey), 's', false),
				[{ t: '}' }]
			];
		const typing = shown < result.reply.length;
		const reply = '"' + result.reply.slice(0, shown) + (typing ? '▍' : '"');
		return [
			[{ t: '200 OK', c: 'good' }],
			[{ t: '{' }],
			pair('  ', 'model', q(MODELS[result.model].name), 's'),
			pair('  ', 'reply', reply, 's'),
			[{ t: '  ' }, { t: q('usage'), c: 'h' }, { t: ': {' }],
			pair('    ', 'input_tokens', String(result.inTok), 'n'),
			pair('    ', 'output_tokens', String(result.outTok), 'n', false),
			[{ t: '  }' }],
			[{ t: '}' }]
		];
	});
</script>

{#snippet code(lines: Piece[][], err = false)}
	<div class="code" class:err>
		{#each lines as line, i (i)}
			<div class="cl">
				{#each line as p, j (j)}<span class={p.c}>{p.t}</span>{/each}
			</div>
		{/each}
	</div>
{/snippet}

<div class="stage">
	<!-- the controls, kept up top and clear of Nim -->
	<div class="controls">
		<div class="group">
			<span class="cap">{tx.promptLabel}</span>
			<div class="chips">
				{#each tx.prompts as p, i (i)}
					<button
						type="button"
						class="chip"
						class:on={promptIdx === i}
						aria-pressed={promptIdx === i}
						disabled={busy}
						onclick={() => (promptIdx = i)}>{p.label}</button
					>
				{/each}
			</div>
		</div>

		<div class="row">
			<div class="group">
				<span class="cap">{tx.modelLabel}</span>
				<div class="seg">
					{#each ['mini', 'pro'] as const as m (m)}
						<button
							type="button"
							class="opt"
							class:on={model === m}
							aria-pressed={model === m}
							disabled={busy}
							onclick={() => pickModel(m)}
						>
							<b>{MODELS[m].name}</b>
							<small>{tx.modelDesc[m]}</small>
						</button>
					{/each}
				</div>
			</div>
			<div class="group">
				<span class="cap">{tx.keyLabel}</span>
				<button
					type="button"
					class="switch"
					class:on={withKey}
					role="switch"
					aria-checked={withKey}
					aria-label={tx.keyLabel}
					disabled={busy}
					onclick={() => (withKey = !withKey)}
				>
					<span class="knob" aria-hidden="true"></span>
					<span class="slabel">{withKey ? tx.keyOn : tx.keyOff}</span>
				</button>
			</div>
		</div>

		<CallToActionButton onclick={send} disabled={busy}>
			{busy ? tx.sending : tx.sendBtn}
		</CallToActionButton>
	</div>

	<!-- the trip from the nimbus.com backend to the provider and back -->
	<div class="wire">
		<div class="actor">
			<div class="mini"><Server slots={2} active={phase === 'out' || phase === 'done'} /></div>
			<b>{tx.appLabel}</b>
			<small>{tx.appSub}</small>
		</div>
		<div class="track">
			<span class="line"></span>
			{#if phase === 'out'}
				<span class="packet go" aria-hidden="true">{'{ }'}</span>
			{:else if phase === 'back'}
				<span class="packet ret" class:bad={!withKey} aria-hidden="true">{'{ }'}</span>
			{/if}
		</div>
		<div class="actor">
			<div class="mini gpu" class:think={phase === 'think'}>
				<Server slots={3} active={phase === 'think'} />
			</div>
			<b>{tx.providerLabel}</b>
			<small>{tx.providerSub}</small>
		</div>
	</div>

	<!-- what goes out and what comes back -->
	<div class="panes">
		<div class="pane">
			<span class="cap">{tx.requestTitle}</span>
			{@render code(requestLines)}
		</div>
		<div class="pane">
			<span class="cap">{tx.responseTitle}</span>
			{#if result}
				{@render code(responseLines, !result.ok)}
			{:else}
				<div class="code empty">{busy ? tx.sending : tx.responseEmpty}</div>
			{/if}
		</div>
	</div>

	<!-- the bill, one bar per successful request so models can be compared -->
	<div class="bill">
		<span class="cap">{tx.billTitle}</span>
		{#if history.length === 0}
			<p class="note">{tx.billEmpty}</p>
		{:else}
			<ul>
				{#each history as h, i (i)}
					<li class:latest={i === history.length - 1}>
						<span class="mname" class:pro={h.model === 'pro'}>{MODELS[h.model].name}</span>
						<span class="bar"
							><i
								class:pro={h.model === 'pro'}
								style="width:{Math.max(3, (h.cost / maxCost) * 100)}%"
							></i></span
						>
						<span class="cost">{money(h.cost)}</span>
						<span class="toks"
							>{tx.tokensIn.replace('{n}', String(h.inTok))}, {tx.tokensOut.replace(
								'{n}',
								String(h.outTok)
							)}</span
						>
					</li>
				{/each}
			</ul>
			{#if last}
				<p class="note">{tx.perDay.replace('{cost}', moneyDay(last.cost * 10000))}</p>
			{/if}
		{/if}
		<p class="price">{priceLine}</p>
	</div>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.cap {
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--color-faint);
	}

	/* controls */
	.controls {
		display: flex;
		width: min(94vw, 440px);
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.controls :global(.cta) {
		padding: 10px 20px;
		font-size: 13px;
	}
	.group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px 18px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 11px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.seg {
		display: flex;
		gap: 4px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.opt {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 9px;
		padding: 4px 10px;
		line-height: 1.15;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.opt b {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
	}
	.opt small {
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.opt.on {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.switch {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 12px 4px 4px;
		height: 38px;
	}
	.knob {
		position: relative;
		width: 34px;
		height: 20px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.knob::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.2s ease;
	}
	.switch.on .knob {
		background: var(--color-grass);
	}
	.switch.on .knob::after {
		transform: translateX(14px);
	}
	.slabel {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	button:disabled {
		opacity: 0.6;
	}

	/* the wire */
	.wire {
		display: flex;
		width: min(94vw, 380px);
		align-items: flex-start;
		justify-content: space-between;
	}
	.actor {
		display: flex;
		width: 92px;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		text-align: center;
	}
	.actor b {
		margin-top: 4px;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.actor small {
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.mini {
		display: flex;
		height: 52px;
		align-items: flex-end;
	}
	.mini > :global(.server) {
		width: 54px;
		gap: 4px;
		padding: 6px;
		border-radius: 9px;
	}
	.mini > :global(.server .slot) {
		height: 9px;
	}
	.gpu {
		transition: transform 0.3s ease;
	}
	.gpu.think {
		transform: scale(1.06);
	}
	.track {
		position: relative;
		flex: 1;
		height: 52px;
	}
	.line {
		position: absolute;
		top: 50%;
		left: 4px;
		right: 4px;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.packet {
		position: absolute;
		top: calc(50% - 11px);
		left: 0;
		display: grid;
		place-items: center;
		height: 22px;
		padding: 0 7px;
		border-radius: 7px;
		background: var(--color-brand);
		color: #fff;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
	}
	.packet.go {
		animation: go 0.65s ease-in-out forwards;
	}
	.packet.ret {
		background: var(--color-grass);
		animation: ret 0.65s ease-in-out forwards;
	}
	.packet.ret.bad {
		background: var(--color-danger);
	}
	@keyframes go {
		from {
			left: 0;
		}
		to {
			left: calc(100% - 34px);
		}
	}
	@keyframes ret {
		from {
			left: calc(100% - 34px);
		}
		to {
			left: 0;
		}
	}

	/* code panes */
	.panes {
		display: grid;
		width: min(94vw, 440px);
		grid-template-columns: 1fr;
		gap: 8px;
	}
	.pane {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 4px;
	}
	.code {
		margin: 0;
		max-height: 168px;
		overflow: auto;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		line-height: 1.5;
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}
	.cl span {
		white-space: pre-wrap;
	}
	.code.empty {
		display: grid;
		min-height: 60px;
		place-items: center;
		font-family: inherit;
		font-size: 12px;
		color: var(--color-faint);
	}
	.code .k {
		font-weight: 700;
		color: var(--color-brand);
	}
	.code .h {
		color: var(--color-muted);
	}
	.code .s {
		color: var(--color-grass);
	}
	.code .n {
		font-weight: 700;
		color: var(--color-amber);
	}
	.code .good {
		font-weight: 700;
		color: var(--color-grass);
	}
	.code .bad {
		font-weight: 700;
		color: var(--color-danger);
	}
	.code.err {
		border-color: color-mix(in srgb, var(--color-danger) 45%, var(--color-line));
		background: var(--color-danger-soft);
	}

	/* the bill */
	.bill {
		display: flex;
		width: min(94vw, 440px);
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
	}
	.bill ul {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.bill li {
		display: grid;
		grid-template-columns: 62px 1fr auto;
		grid-template-rows: auto auto;
		align-items: center;
		column-gap: 8px;
		opacity: 0.6;
		animation: rise 0.35s ease backwards;
	}
	.bill li.latest {
		opacity: 1;
	}
	.mname {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.mname.pro {
		color: var(--color-amber);
	}
	.bar {
		height: 8px;
		border-radius: 4px;
		background: var(--color-paper);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		border-radius: 4px;
		background: var(--color-brand);
		transition: width 0.4s ease;
	}
	.bar i.pro {
		background: var(--color-amber);
	}
	.cost {
		font-size: 11.5px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--color-ink);
	}
	.toks {
		grid-column: 2 / 4;
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.note {
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.price {
		font-size: 10px;
		color: var(--color-faint);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.packet.go,
		.packet.ret,
		.bill li {
			animation: none;
		}
		.chip,
		.opt,
		.knob,
		.knob::after,
		.gpu,
		.bar i {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.panes {
			width: min(94vw, 620px);
			grid-template-columns: 1fr 1fr;
		}
		.code {
			font-size: 11px;
		}
		.bill {
			width: min(94vw, 480px);
		}
	}
</style>

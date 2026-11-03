<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { AgentsText } from '$lib/chapters/ai/agents/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as AgentsText);

	// ---- the agent's script. Tool calls and results are real code, so they stay untranslated. ----
	type Tool = 'calendar' | 'email';
	type Kind = 'think' | 'call' | 'result' | 'answer';
	type Step = {
		kind: Kind;
		say?: 'think1' | 'think2' | 'finalAllow' | 'finalDeny'; // translated line
		code?: string; // a tool call or the data a tool sent back
		tool?: Tool;
		token?: string; // what Nim reacts to
		approval?: boolean; // the agent stops and asks before running this call
		effect?: 'book' | 'sent';
	};
	const START: Step[] = [
		{ kind: 'think', say: 'think1', token: 'think' },
		{ kind: 'call', tool: 'calendar', code: 'calendar.check(day="Thu")', token: 'tool' },
		{
			kind: 'result',
			tool: 'calendar',
			code: '{"09:00": "free", "10:00": "Team sync", "11:00": "free"}',
			token: 'result'
		},
		{ kind: 'think', say: 'think2', token: 'busy' },
		{
			kind: 'call',
			tool: 'calendar',
			code: 'calendar.book(day="Thu", time="11:00", with="Raka")',
			token: 'ask',
			approval: true
		}
	];
	const ALLOWED: Step[] = [
		{ kind: 'result', tool: 'calendar', code: '{"booked": true}', token: 'allow', effect: 'book' },
		{
			kind: 'call',
			tool: 'email',
			code: 'email.send(to="raka@nimbus.com", subject="Meeting Thu 11:00")',
			token: 'email'
		},
		{ kind: 'result', tool: 'email', code: '{"sent": true}', effect: 'sent' },
		{ kind: 'answer', say: 'finalAllow', token: 'done' }
	];
	const DENIED: Step[] = [
		{ kind: 'result', tool: 'calendar', code: '{"error": "denied by user"}', token: 'deny' },
		{ kind: 'answer', say: 'finalDeny', token: 'done_deny' }
	];

	let choice = $state<'allow' | 'deny' | null>(null);
	let shown = $state(0); // how many steps of the script are in the log
	let running = $state(false);
	let booked = $state(false);
	let sent = $state(false);

	const script = $derived(
		choice === 'allow' ? [...START, ...ALLOWED] : choice === 'deny' ? [...START, ...DENIED] : START
	);
	const log = $derived(script.slice(0, shown));
	const last = $derived(log.at(-1));
	const waiting = $derived(!!last?.approval && choice === null);
	const finished = $derived(last?.kind === 'answer');
	const activeTool = $derived(
		last && (last.kind === 'call' || last.kind === 'result') && !finished ? last.tool : undefined
	);
	const calendarRead = $derived(shown >= 3);

	const status = $derived.by(() => {
		if (!last) return tx.status.idle;
		if (finished) return tx.status.done;
		if (waiting) return tx.status.waiting;
		if (last.kind === 'think') return tx.status.thinking;
		if (last.kind === 'call') {
			const name = last.tool === 'email' ? tx.emailLabel : tx.calendarLabel;
			return tx.status.calling.replace('{tool}', name.toLowerCase());
		}
		return tx.status.reading;
	});
	const thought = $derived(
		[...log].reverse().find((s) => s.kind === 'think' || s.kind === 'answer')?.say
	);

	let completed = false;
	let logEl = $state<HTMLOListElement>();

	async function advance() {
		if (waiting || finished || shown >= script.length) return false;
		shown++;
		const s = script[shown - 1];
		if (s.effect === 'book') booked = true;
		if (s.effect === 'sent') sent = true;
		if (s.token) onstate?.(s.token);
		if (s.kind === 'answer' && !completed) {
			completed = true;
			oncomplete?.();
		}
		await tick();
		logEl?.scrollTo({ top: logEl.scrollHeight, behavior: reduced() ? 'auto' : 'smooth' });
		return true;
	}

	function decide(c: 'allow' | 'deny') {
		if (!waiting) return;
		choice = c;
		advance();
		if (running) schedule();
	}

	let timer: ReturnType<typeof setTimeout> | undefined;
	let saidAuto = false;
	function schedule() {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			const moved = await advance();
			if (moved && !waiting && !finished) schedule();
			else if (finished || !moved) running = false;
		}, 1300);
	}
	function runAuto() {
		if (running || waiting || finished) return;
		running = true;
		if (!saidAuto) {
			saidAuto = true;
			onstate?.('auto');
		}
		schedule();
	}
	function stepOnce() {
		running = false;
		clearTimeout(timer);
		advance();
	}

	function reset() {
		clearTimeout(timer);
		running = false;
		choice = null;
		shown = 0;
		booked = false;
		sent = false;
	}

	onDestroy(() => clearTimeout(timer));

	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
</script>

{#snippet toolIcon(t: Tool)}
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.9"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		{#if t === 'calendar'}
			<rect x="3.5" y="5" width="17" height="15" rx="2.5" />
			<path d="M3.5 10h17M8 3v4M16 3v4" />
		{:else}
			<rect x="3" y="5" width="18" height="14" rx="2.5" />
			<path d="m3.5 7 8.5 6 8.5-6" />
		{/if}
	</svg>
{/snippet}

<div class="stage">
	<!-- controls up top, or the permission question when the agent asks -->
	<div class="controls">
		{#if waiting}
			<div class="ask" role="alertdialog" aria-label={tx.approvalQ}>
				<p>{tx.approvalQ}</p>
				<div class="row">
					<button type="button" class="yes" onclick={() => decide('allow')}>{tx.allow}</button>
					<button type="button" class="no" onclick={() => decide('deny')}>{tx.deny}</button>
				</div>
			</div>
		{:else}
			<div class="row">
				<CallToActionButton onclick={stepOnce} disabled={finished}>{tx.stepBtn}</CallToActionButton>
				<button type="button" class="ghost" onclick={runAuto} disabled={finished || running}>
					{running ? tx.running : tx.autoBtn}
				</button>
				<button type="button" class="reset" onclick={reset}>{tx.reset}</button>
			</div>
		{/if}
	</div>

	<!-- the request, the agent, and its tools -->
	<div class="you">
		<span class="lbl">{tx.youLabel}</span>
		<span class="goal">{tx.goal}</span>
	</div>
	<span class="wire" class:on={shown > 0} aria-hidden="true"></span>

	<div class="agent" class:busy={shown > 0 && !finished} class:done={finished}>
		<span class="brain" aria-hidden="true">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
				<circle cx="6" cy="7" r="2.2" fill="currentColor" />
				<circle cx="6" cy="17" r="2.2" fill="currentColor" />
				<circle cx="18" cy="12" r="2.6" fill="currentColor" />
				<circle cx="12" cy="12" r="2.2" fill="currentColor" opacity="0.6" />
				<path
					d="M6 7l6 5M6 17l6-5M12 12h6"
					stroke="currentColor"
					stroke-width="1.4"
					opacity="0.6"
				/>
			</svg>
		</span>
		<span class="ainfo">
			<b>{tx.modelLabel}</b>
			<span class="status">{status}</span>
		</span>
		{#if thought}
			{#key thought}
				<span class="thought">{tx[thought]}</span>
			{/key}
		{/if}
	</div>

	<div class="wires" aria-hidden="true">
		<span class="wire" class:on={activeTool === 'calendar'}></span>
		<span class="wire" class:on={activeTool === 'email'}></span>
	</div>

	<div class="tools">
		<div class="tool" class:on={activeTool === 'calendar'}>
			<span class="thead">{@render toolIcon('calendar')}{tx.calendarLabel}</span>
			<span class="day">{tx.day}</span>
			<ul class="slots">
				<li class:read={calendarRead}><span>09:00</span>{tx.free}</li>
				<li class="taken" class:read={calendarRead}><span>10:00</span>{tx.teamSync}</li>
				<li class:read={calendarRead} class:booked>
					<span>11:00</span>{booked ? tx.withRaka : tx.free}
				</li>
			</ul>
		</div>
		<div class="tool" class:on={activeTool === 'email'}>
			<span class="thead">{@render toolIcon('email')}{tx.emailLabel}</span>
			<span class="mail" class:sent>
				{#if sent}<b aria-hidden="true">✓</b>{/if}
				{sent ? tx.emailSent : tx.emailIdle}
			</span>
		</div>
	</div>

	<!-- the log, every step in order -->
	<div class="logwrap">
		<span class="lbl">
			{tx.logLabel}
			{#if shown > 0}<span class="n">{tx.stepCount.replace('{n}', String(shown))}</span>{/if}
		</span>
		<ol class="log" bind:this={logEl} aria-live="polite">
			{#each log as s, k (k)}
				<li class="entry {s.kind}" class:latest={k === shown - 1}>
					<span class="kind">{tx.kinds[s.kind]}</span>
					{#if s.code}
						<code>{s.code}</code>
					{:else if s.say}
						<span class="say">{tx[s.say]}</span>
					{/if}
				</li>
			{:else}
				<li class="empty">{tx.logEmpty}</li>
			{/each}
		</ol>
	</div>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}
	.controls {
		display: flex;
		min-height: 48px;
		width: 100%;
		justify-content: center;
		margin-bottom: 12px;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.row :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.ghost {
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 14px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.ghost:disabled {
		opacity: 0.5;
	}
	.reset {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
		padding: 6px 8px;
	}
	.reset:hover {
		color: var(--color-ink);
	}
	.ask {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		border-radius: 14px;
		border: 1.5px solid var(--color-amber);
		background: var(--color-amber-soft);
		padding: 10px 14px;
		animation: pop 0.3s ease;
	}
	.ask p {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
		text-align: center;
	}
	.yes,
	.no {
		border-radius: 10px;
		padding: 7px 18px;
		font-size: 13px;
		font-weight: 700;
	}
	.yes {
		background: var(--color-grass);
		color: #fff;
	}
	.no {
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-danger);
	}

	.lbl {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
		letter-spacing: 0.02em;
	}
	.lbl .n {
		font-weight: 600;
		color: var(--color-muted);
	}

	/* request card */
	.you {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		border-radius: 14px;
		background: var(--color-brand);
		padding: 7px 14px;
		color: #fff;
	}
	.you .lbl {
		color: rgba(255, 255, 255, 0.75);
	}
	.goal {
		font-size: 12.5px;
		font-weight: 600;
		text-align: center;
	}

	/* connectors */
	.wire {
		display: block;
		width: 2px;
		height: 14px;
		background: var(--color-line);
		transition: background 0.3s ease;
	}
	.wire.on {
		background: var(--color-brand);
	}
	.wires {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		justify-items: center;
	}

	/* the agent card */
	.agent {
		display: grid;
		width: 100%;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 4px 10px;
		border-radius: 16px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
		transition: border-color 0.3s ease;
	}
	.agent.busy {
		border-color: var(--color-brand);
	}
	.agent.done {
		border-color: var(--color-grass);
	}
	.brain {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.ainfo {
		display: flex;
		flex-direction: column;
		font-size: 12.5px;
		color: var(--color-ink);
	}
	.status {
		font-size: 11px;
		color: var(--color-muted);
	}
	.agent.busy .status {
		color: var(--color-brand);
	}
	.thought {
		grid-column: 1 / -1;
		border-radius: 10px;
		background: var(--color-paper);
		padding: 6px 9px;
		font-size: 11.5px;
		font-style: italic;
		line-height: 1.4;
		color: var(--color-muted);
		animation: fadein 0.3s ease;
	}

	/* tools */
	.tools {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.tool {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 10px;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}
	.tool.on {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 4px var(--color-brand-soft);
	}
	.thead {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.thead :global(svg) {
		color: var(--color-brand);
	}
	.day {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.slots {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.slots li {
		display: flex;
		gap: 6px;
		border-radius: 7px;
		padding: 2px 6px;
		font-size: 10.5px;
		color: var(--color-faint);
		background: var(--color-paper);
		transition: background 0.3s ease;
	}
	.slots li span {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--color-muted);
	}
	.slots li.read {
		color: var(--color-muted);
	}
	.slots li.taken {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.slots li.booked {
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-weight: 700;
		animation: pop 0.35s ease;
	}
	.mail {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		color: var(--color-faint);
	}
	.mail.sent {
		color: var(--color-grass);
		font-weight: 700;
		animation: pop 0.35s ease;
	}

	/* log */
	.logwrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 5px;
		margin-top: 12px;
	}
	.log {
		display: flex;
		max-height: 168px;
		flex-direction: column;
		gap: 4px;
		overflow-y: auto;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px;
	}
	.entry {
		display: flex;
		flex-direction: column;
		gap: 1px;
		border-left: 3px solid var(--color-line);
		border-radius: 3px;
		padding: 2px 8px;
		opacity: 0.7;
		animation: fadein 0.3s ease;
	}
	.entry.latest {
		opacity: 1;
	}
	.entry.think {
		border-left-color: var(--color-faint);
	}
	.entry.call {
		border-left-color: var(--color-brand);
	}
	.entry.result {
		border-left-color: var(--color-amber);
	}
	.entry.answer {
		border-left-color: var(--color-grass);
	}
	.kind {
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-faint);
		letter-spacing: 0.03em;
	}
	.entry code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}
	.say {
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--color-ink);
	}
	.empty {
		font-size: 11.5px;
		color: var(--color-faint);
		text-align: center;
		padding: 6px;
	}

	@keyframes fadein {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
	}
	@keyframes pop {
		from {
			transform: scale(0.96);
			opacity: 0.4;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ask,
		.thought,
		.entry,
		.slots li.booked,
		.mail.sent {
			animation: none;
		}
		.wire,
		.agent,
		.tool,
		.slots li {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.log {
			max-height: 210px;
		}
		.goal {
			font-size: 13.5px;
		}
	}
</style>

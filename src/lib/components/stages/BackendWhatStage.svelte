<script lang="ts">
	import Server from '$lib/components/Server.svelte';
	import MiniPhone from './backend/MiniPhone.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { BackendStepId, BackendWhatText } from '$lib/chapters/web/backend-what/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BackendWhatText);

	const STEPS: BackendStepId[] = ['login', 'stock', 'save', 'email'];

	let loggedIn = $state(true);
	// 0 idle, 1 to 4 the active station, 5 the order is confirmed
	let step = $state(0);
	let rejected = $state(false);
	let completed = false;

	const running = $derived(step >= 1 && step <= 4 && !rejected);

	function place() {
		rejected = false;
		step = 1;
		if (!loggedIn) {
			rejected = true;
			onstate?.('rejected');
		} else {
			onstate?.('login');
		}
	}

	function next() {
		step += 1;
		if (step <= 4) {
			onstate?.(STEPS[step - 1]);
		} else {
			onstate?.('done');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		}
	}

	function act() {
		if (running) next();
		else place();
	}

	function status(i: number): 'wait' | 'on' | 'ok' | 'fail' {
		const n = i + 1;
		if (rejected && n === 1) return 'fail';
		if (rejected) return 'wait';
		if (step > n) return 'ok';
		if (step === n) return 'on';
		return 'wait';
	}

	const led = $derived(
		rejected
			? 'bad'
			: step === 5
				? 'ok'
				: running
					? 'busy'
					: ('idle' as 'idle' | 'busy' | 'ok' | 'bad')
	);
	const phoneLine = $derived(
		rejected
			? tx.phone.rejected
			: step === 5
				? tx.phone.done
				: running
					? tx.phone.waiting
					: tx.phone.idle
	);
	const btnLabel = $derived(running ? tx.nextStep : step === 0 ? tx.placeOrder : tx.again);
</script>

<div class="wrap">
	<div class="top">
		<div class="seg" role="group">
			<button type="button" class:on={loggedIn} disabled={running} onclick={() => (loggedIn = true)}
				>{tx.loggedIn}</button
			>
			<button
				type="button"
				class:on={!loggedIn}
				disabled={running}
				onclick={() => (loggedIn = false)}>{tx.loggedOut}</button
			>
		</div>
		<button type="button" class="cta" onclick={act}>{btnLabel}</button>
	</div>

	<div class="front">
		<MiniPhone {led} width={180}>
			<div class="item">
				<span class="cap" aria-hidden="true">
					<svg viewBox="0 0 24 24" width="22" height="22"
						><path d="M4 15a8 8 0 0 1 16 0Z" style="fill:var(--color-brand)" /><path
							d="M3 15h15l3 2H3Z"
							style="fill:var(--color-ink)"
							opacity="0.8"
						/></svg
					>
				</span>
				<span class="iname"><b>{tx.product}</b><span>{tx.price}</span></span>
			</div>
			<p
				class="pstat"
				class:ok={step === 5}
				class:bad={rejected}
				class:busy={running}
				aria-live="polite"
			>
				{phoneLine}
			</p>
			{#if step === 5}
				<p class="inbox">
					<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"
						><rect
							x="3"
							y="6"
							width="18"
							height="12"
							rx="2"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						/><path
							d="m3.5 7 8.5 6 8.5-6"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						/></svg
					>
					{tx.phone.inbox}
				</p>
			{/if}
		</MiniPhone>
		<span class="cap2">{tx.frontLabel}</span>
	</div>

	<div class="wire" class:live={running} aria-hidden="true"><i></i></div>

	<div class="back">
		<div class="bhead">
			<Server active={running || step === 5} slots={2} />
			<span class="btxt"><b>{tx.backLabel}</b><span>{tx.backSub}</span></span>
		</div>
		<ol class="stations">
			{#each STEPS as s, i (s)}
				{@const st = status(i)}
				<li class={st}>
					<span class="num">
						{#if st === 'ok'}
							<svg viewBox="0 0 16 16" width="12" height="12"
								><path
									d="M3.5 8.5l3 3 6-6.5"
									fill="none"
									stroke="currentColor"
									stroke-width="2.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							>
						{:else if st === 'fail'}
							×
						{:else}
							{i + 1}
						{/if}
					</span>
					<span class="stxt">
						<b>{tx.steps[s].title}</b>
						<span>{st === 'fail' ? tx.loginFail : tx.steps[s].detail}</span>
					</span>
					{#if s === 'stock' || s === 'save'}
						<span class="side" class:hot={st === 'on'}>
							<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
								><ellipse
									cx="12"
									cy="6"
									rx="7"
									ry="3"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
								/><path
									d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
								/></svg
							>
							{tx.dbLabel}
						</span>
					{:else if s === 'email'}
						<span class="side" class:hot={st === 'on'}>
							<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
								><rect
									x="3"
									y="6"
									width="18"
									height="12"
									rx="2"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
								/><path
									d="m3.5 7 8.5 6 8.5-6"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
								/></svg
							>
							{tx.mailLabel}
						</span>
					{/if}
				</li>
			{/each}
		</ol>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 420px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.seg {
		display: flex;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.seg button {
		border-radius: 9px;
		padding: 7px 11px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.seg button.on {
		background: var(--toggle-active);
		color: #fff;
	}
	.seg button:disabled {
		cursor: not-allowed;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 18px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition: filter 0.2s ease;
	}
	.cta:hover {
		filter: brightness(1.18);
	}

	.front {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.cap2 {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.item {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 8px;
	}
	.cap {
		display: flex;
		width: 30px;
		height: 30px;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: var(--color-brand-soft);
	}
	.iname {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
	.iname b {
		font-size: 11.5px;
	}
	.iname span {
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.pstat {
		margin: 0;
		border-radius: 8px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 6px 8px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
		transition:
			background 0.25s ease,
			color 0.25s ease;
	}
	.pstat.busy {
		color: var(--color-amber);
	}
	.pstat.ok {
		background: var(--color-grass-soft);
		border-color: transparent;
		color: var(--color-grass);
	}
	.pstat.bad {
		background: var(--color-danger-soft);
		border-color: transparent;
		color: var(--color-danger);
	}
	.inbox {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-brand);
		animation: rise 0.35s ease;
	}

	.wire {
		position: relative;
		width: 2px;
		height: 24px;
		background: var(--color-line);
		overflow: visible;
	}
	.wire i {
		position: absolute;
		left: 50%;
		top: 0;
		width: 8px;
		height: 8px;
		margin-left: -4px;
		border-radius: 50%;
		background: var(--color-brand);
		opacity: 0;
	}
	.wire.live i {
		animation: drip 1.1s ease-in-out infinite;
	}
	@keyframes drip {
		0% {
			top: -4px;
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		100% {
			top: 22px;
			opacity: 0;
		}
	}

	.back {
		width: 100%;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
	}
	.bhead {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
	}
	.bhead :global(.server) {
		width: 46px;
		padding: 6px;
		gap: 5px;
		border-radius: 9px;
		box-shadow: none;
	}
	.bhead :global(.server .slot) {
		height: 9px;
	}
	.btxt {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
	.btxt b {
		font-size: 13px;
	}
	.btxt span {
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.stations {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.stations li {
		display: flex;
		align-items: center;
		gap: 9px;
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 7px 9px;
		opacity: 0.6;
		transition:
			opacity 0.25s ease,
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.stations li.on {
		opacity: 1;
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.stations li.ok {
		opacity: 1;
	}
	.stations li.fail {
		opacity: 1;
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.num {
		display: flex;
		flex: none;
		width: 22px;
		height: 22px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		font-size: 11px;
		font-weight: 800;
		color: var(--color-muted);
	}
	li.on .num {
		background: var(--color-brand);
		border-color: var(--color-brand);
		color: #fff;
	}
	li.ok .num {
		background: var(--color-grass);
		border-color: var(--color-grass);
		color: #fff;
	}
	li.fail .num {
		background: var(--color-danger);
		border-color: var(--color-danger);
		color: #fff;
	}
	.stxt {
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column;
		line-height: 1.25;
	}
	.stxt b {
		font-size: 12px;
	}
	.stxt span {
		font-size: 10.5px;
		color: var(--color-muted);
	}
	li.fail .stxt span {
		color: var(--color-danger);
	}
	.side {
		display: flex;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		font-size: 9px;
		font-weight: 700;
		color: var(--color-faint);
		transition: color 0.25s ease;
	}
	.side.hot {
		color: var(--color-brand);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.wire.live i {
			animation: none;
			opacity: 1;
			top: 8px;
		}
		.inbox {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
			gap: 12px;
		}
		.cta,
		.seg button {
			font-size: 14px;
		}
	}
</style>

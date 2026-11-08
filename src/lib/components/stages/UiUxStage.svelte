<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { UiUxText } from '$lib/chapters/web/ui-ux/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as UiUxText);

	const PRICE = 12;
	const FEE = 5;
	const money = (n: number) => tx.money.replace('{n}', String(n));

	type AStep = 'cart' | 'confirm' | 'final' | 'cancelled' | 'paid';
	type BStep = 'cart' | 'paid';
	let aStep = $state<AStep>('cart');
	let bStep = $state<BStep>('cart');
	let aTaps = $state(0);
	let bTaps = $state(0);
	let showWhy = $state(false);
	let trapped = false;
	let finished = false;

	function a(next: AStep) {
		aTaps += 1;
		aStep = next;
		if (next === 'cancelled' && !trapped) {
			trapped = true;
			onstate?.('trap');
		}
		if (next === 'paid') settle('paidA');
	}
	function b(next: BStep) {
		bTaps += 1;
		bStep = next;
		if (next === 'paid') settle('paidB');
	}
	function settle(token: string) {
		if (aStep === 'paid' && bStep === 'paid') {
			if (!finished) {
				finished = true;
				onstate?.('both');
				oncomplete?.();
			}
			return;
		}
		onstate?.(token);
	}
	function why() {
		showWhy = true;
		onstate?.('why');
	}
</script>

{#snippet mug()}
	<svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
		<rect x="2" y="2" width="30" height="30" rx="9" fill="var(--color-brand-soft)" />
		<path d="M10 11h12v11a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3Z" fill="var(--color-brand)" />
		<path
			d="M22 13.5h1.6a2.6 2.6 0 0 1 0 5.2H22"
			stroke="var(--color-brand)"
			stroke-width="2"
			fill="none"
		/>
	</svg>
{/snippet}

{#snippet item()}
	<div class="item">
		{@render mug()}
		<div class="meta">
			<b>{tx.product}</b>
			<span>{tx.qty}</span>
		</div>
		<span class="amt">{money(PRICE)}</span>
	</div>
{/snippet}

{#snippet check()}
	<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="12" cy="12" r="10" fill="var(--color-grass-soft)" />
		<path
			d="m7.5 12.3 3 3 6-6.2"
			stroke="var(--color-grass)"
			stroke-width="2.2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<p class="task">{tx.task}</p>

	<div class="shops">
		<!-- Shop A: looks fine, feels like a maze -->
		<div class="shop">
			<div class="head">
				<b>{tx.shopA}</b>
				<span class="taps" class:ok={aStep === 'paid'}>{tx.taps.replace('{n}', String(aTaps))}</span
				>
			</div>
			<div class="phone">
				<div class="addr"><span class="led" class:on={aStep === 'paid'}></span>nimbus.com</div>
				<div class="screen">
					{#if aStep === 'cart'}
						{@render item()}
						<div class="twin">
							<button type="button" class="btn" onclick={() => a('confirm')}>{tx.a.next}</button>
							<button type="button" class="btn" onclick={() => a('cancelled')}>{tx.a.cancel}</button
							>
						</div>
					{:else if aStep === 'confirm'}
						<p class="q">{tx.a.confirmQ}</p>
						<div class="twin">
							<button type="button" class="btn" onclick={() => a('cancelled')}>{tx.a.yes}</button>
							<button type="button" class="btn" onclick={() => a('final')}>{tx.a.no}</button>
						</div>
					{:else if aStep === 'final'}
						{@render item()}
						<div class="sum">
							<span class="fee">{tx.a.feeNote}</span>
							<span class="row"><span>{tx.shipping}</span><span>{money(FEE)}</span></span>
							<span class="row tot"><span>{tx.total}</span><span>{money(PRICE + FEE)}</span></span>
						</div>
						<button type="button" class="btn" onclick={() => a('paid')}>{tx.a.pay}</button>
					{:else if aStep === 'cancelled'}
						<div class="end">
							<span class="x">×</span>
							<b>{tx.cancelled}</b>
							<button type="button" class="ghost" onclick={() => (aStep = 'cart')}
								>{tx.again}</button
							>
						</div>
					{:else}
						<div class="end">
							{@render check()}
							<b>{tx.paid}</b>
							<span class="small">{money(PRICE + FEE)}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Shop B: the same look, one clear path -->
		<div class="shop">
			<div class="head">
				<b>{tx.shopB}</b>
				<span class="taps" class:ok={bStep === 'paid'}>{tx.taps.replace('{n}', String(bTaps))}</span
				>
			</div>
			<div class="phone">
				<div class="addr"><span class="led" class:on={bStep === 'paid'}></span>nimbus.com</div>
				<div class="screen">
					{#if bStep === 'cart'}
						{@render item()}
						<div class="sum">
							<span class="row"><span>{tx.shipping}</span><span>{money(0)}</span></span>
							<span class="row tot"><span>{tx.total}</span><span>{money(PRICE)}</span></span>
							<span class="free">{tx.b.free}</span>
						</div>
						<button type="button" class="btn main" onclick={() => b('paid')}
							>{tx.b.pay.replace('{total}', money(PRICE))}</button
						>
						<button type="button" class="link" onclick={() => (bTaps += 1)}>{tx.b.back}</button>
					{:else}
						<div class="end">
							{@render check()}
							<b>{tx.paid}</b>
							<span class="small">{money(PRICE)}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	{#if aStep === 'paid' && bStep === 'paid'}
		{#if showWhy}
			<div class="why">
				<b>{tx.whyLabel}</b>
				<ul>
					{#each tx.whyPoints as p, i (i)}
						<li>{p}</li>
					{/each}
				</ul>
			</div>
		{:else}
			<button type="button" class="ghost strong" onclick={why}>{tx.whyBtn}</button>
		{/if}
	{/if}
</div>

<style>
	.task {
		margin: 0;
		padding: 5px 14px;
		border-radius: 999px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		color: var(--color-ink);
		font-size: 12.5px;
		font-weight: 700;
	}
	.shops {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		width: min(94vw, 400px);
	}
	.shop {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 6px;
		padding: 0 4px;
		font-size: 12px;
		color: var(--color-ink);
	}
	.taps {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.taps.ok {
		color: var(--color-grass);
	}
	.phone {
		border-radius: 22px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 5px 8px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-muted);
		font-size: 10.5px;
		font-weight: 600;
	}
	.led {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.led.on {
		background: var(--color-grass);
	}
	.screen {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 9px;
		min-height: 196px;
		padding: 10px 4px 4px;
	}
	.item {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
	}
	.meta {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.meta span {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.amt {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.twin {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.btn {
		border-radius: 10px;
		background: var(--color-brand);
		color: #fff;
		padding: 9px 4px;
		font-size: 11.5px;
		font-weight: 700;
		transition: transform 0.12s ease;
	}
	.btn:active {
		transform: scale(0.96);
	}
	.btn.main {
		padding: 11px 6px;
		font-size: 12.5px;
	}
	.q {
		margin: 0;
		font-size: 12px;
		line-height: 1.4;
		color: var(--color-ink);
		text-align: center;
	}
	.sum {
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding-top: 6px;
		border-top: 1px solid var(--color-line);
		font-size: 11px;
		color: var(--color-muted);
	}
	.row {
		display: flex;
		justify-content: space-between;
	}
	.row.tot {
		color: var(--color-ink);
		font-weight: 700;
	}
	.fee {
		font-size: 9px;
		color: var(--color-faint);
	}
	.free {
		font-size: 10px;
		color: var(--color-grass);
		font-weight: 600;
	}
	.link {
		font-size: 10.5px;
		color: var(--color-muted);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.end {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		text-align: center;
		font-size: 12px;
		color: var(--color-ink);
	}
	.x {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-weight: 800;
	}
	.small {
		font-size: 11px;
		color: var(--color-muted);
	}
	.ghost {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 7px 12px;
		font-size: 11.5px;
		font-weight: 600;
	}
	.ghost.strong {
		padding: 9px 16px;
		font-size: 13px;
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.why {
		width: min(94vw, 400px);
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 14px;
		font-size: 12px;
		color: var(--color-ink);
	}
	.why b {
		font-size: 12.5px;
	}
	.why ul {
		margin: 6px 0 0;
		padding-left: 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		color: var(--color-muted);
		line-height: 1.4;
	}
	@media (prefers-reduced-motion: reduce) {
		.btn {
			transition: none;
		}
	}
</style>

<script lang="ts">
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SharedResponsibilityText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as SharedResponsibilityText);

	let revealed = $state(false);
	let done = false;

	function reveal() {
		if (revealed) return;
		revealed = true;
		onstate?.('shown');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
</script>

{#snippet itemIcon(side: string, i: number)}
	{#if side === 'p' && i === 0}
		<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="2.2" />
			<path
				d="M9 21v-4h6v4M8 7h2m4 0h2M8 11h2m4 0h2"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
			/>
		</svg>
	{:else if side === 'p' && i === 1}
		<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2.2" />
			<path
				d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
			/>
		</svg>
	{:else if side === 'p'}
		<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if i === 0}
		<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<ellipse cx="12" cy="5.5" rx="8" ry="3" stroke="currentColor" stroke-width="2.2" />
			<path
				d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"
				stroke="currentColor"
				stroke-width="2.2"
			/>
		</svg>
	{:else if i === 1}
		<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="9" cy="8" r="3.6" stroke="currentColor" stroke-width="2.2" />
			<path
				d="M2.5 20a6.5 6.5 0 0 1 13 0M16 9.5l2 2 3.6-3.6"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="8" cy="8" r="4.5" stroke="currentColor" stroke-width="2.2" />
			<path
				d="M11 11.5 20 20m-3.5.5V17m-3 .5V14"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
			/>
		</svg>
	{/if}
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="wrap">
		<div class="cols">
			<!-- the provider guards the building -->
			<section class="col" style="--a:#2e6fe0; --soft:#eaf1fc; --bord:#cdddf6">
				<div class="chead">
					<span class="medal">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<rect x="4" y="3" width="16" height="18" rx="2" stroke="#2e6fe0" stroke-width="1.9" />
							<path
								d="M9 21v-4h6v4M8 7h2m4 0h2M8 11h2m4 0h2"
								stroke="#2e6fe0"
								stroke-width="1.9"
								stroke-linecap="round"
							/>
						</svg>
					</span>
					<div><b>{tx.providerTitle}</b><span>{tx.providerSub}</span></div>
				</div>
				<div class="items">
					{#each tx.providerItems as it, i (it)}
						{#if revealed}
							<span class="item" style="animation-delay:{i * 0.18}s">
								<i>{@render itemIcon('p', i)}</i>{it}<em>✓</em>
							</span>
						{:else}
							<span class="ghost"></span>
						{/if}
					{/each}
				</div>
			</section>

			<!-- you guard the contents -->
			<section class="col" style="--a:#3a9c64; --soft:#ecf6f0; --bord:#cde6d7">
				<div class="chead">
					<span class="medal">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<circle cx="12" cy="8" r="4" stroke="#3a9c64" stroke-width="1.9" />
							<path
								d="M4 21a8 8 0 0 1 16 0"
								stroke="#3a9c64"
								stroke-width="1.9"
								stroke-linecap="round"
							/>
						</svg>
					</span>
					<div><b>{tx.youTitle}</b><span>{tx.youSub}</span></div>
				</div>
				<div class="items">
					{#each tx.youItems as it, i (it)}
						{#if revealed}
							<span class="item" style="animation-delay:{0.1 + i * 0.18}s">
								<i>{@render itemIcon('y', i)}</i>{it}<em>✓</em>
							</span>
						{:else}
							<span class="ghost"></span>
						{/if}
					{/each}
				</div>
			</section>
		</div>

		<!-- the handshake in the middle -->
		<span class="mid" class:lit={revealed}>
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M8 7H3v6m13 4h5v-6M3 9l5.5 5.5M21 15l-5.5-5.5"
					stroke="currentColor"
					stroke-width="2.3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
	</div>

	<p class="note" class:strong={revealed}>{revealed ? tx.noteDone : tx.noteIdle}</p>

	{#if !revealed}
		<CallToActionButton onclick={reveal}>
			{tx.reveal}
		</CallToActionButton>
	{/if}
</div>

<style>
	.wrap {
		position: relative;
		width: min(94vw, 384px);
	}
	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.col {
		display: flex;
		flex-direction: column;
		border-radius: 18px;
		border: 1px solid var(--bord);
		background: #fff;
		overflow: hidden;
		box-shadow: 0 12px 28px rgba(22, 40, 60, 0.07);
	}
	.chead {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--soft);
		border-bottom: 1px solid var(--bord);
		padding: 10px 12px;
	}
	.medal {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #fff;
		border: 1.5px solid var(--bord);
	}
	.chead div {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
		min-width: 0;
	}
	.chead b {
		font-size: 12px;
		font-weight: 800;
		color: #16212b;
	}
	.chead span {
		font-size: 8.5px;
		color: #8a949d;
	}
	.items {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 11px 11px 13px;
	}
	.item {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 10px;
		border: 1px solid var(--bord);
		background: var(--soft);
		color: #2c3a46;
		font-size: 10.5px;
		font-weight: 700;
		padding: 7px 9px;
		animation: itemin 0.4s ease backwards;
	}
	.item i {
		display: flex;
		flex: none;
		color: var(--a);
		line-height: 0;
	}
	.item em {
		margin-left: auto;
		font-style: normal;
		font-weight: 800;
		color: var(--a);
		font-size: 10px;
	}
	.ghost {
		height: 31px;
		border-radius: 10px;
		border: 1.5px solid #e8e2d8;
		background: #faf9f6;
	}
	@keyframes itemin {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	.mid {
		position: absolute;
		top: 24px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: #fff;
		border: 1.5px solid #e8e2d8;
		color: #b9c0c7;
		box-shadow: 0 4px 12px rgba(22, 40, 60, 0.12);
		z-index: 2;
		transition: all 0.3s ease;
	}
	.mid.lit {
		color: #dd9e36;
		border-color: #ecd9b6;
		background: #fbf1de;
	}
	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
		transition: color 0.3s ease;
	}
	.note.strong {
		color: #16212b;
		font-weight: 700;
	}
	:global(.dark) .col {
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .col:first-child {
		--soft: color-mix(in srgb, var(--color-brand) 12%, transparent) !important;
		--bord: color-mix(in srgb, var(--color-brand) 25%, transparent) !important;
	}
	:global(.dark) .col:last-child {
		--soft: color-mix(in srgb, var(--color-grass) 12%, transparent) !important;
		--bord: color-mix(in srgb, var(--color-grass) 25%, transparent) !important;
	}
	:global(.dark) .medal {
		background: var(--color-card);
	}
	:global(.dark) .chead b {
		color: var(--color-ink);
	}
	:global(.dark) .chead span {
		color: var(--color-faint);
	}
	:global(.dark) .item {
		color: var(--color-ink);
	}
	:global(.dark) .ghost {
		border-color: var(--color-line);
		background: var(--color-paper);
	}
	:global(.dark) .mid {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-faint);
		box-shadow: none;
	}
	:global(.dark) .mid.lit {
		color: var(--color-amber);
		border-color: color-mix(in srgb, var(--color-amber) 50%, transparent);
		background: var(--color-amber-soft);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .note.strong {
		color: var(--color-ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.item {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 560px;
		}
		.cols {
			gap: 18px;
		}
		.chead {
			padding: 13px 16px;
			gap: 10px;
		}
		.medal {
			width: 38px;
			height: 38px;
		}
		.medal svg {
			width: 20px;
			height: 20px;
		}
		.chead b {
			font-size: 15px;
		}
		.chead span {
			font-size: 10.5px;
		}
		.items {
			padding: 14px 14px 16px;
			gap: 8px;
		}
		.item {
			font-size: 12.5px;
			padding: 9px 12px;
		}
		.item i svg {
			width: 13px;
			height: 13px;
		}
		.ghost {
			height: 37px;
		}
		.mid {
			top: 30px;
			width: 32px;
			height: 32px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
	}
</style>

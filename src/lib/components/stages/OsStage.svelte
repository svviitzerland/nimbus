<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { OsAppId, OsText } from '$lib/chapters/basics/os/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as OsText);

	/** RAM each app asks for, in GB, and its colour. Language independent, so it lives here. */
	const APP: Record<OsAppId, { gb: number; color: string }> = {
		browser: { gb: 2, color: 'var(--color-brand)' },
		music: { gb: 1, color: 'var(--color-grass)' },
		chat: { gb: 1, color: 'var(--color-amber)' },
		game: { gb: 3, color: 'var(--color-muted)' }
	};
	const TOTAL = 8;
	const OS_GB = 2;

	let open = $state<OsAppId[]>([]);
	let turn = $state(0);
	let wasSlow = $state(false);
	let done = false;

	const used = $derived(OS_GB + open.reduce((s, id) => s + APP[id].gb, 0));
	const slow = $derived(used > TOTAL);
	const swap = $derived(Math.max(0, used - TOTAL));
	const nameOf = (id: OsAppId) => tx.apps.find((a) => a.id === id)?.name ?? '';
	const current = $derived(open.length ? open[turn % open.length] : null);

	/** The RAM bar, one block per GB, filled by the OS first and then each app in opening order. */
	const blocks = $derived.by(() => {
		const out: { color: string; label: string }[] = [];
		for (let i = 0; i < OS_GB; i++) out.push({ color: 'var(--color-ink)', label: tx.osChunk });
		for (const id of open) {
			for (let i = 0; i < APP[id].gb; i++) out.push({ color: APP[id].color, label: nameOf(id) });
		}
		return out;
	});
	const inRam = $derived(blocks.slice(0, TOTAL));
	const spilled = $derived(blocks.slice(TOTAL));

	const note = $derived(
		slow
			? tx.notes.slow
			: open.length === 0
				? tx.notes.idle
				: wasSlow
					? tx.notes.eased
					: open.length === 1
						? tx.notes.one
						: tx.notes.sharing
	);

	// The CPU hands its turn to the next open app. Far slower than a real OS so the eye can follow,
	// and slower still once the laptop is struggling.
	$effect(() => {
		const n = open.length;
		const ms = slow ? 1300 : 650;
		if (n < 2) return;
		const t = setInterval(() => (turn = (turn + 1) % n), ms);
		return () => clearInterval(t);
	});

	function launch(id: OsAppId) {
		if (open.includes(id)) return;
		open = [...open, id];
		if (used > TOTAL) {
			wasSlow = true;
			onstate?.('slow');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		} else {
			onstate?.(open.length === 1 ? 'first' : 'more');
		}
	}

	function quit(id: OsAppId) {
		open = open.filter((a) => a !== id);
		turn = 0;
		onstate?.('close');
	}
</script>

{#snippet appIcon(id: OsAppId)}
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		{#if id === 'browser'}
			<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="2" />
			<path
				d="M3.5 12h17M12 3.5c2.6 2.4 3.6 5.2 3.6 8.5s-1 6.1-3.6 8.5c-2.6-2.4-3.6-5.2-3.6-8.5s1-6.1 3.6-8.5Z"
				stroke="currentColor"
				stroke-width="1.8"
			/>
		{:else if id === 'music'}
			<path
				d="M9 17.5V5.5l10-2v12"
				stroke="currentColor"
				stroke-width="2"
				stroke-linejoin="round"
			/>
			<circle cx="6.5" cy="17.5" r="2.5" fill="currentColor" />
			<circle cx="16.5" cy="15.5" r="2.5" fill="currentColor" />
		{:else if id === 'chat'}
			<path
				d="M4 5.5h16v10H10l-4.5 3.5v-3.5H4Z"
				stroke="currentColor"
				stroke-width="2"
				stroke-linejoin="round"
			/>
		{:else}
			<rect x="2.5" y="7" width="19" height="11" rx="5" stroke="currentColor" stroke-width="2" />
			<path
				d="M7.5 10.5v4M5.5 12.5h4"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<circle cx="16" cy="11.3" r="1.2" fill="currentColor" />
			<circle cx="17.6" cy="14" r="1.2" fill="currentColor" />
		{/if}
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<!-- the dock, action first so it sits clear of Nim -->
	<div class="dockwrap">
		<span class="hint">{tx.dockHint}</span>
		<div class="dock">
			{#each tx.apps as a (a.id)}
				<button
					type="button"
					class="app"
					class:isopen={open.includes(a.id)}
					style="--a:{APP[a.id].color}"
					onclick={() => launch(a.id)}
					disabled={open.includes(a.id)}
				>
					<span class="aicon">{@render appIcon(a.id)}</span>
					<span class="aname">{a.name}</span>
					<span class="agb">{APP[a.id].gb} GB</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- the laptop screen, one window per open app -->
	<div class="laptop">
		<div class="screen" class:slow>
			{#if slow}<span class="slowtag">{tx.slowTag}</span>{/if}
			{#if open.length === 0}
				<span class="empty">{tx.desktopEmpty}</span>
			{:else}
				<div class="wins">
					{#each open as id (id)}
						<div class="win" class:turn={current === id} style="--a:{APP[id].color}">
							<div class="whead">
								<span class="wicon">{@render appIcon(id)}</span>
								<b>{nameOf(id)}</b>
								<button
									type="button"
									class="x"
									aria-label={tx.closeLabel.replace('{app}', nameOf(id))}
									onclick={() => quit(id)}>×</button
								>
							</div>
							<div class="wbody">
								{#if slow}
									<span class="spin" aria-hidden="true"></span>
								{:else}
									<i></i><i class="short"></i>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<div class="base"><span class="pad"></span></div>
	</div>

	<!-- the OS, the manager in the middle -->
	<div class="oslayer">
		<b>{tx.osLabel}</b>
		<span>{tx.osSub}</span>
	</div>

	<!-- the hardware it shares out -->
	<div class="hw">
		<div class="cpu">
			<span class="hlabel">{tx.cpuLabel}</span>
			<span class="cpuchip" style="--a:{current ? APP[current].color : 'var(--color-line)'}">
				{#if current}{@render appIcon(current)}{/if}
			</span>
			<span class="cputext">{current ? tx.turn.replace('{app}', nameOf(current)) : tx.cpuIdle}</span
			>
		</div>
		<div class="ram">
			<span class="hlabel"
				>{tx.ramLabel}
				<em class:over={slow}>{tx.ramUsed.replace('{n}', String(Math.min(used, TOTAL)))}</em></span
			>
			<div class="blocks">
				{#each Array(TOTAL) as _, i (i)}
					{@const b = inRam[i]}
					<span class="blk" class:filled={!!b} style="--a:{b ? b.color : 'transparent'}"
						>{i === 0 || (b && inRam[i - 1]?.label !== b.label) ? (b?.label ?? '') : ''}</span
					>
				{/each}
			</div>
			{#if swap > 0}
				<div class="swap">
					<span class="blocks small">
						{#each spilled as b, i (i)}<span class="blk filled" style="--a:{b.color}"></span>{/each}
					</span>
					<span class="swaptext">{swap} GB {tx.swapLabel}</span>
				</div>
			{/if}
		</div>
	</div>

	<p class="note" class:bad={slow}>{note}</p>
</div>

<style>
	.dockwrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.hint {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.dock {
		display: flex;
		gap: 6px;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.08);
	}
	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		width: 66px;
		border-radius: 11px;
		padding: 6px 2px 5px;
		transition: background 0.2s ease;
	}
	.app:enabled:hover {
		background: var(--color-paper);
	}
	.aicon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--a) 14%, transparent);
		color: var(--a);
	}
	.aname {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.agb {
		font-size: 9px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.app.isopen {
		opacity: 0.45;
	}

	.laptop {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.screen {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: min(84vw, 300px);
		height: 128px;
		border-radius: 13px 13px 0 0;
		border: 1px solid var(--color-line);
		border-bottom: none;
		background: var(--color-paper);
		padding: 8px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.08);
		transition: border-color 0.3s ease;
	}
	.screen.slow {
		border-color: var(--color-danger);
	}
	.base {
		display: flex;
		justify-content: center;
		width: min(94vw, 336px);
		height: 10px;
		border-radius: 2px 2px 11px 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.pad {
		width: 50px;
		height: 4px;
		border-radius: 0 0 5px 5px;
		background: var(--color-line);
	}
	.empty {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.slowtag {
		position: absolute;
		top: -9px;
		right: 10px;
		border-radius: 999px;
		background: var(--color-danger);
		color: #fff;
		padding: 2px 9px;
		font-size: 9.5px;
		font-weight: 800;
		z-index: 2;
	}
	.wins {
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: 1fr;
		gap: 6px;
	}
	.win {
		display: flex;
		flex-direction: column;
		min-width: 0;
		border-radius: 8px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
		animation: winpop 0.3s ease;
	}
	@keyframes winpop {
		from {
			opacity: 0;
			transform: scale(0.85);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	/* the window whose turn it is on the CPU */
	.win.turn {
		border-color: var(--a);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--a) 22%, transparent);
	}
	.whead {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 3px 4px 3px 6px;
		border-bottom: 1px solid var(--color-line);
	}
	.wicon {
		display: flex;
		color: var(--a);
	}
	.wicon :global(svg) {
		width: 11px;
		height: 11px;
	}
	.whead b {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.x {
		width: 18px;
		height: 18px;
		border-radius: 5px;
		font-size: 13px;
		line-height: 1;
		color: var(--color-faint);
	}
	.x:hover {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.wbody {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 4px;
		padding: 4px 7px;
	}
	.wbody i {
		width: 80%;
		height: 4px;
		border-radius: 2px;
		background: color-mix(in srgb, var(--a) 22%, transparent);
	}
	.wbody i.short {
		width: 55%;
	}
	.spin {
		align-self: center;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid var(--color-line);
		border-top-color: var(--color-danger);
		animation: spin 0.9s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.oslayer {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(92vw, 336px);
		border-radius: 11px;
		border: 1px solid var(--color-brand);
		background: var(--color-brand-soft);
		padding: 5px 12px;
		line-height: 1.2;
	}
	.oslayer b {
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.oslayer span {
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.hw {
		display: flex;
		flex-direction: column;
		gap: 7px;
		width: min(92vw, 336px);
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 11px;
	}
	.hlabel {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 6px;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.hlabel em {
		font-style: normal;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.hlabel em.over {
		color: var(--color-danger);
	}
	.cpu {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.cpuchip {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 7px;
		border: 1.5px solid var(--a);
		color: var(--a);
		transition: border-color 0.2s ease;
	}
	.cputext {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.ram {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.blocks {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 3px;
	}
	.blk {
		height: 22px;
		border-radius: 5px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		overflow: visible;
		white-space: nowrap;
		padding-left: 3px;
		font-size: 8.5px;
		font-weight: 700;
		line-height: 20px;
		color: #fff;
		transition: background 0.3s ease;
	}
	.blk.filled {
		border-color: var(--a);
		background: var(--a);
	}
	.swap {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.blocks.small {
		display: flex;
	}
	.blocks.small .blk {
		width: 14px;
		height: 14px;
		padding: 0;
		opacity: 0.55;
	}
	.swaptext {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-danger);
	}

	.note {
		min-height: 1.4em;
		max-width: 330px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.note.bad {
		color: var(--color-danger);
	}

	:global(.dark) .dock,
	:global(.dark) .screen {
		box-shadow: none;
	}
	:global(.dark) .blk {
		color: var(--color-paper);
	}

	@media (prefers-reduced-motion: reduce) {
		.win,
		.spin {
			animation: none;
		}
		.win,
		.blk,
		.cpuchip {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.app {
			width: 80px;
		}
		.aname {
			font-size: 12px;
		}
		.agb {
			font-size: 10.5px;
		}
		.hint {
			font-size: 12.5px;
		}
		.screen {
			width: 380px;
			height: 160px;
		}
		.base {
			width: 430px;
		}
		.oslayer,
		.hw {
			width: 430px;
		}
		.oslayer b {
			font-size: 13px;
		}
		.oslayer span {
			font-size: 11px;
		}
		.whead b {
			font-size: 11px;
		}
		.hlabel,
		.cputext {
			font-size: 12.5px;
		}
		.hlabel em,
		.swaptext {
			font-size: 11.5px;
		}
		.blk {
			height: 26px;
			line-height: 24px;
			font-size: 10px;
		}
		.note {
			font-size: 14px;
			max-width: 440px;
		}
	}
</style>

<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { StorageTypesText } from '$lib/chapters/resilience/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as StorageTypesText);

	type Kind = 'object' | 'block' | 'file';
	let view = $state<Kind | null>(null);
	const viewed = new SvelteSet<Kind>();
	let done = false;

	function pick(k: Kind) {
		view = k;
		viewed.add(k);
		onstate?.(k);
		if (viewed.size === 3 && !done) {
			done = true;
			oncomplete?.();
		}
	}

	const note = $derived(
		view === 'object'
			? tx.objectNote
			: view === 'block'
				? tx.blockNote
				: view === 'file'
					? tx.fileNote
					: viewed.size === 3
						? tx.seenAll
						: tx.hint
	);
	const when = $derived(
		view === 'object'
			? tx.objectWhen
			: view === 'block'
				? tx.blockWhen
				: view === 'file'
					? tx.fileWhen
					: []
	);
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<!-- the visual, one shape of storage at a time -->
	<div class="panel">
		{#if view === null}
			<div class="empty">?</div>
		{:else}
			{#key view}
				{#if view === 'object'}
					<!-- a giant bucket, whole files tossed in, each with a key -->
					<div class="bucket">
						<div class="bucketlip"></div>
						{#each tx.objectFiles as f, i (f)}
							<div class="obj" style="animation-delay:{0.15 + i * 0.22}s">
								<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path
										d="M13 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"
										stroke="#5e6b76"
										stroke-width="2"
										stroke-linejoin="round"
									/>
									<path d="M13 2v6h6" stroke="#5e6b76" stroke-width="2" stroke-linejoin="round" />
								</svg>
								{f}
								<span class="key">
									<svg width="8" height="8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<circle cx="8" cy="8" r="4.5" stroke="#fff" stroke-width="2.5" />
										<path
											d="M11 11.5 20 20m-3.5.5V17m-3 .5V14"
											stroke="#fff"
											stroke-width="2.5"
											stroke-linecap="round"
										/>
									</svg>
									k{i + 1}
								</span>
							</div>
						{/each}
					</div>
				{:else if view === 'block'}
					<!-- one machine, one raw disk sliced into blocks -->
					<div class="blockscene">
						<div class="machine">
							<div class="mrow"><span class="mdot"></span></div>
							<div class="mrow"><span class="mdot"></span></div>
							<span class="mlabel">{tx.blockMachine}</span>
						</div>
						<div class="cable"></div>
						<div class="disk">
							{#each Array(16) as _, i (i)}
								<span class="cell" style="animation-delay:{0.1 + i * 0.05}s"></span>
							{/each}
						</div>
					</div>
				{:else}
					<!-- one shared folder, many machines all seeing the same files -->
					<div class="filescene">
						<div class="folder">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
									stroke="#dd9e36"
									stroke-width="2"
									stroke-linejoin="round"
									fill="#fbf1de"
								/>
							</svg>
							<div class="fdocs">
								{#each tx.fileDocs as d (d)}
									<span class="fdoc">{d}</span>
								{/each}
							</div>
						</div>
						<svg class="fan" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
							<line class="fl" x1="50" y1="0" x2="17" y2="36" />
							<line class="fl" x1="50" y1="0" x2="50" y2="36" />
							<line class="fl" x1="50" y1="0" x2="83" y2="36" />
						</svg>
						<div class="fmachines">
							{#each tx.fileMachines as m, i (m)}
								<div class="fm" style="animation-delay:{0.1 + i * 0.15}s">
									<div class="fmbox"><span class="mdot"></span></div>
									<span class="fmlabel">{m}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/key}
		{/if}
	</div>

	<p class="note">{note}</p>

	<!-- when you would reach for it -->
	<div class="when" class:show={when.length > 0}>
		{#if when.length > 0}
			<span class="wtitle">{tx.whenTitle}</span>
			{#each when as w (w)}
				<span class="wchip">{w}</span>
			{/each}
		{/if}
	</div>

	<!-- the three shapes, open them one by one -->
	<div class="tabs">
		<button
			type="button"
			class="tab"
			class:on={view === 'object'}
			class:seen={viewed.has('object')}
			onclick={() => pick('object')}
		>
			<b>{tx.objectTitle}</b><span>{tx.objectSub}</span>
		</button>
		<button
			type="button"
			class="tab"
			class:on={view === 'block'}
			class:seen={viewed.has('block')}
			onclick={() => pick('block')}
		>
			<b>{tx.blockTitle}</b><span>{tx.blockSub}</span>
		</button>
		<button
			type="button"
			class="tab"
			class:on={view === 'file'}
			class:seen={viewed.has('file')}
			onclick={() => pick('file')}
		>
			<b>{tx.fileTitle}</b><span>{tx.fileSub}</span>
		</button>
	</div>
</div>

<style>
	.panel {
		display: flex;
		align-items: center;
		justify-content: center;
		width: min(92vw, 340px);
		height: 168px;
		border-radius: 18px;
		border: 1px solid #e8e2d8;
		background: #fff;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.07);
		overflow: hidden;
	}
	.empty {
		font-size: 28px;
		font-weight: 800;
		color: #e0d9cd;
	}

	/* object: the bucket */
	.bucket {
		position: relative;
		display: flex;
		width: 210px;
		height: 124px;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 5px;
		border: 2px solid #cdddf6;
		border-top: none;
		border-radius: 0 0 26px 26px;
		background: #f4f8fe;
		padding-bottom: 10px;
	}
	.bucketlip {
		position: absolute;
		top: 0;
		left: -8px;
		right: -8px;
		height: 2px;
		border-radius: 2px;
		background: #cdddf6;
	}
	.obj {
		display: flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 3px 6px 3px 9px;
		font-size: 10px;
		font-weight: 700;
		color: #16212b;
		box-shadow: 0 4px 10px rgba(22, 40, 60, 0.08);
		animation: dropin 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2) backwards;
	}
	.key {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		border-radius: 999px;
		background: #dd9e36;
		color: #fff;
		font-size: 8px;
		font-weight: 800;
		padding: 1px 6px;
	}
	@keyframes dropin {
		from {
			transform: translateY(-70px);
			opacity: 0;
		}
		60% {
			opacity: 1;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* block: machine plus its sliced disk */
	.blockscene {
		display: flex;
		align-items: center;
		gap: 0;
	}
	.machine {
		position: relative;
		display: flex;
		width: 64px;
		flex-direction: column;
		gap: 5px;
		border-radius: 11px;
		border: 1.5px solid #e8e2d8;
		background: #fff;
		padding: 8px;
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.07);
	}
	.mrow {
		display: flex;
		height: 11px;
		align-items: center;
		border-radius: 3px;
		border: 1px solid #ece6dc;
		background: #f4f1ea;
		padding: 0 4px;
	}
	.mdot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #3a9c64;
	}
	.mlabel {
		position: absolute;
		bottom: -18px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 9.5px;
		font-weight: 600;
		color: #5e6b76;
	}
	.cable {
		width: 28px;
		height: 2.5px;
		background: #2e6fe0;
		border-radius: 2px;
	}
	.disk {
		display: grid;
		grid-template-columns: repeat(4, 17px);
		gap: 3px;
		border-radius: 11px;
		border: 1.5px solid #cdddf6;
		background: #f4f8fe;
		padding: 7px;
	}
	.cell {
		height: 17px;
		border-radius: 4px;
		background: #2e6fe0;
		opacity: 0.85;
		animation: cellin 0.3s ease backwards;
	}
	.cell:nth-child(even) {
		opacity: 0.45;
	}
	@keyframes cellin {
		from {
			transform: scale(0.3);
			opacity: 0;
		}
	}

	/* file: one folder, many machines */
	.filescene {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 230px;
	}
	.folder {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 12px;
		border: 1.5px solid #ecd9b6;
		background: #fbf1de;
		padding: 7px 12px;
		box-shadow: 0 6px 14px rgba(221, 158, 54, 0.16);
	}
	.fdocs {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.fdoc {
		border-radius: 4px;
		background: #fff;
		border: 1px solid #ecd9b6;
		font-size: 8.5px;
		font-weight: 700;
		color: #8a6a25;
		padding: 0 6px;
	}
	.fan {
		width: 100%;
		height: 30px;
	}
	.fl {
		stroke: #dcd6cb;
		stroke-width: 2;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}
	@keyframes flow {
		to {
			stroke-dashoffset: -8;
		}
	}
	.fmachines {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}
	.fm {
		display: flex;
		width: 33%;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		animation: dropin 0.4s ease backwards;
	}
	.fmbox {
		display: flex;
		width: 40px;
		height: 26px;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		border: 1.5px solid #e8e2d8;
		background: #fff;
		box-shadow: 0 4px 10px rgba(22, 40, 60, 0.06);
	}
	.fmlabel {
		font-size: 8.5px;
		font-weight: 600;
		color: #8a949d;
	}

	.note {
		min-height: 1.4em;
		max-width: 320px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	.when {
		display: flex;
		min-height: 26px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 5px;
		opacity: 0;
		transition: opacity 0.25s ease;
	}
	.when.show {
		opacity: 1;
	}
	.wtitle {
		font-size: 10px;
		font-weight: 800;
		color: #16212b;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.wchip {
		border-radius: 999px;
		border: 1px solid #cde6d7;
		background: #ecf6f0;
		color: #2f7d54;
		font-size: 10.5px;
		font-weight: 700;
		padding: 2px 10px;
	}

	.tabs {
		display: flex;
		gap: 7px;
	}
	.tab {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		border-radius: 13px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 8px 13px;
		line-height: 1.2;
		transition: all 0.2s ease;
		animation: pulse 1.8s ease-in-out infinite;
	}
	.tab b {
		font-size: 12.5px;
		font-weight: 800;
		color: #16212b;
	}
	.tab span {
		font-size: 8.5px;
		font-weight: 600;
		color: #8a949d;
		white-space: nowrap;
	}
	.tab.seen {
		animation: none;
	}
	.tab.seen:not(.on)::after {
		content: '✓';
		position: absolute;
		top: 2px;
		right: 6px;
		color: #3a9c64;
		font-size: 10px;
		font-weight: 800;
	}
	.tab.on {
		border-color: #16212b;
		background: #16212b;
		animation: none;
	}
	.tab.on b,
	.tab.on span {
		color: #fff;
	}
	.tab:hover:not(.on) {
		border-color: #16212b;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.14);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tab,
		.obj,
		.cell,
		.fm,
		.fl {
			animation-duration: 0.01s;
		}
	}
	/* ---- Dark mode ---- */
	:global(.dark) .panel {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .empty {
		color: var(--color-faint);
	}
	:global(.dark) .bucket {
		background: var(--color-brand-soft);
		border-color: #3a5a80;
	}
	:global(.dark) .bucketlip {
		background: #3a5a80;
	}
	:global(.dark) .obj {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-ink);
		box-shadow: none;
	}
	:global(.dark) .machine {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .mrow {
		background: #222a36;
		border-color: var(--color-line);
	}
	:global(.dark) .mlabel {
		color: var(--color-muted);
	}
	:global(.dark) .disk {
		background: var(--color-brand-soft);
		border-color: #3a5a80;
	}
	:global(.dark) .folder {
		background: var(--color-amber-soft);
		border-color: #3d3522;
		box-shadow: none;
	}
	:global(.dark) .fdoc {
		background: var(--color-card);
		border-color: #3d3522;
		color: var(--color-amber);
	}
	:global(.dark) .fl {
		stroke: #3a3d45;
	}
	:global(.dark) .fmbox {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .fmlabel {
		color: var(--color-faint);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .wtitle {
		color: var(--color-ink);
	}
	:global(.dark) .wchip {
		background: var(--color-grass-soft);
		border-color: #1f3d28;
		color: var(--color-grass);
	}
	:global(.dark) .tab {
		background: var(--color-card);
		border-color: var(--color-line);
		animation: none;
	}
	:global(.dark) .tab b {
		color: var(--color-ink);
	}
	:global(.dark) .tab span {
		color: var(--color-faint);
	}
	:global(.dark) .tab.on {
		border-color: var(--btn-primary);
		background: var(--btn-primary);
	}
	:global(.dark) .tab:hover:not(.on) {
		border-color: var(--color-ink);
	}

	@media (min-width: 768px) {
		.panel {
			width: 470px;
			height: 216px;
		}
		.bucket {
			width: 260px;
			height: 156px;
		}
		.obj {
			font-size: 12px;
		}
		.key {
			font-size: 9px;
		}
		.machine {
			width: 80px;
		}
		.cable {
			width: 40px;
		}
		.disk {
			grid-template-columns: repeat(4, 22px);
			gap: 4px;
		}
		.cell {
			height: 22px;
		}
		.mlabel {
			font-size: 11px;
		}
		.filescene {
			width: 300px;
		}
		.fdoc {
			font-size: 10px;
		}
		.fmbox {
			width: 52px;
			height: 32px;
		}
		.fmlabel {
			font-size: 10px;
		}
		.fan {
			height: 38px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
		.wchip {
			font-size: 12px;
		}
		.wtitle {
			font-size: 11px;
		}
		.tab {
			padding: 9px 18px;
		}
		.tab b {
			font-size: 14.5px;
		}
		.tab span {
			font-size: 10px;
		}
	}
</style>

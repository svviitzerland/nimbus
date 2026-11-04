<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';

	import type { ContainerText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate,
		beat = 0,
		onshow
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		beat?: number;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as ContainerText);

	// the architecture narrates along with Nim, one view per beat
	const lastBeat = $derived(beat >= tx.intro.length - 1);
	const view = $derived(
		lastBeat ? 'demo' : (['problem', 'stack', 'swarm', 'k8s'][Math.min(beat, 3)] as string)
	);
	$effect(() => {
		void beat;
		onshow?.(true);
	});

	// the hands-on bit, only on the final beat
	let phase = $state<'loose' | 'building' | 'built' | 'running'>('loose');
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function build() {
		phase = 'building';
		timers.push(
			setTimeout(() => {
				phase = 'built';
				onstate?.('built');
			}, 800)
		);
	}
	function run() {
		phase = 'running';
		onstate?.('ran');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
	const note = $derived(
		!lastBeat
			? ' '
			: phase === 'running'
				? tx.noteRan
				: phase === 'built'
					? tx.noteBuilt
					: tx.noteIdle
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet whale(size: number)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<rect x="4" y="8.5" width="3" height="3" fill="#2496ed" />
		<rect x="8" y="8.5" width="3" height="3" fill="#2496ed" />
		<rect x="12" y="8.5" width="3" height="3" fill="#2496ed" />
		<rect x="8" y="4.5" width="3" height="3" fill="#2496ed" />
		<path
			d="M2 13h18.5c1 0 1.8-.4 2.3-1.2.4.1-.4 1.6-1.3 2.3-2 5-7 7.4-11.5 7.4-4 0-7.4-1.9-9-5.5-.6-1.4-1-2.9-1-3Z"
			fill="#2496ed"
		/>
	</svg>
{/snippet}

{#snippet cbox(label: string, small: boolean)}
	<div class="cont" class:small>
		<svg
			width={small ? 10 : 13}
			height={small ? 10 : 13}
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M12 2 3 7v10l9 5 9-5V7Z"
				stroke="#2496ed"
				stroke-width="2"
				stroke-linejoin="round"
				fill="#e7f2fc"
			/>
			<path d="M3 7l9 5 9-5M12 12v10" stroke="#2496ed" stroke-width="2" stroke-linejoin="round" />
		</svg>
		<span>{label}</span>
	</div>
{/snippet}

{#snippet ministack()}
	<div class="mini">
		<div class="mrow conts">
			{@render cbox('', true)}{@render cbox('', true)}
		</div>
		<div class="mrow dock">{@render whale(11)}</div>
		<div class="mrow mach"></div>
	</div>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="panel">
		{#key view}
			{#if view === 'problem'}
				<!-- the app and its loose pieces break when they travel -->
				<div class="problem">
					<div class="side">
						<div class="pieces">
							{#each tx.pieces as p, i (p)}<span class="piece" style="--r:{[-4, 3, -2][i]}deg"
									>{p}</span
								>{/each}
						</div>
						<span class="plabel">{tx.yourLaptop} ✓</span>
					</div>
					<div class="movearrow">
						<svg width="34" height="14" viewBox="0 0 34 14" fill="none" aria-hidden="true">
							<path
								d="M2 7h26m0 0-5-5m5 5-5 5"
								stroke="#b9c0c7"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span class="xmark">×</span>
					</div>
					<div class="side">
						<div class="pieces broken">
							{#each tx.pieces.slice(0, 2) as p, i (p)}<span
									class="piece"
									style="--r:{[5, -6][i]}deg">{p}</span
								>{/each}
							<span class="piece missing">?</span>
						</div>
						<span class="plabel bad">{tx.otherMachine}, {tx.brokenTag}</span>
					</div>
				</div>
			{:else if view === 'stack'}
				<!-- the container architecture, machine, Docker, containers on top -->
				<div class="stack">
					<div class="layer tops">
						{#each tx.archApps as a, i (a)}
							<div class="contwrap" style="animation-delay:{0.5 + i * 0.2}s">
								{@render cbox(a, false)}
							</div>
						{/each}
					</div>
					<div class="layer docker" style="animation-delay:0.25s">
						{@render whale(15)}<b>{tx.archDocker}</b>
					</div>
					<div class="layer machine" style="animation-delay:0s">{tx.archMachine}</div>
				</div>
			{:else if view === 'swarm'}
				<!-- a few machines, managed together by Swarm -->
				<div class="swarm">
					<div class="swarmtag">{@render whale(12)}{tx.swarmTag}</div>
					<svg class="fan" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
						<line class="fl" x1="50" y1="0" x2="17" y2="26" />
						<line class="fl" x1="50" y1="0" x2="50" y2="26" />
						<line class="fl" x1="50" y1="0" x2="83" y2="26" />
					</svg>
					<div class="srow">
						{#each [0, 1, 2] as i (i)}
							<div class="swrap" style="animation-delay:{0.2 + i * 0.16}s">
								{@render ministack()}
							</div>
						{/each}
					</div>
				</div>
			{:else if view === 'k8s'}
				<!-- Kubernetes, a brain commanding many nodes full of containers -->
				<div class="k8s">
					<div class="plane">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path
								d="M12 2.2 3.4 6.4l-2 9.2 5.9 7.2h9.4l5.9-7.2-2-9.2Z"
								stroke="#326ce5"
								stroke-width="1.7"
								stroke-linejoin="round"
								fill="#eaf0fc"
							/>
							<circle cx="12" cy="12.4" r="2.4" stroke="#326ce5" stroke-width="1.6" />
							<path
								d="M12 6v3m-5.4 7.2 2.4-1.8m8.4 1.8-2.4-1.8M7 8.7l2.6 1.6m7.4-1.6-2.6 1.6"
								stroke="#326ce5"
								stroke-width="1.6"
								stroke-linecap="round"
							/>
						</svg>
						{tx.k8sPlane}
					</div>
					<svg class="fan" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
						<line class="fl k" x1="50" y1="0" x2="17" y2="24" />
						<line class="fl k" x1="50" y1="0" x2="50" y2="24" />
						<line class="fl k" x1="50" y1="0" x2="83" y2="24" />
					</svg>
					<div class="srow">
						{#each [0, 1, 2] as i (i)}
							<div class="node" style="animation-delay:{0.2 + i * 0.16}s">
								<div class="ngrid">
									{#each Array(6) as _, j (j)}<span
											class="nc"
											style="animation-delay:{0.3 + i * 0.16 + j * 0.05}s"
										></span>{/each}
								</div>
								<span class="nlabel">{tx.nodeLabel.replace('{n}', String(i + 1))}</span>
							</div>
						{/each}
					</div>
					<span class="kbadge">{tx.k8sBadge}</span>
				</div>
			{:else}
				<!-- your turn: pack it, then run it in three places -->
				<div class="demo">
					{#if phase === 'loose' || phase === 'building'}
						<div class="pieces center" class:sucking={phase === 'building'}>
							{#each tx.pieces as p, i (p)}<span class="piece" style="--r:{[-4, 3, -2][i]}deg"
									>{p}</span
								>{/each}
						</div>
					{:else if phase === 'built'}
						<div class="builtwrap">{@render cbox(tx.imageLabel, false)}</div>
					{:else}
						<div class="ranwrap">
							{#each tx.machines as m, i (m)}
								<div class="place" style="animation-delay:{i * 0.18}s">
									{@render cbox(tx.imageLabel, true)}
									<span class="mlabel2">{m}</span>
									<span class="same">✓ {tx.sameTag}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		{/key}
	</div>

	<p class="note">{note}</p>

	{#if lastBeat && phase !== 'running'}
		<CallToActionButton onclick={phase === 'built' ? run : build} disabled={phase === 'building'}>
			{#snippet children()}{phase === 'built' ? tx.runLabel : tx.buildLabel}{/snippet}
		</CallToActionButton>
	{/if}
</div>

<style>
	.panel {
		display: flex;
		align-items: center;
		justify-content: center;
		width: min(94vw, 364px);
		height: 198px;
		border-radius: 18px;
		border: 1px solid #e8e2d8;
		background: #fff;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.07);
		overflow: hidden;
	}

	/* beat 0, the breakage */
	.problem {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.side {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 7px;
	}
	.pieces {
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-height: 86px;
		justify-content: center;
	}
	.pieces.center {
		align-items: center;
	}
	.piece {
		border-radius: 8px;
		border: 1.5px solid #e6d9bb;
		background: #fbf6ea;
		color: #8a6a25;
		font-size: 10px;
		font-weight: 700;
		padding: 3px 10px;
		transform: rotate(var(--r, 0deg));
	}
	.piece.missing {
		border-color: #eecac4;
		background: #fbeae7;
		color: #b8392c;
		text-align: center;
	}
	.pieces.sucking .piece {
		transition: all 0.7s cubic-bezier(0.5, 0, 0.6, 1);
		transform: rotate(0) scale(0.5);
		opacity: 0.25;
	}
	.plabel {
		font-size: 9px;
		font-weight: 700;
		color: #2f7d54;
		text-align: center;
		max-width: 120px;
	}
	.plabel.bad {
		color: #b8392c;
	}
	.movearrow {
		position: relative;
		display: flex;
		align-items: center;
	}
	.xmark {
		position: absolute;
		top: -16px;
		left: 50%;
		transform: translateX(-50%);
		color: #d3584a;
		font-size: 16px;
		font-weight: 800;
	}

	/* beat 1, the stack */
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: 86%;
	}
	.layer {
		animation: rise 0.45s ease backwards;
	}
	.layer.tops {
		display: flex;
		gap: 8px;
	}
	.contwrap {
		animation: rise 0.45s ease backwards;
	}
	.cont {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 11px;
		border: 1.5px solid #bfdcf6;
		background: #f3f9fe;
		padding: 8px 12px;
		box-shadow: 0 5px 14px rgba(36, 150, 237, 0.14);
	}
	.cont span {
		font-size: 8.5px;
		font-weight: 800;
		color: #1d7ac2;
		max-width: 92px;
		text-align: center;
		line-height: 1.2;
	}
	.cont.small {
		padding: 4px 6px;
	}
	.cont.small span:empty {
		display: none;
	}
	.layer.docker {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 11px;
		border: 1.5px solid #bfdcf6;
		background: #e7f2fc;
		padding: 7px;
	}
	.layer.docker b {
		font-size: 11.5px;
		font-weight: 800;
		color: #1d7ac2;
	}
	.layer.machine {
		width: 100%;
		border-radius: 11px;
		border: 1.5px solid #e0d9cd;
		background: #f4f1ea;
		color: #5e6b76;
		font-size: 10px;
		font-weight: 700;
		text-align: center;
		padding: 8px;
	}
	@keyframes rise {
		from {
			transform: translateY(10px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* beat 2, swarm */
	.swarm {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 88%;
	}
	.swarmtag {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		border: 1.5px solid #bfdcf6;
		background: #e7f2fc;
		color: #1d7ac2;
		font-size: 9.5px;
		font-weight: 800;
		padding: 4px 12px;
		text-align: center;
	}
	.fan {
		width: 78%;
		height: 22px;
	}
	.fl {
		stroke: #bfdcf6;
		stroke-width: 2;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}
	.fl.k {
		stroke: #c3d4f5;
	}
	@keyframes flow {
		to {
			stroke-dashoffset: -8;
		}
	}
	.srow {
		display: flex;
		width: 100%;
		justify-content: space-around;
	}
	.swrap {
		animation: rise 0.4s ease backwards;
	}
	.mini {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.mini .mrow {
		border-radius: 7px;
	}
	.mini .conts {
		display: flex;
		gap: 3px;
	}
	.mini .dock {
		display: flex;
		width: 64px;
		align-items: center;
		justify-content: center;
		border: 1px solid #bfdcf6;
		background: #e7f2fc;
		padding: 2px;
	}
	.mini .mach {
		width: 64px;
		height: 9px;
		border: 1px solid #e0d9cd;
		background: #f4f1ea;
	}

	/* beat 3, kubernetes */
	.k8s {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 90%;
	}
	.plane {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		border: 1.5px solid #c3d4f5;
		background: #eaf0fc;
		color: #2a5bc4;
		font-size: 9.5px;
		font-weight: 800;
		padding: 4px 12px;
	}
	.node {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		animation: rise 0.4s ease backwards;
	}
	.ngrid {
		display: grid;
		grid-template-columns: repeat(3, 10px);
		gap: 3px;
		border-radius: 9px;
		border: 1.5px solid #c3d4f5;
		background: #f5f8fe;
		padding: 5px;
	}
	.nc {
		height: 10px;
		border-radius: 3px;
		background: #326ce5;
		opacity: 0.7;
		animation: popin 0.3s ease backwards;
	}
	.nc:nth-child(even) {
		opacity: 0.4;
	}
	.nlabel {
		font-size: 8.5px;
		font-weight: 700;
		color: #5e6b76;
	}
	.kbadge {
		margin-top: 7px;
		border-radius: 999px;
		background: #326ce5;
		color: #fff;
		font-size: 8.5px;
		font-weight: 800;
		padding: 3px 11px;
		animation: popin 0.35s ease 0.7s backwards;
	}
	@keyframes popin {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* final beat, the demo */
	.demo {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.builtwrap {
		animation: popin 0.35s ease;
	}
	.ranwrap {
		display: flex;
		gap: 10px;
	}
	.place {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #faf9f6;
		padding: 8px 9px;
		animation: popin 0.35s ease backwards;
	}
	.mlabel2 {
		font-size: 8.5px;
		font-weight: 700;
		color: #5e6b76;
	}
	.same {
		font-size: 7.5px;
		font-weight: 800;
		color: #2f7d54;
	}

	.note {
		min-height: 1.3em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	:global(.dark) .panel {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .piece {
		border-color: color-mix(in srgb, var(--color-amber) 40%, transparent);
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	:global(.dark) .piece.missing {
		border-color: color-mix(in srgb, var(--color-danger) 40%, transparent);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	:global(.dark) .plabel {
		color: var(--color-grass);
	}
	:global(.dark) .plabel.bad {
		color: var(--color-danger);
	}
	:global(.dark) .cont {
		border-color: color-mix(in srgb, #2496ed 30%, transparent);
		background: color-mix(in srgb, #2496ed 12%, transparent);
		box-shadow: none;
	}
	:global(.dark) .cont span {
		color: #66b8f7;
	}
	:global(.dark) .cont svg path:first-child {
		fill: color-mix(in srgb, #2496ed 15%, transparent);
	}
	:global(.dark) .layer.docker {
		border-color: color-mix(in srgb, #2496ed 30%, transparent);
		background: color-mix(in srgb, #2496ed 12%, transparent);
	}
	:global(.dark) .layer.docker b {
		color: #66b8f7;
	}
	:global(.dark) .layer.machine {
		border-color: var(--color-line);
		background: var(--color-paper);
		color: var(--color-muted);
	}
	:global(.dark) .swarmtag {
		border-color: color-mix(in srgb, #2496ed 30%, transparent);
		background: color-mix(in srgb, #2496ed 12%, transparent);
		color: #66b8f7;
	}
	:global(.dark) .fl {
		stroke: color-mix(in srgb, #2496ed 30%, transparent);
	}
	:global(.dark) .fl.k {
		stroke: color-mix(in srgb, #326ce5 30%, transparent);
	}
	:global(.dark) .mini .dock {
		border-color: color-mix(in srgb, #2496ed 30%, transparent);
		background: color-mix(in srgb, #2496ed 12%, transparent);
	}
	:global(.dark) .mini .mach {
		border-color: var(--color-line);
		background: var(--color-paper);
	}
	:global(.dark) .plane {
		border-color: color-mix(in srgb, #326ce5 30%, transparent);
		background: color-mix(in srgb, #326ce5 12%, transparent);
		color: #78a9ff;
	}
	:global(.dark) .plane svg path:first-child {
		fill: color-mix(in srgb, #326ce5 15%, transparent);
	}
	:global(.dark) .ngrid {
		border-color: color-mix(in srgb, #326ce5 30%, transparent);
		background: color-mix(in srgb, #326ce5 8%, transparent);
	}
	:global(.dark) .nlabel {
		color: var(--color-muted);
	}
	:global(.dark) .place {
		border-color: var(--color-line);
		background: var(--color-paper);
	}
	:global(.dark) .mlabel2 {
		color: var(--color-muted);
	}
	:global(.dark) .same {
		color: var(--color-grass);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .movearrow svg path {
		stroke: var(--color-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.layer,
		.contwrap,
		.swrap,
		.node,
		.nc,
		.kbadge,
		.place,
		.builtwrap,
		.fl {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.panel {
			width: 520px;
			height: 250px;
		}
		.piece {
			font-size: 12px;
		}
		.plabel {
			font-size: 11px;
			max-width: 160px;
		}
		.cont span {
			font-size: 10.5px;
			max-width: 120px;
		}
		.layer.docker b {
			font-size: 14px;
		}
		.layer.machine {
			font-size: 12px;
		}
		.swarmtag {
			font-size: 12px;
		}
		.plane {
			font-size: 12px;
		}
		.ngrid {
			grid-template-columns: repeat(3, 13px);
		}
		.nc {
			height: 13px;
		}
		.nlabel {
			font-size: 10.5px;
		}
		.kbadge {
			font-size: 10.5px;
		}
		.mini .dock,
		.mini .mach {
			width: 84px;
		}
		.mlabel2 {
			font-size: 10.5px;
		}
		.same {
			font-size: 9px;
		}
		.note {
			font-size: 14px;
		}
	}
</style>

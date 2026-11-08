<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { BottleneckText } from '$lib/chapters/trafficflow/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BottleneckText);

	const MAXV = 6;
	let visitors = $state(1);
	let capacity = $state(3); // how many visitors the one database serves at once
	let seenJam = false;
	let done = false;

	const overloaded = $derived(visitors > capacity);
	const queue = $derived(Math.max(0, visitors - capacity));
	const big = $derived(capacity > 3); // the database has been scaled up
	// a made up page load time so the customer impact is concrete
	const loadSec = $derived(queue === 0 ? 0.3 : Math.round((0.5 + queue * 1.7) * 10) / 10);

	function addVisitor() {
		if (visitors >= MAXV) return;
		visitors += 1;
		if (visitors > capacity && !seenJam) {
			seenJam = true;
			onstate?.('jam');
		}
	}
	function fix() {
		if (!overloaded) return;
		capacity = MAXV; // a bigger database, the one point widened
		onstate?.('fixed');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
</script>

<div class="wrap">
	<div class="status" class:ok={!overloaded}>
		<span class="sdot"></span>
		{#if overloaded}
			{tx.jamStatus}<span class="qcount">{queue} {tx.queueLabel}</span>
		{:else}
			{tx.okStatus}
		{/if}
	</div>

	<!-- Customer side: what one visitor on their phone feels -->
	<div class="side">
		<div class="slabel">
			<svg viewBox="0 0 24 24" aria-hidden="true"
				><rect
					x="7"
					y="2.5"
					width="10"
					height="19"
					rx="2.4"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
				/><circle cx="12" cy="18.4" r="0.9" fill="currentColor" /></svg
			>
			{tx.customerLabel}
		</div>
		<div class="cust">
			<div class="phone" class:slow={overloaded}>
				<span class="notch"></span>
				<div class="pscreen">
					<div class="pbarmini">
						<span class="pdot"></span><span class="purl">{tx.shopUrl}</span>
					</div>
					<div class="pbody">
						{#if overloaded}
							<span class="ldr"></span>
						{:else}
							<div class="page">
								<span class="phero"></span>
								<span class="prow"><i></i><i></i></span>
								<span class="prow"><i></i><i></i></span>
								<span class="prow"><i></i><i></i></span>
								<span class="prow"><i></i><i></i></span>
							</div>
						{/if}
					</div>
				</div>
			</div>
			<span class="ptag" class:bad={overloaded}>
				{overloaded ? tx.loadingLabel : tx.okPageLabel}
				<b>{loadSec}{tx.secUnit}</b>
			</span>
		</div>
	</div>

	<span class="arrow">
		<svg viewBox="0 0 16 12" aria-hidden="true"
			><path
				d="M8 1v8M4 6l4 4 4-4"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/></svg
		>
	</span>

	<!-- Developer side: visitors line up at the one database, the choke point -->
	<div class="side">
		<div class="slabel">
			<svg viewBox="0 0 24 24" aria-hidden="true"
				><rect
					x="3.5"
					y="4"
					width="17"
					height="6"
					rx="1.6"
					fill="none"
					stroke="currentColor"
					stroke-width="1.7"
				/><rect
					x="3.5"
					y="14"
					width="17"
					height="6"
					rx="1.6"
					fill="none"
					stroke="currentColor"
					stroke-width="1.7"
				/><circle cx="7" cy="7" r="1" fill="currentColor" /><circle
					cx="7"
					cy="17"
					r="1"
					fill="currentColor"
				/></svg
			>
			{tx.devLabel}
			<span class="vcount">{visitors} {tx.visitorsLabel}</span>
		</div>
		<div class="backend">
			<div class="qline">
				{#each Array(visitors) as _, i (i)}
					{@const served = i >= visitors - capacity}
					<span class="person" class:served class:wait={!served}>
						<span class="ph"></span><span class="pb"></span>
					</span>
				{/each}
			</div>
			<div class="dbcol">
				<span class="dbwrap">
					<span class="db" class:hot={overloaded} class:big>
						<svg viewBox="0 0 44 50" aria-hidden="true">
							<path class="dbbody" d="M5 9 V40 a17 6 0 0 0 34 0 V9 Z" />
							<ellipse class="dbtop" cx="22" cy="9" rx="17" ry="6" />
							<path class="dbline" d="M5 22 a17 6 0 0 0 34 0" fill="none" />
						</svg>
					</span>
					{#if overloaded}<span class="btag">{tx.bottleneckTag}</span>{/if}
				</span>
				<span class="blabel">{tx.dbLabel}</span>
			</div>
		</div>
	</div>

	<div class="acts">
		<button type="button" class="line" onclick={addVisitor} disabled={visitors >= MAXV}
			>{tx.addBtn}</button
		>
		<button type="button" class="cta" onclick={fix} disabled={!overloaded}>{tx.fixBtn}</button>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: min(94vw, 360px);
		height: 100%;
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 999px;
		border: 1.5px solid #f1cfc9;
		background: #fbecea;
		color: #b8392c;
		font-size: 13px;
		font-weight: 800;
		padding: 6px 8px 6px 14px;
		transition:
			background 0.3s ease,
			border-color 0.3s ease,
			color 0.3s ease;
	}
	.status.ok {
		border-color: #cde6d7;
		background: #ecf6f0;
		color: #2f7d54;
		padding: 6px 16px;
	}
	.sdot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: currentColor;
	}
	.qcount {
		border-radius: 999px;
		background: #fff;
		color: #b8392c;
		font-size: 11px;
		font-weight: 800;
		padding: 2px 9px;
		font-variant-numeric: tabular-nums;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 7px;
		width: 100%;
	}
	.slabel {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11.5px;
		font-weight: 800;
		color: #5e6b76;
	}
	.slabel svg {
		width: 15px;
		height: 15px;
		flex: none;
	}
	.vcount {
		margin-left: auto;
		border-radius: 999px;
		background: #eef2f6;
		color: #44515c;
		font-size: 10.5px;
		font-weight: 800;
		padding: 2px 9px;
		font-variant-numeric: tabular-nums;
	}

	/* customer phone */
	.cust {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 13px;
	}
	/* about twice as tall as it is wide, like a real phone */
	.phone {
		position: relative;
		width: 68px;
		height: 136px;
		border-radius: 13px;
		background: #16212b;
		padding: 6px 5px;
		box-shadow: 0 8px 18px rgba(22, 40, 60, 0.16);
		transition: box-shadow 0.3s ease;
	}
	.notch {
		position: absolute;
		top: 5px;
		left: 50%;
		transform: translateX(-50%);
		width: 22px;
		height: 3px;
		border-radius: 2px;
		background: #3a4650;
	}
	.pscreen {
		height: 100%;
		border-radius: 8px;
		overflow: hidden;
		background: #fbfcfe;
		display: flex;
		flex-direction: column;
	}
	.pbarmini {
		display: flex;
		align-items: center;
		gap: 4px;
		height: 13px;
		padding: 0 5px;
		background: #eef1f5;
	}
	.pdot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #b7c0c9;
		flex: none;
	}
	.purl {
		font-size: 6.5px;
		font-weight: 700;
		color: #9aa4ad;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.pbody {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.page {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 100%;
		padding: 7px;
		animation: pagein 0.3s ease both;
	}
	@keyframes pagein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.phero {
		height: 16px;
		border-radius: 4px;
		background: linear-gradient(120deg, #bcd6f5, #8fb8ec);
	}
	.prow {
		display: flex;
		gap: 5px;
	}
	.prow i {
		flex: 1;
		height: 12px;
		border-radius: 3px;
		background: #e6ebf1;
	}
	.ldr {
		width: 22px;
		height: 22px;
		border: 3px solid #ecd9b8;
		border-top-color: #dd9e36;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.ptag {
		display: inline-flex;
		flex-direction: column;
		gap: 2px;
		font-size: 11px;
		font-weight: 700;
		color: #2f7d54;
	}
	.ptag b {
		font-size: 18px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}
	.ptag.bad {
		color: #c0392b;
	}

	.arrow {
		color: #b7c0c9;
		line-height: 0;
	}
	.arrow svg {
		width: 16px;
		height: 12px;
	}

	/* backend: the queue of people and the one database */
	.backend {
		display: flex;
		align-items: center;
		gap: 9px;
		width: 100%;
		border-radius: 12px;
		border: 1px solid #ece6dc;
		background: #fff;
		padding: 12px 12px 11px;
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.05);
	}
	.qline {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 6px;
		flex: 1;
		min-width: 0;
	}
	.person {
		position: relative;
		width: 13px;
		height: 20px;
		flex: none;
		animation: pop 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.person .ph {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--c);
		transition: background 0.3s ease;
	}
	.person .pb {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 13px;
		height: 10px;
		border-radius: 6px 6px 3px 3px;
		background: var(--c);
		transition: background 0.3s ease;
	}
	.person.served {
		--c: #3a9c64;
	}
	.person.wait {
		--c: #d3584a;
		animation:
			pop 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) both,
			fret 0.6s ease-in-out infinite;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(4px) scale(0.6);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes fret {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(-1.5px);
		}
	}
	.dbcol {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		flex: none;
	}
	.dbwrap {
		position: relative;
		display: inline-flex;
		height: 48px;
		align-items: flex-end;
	}
	.db {
		display: inline-flex;
		transform-origin: bottom center;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.db svg {
		width: 40px;
		height: 46px;
	}
	.db.big {
		transform: scale(1.34);
	}
	.dbbody {
		fill: #e6f5ec;
		stroke: #2f9160;
		stroke-width: 1.6;
		transition:
			fill 0.3s ease,
			stroke 0.3s ease;
	}
	.dbtop {
		fill: #d2efde;
		stroke: #2f9160;
		stroke-width: 1.6;
		transition:
			fill 0.3s ease,
			stroke 0.3s ease;
	}
	.dbline {
		stroke: #9fd3b6;
		stroke-width: 1.3;
		transition: stroke 0.3s ease;
	}
	.db.hot .dbbody {
		fill: #fbe2de;
		stroke: #c0392b;
	}
	.db.hot .dbtop {
		fill: #f6cfc8;
		stroke: #c0392b;
	}
	.db.hot .dbline {
		stroke: #e7a89f;
	}
	.db.hot {
		animation: throb 0.9s ease-in-out infinite;
	}
	@keyframes throb {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.07);
		}
	}
	.btag {
		position: absolute;
		top: -11px;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		border-radius: 999px;
		background: #c0392b;
		color: #fff;
		font-size: 8px;
		font-weight: 800;
		letter-spacing: 0.02em;
		padding: 2px 7px;
	}
	.blabel {
		font-size: 9.5px;
		font-weight: 700;
		color: #5e6b76;
		white-space: nowrap;
	}

	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta {
		border-radius: 12px;
		background: #16212b;
		color: #fff;
		padding: 11px 18px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.line {
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		color: #16212b;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		transition: border-color 0.2s ease;
	}
	.line:enabled:hover {
		border-color: #16212b;
	}
	.cta:disabled,
	.line:disabled {
		opacity: 0.5;
	}

	/* ---- Dark mode ---- */
	:global(.dark) .status {
		background: var(--color-danger-soft);
		border-color: #3d2020;
		color: var(--color-danger);
	}
	:global(.dark) .status.ok {
		background: var(--color-grass-soft);
		border-color: #1f3d28;
		color: var(--color-grass);
	}
	:global(.dark) .qcount {
		background: var(--color-card);
		color: var(--color-danger);
	}
	:global(.dark) .slabel {
		color: var(--color-muted);
	}
	:global(.dark) .vcount {
		background: #1e2835;
		color: var(--color-muted);
	}
	:global(.dark) .phone {
		background: #222d3d;
		box-shadow: none;
	}
	:global(.dark) .notch {
		background: var(--color-muted);
	}
	:global(.dark) .pscreen {
		background: var(--color-card);
	}
	:global(.dark) .pbarmini {
		background: #1e2835;
	}
	:global(.dark) .pdot {
		background: var(--color-faint);
	}
	:global(.dark) .purl {
		color: var(--color-faint);
	}
	:global(.dark) .phero {
		background: linear-gradient(120deg, #1a2d4a, #2e6fe0);
	}
	:global(.dark) .prow i {
		background: #2c3746;
	}
	:global(.dark) .ldr {
		border-color: #3d3522;
	}
	:global(.dark) .ptag {
		color: var(--color-grass);
	}
	:global(.dark) .ptag.bad {
		color: var(--color-danger);
	}
	:global(.dark) .arrow {
		color: var(--color-muted);
	}
	:global(.dark) .backend {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .dbbody {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	:global(.dark) .dbtop {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	:global(.dark) .dbline {
		stroke: var(--color-grass);
	}
	:global(.dark) .db.hot .dbbody {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	:global(.dark) .db.hot .dbtop {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	:global(.dark) .db.hot .dbline {
		stroke: var(--color-danger);
	}
	:global(.dark) .btag {
		background: var(--color-danger);
	}
	:global(.dark) .blabel {
		color: var(--color-muted);
	}
	:global(.dark) .cta {
		background: var(--btn-primary);
		box-shadow: none;
	}
	:global(.dark) .line {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-ink);
	}
	:global(.dark) .line:enabled:hover {
		border-color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.ldr,
		.db.hot,
		.person.wait {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
			gap: 12px;
		}
		.phone {
			width: 76px;
			height: 152px;
		}
		.person {
			width: 15px;
			height: 22px;
		}
		.db svg {
			width: 46px;
			height: 52px;
		}
		.cta,
		.line {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>

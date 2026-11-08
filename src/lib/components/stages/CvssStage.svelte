<script lang="ts">
	import { tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Browser from '../Browser.svelte';
	import Server from '../Server.svelte';
	import {
		cvssCases,
		probes,
		cvssVersions,
		probeCvssCase,
		freshCvssCase,
		hasCvssEvidence,
		cvssCaseAssessment,
		type CvssCase,
		type CvssProbe,
		type CvssVersion
	} from '../labs/cvss-cases';
	import type { StageProps, CvssText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as CvssText);
	let selected = $state<CvssCase>('invoice');
	let states = $state({
		invoice: freshCvssCase(),
		admin: freshCvssCase(),
		public: freshCvssCase()
	});
	const current = $derived(states[selected]);
	const scenario = $derived(tx.cases[selected]);
	const ready = $derived(hasCvssEvidence(current));
	let version = $state<CvssVersion>('3.1');
	const assessment = $derived(cvssCaseAssessment(selected, version));
	const seenVersions = new SvelteSet<CvssVersion>();
	const allScored = $derived(cvssCases.every((id) => states[id].scored));
	let completed = false;
	let last = $state<CvssProbe | null>(null),
		sequence = $state(0);
	let metric = $state('AV');
	let vectorOpen = $state(false);
	let assessmentPanel: HTMLElement | undefined = $state();
	const stopped = $derived(!current.running);
	const read = $derived(current.observed.read === 'full' || current.observed.read === 'limited');
	const changed = $derived(current.observed.write === 'full');
	const status = $derived(last ? current.observed[last] : undefined);
	const metricValue = $derived(assessment.entries.find(([key]) => key === metric)?.[1] ?? 'N');
	const references: Record<CvssVersion, string> = {
		'2.0': '/cvss/v2/guide',
		'3.0': '/cvss/v3.0/specification-document',
		'3.1': '/cvss/v3.1/specification-document',
		'4.0': '/cvss/v4.0/specification-document'
	};
	function pick(id: CvssCase) {
		selected = id;
		last = null;
		vectorOpen = false;
		metric = 'AV';
		onstate?.('explore');
	}
	function probe(action: CvssProbe) {
		if (stopped) return;
		const result = probeCvssCase(selected, action, current.admin);
		current.observed = { ...current.observed, [action]: result };
		if (action === 'stop' && result === 'full') current.running = false;
		last = action;
		sequence++;
		onstate?.(
			result === 'login'
				? 'admin_needed'
				: selected === 'invoice'
					? 'invoice_' + action
					: 'full_' + action
		);
	}
	function login() {
		current.admin = true;
		onstate?.('admin_ready');
	}
	function restore() {
		current.running = true;
		last = null;
		onstate?.('restored');
	}
	function finish() {
		if (!completed && cvssCases.every((id) => states[id].scored) && seenVersions.size > 1) {
			completed = true;
			oncomplete?.();
			onstate?.('finished');
		}
	}
	async function assess() {
		if (!ready) return;
		current.scored = true;
		seenVersions.add(version);
		onstate?.('scored_' + selected);
		finish();
		await tick();
		assessmentPanel?.focus({ preventScroll: true });
		assessmentPanel?.scrollIntoView({ block: 'start' });
	}
	function chooseVersion(next: CvssVersion) {
		version = next;
		metric = 'AV';
		seenVersions.add(next);
		onstate?.(
			{ '2.0': 'version2', '3.0': 'version30', '3.1': 'version31', '4.0': 'version4' }[next]
		);
		finish();
	}
	function outcome(action: CvssProbe) {
		const result = current.observed[action];
		return tx.labels[
			!result
				? 'untried'
				: result === 'full'
					? 'full' + action[0].toUpperCase() + action.slice(1)
					: result
		];
	}
</script>

{#snippet icon(kind: CvssProbe)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.6"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		{#if kind === 'read'}<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h4" />
		{:else if kind === 'write'}<path d="M4 8V4h4l12 12-4 4L4 8Z" /><circle cx="8" cy="8" r="1" />
		{:else}<rect x="3" y="4" width="18" height="16" rx="3" /><path
				d="M3 9h18M7 6.5h.01M10 6.5h.01M9 14l6 4m0-4-6 4"
			/>{/if}
	</svg>
{/snippet}

<div class="cvss-play">
	<nav class="case-nav" aria-label={tx.labels.cases}>
		{#each cvssCases as id, i (id)}
			<button type="button" aria-pressed={selected === id} onclick={() => pick(id)}>
				<span class="case-number" class:done={states[id].scored} aria-hidden="true"
					>{states[id].scored ? '✓' : i + 1}</span
				>
				<span>{tx.cases[id].name}</span>
				{#if states[id].scored}<span class="sr-only">{tx.labels.tested}</span>{/if}
			</button>
		{/each}
	</nav>
	<div class="case-heading">
		<h2>{scenario.title}</h2>
		<p>{scenario.brief}</p>
	</div>
	<div class="play-layout">
		<section class="experiment" aria-label={tx.labels.probe}>
			{#if stopped}
				<div class="restore">
					<span>{tx.labels.restoreHint}</span>
					<button type="button" onclick={restore}>{tx.labels.restore}</button>
				</div>
			{/if}
			<div class="probes">
				{#each probes as action (action)}
					<button
						type="button"
						disabled={stopped}
						class:tested={current.observed[action] && current.observed[action] !== 'login'}
						class:affected={['limited', 'full'].includes(current.observed[action] ?? '')}
						onclick={() => probe(action)}
						aria-label={tx.labels[action]}
					>
						<span class="object-icon">{@render icon(action)}</span>
						<strong>{tx.labels[action]}</strong>
						<span class="outcome">{outcome(action)}</span>
					</button>
				{/each}
			</div>
			<div class="scene">
				<div class="actor client">
					<div class="phone"><Browser phase={last ? 'loaded' : 'idle'} /></div>
					<div class="actor-caption">
						<span class="overline">{tx.labels.client}</span><strong
							>{current.admin ? tx.labels.administrator : tx.labels.visitor}</strong
						>
						{#if selected === 'admin' && !current.admin}<button
								type="button"
								class="login"
								onclick={login}>{tx.labels.signIn}<span aria-hidden="true">↗</span></button
							>{/if}
					</div>
				</div>
				<div class="connection">
					<span>{tx.labels.network}</span>{#if last}{#key sequence}<i
								class="packet"
								aria-hidden="true"
							></i>{/key}{/if}
				</div>
				<div class="actor destination">
					<div class="rack"><Server active={!stopped} /></div>
					<div class="actor-caption">
						<span class="overline">{tx.labels.server}</span><strong class:down={stopped}
							>{stopped ? tx.labels.offline : tx.labels.running}</strong
						><span class="price"
							>{tx.labels.price} <b class:changed>{changed ? '1' : '25'}</b> {tx.labels.coins}</span
						>
					</div>
				</div>
				<div class="document" class:exposed={read}>
					<span class="document-icon">{@render icon('read')}</span>
					<div>
						<strong>{read && selected !== 'invoice' ? tx.labels.files : tx.labels.file}</strong>
						<p>{read ? tx.labels.invoiceData : tx.labels.sealed}</p>
					</div>
					{#if read}<span class="stamp">{tx.labels.exposed}</span>{/if}
				</div>
			</div>
			<div class="probe-response" aria-live="polite">
				{#if status}<code class:rejected={status === 'login' || status === 'denied'}
						>{status === 'login' ? '401' : status === 'denied' ? '403' : '200'}</code
					><span>{last ? outcome(last) : ''}</span>
				{:else}<span>{tx.labels.waiting}</span>{/if}
			</div>
			{#if !current.scored}
				<button type="button" class="assess" disabled={!ready} onclick={assess}
					>{tx.labels.assess}<span aria-hidden="true">→</span></button
				>
				{#if !ready}<p class="instruction">{tx.labels.collect}</p>{/if}
			{/if}
		</section>
		{#if current.scored}
			<section
				class="assessment"
				aria-label={tx.labels.compare}
				bind:this={assessmentPanel}
				tabindex="-1"
			>
				<div class="score-heading">
					<div>
						<span class="overline">CVSS {version} Base</span>
						<div class="score-number">{assessment.score.toFixed(1)}<span>/ 10</span></div>
					</div>
					<span class="severity" class:critical={assessment.level === 'critical'}
						>{tx.labels[assessment.level]}</span
					>
				</div>
				<div
					class="scale"
					role="meter"
					aria-label={tx.labels.scale}
					aria-valuemin="0"
					aria-valuemax="10"
					aria-valuenow={assessment.score}
					aria-valuetext={`${assessment.score.toFixed(1)} ${tx.labels[assessment.level]}`}
				>
					<span class="low"></span><span class="medium"></span><span
						class="high"
						class:v2={version === '2.0'}
					></span>{#if version !== '2.0'}<span class="critical"></span>{/if}<i
						style:left={`calc(${assessment.score * 10}% - 3px)`}
					></i>
				</div>
				<p class="case-result">{scenario.result}</p>
				<h3>{tx.labels.compare}</h3>
				<div class="versions" role="group" aria-label={tx.labels.compare}>
					{#each cvssVersions as v (v)}
						<button
							type="button"
							aria-pressed={version === v}
							aria-label={`CVSS ${v}`}
							onclick={() => chooseVersion(v)}
							><span>{v}</span><strong>{cvssCaseAssessment(selected, v).score.toFixed(1)}</strong
							></button
						>
					{/each}
				</div>
				<p class="version-note">{tx.versions[version]}</p>
				<p class="instruction">{tx.labels.versionHint}</p>
				<details bind:open={vectorOpen}>
					<summary>{tx.labels.vector}</summary>
					<p class="instruction">{tx.labels.vectorHint}</p>
					<div class="tokens" role="group" aria-label={tx.labels.vector}>
						{#each assessment.entries as [key, value] (key)}<button
								type="button"
								aria-pressed={metric === key}
								onclick={() => (metric = key)}><code>{key}:{value}</code></button
							>{/each}
					</div>
					<div class="metric-note" aria-live="polite">
						<strong
							>{metric} / {tx.labels[metric + '_' + metricValue] ?? tx.labels[metricValue]}</strong
						>
						<p>{tx.metrics[metric]}</p>
					</div>
					<code class="vector">{assessment.vector}</code>
					<p class="instruction">{tx.labels.assumptionText}</p>
					<a href={`https://www.first.org${references[version]}`} target="_blank" rel="noreferrer"
						>{tx.labels.source} ↗</a
					>
				</details>
				{#if selected !== 'public'}<button
						type="button"
						class="next-case"
						onclick={() => pick(cvssCases[cvssCases.indexOf(selected) + 1])}
						>{tx.labels.nextCase}<span aria-hidden="true">→</span></button
					>{/if}
			</section>
		{/if}
	</div>
	{#if allScored}<p class="completion" class:done={seenVersions.size > 1}>
			{seenVersions.size > 1 ? '✓ ' : ''}{tx.labels.complete}{#if seenVersions.size < 2}<span
					>{tx.labels.compareHint}</span
				>{/if}
		</p>{/if}
	<p class="scope">{tx.labels.scope}</p>
</div>

<style>
	.cvss-play {
		width: min(100%, 780px);
		padding: 8px 0 24px;
		color: var(--color-ink);
	}
	button {
		cursor: pointer;
		touch-action: manipulation;
	}
	button:focus-visible,
	summary:focus-visible,
	a:focus-visible {
		outline: 3px solid var(--color-brand);
		outline-offset: 3px;
	}
	button:active {
		transform: scale(0.98);
	}
	button:disabled {
		cursor: default;
		opacity: 0.5;
		transform: none;
	}
	.case-nav {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 7px;
	}
	.case-nav button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 46px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		color: var(--color-muted);
		padding: 8px;
		font-size: 12px;
		font-weight: 600;
	}
	.case-nav button[aria-pressed='true'] {
		color: var(--color-brand);
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.case-number {
		width: 22px;
		height: 22px;
		flex: none;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--color-paper);
		font-variant-numeric: tabular-nums;
	}
	.case-number.done {
		color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.case-heading {
		margin: 22px 0 18px;
		text-align: center;
	}
	h2 {
		font: 500 25px/1.2 var(--font-display);
		letter-spacing: -0.02em;
		margin: 0 0 8px;
	}
	.case-heading p {
		font-size: 13px;
		line-height: 1.65;
		color: var(--color-muted);
		max-width: 510px;
		margin: 0 auto;
	}
	.play-layout {
		display: grid;
		gap: 24px;
		align-items: start;
	}
	.experiment {
		min-width: 0;
	}
	.restore {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
		font-size: 12px;
		line-height: 1.5;
		color: var(--color-muted);
	}
	.restore button {
		flex: none;
		min-height: 44px;
		border: 1px solid var(--color-brand);
		border-radius: 12px;
		padding: 8px 12px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
		font-weight: 600;
	}
	.probes {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}
	.probes button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 7px;
		text-align: center;
		min-width: 0;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 18px;
		padding: 12px 6px;
		color: var(--color-ink);
		transition:
			background 0.18s,
			border-color 0.18s,
			transform 0.1s;
	}
	.probes button:hover {
		border-color: var(--color-brand);
	}
	.probes button.tested {
		border-color: color-mix(in srgb, var(--color-grass) 45%, var(--color-line));
	}
	.probes button.affected {
		border-color: color-mix(in srgb, var(--color-danger) 45%, var(--color-line));
		background: color-mix(in srgb, var(--color-danger) 5%, var(--color-card));
	}
	.probes strong {
		font-size: 12px;
		line-height: 1.35;
	}
	.object-icon {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: var(--color-paper);
		color: var(--color-brand);
	}
	.object-icon svg {
		width: 25px;
		height: 25px;
	}
	.outcome {
		font-size: 10px;
		color: var(--color-muted);
		line-height: 1.3;
		min-height: 2.6em;
	}
	.scene {
		margin: 20px auto 12px;
		max-width: 330px;
		padding: 0 10px;
	}
	.actor {
		display: flex;
		align-items: center;
		gap: 22px;
	}
	.phone {
		width: 64px;
		height: 102px;
		flex: none;
		overflow: visible;
		margin-left: 10px;
		margin-right: 12px;
	}
	.phone :global(.phone) {
		max-width: none;
		transform: scale(0.4);
		transform-origin: top left;
	}
	.rack {
		flex: none;
		width: 86px;
	}
	.actor-caption {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
		min-width: 0;
	}
	.actor-caption strong {
		font-size: 13px;
		line-height: 1.5;
	}
	.overline {
		font-size: 10px;
		color: var(--color-faint);
		font-weight: 600;
	}
	.login {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		margin-top: 4px;
		padding: 8px 10px;
		border: 1px solid var(--color-brand);
		border-radius: 10px;
		color: var(--color-brand);
		background: var(--color-brand-soft);
		font-size: 12px;
	}
	.connection {
		position: relative;
		height: 36px;
		margin-left: 41px;
		border-left: 2px solid var(--color-line);
		padding-left: 22px;
		display: flex;
		align-items: center;
		font-size: 10px;
		color: var(--color-muted);
	}
	.packet {
		position: absolute;
		left: -4px;
		top: 0;
		width: 6px;
		height: 9px;
		border-radius: 2px;
		background: var(--color-brand);
		animation: send 0.5s ease-out both;
	}
	@keyframes send {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(27px);
			opacity: 0;
		}
	}
	.down {
		color: var(--color-danger);
	}
	.price {
		font-size: 11px;
		color: var(--color-muted);
	}
	.price b {
		color: var(--color-ink);
		font-size: 17px;
		font-variant-numeric: tabular-nums;
	}
	.price b.changed {
		color: var(--color-danger);
	}
	.document {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px;
		border-radius: 12px;
	}
	.document.exposed {
		border-color: color-mix(in srgb, var(--color-danger) 45%, var(--color-line));
	}
	.document-icon {
		color: var(--color-muted);
		flex: none;
		width: 22px;
	}
	.document-icon svg {
		width: 22px;
		height: 26px;
	}
	.document strong {
		font-size: 11px;
	}
	.document p {
		font-size: 10px;
		color: var(--color-muted);
		margin: 3px 0 0;
	}
	.stamp {
		margin-left: auto;
		font: 10px monospace;
		color: var(--color-danger);
		white-space: nowrap;
	}
	.probe-response {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		gap: 8px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.probe-response code {
		padding: 3px 7px;
		border-radius: 6px;
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.probe-response code.rejected {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.assess,
	.next-case {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		min-height: 46px;
		border-radius: 14px;
		font-size: 13px;
		font-weight: 600;
		background: var(--color-brand);
		color: white;
		padding: 12px 16px;
		margin-top: 10px;
	}
	.instruction {
		font-size: 11px;
		line-height: 1.6;
		color: var(--color-muted);
		margin: 10px 0;
	}
	.experiment > .instruction {
		text-align: center;
	}
	.assessment {
		min-width: 0;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 24px;
		padding: 22px;
	}
	.score-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.score-number {
		font: 54px/1.1 var(--font-display);
		letter-spacing: -0.04em;
		margin-top: 4px;
	}
	.score-number > span {
		font: 12px var(--font-sans);
		color: var(--color-faint);
		letter-spacing: 0;
		margin-left: 8px;
	}
	.severity {
		padding: 6px 10px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
	}
	.severity.critical {
		color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.scale {
		position: relative;
		display: flex;
		height: 8px;
		border-radius: 5px;
		margin: 18px 0;
		isolation: isolate;
	}
	.scale span:first-child {
		border-radius: 5px 0 0 5px;
	}
	.scale span:last-of-type {
		border-radius: 0 5px 5px 0;
	}
	.scale .low {
		width: 40%;
		background: color-mix(in srgb, var(--color-grass) 32%, var(--color-card));
	}
	.scale .medium {
		width: 30%;
		background: color-mix(in srgb, var(--color-amber) 38%, var(--color-card));
	}
	.scale .high {
		width: 20%;
		background: color-mix(in srgb, var(--color-danger) 40%, var(--color-card));
	}
	.scale .high.v2 {
		width: 30%;
	}
	.scale .critical {
		width: 10%;
		background: var(--color-danger);
	}
	.scale i {
		position: absolute;
		top: -4px;
		width: 6px;
		height: 16px;
		border-radius: 4px;
		background: var(--color-ink);
		box-shadow: 0 0 0 2px var(--color-card);
		transition: left 0.35s ease;
	}
	.case-result {
		font-size: 13px;
		line-height: 1.65;
		color: var(--color-muted);
		margin: 0 0 20px;
	}
	h3 {
		font-size: 12px;
		font-weight: 600;
		margin: 0 0 10px;
	}
	.versions {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 7px;
	}
	.versions button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 10px 4px;
		min-height: 64px;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-paper);
		color: var(--color-muted);
	}
	.versions button[aria-pressed='true'] {
		border-color: var(--color-brand);
		color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.versions span {
		font-size: 10px;
	}
	.versions strong {
		font: 23px var(--font-display);
	}
	.version-note {
		font-size: 12px;
		line-height: 1.65;
		margin: 14px 0 0;
	}
	details {
		border-top: 1px solid var(--color-line);
		margin-top: 18px;
		padding-top: 8px;
	}
	summary {
		font-size: 12px;
		font-weight: 600;
		min-height: 44px;
		padding: 14px 0;
		cursor: pointer;
		color: var(--color-brand);
	}
	.tokens {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.tokens button {
		font-size: 12px;
		min-height: 40px;
		padding: 6px 10px;
		border: 1px solid var(--color-line);
		border-radius: 8px;
		background: var(--color-paper);
	}
	.tokens button[aria-pressed='true'] {
		background: var(--color-brand-soft);
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.metric-note {
		margin-top: 12px;
		padding: 12px;
		border-radius: 12px;
		background: var(--color-paper);
		font-size: 12px;
		line-height: 1.6;
	}
	.metric-note p {
		margin: 6px 0 0;
		color: var(--color-muted);
	}
	.vector {
		display: block;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
		font: 11px/1.7 monospace;
		margin: 14px 0;
	}
	a {
		display: inline-block;
		color: var(--color-brand);
		font-size: 11px;
		text-decoration: underline;
		text-underline-offset: 3px;
		padding: 8px 0;
	}
	.next-case {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.scope {
		max-width: 580px;
		margin: 18px auto 0;
		text-align: center;
		font-size: 10px;
		line-height: 1.6;
		color: var(--color-faint);
	}
	.completion {
		display: flex;
		flex-direction: column;
		gap: 6px;
		text-align: center;
		font-size: 13px;
		margin: 20px 0;
	}
	.completion.done {
		color: var(--color-grass);
	}
	.completion span {
		font-size: 12px;
		color: var(--color-muted);
	}
	@media (min-width: 720px) {
		.play-layout:has(.assessment) {
			grid-template-columns: 1fr 1fr;
		}
		.experiment {
			max-width: 380px;
			width: 100%;
			margin-inline: auto;
		}
	}
	@media (max-width: 359px) {
		.case-nav button {
			gap: 5px;
			font-size: 11px;
			padding: 7px 3px;
		}
		.case-number {
			width: 19px;
			height: 19px;
		}
		.assessment {
			padding: 16px;
		}
		.probes strong {
			font-size: 11px;
		}
	}
	@media (max-width: 719px) {
		.case-heading {
			margin: 14px 0 12px;
		}
		.probes button {
			padding: 8px 6px;
			gap: 5px;
		}
		.object-icon {
			width: 28px;
			height: 28px;
		}
		.scene {
			margin-top: 12px;
		}
		.phone {
			width: 44px;
			height: 70px;
			margin-right: 12px;
		}
		.phone :global(.phone) {
			transform: scale(0.28);
		}
		.rack {
			width: 66px;
			height: 66px;
		}
		.rack :global(.server) {
			transform: scale(0.76);
			transform-origin: top left;
		}
		.connection {
			height: 22px;
			margin-left: 32px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.packet {
			animation: none;
			display: none;
		}
		.scale i,
		.probes button {
			transition: none;
		}
		button:active {
			transform: none;
		}
	}
</style>

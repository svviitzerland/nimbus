<script lang="ts">
	// Guided phishing lesson. A pretend mail app shows one new email. Nim reads it like a
	// detective and the three clues light up by themselves, beat by beat (the sender, the
	// pressure, the link). The only optional play, on the last beat, is flipping to a genuine
	// nimbus.com email to compare. Nothing here is a real link, the button is only a picture.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { PhishingKind, PhishingText } from '$lib/chapters/security/phishing/types';
	import { guided } from './attacks2/guided.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as PhishingText);

	const g = guided({
		beat: () => beat,
		last: () => tx.steps.length - 1,
		onshow: (v) => onshow?.(v),
		oncomplete: () => oncomplete?.()
	});
	const step = $derived(g.step);
	const last = $derived(tx.steps.length - 1);

	const KINDS: PhishingKind[] = ['fake', 'real'];
	let pick = $state<PhishingKind>('fake');
	function choose(k: PhishingKind) {
		pick = k;
		onstate?.(k);
	}

	const kind = $derived<PhishingKind>(step === last ? pick : 'fake');
	const mail = $derived(tx.emails[kind]);
	const clue = $derived(tx.clues[kind]);

	// Clues light up one after another and stay lit, the newest one in focus.
	const showSender = $derived(step >= 3);
	const showUrgency = $derived(step >= 4);
	const showLink = $derived(step >= 5);
	const focus = $derived(step === 3 ? 'sender' : step === 4 ? 'urgency' : step === 5 ? 'link' : '');

	/** Splits an address so the true owner (the name right before the first slash) stands out. */
	const link = $derived.by(() => {
		const host = mail.url.split('/')[0];
		const owner = host.split('.').slice(-2).join('.');
		return {
			before: host.slice(0, host.length - owner.length),
			owner,
			after: mail.url.slice(host.length)
		};
	});
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="pick" role="group" aria-label={tx.pickLabel}>
				<span class="cap">{tx.pickLabel}</span>
				<div class="chips">
					{#each KINDS as k (k)}
						<button
							type="button"
							class="chip {k}"
							class:on={pick === k}
							aria-pressed={pick === k}
							onclick={() => choose(k)}>{tx.modes[k]}</button
						>
					{/each}
				</div>
			</div>
		{/if}

		<div class="mail {kind}" aria-label={tx.inboxLabel}>
			<div class="bar">
				<span class="dot"></span><span class="dot"></span><span class="dot"></span>
				<span class="barT">{tx.inboxLabel}</span>
			</div>

			{#if i === 0}
				<ul class="inbox">
					<li class="row new">
						<span class="unread"></span>
						<span class="rFrom">{tx.emails.fake.fromName}</span>
						<span class="rSub">{tx.emails.fake.subject}</span>
					</li>
					{#each tx.olderRows as r (r.from)}
						<li class="row">
							<span class="unread off"></span>
							<span class="rFrom">{r.from}</span>
							<span class="rSub">{r.subject}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="body">
					{#if i === 2}<div class="scan" aria-hidden="true"></div>{/if}
					<div class="head">
						<span class="avatar">{mail.fromName.charAt(0).toUpperCase()}</span>
						<div class="who">
							<div class="fromName">{mail.fromName}</div>
							<div class="fromAddr">
								<span class="mark" class:lit={showSender} class:focus={focus === 'sender'}
									>{mail.fromAddr}</span
								>
								{#if showSender}<span class="clue">{clue.sender}</span>{/if}
							</div>
						</div>
						<span class="time">{mail.time}</span>
					</div>
					<h4 class="subject">{mail.subject}</h4>
					<p class="text">{mail.body}</p>
					{#if mail.urgent}
						<p class="text">
							<span class="mark" class:lit={showUrgency} class:focus={focus === 'urgency'}
								>{mail.urgent}</span
							>
							{#if showUrgency}<span class="clue">{clue.urgency}</span>{/if}
						</p>
					{:else if showUrgency}
						<p class="text"><span class="clue">{clue.urgency}</span></p>
					{/if}
					<div class="ctaRow">
						<span class="cta" class:hover={showLink} class:focus={focus === 'link'}>{mail.cta}</span
						>
						{#if showLink}
							<div class="tip">
								<span class="tipCap">{tx.goesTo}</span>
								<span class="url">{link.before}<b class="owner">{link.owner}</b>{link.after}</span>
								<span class="clue">{clue.link}</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		{#if i === 6}
			<p class="rule">{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={g.select} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.pick {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}
	.chip.fake.on {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.chip.real.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.rule {
		margin: 0;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 5px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-grass);
		text-align: center;
	}

	/* ---- the mail app ---- */
	.mail {
		--clue: var(--color-danger);
		--clue-soft: var(--color-danger-soft);
		width: 100%;
		max-width: 440px;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		box-shadow: 0 10px 28px rgba(22, 40, 60, 0.08);
	}
	.mail.real {
		--clue: var(--color-grass);
		--clue-soft: var(--color-grass-soft);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 6px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 9px 14px;
	}
	.dot {
		height: 9px;
		width: 9px;
		border-radius: 999px;
		background: var(--color-line);
	}
	.barT {
		margin-left: 8px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.inbox {
		margin: 0;
		padding: 6px 0;
		list-style: none;
	}
	.row {
		display: grid;
		grid-template-columns: 10px minmax(0, 0.9fr) minmax(0, 1.3fr);
		align-items: center;
		gap: 10px;
		padding: 11px 16px;
		font-size: 13px;
		color: var(--color-muted);
	}
	.row + .row {
		border-top: 1px solid var(--color-line);
	}
	.row.new {
		color: var(--color-ink);
		font-weight: 700;
		animation: land 0.7s cubic-bezier(0.2, 0.8, 0.3, 1) both;
	}
	@keyframes land {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
	}
	.rFrom,
	.rSub {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.unread {
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background: var(--color-brand);
		animation: pulse 1.6s ease-in-out infinite;
	}
	.unread.off {
		visibility: hidden;
	}
	@keyframes pulse {
		50% {
			opacity: 0.3;
		}
	}

	.body {
		position: relative;
		padding: 16px 18px 18px;
	}
	.scan {
		position: absolute;
		inset: 0 0 auto;
		height: 40px;
		background: linear-gradient(
			to bottom,
			transparent,
			color-mix(in srgb, var(--color-brand) 14%, transparent),
			transparent
		);
		animation: scan 2.6s ease-in-out infinite;
		pointer-events: none;
	}
	@keyframes scan {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(260px);
		}
	}
	.head {
		display: flex;
		align-items: flex-start;
		gap: 10px;
	}
	.avatar {
		display: grid;
		height: 34px;
		width: 34px;
		flex: none;
		place-items: center;
		border-radius: 999px;
		background: var(--color-brand-soft);
		font-weight: 800;
		color: var(--color-brand);
	}
	.who {
		min-width: 0;
		flex: 1;
	}
	.fromName {
		font-size: 14px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.fromAddr {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin-top: 2px;
		font-size: 12.5px;
		color: var(--color-muted);
	}
	.time {
		font-size: 12px;
		color: var(--color-faint);
	}
	.subject {
		margin: 14px 0 6px;
		font-size: 16px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.text {
		margin: 0 0 10px;
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--color-muted);
	}
	.mark {
		border-radius: 5px;
		padding: 1px 3px;
		transition:
			background 0.4s,
			box-shadow 0.4s,
			color 0.4s;
	}
	.mark.lit {
		background: var(--clue-soft);
		color: var(--color-ink);
	}
	.mark.focus {
		box-shadow: 0 0 0 2px var(--clue);
	}
	.clue {
		display: inline-block;
		border-radius: 999px;
		background: var(--clue);
		padding: 2px 8px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.03em;
		color: #fff;
		animation: pop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.7);
		}
	}
	.ctaRow {
		position: relative;
		margin-top: 6px;
	}
	.cta {
		display: inline-block;
		border-radius: 10px;
		background: var(--color-brand);
		padding: 8px 18px;
		font-size: 13.5px;
		font-weight: 700;
		color: #fff;
		transition: box-shadow 0.3s;
	}
	.cta.focus {
		box-shadow: 0 0 0 3px var(--clue-soft);
	}
	.tip {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin-top: 10px;
		border-radius: 10px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 8px 10px;
		animation: pop 0.4s ease both;
	}
	.tipCap {
		width: 100%;
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.url {
		overflow-wrap: anywhere;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		color: var(--color-muted);
	}
	.owner {
		color: var(--clue);
	}

	@media (prefers-reduced-motion: reduce) {
		.row.new,
		.unread,
		.scan,
		.clue,
		.tip {
			animation: none;
		}
		.scan {
			display: none;
		}
		.mark,
		.cta,
		.chip {
			transition: none;
		}
	}
</style>

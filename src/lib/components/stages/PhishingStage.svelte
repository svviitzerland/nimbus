<script lang="ts">
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { PhishingEmailId, PhishingText } from '$lib/chapters/security/phishing/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as PhishingText);

	type Clue = 'sender' | 'link' | 'urgency' | null;
	// Which emails are fakes, and the clue that gives each one away.
	const EMAILS: { id: PhishingEmailId; fake: boolean; clue: Clue }[] = [
		{ id: 'invoice', fake: false, clue: null },
		{ id: 'lookalike', fake: true, clue: 'sender' },
		{ id: 'reset', fake: true, clue: 'link' },
		{ id: 'boss', fake: true, clue: 'urgency' },
		{ id: 'signin', fake: false, clue: null }
	];

	let idx = $state(0);
	let peeked = $state(false);
	let picked = $state<'' | 'real' | 'fake'>('');
	let results = $state<Partial<Record<PhishingEmailId, boolean>>>({});
	let finished = $state(false);
	let peekedOnce = false;
	let completed = false;

	const cur = $derived(EMAILS[idx]);
	const mail = $derived(tx.emails[cur.id]);
	const revealed = $derived(picked !== '');
	const right = $derived(picked !== '' && (picked === 'fake') === cur.fake);
	const score = $derived(Object.values(results).filter(Boolean).length);

	// Split an address into the disguise and the part that really names the site.
	const host = $derived(mail.url.split('/')[0]);
	const path = $derived(mail.url.slice(host.length));
	const hostParts = $derived.by(() => {
		const labels = host.split('.');
		const main = labels.slice(-2).join('.');
		const lead = labels.length > 2 ? labels.slice(0, -2).join('.') + '.' : '';
		return { lead, main };
	});

	function peek() {
		if (peeked) return;
		peeked = true;
		if (!peekedOnce) {
			peekedOnce = true;
			onstate?.('peek');
		}
	}

	function judge(choice: 'real' | 'fake') {
		if (picked) return;
		picked = choice;
		peeked = true;
		const ok = (choice === 'fake') === cur.fake;
		results[cur.id] = ok;
		onstate?.(`${cur.id}${ok ? 'Right' : 'Wrong'}`);
	}

	function next() {
		if (idx === EMAILS.length - 1) {
			finished = true;
			onstate?.('done');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
			return;
		}
		idx += 1;
		picked = '';
		peeked = false;
	}

	function again() {
		idx = 0;
		picked = '';
		peeked = false;
		results = {};
		finished = false;
	}

	const fill = (s: string, n: number) =>
		s.replace('{n}', String(n)).replace('{total}', String(EMAILS.length));
	const flag = (c: Clue) => revealed && cur.clue === c;
</script>

<div class="wrap">
	<p class="safe">{tx.safeNote}</p>

	<!-- actions, kept up top and clear of Nim -->
	<div class="btns">
		{#if finished}
			<CallToActionButton onclick={again}>
				{tx.again}
			</CallToActionButton>
		{:else if !revealed}
			<button type="button" class="pick real" onclick={() => judge('real')}>{tx.markReal}</button>
			<button type="button" class="pick fake" onclick={() => judge('fake')}>{tx.markFake}</button>
		{:else}
			<span class="verdict" class:good={right}>{right ? tx.verdictRight : tx.verdictWrong}</span>
			<CallToActionButton onclick={next}>
				{tx.nextEmail}
			</CallToActionButton>
		{/if}
	</div>

	{#if !finished}
		<p class="counter">{fill(tx.counter, idx + 1)}</p>

		{#key cur.id}
			<article class="mail pop">
				<header class="head">
					<span class="avatar">{mail.fromName.charAt(0)}</span>
					<div class="from">
						<span class="fname">{mail.fromName}</span>
						<span class="faddr" class:bad={flag('sender')} class:okc={revealed && !cur.fake}
							>{mail.fromAddr}</span
						>
					</div>
					<span class="time">{mail.time}</span>
				</header>
				<p class="subject">{mail.subject}</p>
				<p class="body">
					{mail.body}
					{#if mail.urgent}
						<span class="urgent" class:bad={flag('urgency')}>{mail.urgent}</span>
					{/if}
				</p>

				<button type="button" class="incta" onclick={peek} title={tx.peek}>{mail.cta}</button>

				<div class="peekrow">
					{#if !peeked}
						<button type="button" class="peek" onclick={peek}>{tx.peek}</button>
					{:else if mail.url}
						<p class="where pop" class:bad={flag('link')} class:okc={revealed && !cur.fake}>
							<span class="wlabel">{tx.peekLabel}</span>
							<span class="url"
								><span class="lead">{hostParts.lead}</span><b>{hostParts.main}</b><span class="lead"
									>{path}</span
								></span
							>
						</p>
					{:else}
						<p class="where pop"><span class="wlabel">{tx.noLink}</span></p>
					{/if}
				</div>

				{#if revealed}
					<div class="tags pop">
						<span class="tag" class:fake={cur.fake}>{cur.fake ? tx.fakeTag : tx.realTag}</span>
						<span class="clue">{cur.clue ? tx.clues[cur.clue] : tx.clues.none}</span>
					</div>
				{/if}
			</article>
		{/key}
	{:else}
		<div class="summary pop">
			<p class="shead">{tx.inboxLabel}</p>
			{#each EMAILS as e (e.id)}
				<div class="srow">
					<span class="mark" class:good={results[e.id]}>{results[e.id] ? '✓' : '✗'}</span>
					<span class="stext">
						<b>{tx.emails[e.id].fromName}</b>
						<span>{tx.emails[e.id].subject}</span>
					</span>
					<span class="tag" class:fake={e.fake}>{e.fake ? tx.fakeTag : tx.realTag}</span>
				</div>
			{/each}
			<p class="score">{fill(tx.scoreLabel, score)}</p>
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.safe {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.btns {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 10px;
		min-height: 46px;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.pick {
		min-width: 120px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.pick.real:hover {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.pick.fake:hover {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.verdict {
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 12px;
		font-weight: 800;
		padding: 4px 12px;
	}
	.verdict.good {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.counter {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}

	/* the email */
	.mail {
		display: flex;
		width: min(92vw, 360px);
		flex-direction: column;
		gap: 8px;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
	}
	.head {
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.avatar {
		display: grid;
		flex: none;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--color-brand-soft);
		color: var(--color-brand);
		font-size: 13px;
		font-weight: 800;
	}
	.from {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
	}
	.fname {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.faddr {
		overflow-wrap: anywhere;
		border-radius: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		color: var(--color-muted);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.time {
		align-self: flex-start;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.subject {
		font-family: var(--font-display);
		font-size: 15px;
		color: var(--color-ink);
	}
	.body {
		font-size: 12px;
		line-height: 1.5;
		color: var(--color-muted);
	}
	.urgent {
		font-weight: 700;
		color: var(--color-ink);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger) !important;
	}
	.okc {
		background: var(--color-grass-soft);
		color: var(--color-grass) !important;
	}
	.incta {
		align-self: flex-start;
		border-radius: 9px;
		background: var(--color-brand);
		color: #fff;
		padding: 7px 14px;
		font-size: 12px;
		font-weight: 700;
	}
	.peekrow {
		min-height: 34px;
	}
	.peek {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-brand);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.where {
		display: flex;
		flex-direction: column;
		gap: 1px;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 5px 9px;
	}
	.wlabel {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.url {
		overflow-wrap: anywhere;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.where.bad .url,
	.where.okc .url {
		color: inherit;
	}
	.lead {
		opacity: 0.6;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}
	.tag {
		flex: none;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 10px;
		font-weight: 800;
		padding: 2px 9px;
	}
	.tag.fake {
		background: var(--color-danger);
		color: #fff;
	}
	.clue {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}

	/* the sorted inbox */
	.summary {
		display: flex;
		width: min(92vw, 360px);
		flex-direction: column;
		gap: 6px;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
	}
	.shead {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.srow {
		display: flex;
		align-items: center;
		gap: 8px;
		border-top: 1px solid var(--color-line);
		padding-top: 6px;
	}
	.mark {
		display: grid;
		flex: none;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 10px;
		font-weight: 800;
	}
	.mark.good {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.stext {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		font-size: 11px;
		color: var(--color-muted);
	}
	.stext b {
		color: var(--color-ink);
	}
	.score {
		margin-top: 2px;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}

	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.96);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			gap: 14px;
		}
		.btns :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.pick {
			font-size: 14px;
			padding: 12px 20px;
		}
		.mail,
		.summary {
			width: 440px;
			padding: 16px 18px;
		}
		.fname {
			font-size: 14px;
		}
		.faddr {
			font-size: 12px;
		}
		.subject {
			font-size: 18px;
		}
		.body {
			font-size: 13.5px;
		}
		.url {
			font-size: 13px;
		}
		.stext {
			font-size: 12.5px;
		}
	}
</style>

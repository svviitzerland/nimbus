<script lang="ts">
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import ActRow from './secbasics/ActRow.svelte';
	import { sha256 } from './secbasics/sha256';
	import type { LessonText } from '$lib/chapters/types';
	import type { HashingText } from '$lib/chapters/security/hashing/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as HashingText);

	const MIN = 4;
	// What an attacker's lookup table would hold, the most common passwords, hashed in advance.
	const common = [
		'123456',
		'password',
		'123456789',
		'qwerty',
		'12345678',
		'111111',
		'iloveyou',
		'admin',
		'sayang',
		'nimbus123',
		'abc123',
		'password1',
		'1234',
		'12345'
	];
	const commonHashes = new Set(common.map((p) => sha256(p)));
	const short = (h: string, n = 14) => h.slice(0, n) + '…';

	let act = $state(0);
	const actDone = $state([false, false]);
	let completed = false;

	// act 1
	let pw = $state('');
	let typedOnce = false;
	let registered = $state(false);
	let leaked = $state(false);
	const pwHash = $derived(pw ? sha256(pw) : '');
	const weak = $derived(commonHashes.has(pwHash));

	function onInput() {
		if (!typedOnce && pw.length >= MIN) {
			typedOnce = true;
			onstate?.('typed');
		}
	}
	function register() {
		registered = true;
		onstate?.('registered');
	}
	function leak() {
		leaked = true;
		actDone[0] = true;
		onstate?.(weak ? 'leakedWeak' : 'leaked');
	}

	// act 2. phase 0 no salt, 1 lookup ran, 2 salted, 3 lookup ran on salted
	let phase = $state(0);
	const users = [
		{ name: 'Budi', pw: '123456', salt: 'q7Lx' },
		{ name: 'Sari', pw: '123456', salt: 'Zp2m' },
		{ name: 'Wati', pw: 'kopiHujanSenja7', salt: 'r9Ke' }
	];
	const salted = $derived(phase >= 2);
	const rows = $derived(
		users.map((u) => {
			const h = sha256(salted ? u.salt + u.pw : u.pw);
			return { ...u, hash: h, cracked: commonHashes.has(h) };
		})
	);
	const ran = $derived(phase === 1 || phase === 3);
	const tablePreview = common.slice(0, 4).map((p) => ({ p, h: sha256(p) }));

	function runLookup() {
		phase += 1;
		if (phase === 1) onstate?.('lookup');
		if (phase === 3) {
			onstate?.('salted');
			actDone[1] = true;
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		}
	}
	function addSalt() {
		phase = 2;
	}
</script>

<div class="wrap">
	<ActRow
		names={tx.acts}
		current={act}
		done={actDone}
		label={tx.actLabel.replace('{n}', String(act + 1))}
	/>

	{#if act === 0}
		<!-- the password box and its live fingerprint -->
		<div class="pwbox">
			<label class="plabel" for="nimbus-pw">{tx.pwLabel}</label>
			<input
				id="nimbus-pw"
				class="pw"
				type="text"
				autocomplete="off"
				spellcheck="false"
				maxlength="24"
				placeholder={tx.pwPlaceholder}
				disabled={registered}
				bind:value={pw}
				oninput={onInput}
			/>
			<p class="live">
				<span class="hl">{tx.hashLabel}</span>
				<code>{pwHash ? short(pwHash, 24) : '…'}</code>
			</p>
		</div>

		<div class="btns">
			{#if !registered}
				<CallToActionButton onclick={register} disabled={pw.length < MIN}>
					{tx.registerBtn}
				</CallToActionButton>
			{:else if !leaked}
				<CallToActionButton onclick={leak}>
					{tx.leakBtn}
				</CallToActionButton>
			{:else}
				<CallToActionButton onclick={() => (act = 1)}>
					{tx.nextAct}
				</CallToActionButton>
			{/if}
		</div>
		{#if !registered && pw.length < MIN}
			<p class="need">{tx.tooShort.replace('{n}', String(MIN - pw.length))}</p>
		{/if}

		<!-- the two shops and what their databases hold -->
		<div class="shops">
			{#each ['careless', 'nimbus'] as shop (shop)}
				{@const plain = shop === 'careless'}
				<div class="shop" class:leak={leaked}>
					<div class="shead">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<ellipse cx="12" cy="6" rx="7" ry="2.8" stroke="currentColor" stroke-width="2" />
							<path
								d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8"
								stroke="currentColor"
								stroke-width="2"
							/>
						</svg>
						<b>{plain ? tx.carelessName : tx.nimbusName}</b>
						{#if leaked}<span class="ltag pop">{tx.leakedTag}</span>{/if}
					</div>
					<span class="ssub">{plain ? tx.carelessSub : tx.nimbusSub}</span>
					<div class="tbl">
						<span class="th">{tx.colUser}</span>
						<span class="th">{tx.colPassword}</span>
						{#if registered}
							<span class="td pop">{tx.youUser}</span>
							<span class="td pop mono" class:plain>{plain ? pw : short(pwHash, 10)}</span>
						{:else}
							<span class="td faint">{tx.emptyRow}</span>
							<span class="td faint"></span>
						{/if}
					</div>
					{#if leaked}
						<p class="att pop" class:bad={plain || weak} class:good={!plain && !weak}>
							{plain ? tx.attackerReads : weak ? tx.attackerCracked : tx.attackerStuck}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="btns">
			{#if phase === 0 || phase === 2}
				<CallToActionButton onclick={runLookup}>
					{tx.runLookup}
				</CallToActionButton>
			{:else if phase === 1}
				<CallToActionButton onclick={addSalt}>
					{tx.addSalt}
				</CallToActionButton>
			{/if}
		</div>

		<!-- the leaked users -->
		<div class="card">
			<p class="ctitle">{salted ? tx.usersTitleSalted : tx.usersTitle}</p>
			{#each rows as r (r.name)}
				<div class="urow" class:cracked={ran && r.cracked} class:safe={ran && !r.cracked}>
					<span class="uname">{r.name}</span>
					<span class="uhash mono">
						{#if salted}<span class="salt">{tx.saltLabel} {r.salt}</span>{/if}
						{#key r.hash}<span class="pop">{short(r.hash, salted ? 10 : 14)}</span>{/key}
					</span>
					<span class="utag">
						{#if ran}
							<span class="pop">
								{r.cracked ? `${tx.crackedTag}, ${r.pw}` : tx.safeTag}
							</span>
						{/if}
					</span>
				</div>
			{/each}
		</div>

		<!-- the attacker's ready made table -->
		<div class="card table">
			<p class="ctitle">{tx.lookupTitle}</p>
			<p class="csub">{tx.lookupSub}</p>
			{#each tablePreview as t (t.p)}
				<div class="lrow mono" class:match={ran && rows.some((r) => r.cracked && r.hash === t.h)}>
					<span>{short(t.h, 14)}</span>
					<span class="lp">{t.p}</span>
				</div>
			{/each}
			<div class="lrow mono more"><span>…</span><span class="lp">…</span></div>
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 380px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		overflow-y: auto;
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.pwbox {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.plabel {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.pw {
		width: 100%;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 15px;
		padding: 8px 12px;
		outline: none;
	}
	.pw:focus {
		border-color: var(--color-brand);
	}
	.pw:disabled {
		opacity: 0.7;
	}
	.live {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
	}
	.hl {
		border-radius: 999px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
		font-size: 9.5px;
		font-weight: 800;
		padding: 1px 7px;
	}
	.live code {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.btns {
		display: flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.need {
		margin-top: -6px;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.shops {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.shop,
	.card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 4px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 10px;
		transition: border-color 0.3s;
	}
	.shop.leak {
		border-color: var(--color-danger);
	}
	.shead {
		display: flex;
		align-items: center;
		gap: 5px;
		color: var(--color-muted);
		font-size: 11.5px;
	}
	.shead b {
		color: var(--color-ink);
		font-weight: 800;
	}
	.ltag {
		margin-left: auto;
		border-radius: 999px;
		background: var(--color-danger);
		color: #fff;
		font-size: 8.5px;
		font-weight: 800;
		padding: 1px 6px;
	}
	.ssub {
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.tbl {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 2px 8px;
		border-radius: 8px;
		background: var(--color-paper);
		padding: 5px 7px;
	}
	.th {
		font-size: 8.5px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.td {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 11px;
		color: var(--color-ink);
	}
	.td.plain {
		color: var(--color-danger);
		font-weight: 700;
	}
	.td.faint {
		color: var(--color-faint);
	}
	.att {
		font-size: 10.5px;
		font-weight: 700;
		line-height: 1.3;
	}
	.att.bad {
		color: var(--color-danger);
	}
	.att.good {
		color: var(--color-grass);
	}
	.card {
		width: 100%;
	}
	.ctitle {
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.csub {
		margin-top: -3px;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.urow {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr) auto;
		align-items: center;
		gap: 6px;
		border-radius: 8px;
		padding: 4px 6px;
		background: var(--color-paper);
		transition: background 0.3s;
	}
	.urow.cracked {
		background: var(--color-danger-soft);
	}
	.urow.safe {
		background: var(--color-grass-soft);
	}
	.uname {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.uhash {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 5px;
		overflow: hidden;
		white-space: nowrap;
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.salt {
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 9px;
		font-weight: 800;
		padding: 0 6px;
	}
	.utag {
		font-size: 9.5px;
		font-weight: 800;
		white-space: nowrap;
	}
	.urow.cracked .utag {
		color: var(--color-danger);
	}
	.urow.safe .utag {
		color: var(--color-grass);
	}
	.lrow {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		border-radius: 6px;
		padding: 2px 6px;
		font-size: 10.5px;
		color: var(--color-muted);
		transition: background 0.3s;
	}
	.lrow.match {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-weight: 700;
	}
	.lp {
		color: var(--color-ink);
	}
	.lrow.match .lp {
		color: var(--color-danger);
	}
	.lrow.more {
		color: var(--color-faint);
	}
	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
			gap: 12px;
		}
		.btns :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.td,
		.uname {
			font-size: 12px;
		}
		.att {
			font-size: 11.5px;
		}
	}
</style>

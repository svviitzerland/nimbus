<script lang="ts">
	// A guided "watch" stage for prompting. One chat window with an AI. A vague prompt types
	// itself and gets a bland answer, the AI's open questions pop up beside it, then the prompt
	// grows one ingredient per beat (task, context, format, example). Each new line types itself,
	// the AI thinks, and the answer comes back better, while the open questions disappear. The
	// only optional play is tapping a prompt line on the last beat to take it out or put it back.
	import { fade, scale } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { PromptKey, PromptingText } from '$lib/chapters/ai/prompting/types';
	import { sceneClock } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as PromptingText);

	type Scene = 'write' | 'gaps' | 'task' | 'context' | 'format' | 'example' | 'remember' | 'try';
	const SCENES: Scene[] = [
		'write',
		'gaps',
		'task',
		'context',
		'format',
		'example',
		'remember',
		'try'
	];
	// nine beats, eight scenes (the fyi beat keeps the remember picture)
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 7];
	const KEYS: PromptKey[] = ['task', 'context', 'format', 'example'];
	const ON_IN: Record<Scene, PromptKey[]> = {
		write: [],
		gaps: [],
		task: ['task'],
		context: ['task', 'context'],
		format: ['task', 'context', 'format'],
		example: KEYS,
		remember: KEYS,
		try: KEYS
	};
	const TYPE_MS = 22;
	const THINK_MS = 1000;

	let peek = $state<number | null>(null);
	let tryOn = $state<Record<PromptKey, boolean>>({
		task: true,
		context: true,
		format: true,
		example: true
	});
	let last = $state<{ key: PromptKey; on: boolean } | null>(null);
	let toggles = $state(0);

	const active = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, toggles]);
	const t = $derived(clock.t);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const isKey = (s: string): s is PromptKey => (KEYS as string[]).includes(s);
	const onKeys = $derived(scene === 'try' ? KEYS.filter((k) => tryOn[k]) : ON_IN[scene]);

	// the line that types itself in this scene, if any
	const fresh = $derived<PromptKey | 'base' | null>(
		scene === 'write'
			? 'base'
			: isKey(scene)
				? scene
				: scene === 'try' && last?.on
					? last.key
					: null
	);
	// what the prompt held just before, so the old answer can stay until the new one arrives
	const before = $derived<PromptKey[] | null>(
		scene === 'write'
			? null
			: fresh && fresh !== 'base'
				? onKeys.filter((k) => k !== fresh)
				: scene === 'try' && last && !last.on
					? KEYS.filter((k) => tryOn[k] || k === last?.key)
					: onKeys
	);
	const freshText = $derived(
		fresh === 'base' ? tx.basePrompt : fresh ? tx.ingredients[fresh].line : ''
	);
	const animated = $derived(scene === 'write' || isKey(scene) || (scene === 'try' && toggles > 0));
	const typeEnd = $derived(fresh && animated ? 300 + freshText.length * TYPE_MS : 0);
	const typed = $derived(
		fresh && animated ? Math.max(0, Math.floor((t - 300) / TYPE_MS)) : Number.MAX_SAFE_INTEGER
	);
	const ready = $derived(!animated || t >= typeEnd + THINK_MS);
	const thinking = $derived(animated && t >= typeEnd + 150 && !ready);

	type Line = { key: PromptKey | 'base'; tag: string | null; text: string; on: boolean };
	const lines = $derived.by<Line[]>(() => {
		if (scene === 'try') {
			return KEYS.map((k) => ({
				key: k,
				tag: tx.ingredients[k].chip,
				text: tx.ingredients[k].line,
				on: tryOn[k]
			}));
		}
		const out: Line[] = [
			onKeys.includes('task')
				? { key: 'task', tag: tx.ingredients.task.chip, text: tx.ingredients.task.line, on: true }
				: { key: 'base', tag: null, text: tx.basePrompt, on: true }
		];
		for (const k of KEYS.slice(1)) {
			if (onKeys.includes(k))
				out.push({ key: k, tag: tx.ingredients[k].chip, text: tx.ingredients[k].line, on: true });
		}
		return out;
	});

	/** The caption the AI writes for a given set of ingredients. */
	function compose(keys: PromptKey[]) {
		const a = tx.answer;
		const has = (k: PromptKey) => keys.includes(k);
		const open = has('task')
			? has('example')
				? a.openStyle
				: has('context')
					? a.openContext
					: a.openTask
			: has('context')
				? a.openContext
				: a.openVague;
		const body = has('task') ? (has('context') ? a.bodyContext : a.bodyTask) : a.bodyVague;
		const out = [open, body];
		if (!has('format')) out.push(a.ramble);
		if (has('example')) out.push(a.signoff);
		const tags = has('format') ? a.tagsOne : has('task') ? a.tagsMany : a.tagsVague;
		const n = keys.length;
		return { lines: out, tags, grade: n === 0 ? 0 : n === 4 ? 2 : 1 };
	}
	const shown = $derived(ready ? compose(onKeys) : before ? compose(before) : null);
	const shownKeys = $derived(ready ? onKeys : (before ?? []));

	// the AI's open questions, they pop in on the gaps scene and vanish as ingredients arrive
	const questionOn = (k: PromptKey, i: number) => {
		if (scene === 'write') return false;
		if (shownKeys.includes(k)) return false;
		if (scene === 'gaps') return t > 500 + i * 550;
		return true;
	};

	function toggle(k: PromptKey) {
		if (scene !== 'try') return;
		const on = !tryOn[k];
		tryOn[k] = on;
		last = { key: k, on };
		toggles += 1;
		if (!on) onstate?.(`off_${k}`);
		else onstate?.(KEYS.every((x) => tryOn[x]) ? 'full' : 'back');
	}
	const GRADE_CLASS = ['bad', 'mid', 'good'];
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<p class="hint">{tx.tryHint}</p>
		{/if}

		<div class="window" role="img" aria-label={tx.picture}>
			<div class="bar">
				<i></i><i></i><i></i>
				<span>{tx.appTitle}</span>
			</div>

			<div class="thread">
				<!-- the prompt -->
				<div class="msg you">
					<span class="who">{tx.you}</span>
					{#each lines as l (l.key)}
						{#if scene === 'try'}
							<button
								type="button"
								class="line tap"
								class:off={!l.on}
								aria-pressed={l.on}
								onclick={() => toggle(l.key as PromptKey)}
							>
								<span class="chip">{l.tag}</span>
								<span class="txt">{l.text}</span>
							</button>
						{:else}
							<p class="line" in:fade={{ duration: clock.reduced ? 0 : 250 }}>
								{#if l.tag}<span class="chip">{l.tag}</span>{/if}
								<span class="txt"
									>{l.key === fresh && animated
										? l.text.slice(0, typed)
										: l.text}{#if l.key === fresh && animated && typed < l.text.length}<span
											class="caret"
										></span>{/if}</span
								>
							</p>
						{/if}
					{/each}
				</div>

				<!-- the answer -->
				{#if shown || thinking}
					<div class="ai-row" in:fade={{ duration: clock.reduced ? 0 : 250 }}>
						<div class="msg ai" class:dim={thinking}>
							<span class="who">{tx.ai}</span>
							{#if shown}
								{#key shown.lines.join('|')}
									<div in:fade={{ duration: clock.reduced ? 0 : 350 }}>
										{#each shown.lines as s, k (k)}
											<p class="cap" class:long={s === tx.answer.ramble}>{s}</p>
										{/each}
										<p class="tags">{shown.tags}</p>
									</div>
								{/key}
								{#if !thinking}
									{#key shown.grade}
										<span
											class="stamp {GRADE_CLASS[shown.grade]}"
											in:scale={{ duration: clock.reduced ? 0 : 300, start: 0.7 }}
											>{tx.grades[shown.grade]}</span
										>
									{/key}
								{/if}
							{/if}
							{#if thinking}
								<div class="typing" class:over={shown !== null} aria-hidden="true">
									<i></i><i></i><i></i>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<div class="questions">
					{#each KEYS as k, i (k)}
						{#if questionOn(k, i)}
							<span class="q" transition:scale={{ duration: clock.reduced ? 0 : 300, start: 0.7 }}
								>{tx.ingredients[k].question}</span
							>
						{/if}
					{/each}
				</div>
			</div>
		</div>

		{#if scene === 'remember'}
			<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} {active} onselect={(i) => (peek = i)} visual={picture} />
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 460px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.hint {
		margin: 0;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}

	.window {
		width: 100%;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		box-shadow: 0 12px 30px rgba(22, 40, 60, 0.08);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 5px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 8px 12px;
	}
	.bar i {
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background: var(--color-line);
	}
	.bar span {
		margin-left: 6px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.thread {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px;
	}
	.msg {
		position: relative;
		border-radius: 16px;
		padding: 9px 12px;
		font-size: 13px;
		line-height: 1.5;
	}
	.who {
		display: block;
		margin-bottom: 2px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.msg.you {
		align-self: flex-end;
		max-width: 92%;
		border-bottom-right-radius: 4px;
		background: var(--color-brand-soft);
	}
	.line {
		display: flex;
		width: 100%;
		align-items: baseline;
		gap: 7px;
		margin: 3px 0 0;
		text-align: left;
		color: var(--color-ink);
	}
	.line.tap {
		border-radius: 8px;
		padding: 3px 4px;
		margin-left: -4px;
		transition:
			opacity 0.3s,
			background 0.2s;
	}
	.line.tap:hover {
		background: color-mix(in srgb, var(--color-brand) 10%, transparent);
	}
	.line.off {
		opacity: 0.4;
	}
	.line.off .txt {
		text-decoration: line-through;
	}
	.chip {
		flex: none;
		border-radius: 999px;
		background: var(--color-card);
		padding: 1px 8px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-brand);
	}
	.caret {
		display: inline-block;
		height: 1em;
		width: 2px;
		margin-left: 1px;
		vertical-align: -2px;
		background: var(--color-brand);
		animation: blink 0.9s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.ai-row {
		display: flex;
	}
	.msg.ai {
		max-width: 92%;
		min-width: 120px;
		min-height: 56px;
		border: 1px solid var(--color-line);
		border-bottom-left-radius: 4px;
		background: var(--color-paper);
		padding-bottom: 12px;
		transition: opacity 0.3s;
	}
	.msg.ai.dim > div:not(.typing) {
		opacity: 0.35;
	}
	.cap {
		margin: 0;
		color: var(--color-ink);
	}
	.cap.long {
		color: var(--color-muted);
	}
	.tags {
		margin: 4px 0 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-brand);
	}
	.stamp {
		position: absolute;
		right: -6px;
		bottom: -12px;
		border-radius: 999px;
		padding: 3px 10px;
		font-size: 11px;
		font-weight: 800;
		transform: rotate(-3deg);
	}
	.stamp.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.stamp.mid {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.stamp.good {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.typing {
		display: flex;
		gap: 4px;
		padding: 6px 2px;
	}
	.typing.over {
		position: absolute;
		top: 8px;
		right: 12px;
		padding: 0;
	}
	.typing i {
		height: 7px;
		width: 7px;
		border-radius: 999px;
		background: var(--color-faint);
		animation: hop 1s ease-in-out infinite;
	}
	.typing i:nth-child(2) {
		animation-delay: 0.15s;
	}
	.typing i:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes hop {
		50% {
			transform: translateY(-3px);
			opacity: 0.5;
		}
	}

	.questions {
		display: flex;
		min-height: 26px;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 6px;
	}
	.q {
		border-radius: 999px;
		border: 1px solid var(--color-amber);
		background: var(--color-amber-soft);
		padding: 2px 10px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-amber);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		.msg {
			font-size: 12.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.typing i,
		.caret {
			animation: none;
		}
		.line.tap,
		.msg.ai {
			transition: none;
		}
	}
</style>

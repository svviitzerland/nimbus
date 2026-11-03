<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type {
		BackendFrameworksText,
		ChoreId,
		FrameworkId
	} from '$lib/chapters/web/backend-frameworks/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BackendFrameworksText);

	const CHORES: ChoreId[] = ['route', 'read', 'validate', 'security', 'db', 'respond'];
	const FRAMEWORKS: FrameworkId[] = ['laravel', 'express', 'django', 'spring'];
	const NAMES: Record<FrameworkId, string> = {
		laravel: 'Laravel',
		express: 'Express',
		django: 'Django',
		spring: 'Spring'
	};

	// The order endpoint written by hand in plain Node.js, one chunk per chore.
	const HAND: Record<ChoreId, string> = {
		route: `const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/orders') {
    res.writeHead(404);
    return res.end('not found');
  }`,
		read: `  let body = '';
  for await (const chunk of req) body += chunk;
  const form = new URLSearchParams(body);
  const product = form.get('product');`,
		validate: `  const qty = Number(form.get('qty'));
  if (!product || !Number.isInteger(qty) || qty < 1) {
    res.writeHead(422);
    return res.end('invalid order');
  }`,
		security: `  const cookies = parseCookies(req.headers.cookie);
  const session = await findSession(cookies.session);
  if (!session || form.get('csrf') !== session.csrf) {
    res.writeHead(403);
    return res.end('forged request');
  }`,
		db: `  const conn = await pool.connect();
  try {
    await conn.query(
      'INSERT INTO orders (user_id, product, qty) VALUES ($1, $2, $3)',
      [session.userId, product, qty]
    );
  } finally {
    conn.release();
  }`,
		respond: `  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});`
	};

	const FW: Record<FrameworkId, { file: string; code: string; support: Record<ChoreId, boolean> }> =
		{
			laravel: {
				file: 'routes/web.php',
				code: `Route::post('/orders', function (Request $request) {
    $data = $request->validate([
        'product' => 'required',
        'qty' => 'required|integer|min:1',
    ]);
    $request->user()->orders()->create($data);
    return response()->json(['ok' => true], 201);
});`,
				support: {
					route: true,
					read: true,
					validate: true,
					security: true,
					db: true,
					respond: true
				}
			},
			express: {
				file: 'app.js',
				code: `app.use(express.urlencoded());
app.use(csrf());            // a package you add

app.post('/orders', async (req, res) => {
  const { product, qty } = orderSchema.parse(req.body);
  await Order.create({ userId: req.user.id, product, qty });
  res.status(201).json({ ok: true });
});`,
				support: {
					route: true,
					read: true,
					validate: false,
					security: false,
					db: false,
					respond: true
				}
			},
			django: {
				file: 'orders/views.py',
				code: `@require_POST
@login_required
def create_order(request):
    form = OrderForm(request.POST)
    if not form.is_valid():
        return JsonResponse(form.errors, status=422)
    form.save(user=request.user)
    return JsonResponse({"ok": True}, status=201)`,
				support: {
					route: true,
					read: true,
					validate: true,
					security: true,
					db: true,
					respond: true
				}
			},
			spring: {
				file: 'OrderController.java',
				code: `@PostMapping("/orders")
public ResponseEntity<Order> create(@Valid @RequestBody Order order) {
    return ResponseEntity.status(201).body(orders.save(order));
}`,
				support: {
					route: true,
					read: true,
					validate: true,
					security: false,
					db: true,
					respond: true
				}
			}
		};

	let tab = $state<'hand' | FrameworkId>('hand');
	const written = new SvelteSet<ChoreId>();
	let last = $state<ChoreId | null>(null);
	let seenFramework = false;
	let completed = false;

	function count(s: string) {
		return s.split('\n').length;
	}

	const handLines = $derived(
		CHORES.filter((c) => written.has(c)).reduce((n, c) => n + count(HAND[c]), 0)
	);
	const lines = $derived(tab === 'hand' ? handLines : count(FW[tab].code));

	function check() {
		if (!completed && seenFramework && written.size === CHORES.length) {
			completed = true;
			oncomplete?.();
		}
	}

	function write(c: ChoreId) {
		if (tab !== 'hand' || written.has(c)) return;
		written.add(c);
		last = c;
		onstate?.(written.size === CHORES.length ? 'byhand' : c);
		check();
	}

	function pick(t: 'hand' | FrameworkId) {
		tab = t;
		last = null;
		if (t !== 'hand') {
			seenFramework = true;
			onstate?.(t);
			check();
		}
	}
</script>

<div class="wrap">
	<div class="tabs" role="tablist">
		<button
			type="button"
			role="tab"
			aria-selected={tab === 'hand'}
			class:on={tab === 'hand'}
			onclick={() => pick('hand')}>{tx.byHand}</button
		>
		{#each FRAMEWORKS as f (f)}
			<button
				type="button"
				role="tab"
				aria-selected={tab === f}
				class:on={tab === f}
				onclick={() => pick(f)}>{NAMES[f]}<small>{tx.frameworks[f].lang}</small></button
			>
		{/each}
	</div>

	{#if tab !== 'hand'}
		<p class="blurb">{tx.frameworks[tab].blurb}</p>
	{/if}

	<div class="chores">
		<p class="capt">{tx.choresLabel}</p>
		<div class="grid">
			{#each CHORES as c (c)}
				{@const ok = tab === 'hand' ? written.has(c) : FW[tab].support[c]}
				<button
					type="button"
					class="chore"
					class:ok
					class:add={tab !== 'hand' && !ok}
					class:want={tab === 'hand' && !ok}
					disabled={tab !== 'hand' || ok}
					onclick={() => write(c)}
				>
					<span class="dot" aria-hidden="true">
						{#if ok}
							<svg viewBox="0 0 16 16"
								><path
									d="M3.5 8.5l3 3 6-6.5"
									fill="none"
									stroke="currentColor"
									stroke-width="2.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							>
						{:else if tab !== 'hand'}
							+
						{/if}
					</span>
					<span class="cl">{tx.chores[c]}</span>
					{#if tab !== 'hand'}
						<span class="badge">{ok ? tx.built : tx.addon}</span>
					{/if}
				</button>
			{/each}
		</div>
		{#if tab === 'hand' && written.size < CHORES.length}
			<p class="hint">{tx.writeHint}</p>
		{/if}
	</div>

	<div class="editor">
		<div class="bar">
			<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
			<span class="fname">{tab === 'hand' ? 'server.js' : FW[tab].file}</span>
			<span class="count" class:big={tab === 'hand' && handLines > 30}
				>{tx.lines.replace('{n}', String(lines))}</span
			>
		</div>
		<div class="code">
			{#if tab === 'hand'}
				{#each CHORES as c (c)}
					{#if written.has(c)}
						<pre class:fresh={last === c}>{HAND[c]}</pre>
					{:else}
						<pre class="todo">// {tx.chores[c]}, {tx.todo}</pre>
					{/if}
				{/each}
			{:else}
				{#key tab}
					<pre class="fresh">{FW[tab].code}</pre>
				{/key}
			{/if}
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 560px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.tabs {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 5px;
	}
	.tabs button {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1.15;
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 11px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
		transition:
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}
	.tabs button small {
		font-size: 9px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.tabs button:hover {
		border-color: var(--color-ink);
	}
	.tabs button.on {
		background: var(--toggle-active);
		border-color: var(--toggle-active);
		color: #fff;
	}
	.tabs button.on small {
		color: rgba(255, 255, 255, 0.7);
	}
	.blurb {
		margin: 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.chores {
		width: 100%;
	}
	.capt {
		margin: 0 0 6px;
		text-align: center;
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.chore {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 8px;
		text-align: left;
		font-size: 11.5px;
		color: var(--color-muted);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}
	.chore.want {
		color: var(--color-ink);
	}
	.chore.want:hover {
		border-color: var(--color-brand);
	}
	.chore.ok {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-ink);
	}
	.chore.add {
		border-color: transparent;
		background: var(--color-amber-soft);
		color: var(--color-ink);
	}
	.chore:disabled {
		cursor: default;
	}
	.dot {
		display: flex;
		flex: none;
		width: 17px;
		height: 17px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
		font-size: 12px;
		font-weight: 800;
		color: #fff;
	}
	.dot svg {
		width: 11px;
		height: 11px;
	}
	.chore.ok .dot {
		background: var(--color-grass);
		border-color: var(--color-grass);
	}
	.chore.add .dot {
		background: var(--color-amber);
		border-color: var(--color-amber);
	}
	.cl {
		flex: 1;
		min-width: 0;
		line-height: 1.25;
	}
	.badge {
		flex: none;
		font-size: 9px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.hint {
		margin: 6px 0 0;
		text-align: center;
		font-size: 11px;
		color: var(--color-faint);
	}

	.editor {
		width: 100%;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: #16212b;
		overflow: hidden;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		background: #1e2a36;
	}
	.dots {
		display: flex;
		gap: 4px;
	}
	.dots i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #3a4756;
	}
	.fname {
		flex: 1;
		min-width: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		color: #b9c3cc;
	}
	.count {
		border-radius: 999px;
		background: #2c3a48;
		padding: 2px 8px;
		font-size: 10.5px;
		font-weight: 700;
		color: #dfe6ec;
		transition: background 0.3s ease;
	}
	.count.big {
		background: var(--color-danger);
		color: #fff;
	}
	.code {
		max-height: 260px;
		overflow: auto;
		padding: 9px 11px;
	}
	pre {
		margin: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		line-height: 1.5;
		color: #e0e6eb;
		white-space: pre;
	}
	pre.todo {
		color: #66737f;
		font-style: italic;
	}
	pre.fresh {
		animation: glow 1.2s ease;
	}
	@keyframes glow {
		from {
			background: rgba(46, 111, 224, 0.35);
		}
		to {
			background: transparent;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		pre.fresh {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.tabs button {
			font-size: 13px;
			padding: 7px 14px;
		}
		.chore {
			font-size: 12.5px;
		}
		pre {
			font-size: 11.5px;
		}
		.code {
			max-height: 320px;
		}
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { lang, setLang } from '$lib/i18n';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import GitHubLink from '$lib/components/GitHubLink.svelte';
	import LessonMenu from '$lib/components/LessonMenu.svelte';

	let { children } = $props();
</script>

<div
	class="flex h-dvh flex-col overflow-hidden"
	style="background: radial-gradient(120% 90% at 75% 8%, var(--bg-grad-1) 0%, var(--bg-grad-2) 55%, var(--bg-grad-3) 100%);"
>
	<header
		class="z-20 flex shrink-0 items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] md:px-8"
	>
		<div class="flex items-center gap-2.5">
			<LessonMenu />
			<a href={resolve('/')} class="font-display text-lg font-semibold tracking-tight">Nimbus</a>
		</div>
		<div class="flex items-center gap-2 md:gap-3">
			<GitHubLink />
			<ThemeToggle />
			<div
				class="flex items-center gap-0.5 rounded-full border border-line p-0.5 text-[11px] font-bold backdrop-blur"
				style="background: var(--header-btn-bg);"
			>
				<button
					onclick={() => setLang('id')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'id'
						? 'text-white'
						: 'text-faint hover:text-ink'}"
					style={$lang === 'id' ? 'background: var(--toggle-active);' : ''}
				>
					ID
				</button>
				<button
					onclick={() => setLang('en')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'en'
						? 'text-white'
						: 'text-faint hover:text-ink'}"
					style={$lang === 'en' ? 'background: var(--toggle-active);' : ''}
				>
					EN
				</button>
			</div>
		</div>
	</header>

	{@render children()}
</div>

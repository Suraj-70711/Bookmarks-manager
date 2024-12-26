<script lang="ts">
	import { ArrowSquareOut, Link, Plus, Share, Trash } from 'phosphor-svelte';
	import linkStore from '$lib/store.svelte';
	import { Priority } from '$lib/types';
	import type { LinkItem } from '$lib/types';
	import { v4 } from 'uuid';

	const FavIconAPIURL = 'https://www.google.com/s2/favicons?domain=';

    let isAddModalOpen = $state<boolean>(false);
    let isDeleteItemModalOpen = $state<boolean>(false);
    let isDeleteAllItemModalOpen = $state<boolean>(false);

	function addtem() {
		linkStore.update((val) => {
			val.push({
				id: v4(),
				label: 'Google',
				url: 'https://google.com',
				priority: Priority.MostPrior
			});
			return val;
		});
	}
</script>

<svelte:head>
	<title>Bookmarks Manager</title>
</svelte:head>

<header class="flex justify-between bg-slate-800 px-6 py-2">
	<button onclick={addtem} class="btn border-red-600/25 bg-red-500/25 text-red-500">
		<Trash size="24" />
	</button>

	<div class="flex items-center font-semibold text-white">
		<img src="/favicon.ico" alt="Logo" />
		<span>Bookmarks Manager</span>
	</div>

	<button onclick={addtem} class="btn border-purple-600/25 bg-purple-500/25 text-purple-500">
		<Plus size="24" />
	</button>
</header>

<div class="grid grid-cols-1 gap-4 px-4 py-2 md:grid-cols-3">
	{#each $linkStore as link (link.id)}
		{@render linkItem(link)}
	{/each}
</div>

{#snippet linkItem({ id, label, url, priority }: LinkItem)}
	<div class="flex items-center gap-2 rounded border border-slate-600 px-4 py-2">
		<img class="aspect-square h-10" src={`${FavIconAPIURL}${url}`} alt="Item Logo" />
		<div class="flex w-full flex-col">
			<span class="text-slate-200">{label}</span>
			<span class="text-sm text-gray-500">{url}</span>
		</div>
        <a href={url} target="_blank" class="text-slate-500 mr-3" >
            <ArrowSquareOut />
        </a>
		<button class="rounded bg-red-400/25 p-2 text-red-500">
			<Trash />
		</button>
	</div>
{/snippet}

<style lang="postcss">
	.btn {
		@apply flex items-center justify-center rounded border-b-4 px-4 hover:brightness-90 active:border-none;
	}
</style>

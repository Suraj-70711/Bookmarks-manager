<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import linkStore from '$lib/store.svelte';
	import { type LinkItem } from '$lib/types';
	import { ArrowSquareOut, Plus, Trash } from 'phosphor-svelte';
	import { blur } from 'svelte/transition';
	import { v4 } from 'uuid';

	const FavIconAPIURL = 'https://www.google.com/s2/favicons?sz=64&domain=';
	let label = $state('');
	let url = $state('');
	let submitter: HTMLButtonElement;

	function resetAddItemFields() {
		label = '';
		url = '';
	}

	function addItem() {
		if (!url.includes('https://')) url = `https://${url}`;
		if (!url.includes('www.')) url = url.replace('https://', 'https://www.');
		linkStore.update((val) => {
			val.push({
				id: v4(),
				label,
				url
			});
			return val;
		});
	}

	function deleteItem(id: string) {
		const conf = window.confirm('Are you sure?');
		if (conf)
			linkStore.update((val) => {
				val = val.filter((item) => item.id !== id);
				return val;
			});
	}

	function deleteAllItems() {
		linkStore.set([]);
	}
</script>

<svelte:head>
	<title>Bookmarks Manager</title>
</svelte:head>

<header class="flex items-center justify-between bg-slate-800 px-6 py-2">
	<Modal type="confirm" confirmationText="Yes!" title="Are you sure?" onconfirm={deleteAllItems}>
		{#snippet trigger(onclick: () => void)}
			<button {onclick} class="btn border-red-600/25 bg-red-500/25 text-red-500">
				<Trash size="24" />
			</button>
		{/snippet}
	</Modal>

	<div class="flex items-center font-semibold text-white">
		<img class="w-8" src="/favicon.ico" alt="Logo" />
		<span>Bookmarks Manager</span>
	</div>

	<Modal
		type="interactive"
		description="Enter the details of the item you want to add."
		title="Add an Item"
		onMount={(sb) => {
			submitter = sb;
		}}
		onsubmit={addItem}
		onclose={resetAddItemFields}
	>
		{#snippet trigger(onclick: () => void)}
			<button {onclick} class="btn border-purple-600/25 bg-purple-500/25 text-purple-500">
				<Plus size="24" />
			</button>
		{/snippet}

		<div class="flex flex-col gap-2">
			<input
				bind:value={label}
				type="text"
				placeholder="Label"
				class="inp"
			/>
			<input
				bind:value={url}
				type="text"
				placeholder="URL"
				class="inp"
				onkeypress={(e: KeyboardEvent) => {
					if (e.key === 'Enter') submitter.click();
				}}
			/>
		</div>
	</Modal>
</header>

<div class="grid grid-cols-1 gap-4 px-4 py-2 md:grid-cols-3">
	{#each $linkStore as link (link.id)}
		{@render linkItem(link)}
	{/each}
</div>

{#snippet linkItem({ id, label, url }: LinkItem)}
	<div
		transition:blur={{ delay: 200 }}
		class="flex items-center gap-2 rounded border border-slate-600 px-4 py-2"
	>
		<img
			class="aspect-square h-10 rounded-full shadow-md shadow-white/25"
			src={`${FavIconAPIURL}${url}`}
			alt="Logo"
		/>
		<div class="flex w-full flex-col">
			<span class="text-slate-200">{label}</span>
			<span class="text-sm text-gray-500">{url}</span>
		</div>
		<a href={url} target="_blank" class="mr-3 text-slate-500 active:scale-90">
			<ArrowSquareOut />
		</a>
		<button
			onclick={() => deleteItem(id)}
			class="rounded bg-red-400/25 p-2 text-red-500 active:scale-90"
		>
			<Trash size="20" />
		</button>
	</div>
{/snippet}

<style lang="postcss">
	.btn {
		@apply flex aspect-square items-center justify-center rounded border-b-4 px-2 hover:brightness-90 active:border-none;
	}

	.inp {
		@apply rounded border border-slate-400 bg-transparent px-3 py-2 outline-none;
	}
</style>

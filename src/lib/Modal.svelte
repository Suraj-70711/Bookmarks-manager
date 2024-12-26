<script lang="ts">
	import { browser } from '$app/environment';
	import { XCircle } from 'phosphor-svelte';
	import { type Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	let {
		title,
		description,
		onconfirm,
		onsubmit,
		children,
		trigger,
		type,
		confirmationText,
		onclose,
		onMount
	} = $props<
		| {
				title: string;
				trigger: Snippet<[() => void]>;
				type: 'confirm';
				confirmationText: string;
				onconfirm: () => void;
				onMount?: (submitter: HTMLButtonElement) => void;
				onclose?: () => void;
		  }
		| {
				title: string;
				trigger: Snippet<[() => void]>;
				type: 'interactive';
				description: string;
				children: Snippet;
				onsubmit: () => void;
				onMount?: (submitter: HTMLButtonElement) => void;
				onclose?: () => void;
		  }
	>();

	let isOpen = $state(false);
	let submitter = $state<HTMLButtonElement | null>(null);
	let view = $state<HTMLDivElement | null>(null);

	function close() {
		isOpen = false;
		if (onclose) onclose();
	}

	function open() {
		isOpen = true;
	}

	function focusFirstField() {
		if (browser) {
			const firstField = view?.children[0].children[0];
			if (firstField?.nodeName === 'INPUT') (firstField as HTMLInputElement).focus();
		}
	}
</script>

{@render trigger(open)}

{#if isOpen}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		transition:fly
		role="dialog"
		onkeypress={(e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		}}
		onclick={close}
		class="fixed left-0 top-0 flex h-dvh w-dvw items-center justify-center bg-black/50 backdrop-blur-sm"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			onclick={(e: Event) => e.stopPropagation()}
			class="relative max-h-[620px] w-5/6 rounded bg-slate-700 p-4 md:w-fit"
		>
			<div class="flex w-full items-center justify-between px-2">
				<div class="flex flex-col">
					<h2 class="text-lg text-white">{title}</h2>
					{#if description}
						<p class="text-sm text-slate-200">{description}</p>
					{/if}
				</div>
				<button
					aria-label="Close Dialog"
					onclick={close}
					class="absolute right-2 top-2 text-red-400"
				>
					<XCircle size="24" />
				</button>
			</div>
			<hr class="my-3 rounded border border-slate-600" />
			{#if type === 'confirm'}
				<div class="flex justify-between gap-4 font-semibold">
					<button class="btn bg-slate-800/40 text-gray-300" onclick={close}>Cancel</button>
					<button
						bind:this={submitter}
						class="btn bg-red-500/25 text-red-500"
						onclick={() => {
							onconfirm();
							close();
						}}>{confirmationText}</button
					>
				</div>
			{:else}
				<div bind:this={view} class="overflow-hidden overflow-y-auto">
					{@render children()}
				</div>

				<div class="mt-4 flex justify-between gap-4 font-semibold">
					<button class="btn bg-slate-800/40 text-gray-300" onclick={close}>Cancel</button>
					<button
						bind:this={submitter}
						class="btn bg-green-400/25 text-green-400"
						onclick={() => {
							onsubmit();
							close();
						}}>Submit</button
					>
				</div>
			{/if}
		</div>
	</div>
	{onMount && onMount(submitter)}
	{focusFirstField()}
{/if}

<style lang="postcss">
	.btn {
		@apply min-w-32 rounded-full px-4 py-2;
	}
</style>

<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import {IconContext} from 'phosphor-svelte'
</script>

<IconContext values={{size: 24, weight: "bold", color: "currentColor"}} >
	{@render children()}
</IconContext>

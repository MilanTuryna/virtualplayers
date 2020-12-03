<script>
	export let name;
	import { onMount } from "svelte";
	// define the data holding variable
	let botList;
	let botCount = 0;
	onMount(async () => {
		await fetch(`http://localhost:5001/bots`)
				.then(r => r.json())
				.then(data => {
					botCount = data['count'];
					botList = data.list;
				});
	})
</script>
{#if botList}
<ul>
	{#each Object.keys(botList) as bot}
	<li>{bot} - {botList[bot].server}</li>
	{/each}
</ul>
{/if}
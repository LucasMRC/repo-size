<script lang="ts">
import { onMount } from "svelte";

let input: HTMLInputElement;
let button: HTMLButtonElement;

onMount(() => {
	button.addEventListener('click', store_token);
})

function store_token() {
	const token = input.value
	chrome.runtime.sendMessage({ action: 'STORE_TOKEN', data: token });
}

</script>

<main>
	To size private repos, you'll need to provide a Github token:
	<input type="text" bind:this={input}>
	<button bind:this={button}>Store</button>
</main>

<script lang="ts">
import { onMount } from "svelte"

const Actions = {
	PROVIDED_TOKEN: 'PROVIDED_TOKEN',
	TOKEN_EXISTS: 'TOKEN_EXISTS'
} as const

const Screens = {
	FORM: 'FORM',
	INITIAL: 'INITIAL',
	READY: 'READY',
	ABOUT: 'ABOUT'
} as const

type Screen = keyof typeof Screens

let input: HTMLInputElement
let screen: Screen
let prev_screen: Screen

onMount(() => {
	browser.runtime.sendMessage({ action: Actions.TOKEN_EXISTS })
		.then(it_does => {
			screen = it_does
				? Screens.READY
				: Screens.FORM
		})
})

function store_token() {
	const token = input.value
	if (!input.value) return
	browser.runtime.sendMessage({ action: Actions.PROVIDED_TOKEN, data: token } as Message).then(r => {
		if (r) screen = Screens.READY
	})
}

function go_to(new_screen: Screen) {
	prev_screen = screen
	screen = new_screen
}
</script>

<main class="w-min px-6 border-none py-4 bg-blue-950 font-[Inconsolata] transition-all transition-ease text-blue-50 grid gap-y-3 auto-rows-min justify-start">
	{#if screen === Screens.INITIAL}
		<span>Loading</span>
	{:else if screen === Screens.FORM}
		<section>
			To size repos, you'll need to provide a Github token:
			<input type="password" class="my-4! py-1 px-2 border-2! border-solid! border-blue rounded h-10 bg-black" bind:this={input}>
			<button class="hover:brightness-200 bg-blue-950 py-1 px-2 cursor-pointer border! border-solid! border-blue-50! rounded text-blue-50 font-bold" on:click={store_token}>Store</button>
			<button class="hover:brightness-200 bg-blue-950 py-1 px-2 cursor-pointer border! border-solid! border-blue-50! rounded text-blue-50 font-bold" on:click={() => go_to(Screens.ABOUT)}>About me</button>
		</section>
	{:else if screen === Screens.READY}
		<section class="w-40">
			<p class="mb-4! ">Your token is safe!</p>
			<button class="hover:brightness-200 bg-blue-950 py-1 px-2 cursor-pointer border! border-solid! border-blue-50! rounded text-blue-50 font-bold" on:click={() => go_to(Screens.FORM)}>Update</button>
			<button class="hover:brightness-200 bg-blue-950 py-1 px-2 cursor-pointer border! border-solid! border-blue-50! rounded text-blue-50 font-bold" on:click={() => go_to(Screens.ABOUT)}>About me</button>
		</section>
	{:else}
		<section class="w-80">
			<h1 class="font-semibold text-3xl font-[DancingScript]">About me <span class="font-[Inconsolata]">:)</span></h1>
			<br>
			<p class="relative after:text-xl after:absolute after:content-['🧉']">I'm Lucas, an argentinian living in the Netherlands</p>
			<br>
			<p>Nice to meet you!</p>
			<br>
			<p>I find myself constantly surfing Github because my job requires me to. Also, a lot of my personal tools can be upgraded with GH hosted packages.</p>
			<br>
			<p>And when I have to make a desicion over which packages to add, size is an important detail for me. So I built this humble thing to help me out with that.</p>
			<br>
			<p>Hope this helps you too!</p>
			<p class="font-[DancingScript] text-3xl my-4!">Lucas</p>
			<a target="_blank" class="py-1 px-2 cursor-pointer border border-solid rounded w-fit inline-block" href="https://www.buymeacoffee.com/lucas.maria">Buy me a coffee ☕</a>
			<button class="hover:brightness-200 bg-blue-950 py-1 px-2 cursor-pointer border! border-solid! border-blue-50! rounded text-blue-50 font-bold" on:click={() => screen = prev_screen}>Go back</button>
		</section>
	{/if}
</main>

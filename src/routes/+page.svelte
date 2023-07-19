<script lang="ts">
	import {
		RangeSlider,
		Toast,
		toastStore,
		clipboard,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import { generate } from 'generate-password-ts';
	import { onMount, tick } from 'svelte';
	import { passwordStore } from '$lib/stores/passwordStore';
	import copy from '$lib/assets/copy.svg';

	let notifed = false;
	let max = 128;
	let generatedPassword = '';
	const t: ToastSettings = {
		message: 'Copied to clipboard! 👍',
		timeout: 2000,
		hideDismiss: true
	};

	function checkboxChange() {
		const { useRandomLength, min, max, ...otherOptions } = $passwordStore;

		const atLeastOneTrue = Object.values(otherOptions).some((option) => option === true);

		if (!atLeastOneTrue) {
			$passwordStore.useLowercase = true;
		}
		updateGeneratedPassword();
	}

	function updateGeneratedPassword() {
		let length = $passwordStore.useRandomLength
			? Math.floor(Math.random() * (max - $passwordStore.min + 1)) + $passwordStore.min
			: $passwordStore.min;

		generatedPassword = generate({
			lowercase: $passwordStore.useLowercase,
			uppercase: $passwordStore.useUppercase,
			numbers: $passwordStore.useNumbers,
			symbols: $passwordStore.useSymbols,
			length: length
		});
	}

	function notify() {
		toastStore.trigger(t);
		notifed = true;
		setTimeout(() => {
			notifed = false;
		}, t.timeout);
	}
	onMount(() => updateGeneratedPassword());
</script>

<svelte:head>
	<title>Scuffed Password Generator</title>
</svelte:head>

<main class="space-y-6 flex flex-col place-content-center h-screen mx-auto px-6 max-w-screen-md">
	<h1 class="text-center text-2xl">Scuffed Password Generator</h1>
	<div class="text-sm relative">
		<input
			class="input px-6"
			title="password"
			type="text"
			value={generatedPassword}
			readonly
			aria-label="Generated Password"
			aria-readonly="true"
		/>
		<Toast background="bg-surface-800" position="t" />
		{#if notifed}
			<div class="sr-only" aria-live="polite" role="alert">Copied to clipboard! 👍</div>
		{/if}
		<button
			on:click={notify}
			type="button"
			class="btn absolute top-0 bottom-0 right-0 bg-surface-700 p-4"
			aria-label="Copy to clipboard"
			use:clipboard={generatedPassword}><img src={copy} alt="" /></button
		>
	</div>
	<div class="card p-6 space-y-6">
		{#if !$passwordStore.useRandomLength}
			<RangeSlider
				name="range-slider"
				bind:value={$passwordStore.min}
				min={5}
				max={$passwordStore.max}
				step={1}
				on:change={updateGeneratedPassword}
				aria-label="Character Length Slider"
				aria-valuemin={$passwordStore.min}
				aria-valuemax={max}
				aria-valuenow={$passwordStore.min}
				role="slider"
			>
				<div class="flex justify-between items-center gap-8">
					<div class="text-s">Character Length</div>
					<div class="text-xs">{$passwordStore.min} / {max}</div>
				</div>
			</RangeSlider>
		{/if}
		<div class="space-y-3 text-s">
			<label class="flex items-center space-x-2">
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={$passwordStore.useLowercase}
					on:change={checkboxChange}
					aria-label="Use Lowercase"
					aria-checked={$passwordStore.useLowercase}
				/>
				<p>Use Lowercase</p>
			</label>
			<label class="flex items-center space-x-2">
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={$passwordStore.useUppercase}
					on:change={checkboxChange}
					aria-label="Use Uppercase"
					aria-checked={$passwordStore.useUppercase}
				/>
				<p>Use Uppercase</p>
			</label>
			<label class="flex items-center space-x-2">
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={$passwordStore.useNumbers}
					on:change={checkboxChange}
					aria-label="Use Numbers"
					aria-checked={$passwordStore.useNumbers}
				/>
				<p>Use Numbers</p>
			</label>
			<label class="flex items-center space-x-2">
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={$passwordStore.useSymbols}
					on:change={checkboxChange}
					aria-label="Use Symbols"
					aria-checked={$passwordStore.useSymbols}
				/>
				<p>Use Symbols</p>
			</label>
			<label class="flex items-center space-x-2">
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={$passwordStore.useRandomLength}
					on:change={checkboxChange}
					aria-label="Random Length"
					aria-checked={$passwordStore.useRandomLength}
				/>
				<p>Random Length</p>
			</label>
		</div>
		<div class="flex justify-center items-center">
			<button
				type="button"
				class="btn variant-ghost w-full"
				on:click={updateGeneratedPassword}
				aria-label="Generate Password"
			>
				<span>Generate</span>
			</button>
		</div>
	</div>
</main>

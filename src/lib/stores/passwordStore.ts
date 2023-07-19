import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

interface PasswordStore {
	min: number;
	max: number;
	useLowercase: boolean;
	useUppercase: boolean;
	useNumbers: boolean;
	useSymbols: boolean;
	useRandomLength: boolean;
}

const password: PasswordStore = {
	min: 5,
	max: 128,
	useLowercase: true,
	useUppercase: true,
	useNumbers: true,
	useSymbols: true,
	useRandomLength: false
};

export const passwordStore = writable(fromLocalStorage('password', password));
toLocalStorage(passwordStore, 'password');

function fromLocalStorage(storageKey: string, fallbackValue: unknown) {
	if (browser) {
		const storedValue = window.localStorage.getItem(storageKey);

		if (storedValue !== 'undefined' && storedValue !== null) {
			return typeof fallbackValue === 'object' ? JSON.parse(storedValue) : storedValue;
		}
	}

	return fallbackValue;
}

function toLocalStorage(store: Writable<PasswordStore>, storageKey: string) {
	if (browser) {
		store.subscribe((value) => {
			const storageValue = typeof value === 'object' ? JSON.stringify(value) : value;

			window.localStorage.setItem(storageKey, storageValue);
		});
	}
}

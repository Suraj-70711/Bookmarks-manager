import { writable } from "svelte/store";
import type { LinkItem } from "./types";
import { browser } from "$app/environment";

const LINKS_KEY = 'links';


let links: LinkItem[] = $state([]);
const linkStore = writable<LinkItem[]>(links);

if (browser) {
    // Initialise local storage
    const existinglinks = JSON.parse(localStorage.getItem(LINKS_KEY) ?? '[]') as LinkItem[];
    if (!existinglinks) {
        localStorage.setItem(LINKS_KEY, JSON.stringify([]));
    } else {
        linkStore.set(existinglinks);
    }

    linkStore.subscribe((val) => {
        localStorage.setItem(LINKS_KEY, JSON.stringify(val));
    })
}

export default linkStore
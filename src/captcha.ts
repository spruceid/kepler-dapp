import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type Captcha = {
  title: string;
  description: string;
  action: string;
  callback: (data: any) => Promise<void>;
};

export const captcha: Writable<Captcha> = writable<Captcha>(null);

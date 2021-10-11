import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type FileUpload = {
  title: string;
  callback: (data: any) => Promise<void>;
};

export const fileUpload: Writable<FileUpload> = writable<FileUpload>(null);

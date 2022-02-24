<script>
import { CheckArrow } from 'components';
import { notifications } from "src/helpers/notifications";

  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
//   export let themes = {
//       danger: "#E26D69",
//       success: "#84C991",
//       warning: "#f0ad4e",
//       info: "#5bc0de",
//       default: "#aaaaaa",
//   };
</script>

<div class="notifications fixed top-17.5 right-4 pointer-events-none z-50">
  {#each $notifications as notification (notification.id)}
      <div
          animate:flip
          class="rounded-lg border-green border h-12 flex items-center pr-3 pl-5 bg-gray"
          transition:fly={{ y: 30 }}
      >
          <div class="content text-sm text-white">{notification.message}</div>
          <CheckArrow class="w-6 h-6 ml-8" />
          <!-- {#if notification.icon}<i class={notification.icon} />{/if} -->
      </div>
  {/each}
</div>

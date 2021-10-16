<script lang="ts">
    import { onMount } from 'svelte';

    let count: number = 0;
    let test = 'test';
    let url;

    function incrementCount() {
        count += 1;
    }

    onMount(() => {
        console.log(window.location.href)
        url = window.location.href
    })
</script>

<style lang="scss">
  $color: lightblue;

  button {
    background-color: $color;
  }
</style>

<h2>Client Side JS Sample</h2>
<h3>{url}</h3>
<button on:click={incrementCount}>
  <span>Clicked</span> {count} {count === 1 ? 'time' : 'times'}
</button>


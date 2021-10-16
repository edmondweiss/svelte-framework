<script lang="ts">
    let count: number = 0;
    let test = 'test';

    function incrementCount() {
        count += 1;
    }
</script>

<style lang="scss">
  $color: lightblue;

  button {
    background-color: $color;
  }
</style>

<h2>Client Side JS Sample</h2>
<button on:click={incrementCount}>
  <span>Clicked</span> {count} {count === 1 ? 'time' : 'times'}
</button>


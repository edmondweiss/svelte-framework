<script lang="ts">
    import SomeComponent from '../components/SomeComponent.svelte';

    export let title;
    let prompt: string = 'Hello world!'

    type Apple = {
        color: string;
        shape: string
    }

    interface Person {
        name: string;
        age: number;
    }
</script>


<svelte:head>
    <title>{title}</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
</svelte:head>

<h1>{prompt}</h1>

<ul>
    <li><SomeComponent/></li>
</ul>

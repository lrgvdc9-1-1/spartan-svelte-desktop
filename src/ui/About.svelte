<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    function sayHello() {
        dispatch("message", {text: "hello!"});
    }

</script>
<h1>
    test
</h1>

<button on:click={sayHello}>
test
</button>
<template>
    <div>
        <h3 class="red">Uuid2: {{uuid2 ? uuid2 : 'no uuid'}}</h3>
    </div>
</template>

<script>
export default {
    props: ['uuid2'],
    data: function () {
        return {}
    }
}
</script>

<style lang="css">
.red {
    color: yellowgreen;
}
</style>

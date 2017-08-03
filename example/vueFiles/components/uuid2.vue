<template>
    <div>
        <h3>Uuid2: {{uuid2 ? uuid2 : 'no uuid'}}</h3>
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
.test {
    color: blue;
}
</style>

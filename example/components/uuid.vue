<template>
    <div>
        <inner></inner>
        <h2>Uuid: {{uuid ? uuid : 'no uuid'}}</h2>
    </div>
</template>

<script>
import inner from '../components/inner.vue';
export default {
    props: ['uuid'],
    data: function () {
        return {}
    },
    components: {
        inner: inner
    }
}
</script>

<style lang="css">
.test {
    color: blue;
}
</style>

<template>
    <div>
        <inner></inner>
        <h2 class="test">Uuid: {{uuid ? uuid : 'no uuid'}}</h2>
    </div>
</template>

<script>
import inner from '../components/inner.vue';
export default {
    props: {
        uuid: {
            type: String,
            default: 'missing',
            required: true
        }
    },
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

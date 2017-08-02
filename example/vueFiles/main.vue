<template lang="html">
    <div>
        <h1>{{title}}</h1>
        <p>Welcome to the {{title}} demo. Click a link:</p>
        <input v-model="message" placeholder="edit me">
        <p>{{message}}</p>
        <uuid :uuid="uuid"></uuid>
        <uuid2 :uuid="uuid"></uuid2>
        <button type="button" name="button" v-on:click="this.hello">Test mixin</button>
        <button type="button" name="button" v-on:click="this.test">Test method</button>
    </div>
</template>

<script>
import exampleMixin from '../example/vueFiles/mixins/exampleMixin';
import uuid from '../example/vueFiles/components/uuid.vue';
import uuid2 from '../example/vueFiles/components/uuid2.vue';
export default {
    mixins: [exampleMixin],
    data: function () {
        return {
        }
    },
    methods: {
        test: function () {
            console.error('test');
        }
    },
    components: {
        uuid: uuid,
        uuid2: uuid2
    }
}
</script>

<style lang="css">

</style>

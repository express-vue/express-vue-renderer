<template>
    <div>
        <h1>{{title}}</h1>
        <p>Welcome to the {{title}} demo. Click a link:</p>
        <input v-model="message" placeholder="edit me">
        <p>{{message}}</p>
        <uuid :uuid="uuid"></uuid>
        <uuid2 :uuid2="uuid2"></uuid2>
        <button type="button" name="button" v-on:click="this.hello">Test mixin</button>
        <button type="button" name="button" v-on:click="this.test">Test method</button>
        <!-- Renders a div element by default -->
        <v-touch v-on:swipeleft="onSwipeLeft">Swipe me!</v-touch>

        <!-- Render as other elements with the 'tag' prop -->
        <v-touch tag="a" v-on:tap="onTap">Tap me!</v-touch>
    </div>
</template>

<script>
import exampleMixin from '../mixins/exampleMixin';
import uuid from '../components/uuid.vue';
import uuid2 from '../components/uuid2.vue';
export default {
    mixins: [exampleMixin],
    data: function () {
        return {}
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

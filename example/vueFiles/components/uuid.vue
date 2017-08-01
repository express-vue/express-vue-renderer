<template lang="html">
  <div class="">
      <h2>Uuid: {{uuid ? uuid : 'no uuid'}}</h2>
  </div>
</template>

<script>
export default {
    props: ['uuid'],
    data: function() {
        return {}
    }
}
</script>

<style lang="css">
    .test {
        color: blue;
    }
</style>

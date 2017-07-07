<template lang="html">
  <div class="">
      <h1>{{message}}</h1>
      <h2>Uuid: {{uuid ? uuid : 'no uuid'}}</h2>
  </div>
</template>

<script>
exports.default = {
    data: function() {
        return {
        }
    }
}
</script>

<style lang="css">
    .test {
        color: blue;
    }
</style>

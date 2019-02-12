<template>
  <section class="hero is-dark is-medium">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Lightweight data editing, robust possibilities
        </h1>
        <h2 class="subtitle">
          Edit CSV files in the browser and sync them with GitHub.
        </h2>
        <form @submit.prevent="openFile">
          <label
            for="csv-url"
            class="label has-text-white">
            Enter the URL of a CSV file on GitHub
          </label>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input
                id="csv-url"
                v-model="csvUrl"
                class="input"
                type="url"
                placeholder="https://github.com/user/repo/blob/master/data.csv">
              <p class="help">
                Raw or UI URLs will work
              </p>
            </div>
            <div class="control">
              <button
                class="button is-primary"
                type="submit">
                Edit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      csvUrl: ''
    }
  },
  computed: {
    fileUrl () {
      const url = new URL(this.csvUrl)
      if (url.hostname === 'github.com') {
        return url.pathname.replace('/blob', '')
      } else if (url.hostname === 'raw.githubusercontent.com') {
        return url.pathname
      } else {
        return '/'
      }
    }
  },
  methods: {
    openFile () {
      this.$router.push(this.fileUrl)
    }
  }
}
</script>

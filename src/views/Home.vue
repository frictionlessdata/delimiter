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
                placeholder="https://github.com/user/repo/blob/master/data.csv"
                required>
              <p class="help">
                You can use either the regular or "raw" URL. Or
                <router-link :to="trySampleLink">
                  try a sample dataset
                </router-link>
                .
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
import { simplifyGithubUrl } from '@/util'
const SAMPLE_DATA_URL = process.env.VUE_APP_SAMPLE_DATA_URL

export default {
  data () {
    return {
      csvUrl: ''
    }
  },
  computed: {
    trySampleLink () {
      return `/edit${simplifyGithubUrl(SAMPLE_DATA_URL)}`
    }
  },
  methods: {
    openFile () {
      this.$router.push(`/edit${simplifyGithubUrl(this.csvUrl)}`)
    }
  }
}
</script>

<template>
    <div class="container pt-3">
        <div v-if="isFetching">
            <b-row class="mt-5">
            <b-col cols="12">
                <b-spinner variant="primary" label="Spinning"></b-spinner>
            </b-col>
            <b-col cols="12" class="mt-3">
                Fetching Data
            </b-col>
            </b-row>
        </div>
        <div v-else>
            <b-row>
            <b-col cols="12">
                <b-form-textarea
                v-model="text"
                placeholder="Enter text here"
                rows="3"
                max-rows="3"
                ></b-form-textarea>
            </b-col>
            <b-col cols="12" class="text-left" v-if="inputErrorMessage.length > 0">
                <label class="text-danger"><i>{{ inputErrorMessage }}</i></label>
            </b-col>
            <b-col sm="12" md="3" offset-sm="0" offset-md="9" class="mt-2">
                <b-button variant="primary" v-on:click="post" style="width: 100%">Send</b-button>
            </b-col>
            </b-row>

            <b-row class="mt-3">
            <b-col cols="12" v-for="post in reversedPosts" v-bind:key="post.postId">
                <Comment :post="post" class="mb-2" 
                :canReport="isModerator"
                @onClickReport="reportPost"/>
            </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import Comment from '@/components/Comment.vue'

export default {
  components: {
    Comment,
  },
  computed: {
    reversedPosts() {
      return this.$store.getters.posts.slice().reverse();
    },
    isModerator() {
      return this.$store.getters.isModerator
    },
    thread() {
      return this.$store.getters.thread
    },
  },
  data() {
    return {
      isFetching: true,
      text: "",
      inputErrorMessage: "",
    }
  },
  mounted() {
    this.fetchPosts()
  },
  methods: {
    async fetchPosts() {
        this.isFetching = true;
        await this.$store.dispatch("fetchPosts");
        this.isFetching = false;
    },

    async post() {
      this.inputErrorMessage = ""

      if (this.thread == null) {
        this.inputErrorMessage = "Please connect first."
        return
      }

      if (this.text.length == 0){
        this.inputErrorMessage = "Please input your message."
        return
      }

      console.log("posting")
      await this.thread.post(this.text)
      this.text = ""
      await this.$store.dispatch("fetchPosts");
    //   this.posts = await this.thread.getPosts()
    },

    async reportPost(postId) {
      console.log(postId)
    }

  }
}
</script>
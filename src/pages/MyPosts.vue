<template>
    <b-container>
        <b-row class="mt-3">
            <b-col cols="12" v-for="post in myPosts" v-bind:key="post.postId">
                <Comment :post="post" :viewStatus="true" class="mb-2" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import Comment from '@/components/Comment.vue'

export default {
    components: {
        Comment,
    },
    computed: {
        user() {
            return this.$store.getters.user
        },
        myPosts() {
            let myPosts = this.$store.getters.posts.filter(post => post.author == this.user.DID)
            return myPosts.slice().reverse();
        }
    },
    mounted() {
        this.fetchPosts()
    },
    methods: {
        fetchPosts() {
            this.$store.dispatch("fetchPosts");
        }
    }
}
</script>
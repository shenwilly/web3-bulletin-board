<template>
    <b-container>
        <b-row class="mt-3">
            <!-- {{ reportedPosts }} -->
            <b-col cols="12" v-for="post in reportedPosts" v-bind:key="post.postId">
                <Comment :post="post" class="mb-2" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import GTCRService from '@/services/gtcr'
import Comment from '@/components/Comment.vue'

export default {
    components: {
        Comment,
    },
    computed: {
        user() {
            return this.$store.getters.user
        },
        account() {
            return this.$store.getters.accounts[0]
        },
        reportedPosts() {
            const posts = this.$store.getters.posts
            return posts.filter(post => {
                return this.reportedPostIds.includes(post.postId)
            });
        }
    },
    data() {
        return {
            reportedPostIds: [],
        }
    },
    mounted(){
        // console.log(this.profile)
        this.fetchMyReports()
    },
    methods: {
        async fetchMyReports() {
            this.reportedPostIds = await GTCRService.fetchReportedPostIds(this.account)
        }
    }
}
</script>
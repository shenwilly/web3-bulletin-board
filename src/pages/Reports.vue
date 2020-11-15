<template>
    <b-container>
        <b-row class="mt-3">
            <!-- {{ reportedPosts }} -->
            <b-col cols="12" v-for="post in reportedPosts" v-bind:key="post.postId">
                <Comment :post="post" :viewStatus="true" class="mb-2" @onClickView="goToCurate" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import GTCRService from '@/services/gtcr'
import Comment from '@/components/Comment.vue'
import { GTCR_VIEWER_URL, BLOCKED_POSTS_TCR_ADDRESS } from '@/env'

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
        reportedPostIds() {
            return this.reportedItems.map(item => item.decodedData[0])
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
            reportedItems: [],
        }
    },
    mounted(){
        // console.log(this.profile)
        this.fetchMyReports()
    },
    methods: {
        async fetchMyReports() {
            this.reportedItems = await GTCRService.fetchReportedItems(this.account)
        },
        goToCurate(postId) {
            console.log(this.reportedItems, postId)
            const item = this.reportedItems.find(item => item.decodedData[0].toLowerCase() == postId.toLowerCase())

            const url = GTCR_VIEWER_URL + "/" + BLOCKED_POSTS_TCR_ADDRESS + "/" + item[0];
            window.open(url)
        }
    }
}
</script>
<template>
    <b-container>
        My Reports
        <b-row>
            <b-col>
                {{ myPosts }}
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    computed: {
        user() {
            return this.$store.getters.user
        },
        myPosts() {
            return this.$store.getters.posts.filter(post => post.author == this.user.DID)
        }
    },
    mounted(){
        console.log(this.profile)
    }
}
</script>
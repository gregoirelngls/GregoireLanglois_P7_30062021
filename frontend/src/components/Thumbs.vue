<template>
        <div id="iconsThumbs">
            <i @click.prevent="likeMessage" class="fas fa-thumbs-up" aria-hidden="true"></i> {{ totallike }}
            <i @click.prevent="dislikeMessage" class="fa fa-thumbs-down" aria-hidden="true"></i> {{ totaldislike }}
        </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Thumbs',
    props:['message'],
    data(){
        return {
            totallike:0,
            totaldislike:0,
        }
    },
    methods:{
        likeMessage(){
            this.totallike += 1
            axios.post('http://localhost:3000/api/messages/:messageId/vote/like',{ 
                headers : {
                    'content-type': 'application/json',
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token
                },
            }) 
            .then(response =>console.log(response))
            .catch(error =>console.log(error))
        },

        dislikeMessage(){
            this.totaldislike -= 1
            axios.post('http://localhost:3000/api/messages/:messageId/vote/dislike',{ 
                headers : {
                    'content-type': 'application/json',
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token
                },
            }) 
            .then(response =>console.log(response))
            .catch(error =>console.log(error))
        },
    }
            

}
</script>

<style scoped>

#iconsThumbs{
    width: 50%;
    padding: 5px 10px;
    margin: 1%;
    font-size: 2.5vw;
}

#iconsThumbs i{
    margin: 3%;
}

.fa{
    color:red;
}

.fas{
    color:green;
}
</style>
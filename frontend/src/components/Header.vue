<template>
    <nav>
        <div class="nav-container">

            <div id="logo">
                <img src="../assets/logo.png" alt="logo groupomania" />
            </div>

            <ul id="icons">
                
                <li class="nav-barre">
                    <router-link class="routerLink" to="/createmessage">
                    <i class="fas fa-plus"></i>
                    </router-link>
                </li>

                <li class="nav-barre">
                    <router-link class="routerLink" to="/messages">
                    <i class="fas fa-comments"></i>
                    </router-link>
                </li>

                <li class="nav-barre">
                    <router-link class="routerLink" to="/user">
                    <i class="fas fa-user"></i>
                    </router-link>
                </li>

                <li class="nav-barre">
                    <router-link class="routerLink" to="/About">
                    <i class="fas fa-question-circle"></i>
                    </router-link>
                </li>
            </ul>
            <router-view />

        </div>
    </nav>
</template>


<script>
export default {
    name: 'Header',
    props:{
       
    }
}
</script>

<style scoped>

#logo {
    width: 100%;
}

nav{
    background-color:white;
}

.nav-container{
    position: relative;
    top:0em;
    display:flex;
    flex-direction:row;
    padding: 1%;
}

#icons {
    list-style: none;
    color: rgb(255, 122, 122);
    display: flex;
    padding-left: 0;
    margin-bottom: 0;
    padding-right: 3%;
    font-size: 1.8em;
    text-decoration: none;
} 

#icons i{
    color: rgb(255, 122, 122);
    text-decoration: none;
}

.nav-barre{
    padding-right: 1em;
}

#icons li :hover{
    color:crimson
}


</style>
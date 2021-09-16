import { createWebHistory, createRouter } from "vue-router";
import Login from "../views/login.vue";
import Wall from "../views/wall.vue";
import About from "../views/About";
import CreateMessage from "../views/CreateMessage";
import User from "../views/User";

const routes = [
  { 
    name: 'login',
    path: '/', 
    component: Login,
  },
  { 
    name: 'wall',
    path: '/messages', 
    component: Wall, 
    props:true 
  },
  {
    name: 'About',
    path: '/about',
    component: About,
  },
  {
    name: 'CreateMessage',
    path: '/createmessage',
    component: CreateMessage,
  },
  {
    name:'User',
    path: '/user',
    component: User,
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
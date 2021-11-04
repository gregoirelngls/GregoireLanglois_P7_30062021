import { createWebHistory, createRouter } from "vue-router";
import Login from "../views/login.vue";
import Wall from "../views/wall.vue";
import About from "../views/About";
import User from "../views/User";
import Edit from "../views/Edit.vue";
// import UpdateMessage from "../views/UpdateMessage";

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
    name:'User',
    path: '/user',
    component: User,
  },
  // {
  //   name: 'UpdateMessage',
  //   path: '/updateMessage', 
  //   component: UpdateMessage,
  //   props:true
  // },
  {
    name: 'Edit',
    path: '/edit/:id', 
    component: Edit,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
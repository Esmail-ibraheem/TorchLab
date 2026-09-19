import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
import Packages from '@/views/Packages.vue';
import Package from '@/views/Package.vue';

const routes = [
  {
    name: 'home',
    path: '/TorchLab/',
    component: Home
  },
  {
    name: 'packages',
    path: '/TorchLab/packages',
    component: Packages
  },
  {
    name: 'package',
    path: '/TorchLab/package/:id',
    component: Package
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

export default router;

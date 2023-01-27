import FeaturesRoutes from './FeaturesRoutes';
import PageRoutes from './PageRoutes';
import Components from './Components';
import Apps from './Applications';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "Dashboard" */ '@/view/dashboard/Dashboard.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/view/dashboard'),
      },
      {
        path: 'crm',
        name: 'crm',
        component: () => import(/* webpackChunkName: "CRM" */ '@/view/dashboard/CRM.vue'),
      },

    ],
  },
  {
    path: '/campaigns',
    name: 'campaigns',
    component: () => import(/* webpackChunkName: "axios" */ '@/view/crud/axios/Index.vue'),
    children: [
      {
        path: 'view-campaign',
        name: 'view',
        component: () => import(/* webpackChunkName: "axios-view" */ '@/view/pages/campaigns/viewCampaigns.vue'),
      },
      {
        path: 'edit/:id',
        name: 'edit',
        component: () => import(/* webpackChunkName: "axios-edit" */ '@/view/crud/axios/edit.vue'),
      },
      {
        path: 'create-campaign',
        name: 'create',
        component: () => import(/* webpackChunkName: "axios-add" */ '@/view/pages/campaigns/createCampaign.vue'),
      },
    ],
  },
  {
    path: '/events',
    name: 'fireStore',
    component: () => import(/* webpackChunkName: "fireStore" */ '@/view/crud/fireStore/Index.vue'),
    children: [
      {
        path: 'event-view',
        name: 'event-view',
        component: () => import(/* webpackChunkName: "fireStore-view" */ '@/view/crud/fireStore/View.vue'),
      },
      {
        path: 'fireStore-edit/:id',
        name: 'fireStore-edit',
        component: () => import(/* webpackChunkName: "fireStore-edit" */ '@/view/crud/fireStore/edit.vue'),
      },
      {
        path: 'event-create',
        name: 'event-create',
        component: () => import(/* webpackChunkName: "fireStore-add" */ '@/view/crud/fireStore/addNew.vue'),
      },
    ],
  },
  ...PageRoutes,
  ...FeaturesRoutes,
  ...Components,
  ...Apps,
];

export default routes;

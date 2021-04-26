export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
          {
            name: 'register',
            path: '/user/register',
            component: './User/register',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/services',
              },
              {
                name: 'Services',
                icon: 'profile',
                path: '/services',
                component: './Services',
              },
              {
                name: 'Reservations',
                icon: 'table',
                path: '/reservations',
                component: './Reservations',
              },
              {
                name: 'Employees',
                icon: 'team',
                path: '/employees',
                component: './Employees',
              },
              {
                name: 'Company info',
                icon: 'user',
                path: '/profile',
                component: './Profile/basic',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];

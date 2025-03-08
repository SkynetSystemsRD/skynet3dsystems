export default [
  {
    title: 'Dashboards',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Analytics',
        to: 'dashboards-analytics',
      },
      {
        title: 'CRM',
        to: 'dashboards-crm',
      },
      {
        title: 'Ecommerce',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Projects',
        to: 'dashboards-projects',
      },
      {
        title: 'Logistics',
        to: 'dashboards-logistics',
      },
    ],
    badgeContent: '5',
    badgeClass: 'bg-error',
  },
  {
    title: 'Front Pages',
    icon: { icon: 'tabler-files' },
    children: [
      {
        title: 'Landing',
        to: 'main-pages-landing-page',
        target: '_blank',
      },
      {
        title: 'Pricing',
        to: 'main-pages-pricing',
        target: '_blank',
      },
      {
        title: 'Payment',
        to: 'main-pages-payment',
        target: '_blank',
      },
      {
        title: 'Checkout',
        to: 'main-pages-model-checkout',
        target: '_blank',
      },
      {
        title: 'Help Center',
        to: 'main-pages-help-center',
        target: '_blank',
      },
    ],
  },
]

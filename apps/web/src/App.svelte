<script lang="ts">
  import Counter from './lib/Counter.svelte';
  import { Router, type Route, type RouteConfig } from '@mateothegreat/svelte5-router';
  import UploadPage from './pages/PageUpload.svelte';
  import PageHome from './pages/PageHome.svelte';
  import Layout from './Components/Layout.svelte';

  const router_config: RouteConfig[] = [
    {
      path: '/',
      component: PageHome
    },
    {
      path: '/upload',
      component: UploadPage
    }
  ];
</script>

<Layout>
  <Router basePath="/" routes={router_config} />
</Layout>

<script lang="ts">
  import { useDatabaseList } from '../utility/metadataLoaders';
  import AppObjectList from './AppObjectList.svelte';
  import DatabaseAppObject from './DatabaseAppObject.svelte';

  export let data;

  $: databases = useDatabaseList({ conid: data._id });
</script>

<AppObjectList list={($databases || []).map(db => ({ ...db, connection: data }))} component={DatabaseAppObject} />

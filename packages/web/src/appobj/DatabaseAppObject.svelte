<script lang="ts">
  import _ from 'lodash';

  import { currentDatabase } from '../stores';

  import AppObjectCore from './AppObjectCore.svelte';

  export let data;
  export let commonProps;
</script>

<AppObjectCore
  {...commonProps}
  {data}
  title={data.name}
  icon="img database"
  isBold={_.get($currentDatabase, 'connection._id') == _.get(data.connection, '_id') &&
    _.get($currentDatabase, 'name') == data.name}
  on:click={() => ($currentDatabase = data)}
/>

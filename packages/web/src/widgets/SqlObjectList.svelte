<script lang="ts">
  import InlineButton from './InlineButton.svelte';
  import SearchInput from './SearchInput.svelte';
  import WidgetsInnerContainer from './WidgetsInnerContainer.svelte';
  import { useDatabaseInfo, useDatabaseStatus } from '../utility/metadataLoaders';
  import SearchBoxWrapper from './SearchBoxWrapper.svelte';
  import AppObjectList from '../appobj/AppObjectList.svelte';
  import _ from 'lodash';
  import DatabaseObjectAppObject from '../appobj/DatabaseObjectAppObject.svelte';
  import { currentDatabase } from '../stores';

  export let conid;
  export let database;

  $: objects = useDatabaseInfo({ conid, database });
  $: status = useDatabaseStatus({ conid, database });

  $: objectList = _.flatten(
    ['tables', 'views', 'procedures', 'functions'].map(objectTypeField =>
      _.sortBy(
        (($objects || {})[objectTypeField] || []).map(obj => ({ ...obj, objectTypeField })),
        ['schemaName', 'pureName']
      )
    )
  );
</script>

<SearchBoxWrapper>
  <SearchInput placeholder="Search connection" />
  <InlineButton>Refresh</InlineButton>
</SearchBoxWrapper>
<WidgetsInnerContainer>
  <AppObjectList list={objectList.map(x => ({ ...x, conid, database }))} component={DatabaseObjectAppObject} />
</WidgetsInnerContainer>

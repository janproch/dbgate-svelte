<script lang="ts" context="module">
  function getTabDbName(tab) {
    if (tab.props && tab.props.conid && tab.props.database) return tab.props.database;
    if (tab.props && tab.props.archiveFolder) return tab.props.archiveFolder;
    return '(no DB)';
  }

  function getTabDbKey(tab) {
    if (tab.props && tab.props.conid && tab.props.database)
      return `database://${tab.props.database}-${tab.props.conid}`;
    if (tab.props && tab.props.archiveFolder) return `archive://${tab.props.archiveFolder}`;
    return '_no';
  }

  function getDbIcon(key) {
    if (key.startsWith('database://')) return 'icon database';
    if (key.startsWith('archive://')) return 'icon archive';
    return 'icon file';
  }
</script>

<script lang="ts">
  import _ from 'lodash';
  import FontIcon from '../icons/FontIcon.svelte';

  import { currentDatabase, openedTabs } from '../stores';
  import { setSelectedTab } from '../utility/common';

  $: currentDbKey =
    $currentDatabase && $currentDatabase.name && $currentDatabase.connection
      ? `database://${$currentDatabase.name}-${$currentDatabase.connection._id}`
      : '_no';

  $: tabsWithDb = $openedTabs
    .filter(x => !x.closedTime)
    .map(tab => ({
      ...tab,
      tabDbName: getTabDbName(tab),
      tabDbKey: getTabDbKey(tab),
    }));

  $: tabsByDb = _.groupBy(tabsWithDb, 'tabDbKey');
  $: dbKeys = _.keys(tabsByDb).sort();

  const handleTabClick = (e, tabid) => {
    if (e.target.closest('.tabCloseButton')) {
      return;
    }
    setSelectedTab(tabid);
  };

  const closeTabFunc = closeCondition => tabid => {
    openedTabs.update(files => {
      const active = files.find(x => x.tabid == tabid);
      if (!active) return files;

      const newFiles = files.map(x => ({
        ...x,
        closedTime: x.closedTime || (closeCondition(x, active) ? new Date().getTime() : undefined),
      }));

      if (newFiles.find(x => x.selected && x.closedTime == null)) {
        return newFiles;
      }

      const selectedIndex = _.findLastIndex(newFiles, x => x.closedTime == null);

      return newFiles.map((x, index) => ({
        ...x,
        selected: index == selectedIndex,
      }));
    });
  };

  const closeTab = closeTabFunc((x, active) => x.tabid == active.tabid);
  const closeAll = () => {
    const closedTime = new Date().getTime();
    openedTabs.update(tabs =>
      tabs.map(tab => ({
        ...tab,
        closedTime: tab.closedTime || closedTime,
        selected: false,
      }))
    );
  };
  const closeWithSameDb = closeTabFunc(
    (x, active) =>
      _.get(x, 'props.conid') == _.get(active, 'props.conid') &&
      _.get(x, 'props.database') == _.get(active, 'props.database')
  );
  const closeWithOtherDb = closeTabFunc(
    (x, active) =>
      _.get(x, 'props.conid') != _.get(active, 'props.conid') ||
      _.get(x, 'props.database') != _.get(active, 'props.database')
  );
  const closeOthers = closeTabFunc((x, active) => x.tabid != active.tabid);
  const handleMouseUp = (e, tabid) => {
    if (e.button == 1) {
      e.preventDefault();
      closeTab(tabid);
    }
  };
</script>

{#each dbKeys as dbKey}
  <div class="db-wrapper">
    <div class="db-name" class:selected={tabsByDb[dbKey][0].tabDbKey == currentDbKey}>
      <FontIcon icon={getDbIcon(dbKey)} />
      {tabsByDb[dbKey][0].tabDbName}
    </div>
    <div class="db-group">
      {#each _.sortBy(tabsByDb[dbKey], ['title', 'tabid']) as tab}
        <div
          class="file-tab-item"
          class:selected={tab.selected}
          on:click={e => handleTabClick(e, tab.tabid)}
          on:mouseup={e => handleMouseUp(e, tab.tabid)}
        >
          <FontIcon icon={tab.busy ? 'icon loading' : tab.icon} />
          <span class="file-name">
            {tab.title}
          </span>
          <span class="close-button tabCloseButton" on:click={e => closeTab(tab.tabid)}>
            <FontIcon icon="icon close" />
          </span>
        </div>
      {/each}
    </div>
  </div>
{/each}

<style>
  .db-group {
    display: flex;
    flex: 1;
    align-content: stretch;
  }
  .db-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .db-name {
    text-align: center;
    font-size: 8pt;
    border-bottom: 1px solid var(--theme-border);
    border-right: 1px solid var(--theme-border);
    cursor: pointer;
    user-select: none;
    padding: 1px;
    position: relative;
    white-space: nowrap;

    overflow: hidden;
    text-overflow: ellipsis;
  }
  .db-name:hover {
    background-color: var(--theme-bg-3);
  }
  .db-name.selected {
    background-color: var(--theme-bg-1);
  }
  .file-tab-item {
    border-right: 1px solid var(--theme-border);
    padding-left: 15px;
    padding-right: 15px;
    flex-shrink: 1;
    flex-grow: 1;
    min-width: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
  .file-tab-item.selected {
    background-color: var(--theme-bg-1);
  }
  .file-name {
    margin-left: 5px;
  }
  .close-button {
    margin-left: 5px;
    color: var(--theme-font-3);
  }
  .close-button:hover {
    color: var(--theme-font-1);
  }
</style>

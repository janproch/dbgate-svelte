<script lang="ts">
  import { update } from 'lodash';
  import FontIcon from '../icons/FontIcon.svelte';
  import { selectedWidget, visibleCommandPalette, visibleToolbar } from '../stores';

  const widgets = [
    {
      icon: 'icon database',
      name: 'database',
      title: 'Database connections',
    },
    // {
    //   icon: 'fa-table',
    //   name: 'table',
    // },
    {
      icon: 'icon file',
      name: 'file',
      title: 'Closed tabs & Saved SQL files',
    },
    {
      icon: 'icon archive',
      name: 'archive',
      title: 'Archive (saved tabular data)',
    },
    {
      icon: 'icon plugin',
      name: 'plugins',
      title: 'Extensions & Plugins',
    },
    {
      icon: 'icon favorite',
      name: 'favorites',
      title: 'Favorites',
    },
    // {
    //   icon: 'fa-cog',
    //   name: 'settings',
    // },
    // {
    //   icon: 'fa-check',
    //   name: 'settings',
    // },
  ];

  function handleChangeWidget(name) {
    $selectedWidget = name == $selectedWidget ? null : name;
  }
  //const handleChangeWidget= e => (selectedWidget.set(item.name))
</script>

{#if !$visibleToolbar}
  <div class="wrapper mb-3" on:click={() => ($visibleCommandPalette = true)}>
    <FontIcon icon="icon menu" />
  </div>
{/if}
{#each widgets as item}
  <div class="wrapper" class:selected={item.name == $selectedWidget} on:click={() => handleChangeWidget(item.name)}>
    <FontIcon icon={item.icon} />
  </div>
{/each}

<style>
  .wrapper {
    font-size: 23pt;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--theme-font-inv-2);
  }
  .wrapper:hover {
    color: var(--theme-font-inv-1);
  }
  .wrapper.selected {
    color: var(--theme-font-inv-1);
    background: var(--theme-bg-inv-3);
  }
</style>

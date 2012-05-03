# meminfo
`meminfo` is a module for reading `/proc/meminfo` data.

## Installation

    npm install meminfo

## Usage
```js
require('meminfo')(function (err, data) {
  console.dir(data);
});
```

Output:

```
{ MemTotal: '3145728',
  MemFree: '3062044',
  Buffers: '0',
  Cached: '0',
  SwapCached: '0',
  Active: '0',
  Inactive: '0',
  HighTotal: '0',
  HighFree: '0',
  LowTotal: '3145728',
  LowFree: '3062044',
  SwapTotal: '0',
  SwapFree: '0',
  Dirty: '0',
  Writeback: '0',
  AnonPages: '0',
  Mapped: '0',
  Slab: '0',
  PageTables: '0',
  NFS_Unstable: '0',
  Bounce: '0',
  CommitLimit: '0',
  Committed_AS: '0',
  VmallocTotal: '0',
  VmallocUsed: '0',
  VmallocChunk: '0',
  HugePages_Total: '0',
  HugePages_Free: '0',
  HugePages_Rsvd: '0',
  Hugepagesize: '2048' }
```

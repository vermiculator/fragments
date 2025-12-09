---
url: " https://anytype.io/"
title: AnyType
aliases:
  - AnySync
  - anysync
  - anytype
kind:
  - collective
  - tech company
  - tech ecosystem
  - protocol
---

- AnyType is promising in lots of ways 
	- but remains very siloed, its still not stored in a way that makes it easily interoperable or exportable
	- its values don't always actually align with its design.
	- but good use of local-first with backup nodes - 'You can choose to self-host your own backup node or use ‘local-only’ mode, which means that data will only be synced across verified devices in your local network.'
	- it doesn't properly build upon or interface with similar tools
	- it does have open source protocols
	- its applications are permissively licensed for non-commercial use (explicitly allows academic use)
	- significant contributors can 'join' somehow - see https://blog.anytype.io/our-open-philosophy/
	- 'we guarantee everyone the right to use, modify, and distribute the data exchange protocol and the data format'

so could build upon the data format to make it more md-workable?

the anysync protocol is based on CRDTs, i read about these in undergrad - [[Conflict-free replicated data types]], promising 

want something like anytype but specifically for ideas and actions rather than for objects and spaces - fragments of text, single img or clip or screenshot or link -- akin to tumblr posts or are.na links, connected and combined in similar ways. so it must be saved in semi-readable format 

https://github.com/anyproto/any-sync

any-sync is written in Go. I worked a bit with Go in the past but Do Not remember enough
surely i can't build on any-sync anyway if i don't physically have the storage nodes 
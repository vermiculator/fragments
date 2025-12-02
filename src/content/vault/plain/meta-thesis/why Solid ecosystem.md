---
parent:
  - "[[Masters in public]]"
---
the needs for
- data ownership/portability/control/etc
- hyperconnectivity, linked data, semantic web

A: [[RDF]]

- how can we use RDF 
	- in an established ecosystem
	- with common standards and interoperability
	- old web style / durable

A: [[Solid (RDF)|Solid]]

- but how do we do this
	- [[Solid limitations]]
	- [[data format decisions]]

why quads
- in need of a fourth element to the triple Statement
- to give details of context 
	- such as perspective of data or author of changes, depending on how we decide to implement 

selecting a Quad format
	- information sciences consider this problem when formatting their data in eg humanities
	- what are the options
	- humanities/archival fields often deal with 'complexity of uncertain or even contested knowledge' - [[quickref#^f291c4]]
	- this is just the sort of consideration we are dealing with here - trust, authorship, lineage

- why Conjectural Graphs?
	- are an extension of Named Graphs
		- why Named Graphs?
			- use quads
			- fully compliant with RDF and SPARQL standards.
			- support multiple serialization formats, such as TriG, TriX, and N-Quads
			- scalable
	- "Conjectural Graphs are particularly useful in domains like the Arts and Humanities, where repre­senting uncertain or evolving claims without asserting them as facts is essential."  - [[quickref#^f291c4]]


- so, are Conjectural Graphs compatible with the Community Solid Server?
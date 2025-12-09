---
title: 'data format decisions'
---

Through [[insights from my own experience|my experiences]] selecting tools in the past I'd always come back to markdown as the format that is the most portable, the most human readable but extensible through other syntax eg YAML that gives it properties useful for sorting and refinding. JSON and XML are very portable but not readable and don't prioritise the actual 'note-like' content, and .txt doesn't give basic formatting. No other non-proprietary formats are widely used enough for interoperability with most commonly used text editors from the very simple to the more complex. But markdown isn't enough when it comes to structured metadata for better linking, searching and finding, crucial to curation. 

When it comes to structured metadata, we're in the world of linked data and the semantic web, which means RDF is the commonly used data format (and the format used by Solid Pods), so the question becomes compatibility between markdown and various extended forms of RDF.

For the infrastructure I'm considering here, necessitating added context to each RDF Statement, formats that add provenance to each RDF Statement are he methods I must select from, and analyse their compatibility with Solid's data store and with embedding in or translating to/from markdown (with YAML). 

Extensive review and comparison of existing methods have been conducted but of most relevance to this research is the review for usage with cultural heritage as it is conducted from a curational perspective and with attention to possibly contested provenance, which is a common issue in sources of internet content recirculated out of context.

---


Write about how triples are useful for semantic links, semantic web. But also write about how we need authorship of each triple for trust reasons. Like who established this as truth and who confirms it. Timestamped signature of an Agent. Anyone who uses it implicitly affirms it? And can choose to explicitly affirm it


https://www.sciencedirect.com/science/article/pii/S1570826805000235?via%3Dihub
8.3. Publishing with signatures
"Information providers may decide to digitally sign graphs, when they wish to allow information consumers to have greater confidence in the information published."

A survey of existing approaches to provenance in RDF - "in many humanities disciplines, the concept of “truth” is inherently tied to provenance, as truth is often considered a statement with adequate supporting sources. " - https://academic.oup.com/dsh/advance-article/doi/10.1093/llc/fqaf076/8219704

Define RDF early on
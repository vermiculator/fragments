---
parent:
  - "[[web infrastructure]]"
  - "[[data storage]]"
peer:
  - "[[Web 1.0]]"
  - "[[Web 3.0]]"
  - "[[Solid (RDF)|Solid]]"
---

RDF stands for _Resource Description Framework_
It is an old-web/indie-web/new-web data storage standard used for linked data

[SPARQL](https://en.wikipedia.org/wiki/SPARQL "SPARQL") is a standard query language for RDF graphs.
[RDF Schema](https://en.wikipedia.org/wiki/RDF_Schema "RDF Schema") (RDFS), [Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language "Web Ontology Language") (OWL) and [SHACL](https://en.wikipedia.org/wiki/SHACL "SHACL") (Shapes Constraint Language) are ontology languages that are used to describe RDF data.


A *Document* contains a list of relationships between things. 
e.g. [Vincent's WebID](https://vincentt.inrupt.net/profile/card#me) contain the following relationships:

| Subject | Predicate                            | Object    |
| ------- | ------------------------------------ | --------- |
| `#me`   | has name (`foaf:name`)               | Vincent   |
| `#me`   | works at (`vcard:organization-name`) | Inrupt    |
| `#me`   | job title (`vcard:role`)             | Developer |

Every row contains a _Statement_
The 'Subject' is the unique identifier.
The three parts together are also commonly referred to as a _Triple_

the *Predicate* give metadata to links -- semantic links!

*Documents* describing terms form shared *Vocabularies*, the agreed-upon usage of particular terms -- multi-view of language -- choosing the version of 'name' that you personally mean in this context

Personal namespaces for individual defaults according to your own meanings, that may or may not align with established standards

The *Public Type Index* is itself a publicly accessible *Document* stored in the user's *Pod*. This Document contains a list of links to other *Documents*, along with the type of data that is to be included in those *Documents*.



## Common Namespaces
- http://www.w3.org/2006/vcard
- http://xmlns.com/foaf/0.1/
- 
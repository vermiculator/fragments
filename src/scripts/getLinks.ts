import { getEntry } from 'astro:content';
import type { DataEntryMap, ReferenceDataEntry } from 'astro:content';

export async function getLinks(which: string, collection: keyof DataEntryMap | (keyof DataEntryMap)[], id: string): Promise<ReferenceDataEntry<keyof DataEntryMap>[]> {

		// If collection is an array, try each collection in order until we find the entry
		const collections = Array.isArray(collection) ? collection : [collection];

		let content = null;
		for (const coll of collections) {
			content = await getEntry(coll, id);
			if (content) break;
		}

		if (!content) {
			return [];
		} else if (!content.data) {
			return [];
		} else {
			switch (which) {
				case "parents":
					const parents = (content.data as any).parent ?? [];
					const instanceOf = (content.data as any).instanceOf ?? [];
					return [...parents, ...instanceOf];
				case "peers":
					return (content.data as any).peer ?? [];
				case "children":
					const children = (content.data as any).child ?? [];
					const instances = (content.data as any).instances ?? [];
					return [...children, ...instances];
				default:
					return [];
			}
		}

	}
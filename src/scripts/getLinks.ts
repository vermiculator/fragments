import { getEntry } from 'astro:content';
import type { DataEntryMap, ReferenceDataEntry } from 'astro:content';

export async function getLinks(which: string, collection: keyof DataEntryMap, id: string): Promise<ReferenceDataEntry<keyof DataEntryMap>[]> {
		const content = await getEntry(collection, id);
		if (!content) {
			return [];
		} else if (!content.data) {
			return [];
		} else {
			switch (which) {
				case "parents":
					return content.data.parent ?? [];
				case "peers":
					return content.data.peer ?? [];
				case "children":
					return content.data.child ?? [];
				default:
					return [];
			}
		}

	}
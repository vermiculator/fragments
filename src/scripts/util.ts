export function slugify (link:string):string {
  if(link && link!== ''){
  return link.normalize('NFKD') // decompose diacritics
              .replace(/[\u0300-\u036f]/g, '') // remove diacritic marks
              .toLowerCase()
              .trim()
              .replace(/[^\p{L}\p{N}\s-]+/gu, '') // remove punctuation (keep letters/numbers/spaces/hyphen)
              .replace(/[\s_]+/g, '-') // spaces and underscores -> hyphen
              .replace(/-+/g, '-') // collapse multiple hyphens
              .replace(/^-|-$/g, ''); // trim leading/trailing hyphens
 } return ''
}

export function debracketKeepTitleOrAlias (link: string): string {
  if (link && link !== '') {
    const match = link.match(/^\s*\[\[([\s\S]+?)\]\]\s*$/);
    const content = match ? match[1] : link;
    const parts = content.split('|');
    return (parts.length > 1 ? parts[1] : parts[0].trim());
  }
  return ''
}

export function debracketKeepAlias (link: string): string {
  if (link && link !== '') {
    const match = link.match(/^\s*\[\[([\s\S]+?)\]\]\s*$/);
    const content = match ? match[1] : link;
    const parts = content.split('|');
    return (parts.length > 1 ? parts[1] : '');
  }
  return ''
}

export function debracketKeepFirst (link:string):string {
  if (link && link !== '') {
    const match = link.match(/^\s*\[\[([\s\S]+?)\]\]\s*$/);
    const content = match ? match[1] : link;
    const parts = content.split('|');
    return parts[0].trim();
  }
  return ''
}

export function baseify (link:string):string {
  return link.replace(/^\/(md|mdx|plain)\//, '/').split('/').slice(0, -1).join('/') + '/';
}
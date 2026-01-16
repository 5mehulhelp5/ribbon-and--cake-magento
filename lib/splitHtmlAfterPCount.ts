export function splitHtmlAfterPCount(html: string, pLimit = 5) {
    if (!html) return { first: '', second: '' };
  
    let pCount = 0;
    let splitIndex = -1;
  
    // Scan HTML safely
    const regex = /<\/p>/gi;
    let match: RegExpExecArray | null;
  
    while ((match = regex.exec(html)) !== null) {
      pCount++;
      if (pCount === pLimit) {
        splitIndex = match.index + match[0].length;
        break;
      }
    }
  
    // If fewer than pLimit <p> tags, don't split
    if (splitIndex === -1) {
      return { first: html, second: '' };
    }
  
    return {
      first: html.slice(0, splitIndex),
      second: html.slice(splitIndex),
    };
  }
  
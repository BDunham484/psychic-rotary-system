import React from 'react';
import styles from './ShowDescription.module.css';

// Matches a [text](url) token where the url is an http/https/mailto link. The scheme requirement
// is the intentional guard against false positives: a literal "[see](here)" in prose won't match.
// [^\s)]+ stops the url at whitespace or the token's closing paren; the scraper percent-encodes
// any literal ) in the url to %29 so a real url is never truncated.
const LINK_TOKEN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g;

// Parse a description string into an array of React nodes: plain strings for ordinary text and
// <a> elements for [text](url) tokens. Safe by construction — anchors are only ever built from
// regex matches whose url scheme is http/https/mailto, so no raw HTML is injected.
export const linkifyDescription = (text) => {
    if (!text) return [];
    const nodes = [];
    let lastIndex = 0;
    let key = 0;
    let match;
    LINK_TOKEN.lastIndex = 0;
    while ((match = LINK_TOKEN.exec(text)) !== null) {
        const [full, label, url] = match;
        if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
        nodes.push(
            <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {label}
            </a>
        );
        lastIndex = match.index + full.length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
};

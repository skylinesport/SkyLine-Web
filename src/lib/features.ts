// Site feature flags — plain booleans the repo records as product decisions.
// Flip a flag to turn a surface on or off; nothing else needs to change.

/**
 * Campus Ambassadors page (`/ambassadors`) and its navbar links.
 *
 * Disabled for now: the page's showcase marquee is placeholder-only until we
 * have real ambassador photos to display. Flip to `true` once the images are
 * in (see ROW_ONE / ROW_TWO in pages/Ambassadors.tsx) to bring the page and
 * its nav links back — that's the only change required.
 */
export const AMBASSADORS_ENABLED = false;

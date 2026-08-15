import { MSMarkOutline } from "./MSMarkOutline";

/**
 * Opening sequence: the brackets close in around the initials, then the
 * signature gradient draws underneath and the whole thing lifts away.
 *
 * The animation reads the mark the way the mark is built — `< MS />` is an
 * element wrapping its contents, so the brackets arrive last and enclose it.
 *
 * Deliberately CSS-only and server-rendered:
 *   · it paints with the first frame of HTML, before any JS has run, which is
 *     the whole point of a loading screen;
 *   · it dismisses on a timer it owns, so it cannot get wedged waiting on a
 *     hydration or network event that never lands;
 *   · with JS disabled it still clears itself.
 *
 * The markup behind it is fully server-rendered, so this is decorative rather
 * than a real loading state — hence `aria-hidden`. Assistive tech reads the
 * page underneath immediately instead of being held at a spinner.
 */
export function Loader() {
  return (
    <div className="loader" aria-hidden>
      <div className="loader__stack">
        <MSMarkOutline
          className="loader__mark"
          bracketClassName="loader__bracket"
          initialsClassName="loader__initials"
        />
        <div className="loader__rule" />
      </div>
    </div>
  );
}

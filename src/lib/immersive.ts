/**
 * "Immersive" mode for phones: full screen and locked sideways, so the game fills the display
 * like a movie. Only touch devices are affected; a desktop browser is left alone.
 *
 * Browsers only allow full screen after a tap, so call `enterImmersive()` from a click handler
 * (the "Begin Mission" button). Orientation lock works on Android Chrome (and only while in full
 * screen). iPhone Safari offers neither API, so there the game asks the player to turn the phone
 * (see the rotate prompt on the game screen) and works best added to the Home Screen
 * (public/manifest.webmanifest + the meta tags in index.html).
 */
interface OrientationLock {
  lock?: (orientation: string) => Promise<void>;
  unlock?: () => void;
}

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export async function enterImmersive(): Promise<void> {
  if (!isTouch()) return;
  const root = document.documentElement;
  try {
    if (!document.fullscreenElement && root.requestFullscreen) await root.requestFullscreen({ navigationUI: 'hide' });
  } catch {
    /* Refused (no tap, or unsupported): carry on without full screen. */
  }
  try {
    await (screen.orientation as unknown as OrientationLock | undefined)?.lock?.('landscape');
  } catch {
    /* Unsupported (iPhone) or not allowed: the rotate prompt covers it. */
  }
}

export function exitImmersive(): void {
  if (!isTouch()) return;
  try {
    (screen.orientation as unknown as OrientationLock | undefined)?.unlock?.();
  } catch {
    /* ignore */
  }
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

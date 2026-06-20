import { LivePhotoViewer } from "live-photo";

interface MountState {
  viewer: LivePhotoViewer;
  cleanup: () => void;
}

const mounts = new WeakMap<HTMLElement, MountState>();

function setupImageInteraction(
  container: HTMLElement,
  viewer: LivePhotoViewer,
): () => void {
  const overlay = container.querySelector<HTMLElement>(".live-photo-overlay");
  if (!overlay) return () => {};

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let hoverStopTimer: ReturnType<typeof setTimeout> | undefined;

  const onEnter = () => {
    if (!canHover) return;
    if (hoverStopTimer) {
      clearTimeout(hoverStopTimer);
      hoverStopTimer = undefined;
    }
    void viewer.play();
  };

  const onLeave = () => {
    if (!canHover) return;
    if (hoverStopTimer) clearTimeout(hoverStopTimer);
    hoverStopTimer = setTimeout(() => {
      hoverStopTimer = undefined;
      viewer.stop();
    }, 120);
  };

  overlay.addEventListener("mouseenter", onEnter);
  overlay.addEventListener("mouseleave", onLeave);

  return () => {
    if (hoverStopTimer) clearTimeout(hoverStopTimer);
    overlay.removeEventListener("mouseenter", onEnter);
    overlay.removeEventListener("mouseleave", onLeave);
  };
}

function mountAll() {
  document
    .querySelectorAll<HTMLElement>(
      ".live-photo-mount[data-photo-src]:not([data-mounted])",
    )
    .forEach(container => {
      const photoSrc = container.dataset.photoSrc;
      const videoSrc = container.dataset.videoSrc;
      if (!photoSrc || !videoSrc) return;

      container.dataset.mounted = "true";

      let viewer!: LivePhotoViewer;

      const fitMedia = {
        styles: { objectFit: "contain" as const },
      };

      viewer = new LivePhotoViewer({
        photoSrc,
        videoSrc,
        container,
        width: "100%",
        autoplay: false,
        lazyLoadVideo: true,
        locale: "zh-CN",
        showMuteButton: true,
        borderRadius: 0,
        theme: "auto",
        enableVibration: false,
        imageCustomization: fitMedia,
        videoCustomization: fitMedia,
        onClick: () => {
          viewer.toggle();
        },
      });

      const cleanup = setupImageInteraction(container, viewer);
      mounts.set(container, { viewer, cleanup });
    });
}

function destroyAll() {
  document
    .querySelectorAll<HTMLElement>(".live-photo-mount[data-mounted]")
    .forEach(container => {
      const mount = mounts.get(container);
      mount?.cleanup();
      mount?.viewer.destroy();
      mounts.delete(container);
      delete container.dataset.mounted;
    });
}

mountAll();
document.addEventListener("astro:before-swap", destroyAll);
document.addEventListener("astro:page-load", mountAll);

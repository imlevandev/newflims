"use client";

import { useEffect } from "react";

function syncSlideClasses(
  slide: HTMLElement,
  index: number,
  activeIndex: number,
  visibleCount: number,
) {
  const isActive = index === activeIndex;
  const isNext = index === (activeIndex + 1) % visibleCount;
  const isVisible = index >= activeIndex && index < activeIndex + visibleCount;

  slide.classList.toggle("swiper-slide-active", isActive);
  slide.classList.toggle("swiper-slide-thumb-active", isActive);
  slide.classList.toggle("swiper-slide-next", isNext);
  slide.classList.toggle("swiper-slide-visible", isVisible || isActive);
  slide.classList.toggle("swiper-slide-fully-visible", isVisible || isActive);
}

function syncHeroSlider(wrapper: HTMLElement, activeIndex: number) {
  const main = wrapper.querySelector<HTMLElement>(".top-slide-main");
  const thumbs = wrapper.querySelector<HTMLElement>(".top-slide-small");
  const mainSlides = Array.from(
    main?.querySelectorAll<HTMLElement>(":scope > .swiper-wrapper > .swiper-slide") ?? [],
  );
  const thumbSlides = Array.from(
    thumbs?.querySelectorAll<HTMLElement>(":scope > .swiper-wrapper > .swiper-slide") ?? [],
  );

  if (mainSlides.length <= 1) {
    return;
  }

  const activeSlide = mainSlides[activeIndex];
  const slideWidth = activeSlide?.getBoundingClientRect().width || mainSlides[0].getBoundingClientRect().width || 1400;

  mainSlides.forEach((slide, index) => {
    syncSlideClasses(slide, index, activeIndex, mainSlides.length);
    slide.style.opacity = index === activeIndex ? "1" : "0";
    slide.style.transform = `translate3d(${-slideWidth * index}px, 0px, 0px)`;
  });

  thumbSlides.forEach((slide, index) => {
    syncSlideClasses(slide, index, activeIndex, Math.min(thumbSlides.length, 12));
  });

  const thumbWrapper = thumbs?.querySelector<HTMLElement>(":scope > .swiper-wrapper");
  const activeThumb = thumbSlides[activeIndex];

  if (thumbWrapper && activeThumb) {
    if (wrapper.classList.contains("big-slide-wrapper")) {
      thumbWrapper.style.transform = "translate3d(0px, 0px, 0px)";
      return;
    }

    const thumbWidth = activeThumb.getBoundingClientRect().width || 0;
    const offset = Math.max(0, activeIndex - 4) * thumbWidth;
    thumbWrapper.style.transform = `translate3d(${-offset}px, 0px, 0px)`;
  }
}

export function HomeSliderController() {
  useEffect(() => {
    const wrappers = Array.from(document.querySelectorAll<HTMLElement>(".slide-wrapper")).filter(
      (wrapper) => wrapper.querySelectorAll(".top-slide-main .swiper-slide").length > 1,
    );

    if (wrappers.length === 0) {
      return;
    }

    const activeIndexes = new WeakMap<HTMLElement, number>();

    wrappers.forEach((wrapper) => {
      activeIndexes.set(wrapper, 0);
      syncHeroSlider(wrapper, 0);
    });

    const handleThumbClick = (event: MouseEvent) => {
      const thumb = (event.target as Element | null)?.closest<HTMLElement>(
        ".top-slide-small .swiper-slide",
      );
      const wrapper = thumb?.closest<HTMLElement>(".slide-wrapper");

      if (!thumb || !wrapper || !wrappers.includes(wrapper)) {
        return;
      }

      const thumbSlides = Array.from(
        wrapper.querySelectorAll<HTMLElement>(".top-slide-small .swiper-slide"),
      );
      const fallbackIndex = thumbSlides.indexOf(thumb);
      const nextIndex = Number(thumb.dataset.slideIndex ?? fallbackIndex);
      const count = wrapper.querySelectorAll(".top-slide-main .swiper-slide").length;

      if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= count) {
        return;
      }

      activeIndexes.set(wrapper, nextIndex);
      syncHeroSlider(wrapper, nextIndex);
    };

    document.addEventListener("click", handleThumbClick);

    const intervalId = window.setInterval(() => {
      wrappers.forEach((wrapper) => {
        const count = wrapper.querySelectorAll(".top-slide-main .swiper-slide").length;
        const nextIndex = ((activeIndexes.get(wrapper) ?? 0) + 1) % count;

        activeIndexes.set(wrapper, nextIndex);
        syncHeroSlider(wrapper, nextIndex);
      });
    }, 5000);

    return () => {
      document.removeEventListener("click", handleThumbClick);
      window.clearInterval(intervalId);
    };
  }, []);

  return null;
}

'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Open Create Account Window
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scroll Down on "Learn more"
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // Scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation scroll
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const id = e.target.getAttribute('href');
    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed container
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // Guard clause
  if (!clicked) return;
  // Remove Active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  // Active tab
  clicked.classList.add('operations__tab--active');
  // Active Content
  document
    .querySelector(`.operations__content--${Number(clicked.dataset.tab)}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (o) {
  return function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        if (el !== link) el.style.opacity = o;
      });
      logo.style.opacity = o;
    }
  };
};
nav.addEventListener('mouseover', handleHover(0.5));
nav.addEventListener('mouseout', handleHover(1));

// Sticky Navigation
const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images
const featuresImg = document.querySelectorAll('.features__img');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    // only removes the blur filter when the img stops loading
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.8,
  rootMargin: '200px',
});
featuresImg.forEach(img => {
  img.classList.add('lazy-img');
  imgObserver.observe(img);
});

// Slider

const slider = function () {
  let curSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const maxSlide = slides.length - 1;
  const slideDots = document.querySelector('.dots');
  const createDots = function () {
    slides.forEach((_, i) => {
      slideDots.insertAdjacentHTML(
        'beforeend',
        `<button class ="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const dotActive = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(d => {
      d.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const changeSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  };

  function init() {
    changeSlide(0);
    createDots();
    dotActive(0);
  }

  init();

  const nextSlide = function () {
    if (curSlide < maxSlide) curSlide++;
    else curSlide = 0;
    changeSlide(curSlide);
    dotActive(curSlide);
  };
  const prevSlide = function () {
    if (curSlide > 0) curSlide--;
    else curSlide = maxSlide;
    changeSlide(curSlide);
    dotActive(curSlide);
  };

  //Event Handlers

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  slideDots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      changeSlide(slide);
      curSlide = slide;
      dotActive(curSlide);
    }
  });
};
slider();
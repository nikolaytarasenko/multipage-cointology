import $ from 'jquery';
import AOS from 'aos';
import 'bootstrap/js/dist/collapse.js';

const setActiveNavLink = () => {
  const currentPageName = window.location.pathname.slice(1, -5) || '/';
  const navLinks = document.querySelectorAll('.nav-link');

  if (currentPageName.length === 1) {
    navLinks[0].classList.add('active');
    return true;
  } else {
    navLinks.forEach(link => {
      if (link.href.includes(currentPageName)) link.classList.add('active');
    });
  }
}

const toggleHamburgerMenu = () => {
  const header = document.querySelector('.header');
  const hamburgerButton = document.querySelector('.hamburger-button');
  const animatedIcon = document.querySelector('.animated-icon');

  hamburgerButton.addEventListener('click', function() {
    header.classList.toggle('mobile-open');
    animatedIcon.classList.toggle('open');
    document.body.classList.toggle('overflow-hidden');
  });
}

const closeHamburgerMenu = () => {
  const header = document.querySelector('.header');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const animatedIcon = document.querySelector('.animated-icon');

  if (document.documentElement.clientWidth > 991) {
    header.classList.remove('mobile-open');
    animatedIcon.classList.remove('open');
    navbarCollapse.classList.remove('show');
    document.body.classList.remove('overflow-hidden');
  }
}

const initStickyHeader = e => {
  const header = document.querySelector('.header');
  const scrollY = window.scrollY;

  header.classList.toggle('sticky', scrollY > 0);
}

const hidePreloader = () => {
  const preloaderWrapper = document.querySelector('.preloader-wrapper');

  preloaderWrapper.classList.add('hide');
}

const resizeHandler = () => {
  closeHamburgerMenu();
}

const domContentLoadedHandler = () => {
  setActiveNavLink();
  toggleHamburgerMenu();

  window.addEventListener('scroll', initStickyHeader);
}

const loadHandler = () => {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false
  });

  hidePreloader();
}

window.addEventListener('resize', resizeHandler);
window.addEventListener('DOMContentLoaded', domContentLoadedHandler);
window.addEventListener('load', loadHandler);
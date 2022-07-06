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

const initStats = () => {
  if (localStorage.getItem('weekday')) {
    if (String(localStorage.getItem('weekday')) !== String(new Date().getDay())) {
      localStorage.clear();
    }
  }

  if (!document.querySelector('.home-page')) {
    return false;
  }

  const deals = {
    all: {
      min: 1500,
      max: 1550,
      increase() {
        return this.max - this.min;
      }
    },
    dollarProfit: {
      min: 22000,
      max: 27000,
      increase() {
        return this.max - this.min;
      }
    }
  }

  const $dealsAll = document.querySelector('#deals-all');
  const $dealsProfitable = document.querySelector('#deals-profitable');
  const $dealsDollars = document.querySelector('#deals-dollars');

  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const getProfitableDeals = deals => {
    const percent = 80;

    return Math.floor(deals / 100 * percent);
  }

  const renderStats = () => {
    $dealsAll.textContent = localStorage.getItem('allDeals');
    $dealsProfitable.textContent = localStorage.getItem('profitableDeals');
    $dealsDollars.innerHTML = localStorage.getItem('money') + '<span class="stats__item-sign">$</span>';
  }

  if (localStorage.getItem('isDone') === '1') {
    renderStats();

    return false;
  }

  const allDealsInit = getRandom(deals.all.min, deals.all.max);
  const maxAllDeals = allDealsInit + deals.all.increase();
  let allDealsCurrent = allDealsInit;
  let dollarProfitCurrent = (allDealsCurrent - deals.all.min) * (deals.dollarProfit.increase() / deals.all.increase()) + deals.dollarProfit.min;
  let isDone = 0;

  const setStorage = () => {
    localStorage.setItem('weekday', String(new Date().getDay()));
    localStorage.setItem('allDeals', allDealsInit);
    localStorage.setItem('maxAllDeals', maxAllDeals);
    localStorage.setItem('profitableDeals', String(getProfitableDeals(allDealsCurrent)));
    localStorage.setItem('money', String(Math.floor(dollarProfitCurrent)));
    localStorage.setItem('isDone', String(isDone));
  }

  const updateStorage = (all, profit, dollar) => {
    localStorage.setItem('allDeals', all);
    localStorage.setItem('profitableDeals', String(profit));
    localStorage.setItem('money', String(dollar));
  }

  if (!localStorage.getItem('allDeals')) {
    setStorage();
  }

  renderStats();

  const interval = setInterval(function() {
    const allDealsIncrease = getRandom(2, 5);
    allDealsCurrent = Number(localStorage.getItem('allDeals')) + allDealsIncrease;

    const profitableDealsCurrent = getProfitableDeals(allDealsCurrent);
    dollarProfitCurrent = Number(localStorage.getItem('money')) + (deals.dollarProfit.increase() / deals.all.increase()) * allDealsIncrease;

    if (allDealsCurrent > localStorage.getItem('maxAllDeals')) {
      clearInterval(interval);
      localStorage.setItem('isDone', String(1));

      return true;
    }

    updateStorage(allDealsCurrent, profitableDealsCurrent, Math.floor(dollarProfitCurrent));

    renderStats();
  }, 4000);
}

const resizeHandler = () => {
  closeHamburgerMenu();
}

const domContentLoadedHandler = () => {
  setActiveNavLink();
  toggleHamburgerMenu();
  initStats();

  window.addEventListener('scroll', initStickyHeader);
}

const loadHandler = () => {
  AOS.init({
    duration: 500,
    easing: "ease-in-out",
    once: true,
    mirror: false
  });

  hidePreloader();
}

window.addEventListener('resize', resizeHandler);
window.addEventListener('DOMContentLoaded', domContentLoadedHandler);
window.addEventListener('load', loadHandler);
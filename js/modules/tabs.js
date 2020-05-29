function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
     // Tabs
     const tabBtnsWrap = document.querySelector(tabsParentSelector),
     btns = document.querySelectorAll(tabsSelector),
     tabs = document.querySelectorAll(tabsContentSelector);

    function tabDisplay(chosen = 0) {
        tabs.forEach(item => {
            // item.style.display = 'none';
            item.classList.add('hide');
            item.classList.remove('show');
        });
        // tabs[chosen].style.display = 'flex';
        tabs[chosen].classList.add('show', 'fade');
        tabs[chosen].classList.remove('hide');
    }
    tabDisplay();

    function tabsChoose() {
        tabBtnsWrap.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains(tabsSelector.slice(1))) {
                btns.forEach((btn, i) => {
                    if (event.target == btn) {
                        tabDisplay(i);
                    }
                    btn.classList.remove(activeClass);
                });
                event.target.classList.add(activeClass);
            }
        });
    }
    tabsChoose();
}

export default tabs;


function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show', 'fade');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    console.log(modalTimerId);
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show', 'fade');
    document.body.style.overflow = '';
}

function modal(triigerSelector, modalSelector, modalTimerId) {
    //Modal
    const modalShow = document.querySelectorAll(triigerSelector),
        modal = document.querySelector(modalSelector);

    modalShow.forEach(item => {
        item.addEventListener('click', () => {
            openModal(modalSelector, modalTimerId);
        });
    });

    // Закрытие модального окна при клике за его границами
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });

    // Закрытие модального окна при нажатии Esc
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    // Открытие модального окна при скролле до низа страницы
    function shwModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight == document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', shwModalByScroll);
        }
    }
    window.addEventListener('scroll', shwModalByScroll);
}

export default modal;
export {openModal};
export {closeModal};
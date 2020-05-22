window.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // Tabs
    const tabBtnsWrap = document.querySelector('.tabheader__items'),
        btns = document.querySelectorAll('.tabheader__item'),
        tabs = document.querySelectorAll('.tabcontent');

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
            if (event.target && event.target.classList.contains('tabheader__item')) {
                btns.forEach((btn, i) => {  
                    if (event.target == btn) {
                        tabDisplay(i);
                    }
                    btn.classList.remove('tabheader__item_active');
                });
                event.target.classList.add('tabheader__item_active');
            }
        });
    }
    tabsChoose();


    //Timer
    const deadline = "2020-05-19";

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
        days = Math.floor(t / (1000*60*60*24)),
        hours = Math.floor((t / (1000*60*60)) % 24),
        minutes = Math.floor((t / (1000*60)) % 60),
        seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >=0 && num < 10) {
            return `0${num}`;
        } else if (num < 0) {
            return `00`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000) ;

        updateClock(); /* - для того, чтоб не было мигания при перезагузке страницы, т.к. функция обновления запустится только через 1 с */
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
        
    }

    setClock('.timer', deadline);


    //Modal
    const modalShow = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalShow.forEach(item => {
        item.addEventListener('click', () => {
            openModal();
        });
    });

    function openModal() {
        modal.classList.add('show', 'fade');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        // clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show', 'fade');
        document.body.style.overflow = '';
    }

    // Закрытие модального окна при клике за его границами
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    // Закрытие модального окна при нажатии Esc
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout( function() {
        openModal();
    }, 50000);

    // Открытие модального окна при скролле до низа страницы
    function shwModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight == document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', shwModalByScroll);
        }
    }

    window.addEventListener('scroll', shwModalByScroll);



    // Create cards
    class createCard {
        constructor(imgLink, altimg, subtitle, descr, price, parentSelector, ...classes) { /* rest- оператор здесь, т.к. неизвестно какие еще классы CSS для кастомизации карточки мы добавим в будущем */
            this.imgLink = imgLink;
            this.altimg = altimg;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27; /* Коэфф для перевода курсов валют */
            this.changeToUAH();
        }
        render() {
            const div = document.createElement('div');

            if (this.classes.length === 0) {
                this.div = 'menu__item';
                div.classList.add(this.div);
            } else {
                this.classes.forEach(className => div.classList.add(className));
            }

            this.parent.append(div);

            div.innerHTML = `
            <img src="${this.imgLink}" alt="${this.altimg}">
            <h3 class="menu__item-subtitle">${this.subtitle}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total">
                    <span>${this.price}</span> грн/день</div>
            </div>`;
        }
        //Конвертация валюты
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
    }

    // Функция получения данных с сервера (для формирования карточек)
    const getData = async (url) => {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }
    
    // Формирование карточек из данных с сервера (при помощи сформированнго заранее класса (который выше))
    // getData('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => { /* - здесь произвели деструктуризацию объекта (для сокращения) */
    //             new createCard(img, altimg, title, descr, price, '.menu__field .container').render();
    //         })
    //     })

    // Формирование карточек при помощи Axios
    axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => { /* - здесь произвели деструктуризацию объекта (для сокращения) */
            new createCard(img, altimg, title, descr, price, '.menu__field .container').render();
        })
    })

    // Метод формирования карточек "на лету", без использования классов
    // getData('http://localhost:3000/menu')
    //     .then(data => createCards(data))

    // function createCards(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');
    //         element.classList.add('menu__item');
    //         element.innerHTML = `
    //             <img src="${img}" alt="${altimg}">
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total">
    //                     <span>${price}</span> грн/день</div>
    //             </div>`
    //         document.querySelector('.menu__field .container').append(element);
    //     })
    // }


    // Формирование карточек вручную
    // new createCard(
    //     'img/tabs/vegy.jpg',
    //     'Меню "Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 9,
    //     '.menu__field .container',
    //     'menu__item'
    //     ).render();


    // Forms
    const forms = document.querySelectorAll('form');

    const message={
        loading: "img/form/original.svg",
        success: "Спасибо, скоро мы с вами свяжемся",
        failure: "Что-то пошло не так..."
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        })
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // помещаем на страницу div со спиннером
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            // вместо этого лучше использовать заранее созданный класс
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            
            // form.append(statusMessage); - это осталось от случая, когда вместо спиннера вставляли надпись "загрузка"
            // Далее вставляем блок со спиннером после формы
            form.insertAdjacentElement('afterend', statusMessage);

            // Метод отправки 1 (при помощи XMLHttpRequest())
            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');

            
            const formData = new FormData(form);
            
            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value
            })

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            
            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            })

            // Это тоже от первого случая (при помощи XMLHttpRequest())
            // request.send(formData);

            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         showThanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();
            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // });
        });  
    }

    // Окно благодарности (вместо основного окна)
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        // Удаляем окно благодарности через 4 сек
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show'); 
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));



    // Slider
    const slide = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        currentSlide = document.querySelector('#current'),
        totalSlide = document.querySelector('#total');

    let i = 0;  
    showSlide(0);

    function changeSlide(n) {
        if (n < slide.length && n >= 0) {
            showSlide(n);
        } else if (n >= slide.length) {
            i = 0;
            showSlide(i);
        } else {
            i = slide.length - 1;
            showSlide(i);
        }
    }

    function showSlide(i) {
        slide.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
        });
        slide[i].classList.remove('hide');
        slide[i].classList.add('show');
        showNumber(i);
    }

    function showNumber(i) {
        if (slide.length < 10) {
            totalSlide.textContent = `0${slide.length}`;
            currentSlide.textContent = `0${i+1}`;
        } else if (slide.length >= 10 && i >= 9 ) {
            totalSlide.textContent = `${slide.length}`;
            currentSlide.textContent = `${i+1}`;
        } else {
            totalSlide.textContent = `${slide.length}`;
            currentSlide.textContent = `0${i+1}`;
        }
        
    }

    next.addEventListener('click', () => {
        changeSlide(i += 1);
    });

    prev.addEventListener('click', () => {
        changeSlide(i -= 1);
    })
});

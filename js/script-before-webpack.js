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
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
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
        if (num >= 0 && num < 10) {
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
            timeInterval = setInterval(updateClock, 1000);

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

    const modalTimerId = setTimeout(function () {
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
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

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
            data.data.forEach(({ img, altimg, title, descr, price }) => { /* - здесь произвели деструктуризацию объекта (для сокращения) */
                new createCard(img, altimg, title, descr, price, '.menu__field .container').render();
            });
        });

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

    const message = {
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
        });
        return await res.json();
    };

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
            formData.forEach(function (value, key) {
                object[key] = value;
            });

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
                });

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
        .then(data => data.json());

    // Slider
    const slider = new Promise(function (resolve) {
        // Загрузка слайдов из debugger.json и формирование верстки
        class Slides {
            constructor(link, parentSelector) {
                this.link = link;
                this.parent = document.querySelector(parentSelector);
            }
            render() {
                let newSlide = document.createElement('div');
                newSlide.classList.add('offer__slide');
                this.parent.append(newSlide);
                newSlide.innerHTML = `
                    <img src="${this.link}" alt="pepper">
                `;
            }
        }

        const getSlide = async (url) => {
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Какая-то ошибка, статус: ${res.status}`);
            }

            return await res.json();
        };

        getSlide('http://localhost:3000/slider')
            .then(data => {
                data.forEach(item => {
                    new Slides(item.img, '.offer__slider-inner').render();
                });
                resolve();
            });

    });
    slider.then(() => {


        // реализация самого слайдера
        const slide = document.querySelectorAll('.offer__slide'),
            prev = document.querySelector('.offer__slider-prev'),
            next = document.querySelector('.offer__slider-next'),
            currentSlideNumber = document.querySelector('#current'),
            totalSlide = document.querySelector('#total');

        let currentSlide = 0;



        // Слайдер-карусель
        let sliderWrapper = document.querySelector('.offer__slider-wrapper'),
            sliderInner = document.querySelector('.offer__slider-inner'),
            width = window.getComputedStyle(sliderWrapper).width;

        sliderInner.style.width = 100 * slide.length + '%';
        sliderInner.style.display = 'flex';
        sliderInner.style.transition = '0.5s all';

        sliderWrapper.style.overflow = 'hidden';
        // назначаем всем слайдам ширину равную ширине "окна просмотра"
        slide.forEach(slide => {
            slide.style.width = width;
        });

        let offset = 0;

        showNumber(currentSlide + 1);

        if (slide.length < 10) {
            totalSlide.textContent = `0${slide.length}`;
        } else {
            totalSlide.textContent = slide.length;
        }

        // обрезание НЕ чисел (т.е. px в конце)
        function cutPx(i) {
            return +i.replace(/\D/g, '');
        }

        next.addEventListener('click', () => {
            // Проверка на последний слайд. Width в формате "650px". Поэтому обрезаем последние два символа и при помощи унарного плюса превращаем в число
            if (offset == cutPx(width) * (slide.length - 1)) {
                offset = 0;
                currentSlide = 0;
            } else {
                offset += cutPx(width);
                currentSlide += 1;
            }
            sliderInner.style.transform = `translateX(-${offset}px)`;
            showNumber();
            dotsActive();
        });

        prev.addEventListener('click', () => {
            if (offset == 0) {
                offset = cutPx(width) * (slide.length - 1);
                currentSlide = slide.length - 1;
            } else {
                offset -= cutPx(width);
                currentSlide -= 1;
            }
            sliderInner.style.transform = `translateX(-${offset}px)`;
            showNumber();
            dotsActive();
        });

        function showNumber() {
            if (currentSlide < 9) {
                currentSlideNumber.textContent = `0${currentSlide + 1}`;
            } else {
                currentSlideNumber.textContent = currentSlide + 1;
            }
        }


        // Точки
        const sliderOuter = document.querySelector('.offer__slider');

        sliderOuter.style.position = 'relative';

        const dotsWrapper = document.createElement('ol');

        dotsWrapper.classList.add('carousel-indicators');
        sliderOuter.append(dotsWrapper);


        for (let i = 0; i < slide.length; i++) {
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i);
            dot.classList.add('dot');
            dotsWrapper.append(dot);
        }

        const dot = document.querySelectorAll('.dot');
        dot[currentSlide].style.opacity = "1";

        function dotsActive() {
            dot.forEach(item => {
                item.style.opacity = ".5";
            });
            dot[currentSlide].style.opacity = "1";
        }

        // Реализация через атрибуты
        // dot.forEach(item => {
        //     item.addEventListener('click', (e) => {
        //         const slideTo = +e.target.getAttribute('data-slide-to');
        //         currentSlide = slideTo;
        //         console.log(typeof(currentSlide));
        //         offset = cutPx(width)*slideTo;
        //         sliderInner.style.transform = `translateX(-${offset}px)`;
        //         dotsActive();
        //         showNumber();
        //     });
        // });

        // И без атрибутов
        dot.forEach((item, i) => {
            item.addEventListener('click', () => {
                offset = i * cutPx(width);
                sliderInner.style.transform = `translateX(-${offset}px)`;
                currentSlide = i;
                dotsActive();
                showNumber();
            });
        });




        // Обычный вариант слайдера
        // showSlide(currentSlide);

        // function showSlide(n) {
        //     if (n >= slide.length) {
        //         currentSlide = 0;
        //     }
        //     if (n < 0) {
        //         currentSlide = slide.length - 1;
        //     }
        //     slide.forEach(item => {
        //         item.classList.remove('show');
        //         item.classList.add('hide');
        //     });
        //     slide[currentSlide].classList.remove('hide');
        //     slide[currentSlide].classList.add('show');

        //     showNumber(currentSlide);
        // }

        // function changeSlide(i) {
        //     showSlide(currentSlide += i); /* - при этом не только в функцию передается значение, но и само значение currentSlide изменяется */
        // }

        // function showNumber(currentSlide) {
        //     if (slide.length < 10) {
        //         totalSlide.textContent = `0${slide.length}`;
        //     } else {
        //         totalSlide.textContent = slide.length;
        //     }
        //     if (currentSlide < 9) {
        //         currentSlideNumber.textContent = `0${currentSlide + 1}`;
        //     } else {
        //         currentSlideNumber.textContent = currentSlide + 1;
        //     }
        // }

        // prev.addEventListener('click', () => {
        //     changeSlide(-1);
        // });

        // next.addEventListener('click', () => {
        //     changeSlide(1);
        // });


    });



    // Calculator
    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;


    // Используем localStorage (если там уже есть данные) и задаем данные по-умолчанию
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }
    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    // инициализация калькулятора (настраивает классы активности в соответствии со значениями, сохраненными в localStorage)
    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = 'Не хватает данных';
            return;
        }

        if (sex == 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(`${selector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    // сохраним информацию о пользователе в Local Storage
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                console.log(ratio, sex);

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            // если ввели НЕ цифры, то граница окрасится
            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = "none";
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

});





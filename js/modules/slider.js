function slider({container, slides, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
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
        const slide = document.querySelectorAll(slides),
            prev = document.querySelector(prevArrow),
            next = document.querySelector(nextArrow),
            currentSlideNumber = document.querySelector(currentCounter),
            totalSlide = document.querySelector(totalCounter);

        let currentSlide = 0;

        // Слайдер-карусель
        let sliderWrapper = document.querySelector(wrapper),
            sliderInner = document.querySelector(field),
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
        const sliderOuter = document.querySelector(container);

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

        dot.forEach((item, i) => {
            item.addEventListener('click', () => {
                offset = i * cutPx(width);
                sliderInner.style.transform = `translateX(-${offset}px)`;
                currentSlide = i;
                dotsActive();
                showNumber();
            });
        });
    });
}

export default slider;
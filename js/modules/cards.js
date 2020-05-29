import {getData} from '../services/services';

function cards() {

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



    // Формирование карточек при помощи Axios
    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price }) => { /* - здесь произвели деструктуризацию объекта (для сокращения) */
                new createCard(img, altimg, title, descr, price, '.menu__field .container').render();
            });
        });
}

export default cards;
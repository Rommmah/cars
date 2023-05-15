const descElement = document.querySelector('.description');

// получим id из адреса
const url = new URL(window.location);
const id = url.searchParams.get('id');

// отрисовка полученных данных
getDataById(id);

// получает данные об автомобиле c сервера по id
async function getDataById(id) {
    let urlBase = getBase()
    let request = await fetch(urlBase + `car.php?id=${id}`, {
        mode: "cors",
    })
    let result = await request.json();

    // отображение на странице
    descElement.insertAdjacentHTML('beforeend', getMarkedElement(result))
}

// Функции
function getMarkedElement({model, price, qty, describtion, img}){
    return `
        <h3 class="description__header">
            ${model}
        </h3>
        <img class="description__img" src="images/dest/${img}">
        <div class="description__item">
            <b class="description__name">Описание:</b>
            <span class="description__text"> ${describtion}</span>
        </div>
        <div class="description__item">
            <b class="description__name">Цена:</b>
            <span class="description__text"> 
                ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price)}
            </span>
        </div>
        <div class="description__item">
            <b class="description__name">В наличии:</b>
            <span class="description__text">${qty} шт.</span>
        </div>
    `
}
function getBase(local = true){
    const localBase = 'http://procontext/php/'
    const realBase = document.location.origin + '/proContext/api/'

    return local ? localBase : realBase;
}

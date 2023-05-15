const container = document.querySelector('.cars-list');

( async() => {
    // получить из БД
    let request = await fetch(urlBase + 'cars.php')
    let data = await request.json()

    // вывести список в html
    for(let item of data){
        container.insertAdjacentHTML('beforeend', carItem(item))
    }

    // открытие модального окна по клику
    showByClickHandler()
})()

function carItem({model, qty, describtion, img, id}){
    return `
        <a href="car.html?id=${id}" class="car-item">
            <h3 class="car-item__title">${model}</h3>
            <div class="car-item__qty">
              <div class="car-item__qty-item">
                <svg class="car-item__icon" width="20" height="20">
                  <use href="#car"></use>
                </svg><span class="car-item__text">${qty} А/М В НАЛИЧИИ</span>
              </div>
              <div class="car-item__qty-item">
                <svg class="car-item__icon" width="20" height="20">
                  <use href="#clock"></use>
                </svg><span class="car-item__text">ЛИЗИНГ А/М</span>
              </div>
            </div><img class="car-item__img" alt="${model}" src="images/dest/${img}">
            <div class="car-item__description">${describtion}</div>
            <form class="car-item__form">
              <input class="visually-hidden" value="${id}" name="id">
              <button class="btn btn--main car-item__btn show-modal">Получить спец. цену</button>
              <button class="btn btn--second car-item__btn show-modal">Спец. условия по лизингу</button>
              <button class="btn btn--second car-item__btn show-modal">Подобрать автомобиль</button>
            </form>
        </a>
    `
}

function showByClickHandler(){
    //кнопки открытия модального окна
    const modalOpenBtns = document.querySelectorAll('.show-modal')

    // обработчики открытия модального окна
    for(let btn of modalOpenBtns) {
        btn.addEventListener('click', event => {
            event.preventDefault();
            showFormModal();
        })
    }
}
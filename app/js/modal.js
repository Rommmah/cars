const modalWrapper = document.querySelector('#modal-wrapper');
//крестик закрытия окна
const cross = document.querySelector('.modal__cross');
//кнопки открытия модального окна
const modalOpenBtns = document.querySelectorAll('.show-modal')
// кнопка отправки сообщения
const sendBtns = document.querySelectorAll('.send-btn');
let timer, allow = true // для будущих отключений

// обработчики открытия модального окна
for(let btn of modalOpenBtns) {
    btn.addEventListener('click', event => {
        event.preventDefault();
        showFormModal();
    })
}
// обработчики закрытия окна
document.addEventListener('keydown', event => {
    if(event.code == 'Escape') closeModal()
})
modalWrapper.addEventListener('click', event => {
    if(event.target == event.currentTarget) closeModal()
})
cross.addEventListener('click', closeModal)
document.getElementById('success-btn').addEventListener('click',    e => {
    e.preventDefault()
    closeModal()
})

// обработчик отправки сообщения при клике по кнопке
for(btn of sendBtns) {
    btn.addEventListener('click', sendMessage)
}

// отправка сообщения
async function sendMessage(event) {
    event.preventDefault();
    const form = event.target.closest('form')

    if(!validation(form)) return

    // Отправка данных
    sendData(form)
}
// Валидация полей
function validation(form){
    const inputs = form.querySelectorAll('input')
    let result = true
    for(let input of inputs){
        if(input.value.length === 0){
            input.classList.add('input--error')
            //Показываем сообщение об ошибке
            form.querySelector('.error-message').classList.remove('visually-hidden')
            result = false;
        }else{
            input.classList.remove('input--error')
        }
    }
    return result;
}

// Отправка данных
async function sendData(form) {
    let isSuccess = await sendToServer(form); // отправка данных на сервер
    if(isSuccess){
        // В случае успеха
        // Показвает сообщение об успехе
        showSuccessModal();
        if( !form.classList.contains('modal__form')){
            // Для форм в банере и в questions
            // меняем цвет и текст кнопки
            const btn = form.querySelector('button')
            btn.textContent = 'Отправлено'
            btn.classList.add('btn--success')
        }
        form.reset();
        //скрываем сообщение об ошибке
        form.querySelector('.error-message').classList.add('visually-hidden')
    } else {
        // Показваем сообщение об ошибке
        showErrorModal(form);
    }
}
// Отправка данных на сервер
async function sendToServer(form) {
    let isDisabled = true // флаг отключения кнопки
    disableBtn(form) // отключаем кнопку

    let request = await fetch('http://procontext/api/request.php', {
        method: 'POST',
        mode: "cors",
        body: new FormData(form)
    })
    let result = await request.text();

    isDisabled = false // снимаем флаг отключения кнопки
    if(result == 'success') return true
    return false

    // Отключение кнопки во время запроса на сервер
    function disableBtn(form){
        const btn = form.querySelector('button')
        let initialBtnText = btn.innerText
        const text = 'Отправка'
        let dots = ''
        btn.disabled = true
        // Анимация отправки
        let timer = setInterval(function(){
            if(!isDisabled) {
                clearInterval(timer)
                if(!form.classList.contains('modal__form') && result) initialBtnText = 'Отправлено'
                btn.innerText = initialBtnText
                btn.disabled = false
                return
            }
            if(dots.length < 6) dots += ' .'
            else dots = ''

            btn.innerText = text + dots
        }, 300)
    }
}

// Показ модальных окон
function showFormModal(){
    openModal('form')
}
function showSuccessModal(){
    openModal('success')
}
function showErrorModal(form){
    openModal('error')
    // изменить обработчик кнопки окна
    const errorBtn = document.getElementById('error-btn')

    errorBtn.onclick = () => {
        closeModal();
        sendData(form)
        if(form.classList.contains('modal__form')) showFormModal()
    }
}

// Открывает модальное окно
function openModal(type = 'form'){
    // задний план для модального окна
    modalWrapper.classList.remove('visually-hidden');
    // показвает нужно окно
    chooseModal(type)
}
// Закрывает модальное окно
function closeModal(){
    modalWrapper.classList.add('visually-hidden');
}

// Показывает выбранное окно
function chooseModal(type){
    //список допустимых type и соответствующих id
    let id = {
        form: 'showForm',
        success: 'success-modal',
        error: 'error-modal',
    }
    if( !id[type] ) {
        // Проверка аргумента
        return console.error('Допустимые варианты: form, success, error')
    }
    // Скрываем текущее окно
    document.querySelector('.shown').classList.remove('shown');
    // показваем нужное окно
    document.getElementById( id[type] ).classList.add('shown');
}


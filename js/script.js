const filterByType = (
    type,
    ...values // функция "filterByType" принимает 2 параметра 1) type - тип данных; 2) values - само введенное значение. "filterByType" выполнится только в случае успешной проверки внутри функции "tryFilterByType"
  ) => values.filter((value) => typeof value === type), // переменная values обрабатывается методом "filter", который создает новый массив элементов, прошедших проверку (typeof value === type), то есть введенные в поле значения соответствуют типу, который мы выбрали в select.
  hideAllResponseBlocks = () => {
    const responseBlocksArray = Array.from(
      document.querySelectorAll("div.dialog__response-block")
    ); // переменная "responseBlocksArray" принимает значение массива из блоков с классом "responseBlocksArray"
    responseBlocksArray.forEach((block) => (block.style.display = "none")); // перебирается массив блоков. Каждому итерируемому блоку присваивается свойство "display" со значением "none", т.е. скрываем блоки
  },
  showResponseBlock = (blockSelector, msgText, spanSelector) => {
    // функция "showResponseBlock" принимает 3 параметра: 1) селектор блока; 2) текст сообщения; 3) spanSelector - селектор span'a, в который будет выводиться текст сообщения
    hideAllResponseBlocks(); // вызвается ф-я "hideAllResponseBlocks", которая скрывает блоки
    document.querySelector(blockSelector).style.display = "block"; // блоку, который соответствует условию в случае (успеха/ошибки) присваивается свойство "display" со значением "block", т.е делаем его видимым
    if (spanSelector) {
      // если "spanSelector" существует,
      document.querySelector(spanSelector).textContent = msgText; // то выводим в него текст сообщения
    }
  },
  showError = (
    msgText // функция "showError" принимает параметр "msgText", то есть "alertMsg", который мы передали при вызове
  ) => showResponseBlock(".dialog__response-block_error", msgText, "#error"), // вызывается функция "showResponseBlock" и в неё передается 3 аргумента: 1) ".dialog__response-block_error" - селектор блока, в который мы будем выводить информацию; 2) msgText - "текст сообщения ошибки"; 3) "#error" - селектор span'a, в который выводится текст ошибки
  showResults = (
    msgText // то же самое, что с функцией "showError", только в случае усппеха
  ) => showResponseBlock(".dialog__response-block_ok", msgText, "#ok"),
  showNoResults = () => showResponseBlock(".dialog__response-block_no-results"), // вызывается функция "showResponseBlock" и в неё передается 3 аргумента: 1) ".dialog__response-block_error" - селектор блока, в который мы будем выводить информацию; 2) msgText - "текст сообщения"; 3) "#error" - селектор span'a, в который выводится текст
  tryFilterByType = (type, values) => {
    // функция "tryFilterByType" приниммает параметры, которые мы передали при вызове функции, далее отрбатывет конструкция try/catch
    try {
      // инициализация блока try.
      const valuesArray = eval(`filterByType('${type}', ${values})`).join(", "); // переменная "valuesArray", принимает значение результата выполнения функции "filterByType", которая принимает 2 параметра: 1) Тип данных; 2) Сами данные. Функция filterByType вызывается внутри интерполяции и обрабатывается методом eval, который позволяет выполнять JS код, предствленный строкой. Каждый новый тип данных разделяется запятой
      const alertMsg = valuesArray.length // переменная "alertMsg" принимает значение в зависимости от условия
        ? `Данные с типом ${type}: ${valuesArray}` // если данные с выбранным типом cуществуют, то переменная "alertMsg" примет значение "Данные с типом ${type}: ${valuesArray}",
        : `Отсутствуют данные типа ${type}`; // а если не существуют, то "Отсутствуют данные типа ${type}"
      showResults(alertMsg); // "вызывается функция "showResults" с аргументом "alertMsg", который по сути и есть сообщение пользователю"
    } catch (e) {
      // блок catch с параметром (e) обрабатывает ошибку
      showError(`Ошибка: ${e}`); // вызывает функцию "showError" с аргументом "`Ошибка: ${e}`", который содержит описание ошибки
    } // окончание блока catch
  }; // окончание функции "tryFilterByType"

const filterButton = document.querySelector("#filter-btn"); // получаем кнопку со страницы

filterButton.addEventListener("click", (e) => {
  // вешаем обработчик событий по клику на кнопку
  const typeInput = document.querySelector("#type"); // получаем select с типами данных, которые мы хотим получить
  const dataInput = document.querySelector("#data"); // получаем input с данными, которые мы вводим

  if (dataInput.value === "") {
    // если input пустой,
    dataInput.setCustomValidity("Поле не должно быть пустым!"); // то уведомляем пользователя, что поле не должно быть пустым методом "setCustomValidity"
    showNoResults(); // запускаем функцию "showNoResults"
  } else {
    // иначе
    dataInput.setCustomValidity(""); // отключаем оповещение пользователя, присваивая уведомлению пустую строку
    e.preventDefault(); // игнорируем стандартное поведение события
    tryFilterByType(typeInput.value.trim(), dataInput.value.trim()); // запускаем функцию "tryFilterByType" и передаем в нее 2 аргумента: 1) значение выбранного option у select с типом данных, который мы будем искать; 2) значение input, который содержит данные. Методом trim() убираем пробелы.
  }
});

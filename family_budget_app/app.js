
//BUDGET CONTROLLER START
var budgetController = (function() {

  ///////// сохраняем пользовательский ввод с форм в обекты
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome)*100);
    } else {
      this.percentage = -1;
    }
  };

Expense.prototype.getPercentage = function() {
  return this.percentage;
}

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
//подсчет общей суммы доходов или расходов в зависимости от type
var calculateTotal = function(type) {
var sum = 0;
data.allItems[type].forEach(function(cur) {
    sum += cur.value;
})
data.totals[type] = sum;
};

 //записываем общую суммув зависимости от type
  //сюда передаем и распределяем данные из форм/
  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    },
    budget: 0,
    percentage: -1
  };


//

  // публичные методы контроллера
  return {
    addItem: function(type, des, val) {
      var newItem, ID;
     
      //ID  = индекс последнего элемента в массиве + 1  (.length -1)
      //создаем новое id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //создаем новый элемент в зависимости от типа полученных данных 'expense' или 'income' //////////////////
      if (type === 'expense') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'income') {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      //возвращаем новый элемент 
      return newItem;
   

    },
 //удаляем данные из data
    deleteItem: function(type, id) {
      var ids, index;
      ids = data.allItems[type].map(function(current) {
       return current.id;
      });
      //ищем индекс html-элемента в массивах data.allItems[type]
      index = ids.indexOf(id); 

      if(index !== -1) {
        data.allItems[type].splice(index, 1); 
      }
    },


//подсчет бюджета
 calculateBudget: function() {
    //посчитать все доходы и расходы
    calculateTotal('expense');
    calculateTotal('income');
    //подсчитать бюджет: доход - расход
    data.budget = data.totals.income - data.totals.expense;
    // посчитать процент потраченные от общих денег
    if(data.totals.income > 0) {
        data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
    } else {
        data.percentage = -1;
    }
    
 },   

 //подсчет процентов
 calculatePercentages: function() {
  data.allItems.expense.forEach(function(cur) {
    cur.calcPercentage(data.totals.income);
  });
 },

getPercentages: function() {
  var allPerc = data.allItems.expense.map(function(cur) {
    return cur.getPercentage();
  });
  return allPerc;
},


getBudget: function() {
    return {
        budget: data.budget,
        totalInc: data.totals.income,
        totalExp: data.totals.expense,
        percentage: data.percentage
    }
},

    testing: function() {
     console.log(data);
    }
  };
})();

//BUDGET CONTROLLER END



//UI CONTROLLER START

var UIController = (function() {
  //переменные для html-классов
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };


//форматируем чисела в списке
var formatNumber = function(num, type) {
  var numSplit, int, dec, type, num;
  num = Math.abs(num); //возвращает абсолютное число
  num = num.toFixed(2); // форматирует число, используя запись с фиксированной запятой
  numSplit = num.split('.');
  int = numSplit[0];
  if(int.length > 3) {
    int = int.substr(0, int.length - 3) + ' ' + int.substr(int.length - 3, 3); 
  }
  dec = numSplit[1];
  return (type === 'expense' ? '-' : '+') + ' ' + int + ',' + dec + '₽';
}

  //обрабатываем nodeList 
  var nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++) {
      callback(list[i], i); 
    }
  }; 


//публичные методы контроллера
  return {
    //записываем данные с форм в объект getInput
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //income или expense
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
   

   
    addListItem: function(obj, type) {
        var html, newHtml, element ;

        //создаем строку html с шаблоном
        if(type === 'income') {
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value% &#8381;</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'expense') {
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value% &#8381;</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
       //
    
        //меняем значения в шаблоне на реальные данные
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
       
        
        //передаем, вставляем html в DOM 1.выбираем элемент 2. вставляем 'beforebegin/afterbegin/beforeend/afterend'
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
        //удаляем элемент из UI
        deleteListItem: function(selectorID){
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    //очищаем поля формы
    clearFields: function() {
        var fields, fieldsArr;
        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
        
        //превращаем  nodelist в array
        fieldsArr = Array.prototype.slice.call(fields);
        //чистим данные с импутов записанных в массиве
        fieldsArr.forEach(function(current, index, array) {
        current.value = "";
        });
        //возвращаем focus первому элементу в массиве
        fieldsArr[0].focus();
    },

    ///отображаем бюджет
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? type = 'income' : type = 'expense';

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'income');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'expense');

        if(obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }
        
    },
    //отображаем проценты
    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      ///функция с функцией обраного вызова
      nodeListForEach(fields, function(current, index) {
        //тут код будет исполняться в зависимости от количество nodeList элементов
        if(percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    //отображаем дату
    displayMonth: function() {
      var now, month, year, months ; 

      var now = new Date(); //
      months = ['Январе', 'Феврале', 'Марте', 'Апреле', 'Мае', 'Июне', 'Июле',
       'Августе', 'Сентябре', 'Октябре', 'Ноябре', 'Декабре'];
      month = now.getMonth(); //получаем текущий месяц
      year = now.getFullYear(); //получаем текущий год
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },  
    //

    //меняем цвет поля для ввода по событию 'changed'
    changedType() {
      //возвращаем nodelist
      var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
        nodeListForEach(fields, function(cur) {
          cur.classList.toggle('red-focus');
    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        });

    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//UI CONTROLLER END

//GLOBAL APP CONTROLLER START
var controller = (function(budgetCtrl, UICtrl) {
  
//обработчики событий
var setupEventListeners = function() {

//получаем html-классы из DOMstrings
var DOM = UICtrl.getDOMstrings();

//добавляем элемент
document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    
document.addEventListener("keypress", function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

//удаляем элемент
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
//выбираем type + или -  
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };


//обновляем бюджет
var updateBudget = function() {
// 1. подсчитываем бюджет
    budgetCtrl.calculateBudget();
// 2. возвращаем обновленный бюджет
    var budget = budgetCtrl.getBudget();
// 3. обновляем UI
    UICtrl.displayBudget(budget);
};

var updatePercentages = function() {
  // 1. подсчитываем проценты
budgetCtrl.calculatePercentages();
  // 2. получаем проценты из контроллера
var percentages = budgetCtrl.getPercentages();
  // 3. обновляем UI
  UICtrl.displayPercentages(percentages);
  console.log(percentages);
};
 //сохраняем значения из полей в input 
 var ctrlAddItem = function(){
    var input, newItem;
    var input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0 ) { //валидация форм

    //добавляем элемент в контроллер 
    var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //выводим новый элемент в UI

    UICtrl.addListItem(newItem, input.type);

    //очищаем поля
    UICtrl.clearFields();

    //подсчитываем и обновляем бюджет
    updateBudget();
    }

    //считаем и обновлчем проценты
    updatePercentages();
  };
//убираем элементы из UI
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID; 
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
    if(itemID) {
      splitID = itemID.split('-');//преобразует строку, возвращая массив и слов в зависимости от разделителя
      type = splitID[0];
      ID = parseInt(splitID[1]); //приобразуем в число
      // 1. Удаляем элементы из data
      budgetCtrl.deleteItem(type, ID);
      // 2. Удаляем элементы из UI
      UICtrl.deleteListItem(itemID);
      // 3. Обновляем и отображаем новые данные
      updateBudget();
      // 4. Обновляем и отображаем проценты
      updatePercentages();
    }
  };
  return {
    init: function() {
      //console.log("App has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
    });
      setupEventListeners();
    }
  };

})(budgetController, UIController);
//GLOBAL APP CONTROLLER END

controller.init(); //запускаем приложение


var rW,
    count, //счетчик ошибок
    cOfL,  //счетчик угаданных букв
    hintIndex,
    hint,  //подсказка
    countW = 0,  
    countL = 0;  

start.addEventListener('click', function(){
    rW = pickWord();
    hint = pickHint(hintIndex);
    count = 1;
    cOfL = 0;
    setupAnswerPlace(rW);
    hintPlace.innerText = hint;
    $("#win").css("display", "none");
    $("#lose").css("display", "none");
});

end.addEventListener('click', reloadGame);

keyboard.addEventListener('click', compareAndUpdate);

// выбирает случайное слово и возвращает его
function pickWord() {
	var randomWordsArray = [
	"молоко",
	"макака",
	"дерево",
	"бутылка",
	"темперамент",
	"пальто",
	"подземелье",
	"корова",
	"победа",
	"капуста",
	"волос",
	"человек",
	"глаз",
    "реферат"
	];
    var j = Math.floor(Math.random() * randomWordsArray.length);
    hintIndex = j;
	return randomWordsArray[j];
};


function pickHint(num) {
	var hintArray = [
	"Питательная жидкость",
	"Род приматов",
	"Хвойное и лиственное",
	"Ёмкость для хранения жидкостей",
	"Совокупность индивидуальных психофизиологических особенностей личности",
	"Разновидность верхней одежды",
	"Пещера",
	"Парнокопытное жвачное",
	"Достижение абсолютного преимущества",
	"Сельскохозяйственная культура",
	"Роговое нитевидное образование",
	"Общественное существо",
	"Сенсорный орган",
    "Краткий доклад"
	];
    
	return hintArray[num];
};





// принимает случайное слово, создаёт контейнеры, в количестве равном количеству букв в слове
function setupAnswerPlace(word) {
	for (var i = 0; i < word.length; ++i) {
        $("<div>").appendTo("#wordPlace").attr("class", "fieldForLetter");
	}
};

function showModal() {
    $('#modalW').css("animation", "emersion 2s ease");
    $("#tumbler").prop("checked", false);
    reloadGame();
            }

function reloadGame() {
    $('.fieldForLetter').remove();
    clearStaging();
    updateKeyboard();
}
function clearStaging(){
    $('.elems').css("display", "none");
}

function updateKeyboard(){
    $("#keyboard").children().attr("class", "letter");
}

function compareAndUpdate(event){
    //получаем букву, нажатую пользователем
    
    var j = event;
    console.log(j);
    
    var item = event.target;
    var letter = item.innerText;
    if(item.className === "letter"){
        var isHit = false;
        for (var i = 0; i < rW.length; ++i) {
            if (rW[i] === letter) {
                $(".fieldForLetter").eq(i)
                .text(letter)
                .css('background', "#52c58c");
                
                isHit = true;
                cOfL++;
            }
        } 
        item.className = "disable";
        if(isHit === false) {
            $("#el" + count).css("display", "inline");
            count++;
            
        }
        if(count >= 11) {
            lose.style.display = "block";
            cLoss.innerText = ++countL;
            showModal();  
        }
    }
    if(cOfL === rW.length){
        win.style.display = "block";
        cWin.innerText = ++countW;
        showModal();  
    }
}
    
    
    
    
    
    
    
    
    
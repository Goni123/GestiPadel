
var IsOnBrackets = false;



const User = import("./model/usermodel");


var list;
console.log("entrou");
GetTeamList();


var bracketSize;
let columns = 0;

let groupSize = list.length;
let groupSizeAdap = 1;

if (groupSize <= 4) {
    groupSizeAdap = 4;
    columns = 3;
} else if (groupSize <= 8) {
    groupSizeAdap = 8;
    columns = 4;
} else if (groupSize <= 16) {
    groupSizeAdap = 16;
    columns = 5;
} else if (groupSize <= 32) {
    groupSizeAdap = 32;
    columns = 6;
} else {
    groupSizeAdap = 64;
    columns = 7;
}

IsOnBrackets = true;
SelectBracketOrGroupFase();

function SelectBracketOrGroupFase() {
    if (IsOnBrackets) {
        CreateGroups();
        CreateBracketsSlots();
    } else {
        CreateGroups();
        CreateGroupFase();
    }
}


//DeleteWholeBracket();

let brackets = document.querySelectorAll('.bracketSlots');

for (let toSelectSlots of brackets) {
    //bracketSlots.style.gridTemplateColumns = 'repeat(10, 1fr)';
    bracketSlots.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

async function GetTeamList() {


    console.log(User.name);
    /*/fetch('/editar_brakets/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((response) => response.json())
        .then((result) => {
            console.log('Success:', result);


        })
        .catch((error) => {
            console.error('Error:', error);
        });*/
    /*var array_nome = [];
    await User.find({ _id: { $in: ['6391e50313339dd8ef8a38ff', '6391e54213339dd8ef8a3902', '6391e57b13339dd8ef8a3905', '6391e6f513339dd8ef8a3908', '6391e71313339dd8ef8a390b', '6391e74713339dd8ef8a390e'] } }).exec(function (err, docs) {
        if (docs) {
            console.log(docs)
            array_nome = docs
        }
    })*/

    /*for (var i = 0; i < User.length; i++) {
        array_nome.push(User[i].name)
    
    }*/



    //console.log(array_nome);
    list = [
        { name0: 'Ademar', name1: 'Adelson' },
        { name0: 'Ben', name1: 'Benato' },
        { name0: 'Claudi', name1: 'Carlos' },
        { name0: 'Diego', name1: 'Douglas' },
        { name0: 'Eduardo', name1: 'Edison' },
        { name0: 'Fernando', name1: 'Felipe' },
        { name0: 'Gabriel', name1: 'Geliton' },
        { name0: 'Hunservio', name1: 'Hummm' },
    ];
}

//Get List names
//Set Array Matches

//Get Array Matches - mount bracket

//Get List names to group fase
//Set Array to group fase

//Get Array to group fase - mount group fase

function CreateGroups() {
    var bracketDiv = document.createElement("div");             //Create bracket Div
    bracketDiv.classList.add(`toSelectSlots`);

    var genDiv = document.createElement("div");                 //Create general Div
    genDiv.classList.add(`genDiv`);
    bracketDiv.appendChild(genDiv);

    for (let i = 0; i < groupSize; i++) {

        var newDiv = document.createElement("div");           //Create team Div
        newDiv.classList.add(`teamDiv`);
        newDiv.setAttribute('draggable', true);
        genDiv.appendChild(newDiv);

        var node = document.createTextNode(`${list[i].name0} / ${list[i].name1}`);   //Create text
        newDiv.appendChild(node);

        var currentDiv = document.getElementById("beforeRefDiv");
        document.body.insertBefore(bracketDiv, currentDiv);
    }
}

function CreateBracketsSlots() {
    var bracketDiv = document.createElement("div");             //Create bracket Div
    bracketDiv.classList.add(`bracketSlots`);
    bracketDiv.setAttribute('id', 'bracketSlots');

    var bracketDivision = 1;

    for (let k = 0; k < columns; k++) {

        var genDiv = document.createElement("div");                 //Create general Div
        genDiv.classList.add(`genDiv`);
        bracketDiv.appendChild(genDiv);

        var matchDiv = document.createElement("div");

        for (let i = 0; i < groupSizeAdap / bracketDivision; i++) {

            if (i % 2 == 0) {
                matchDiv = document.createElement("div");                   //Create match Div
                matchDiv.classList.add(`matchDiv`);
                matchDiv.setAttribute("id", `match${i / 2}/${k}`);
            }

            var teamDiv = document.createElement("div");                    //Create team Div

            if (k == 0) {
                teamDiv.classList.add(`teamDiv`);
                teamDiv.setAttribute('draggable', true);
            } else {
                teamDiv.classList.add(`teamDivNoDrag`);
            }

            teamDiv.setAttribute("id", `teamDiv${i}/${k}`);

            var node = document.createTextNode(`/`);                        //Create text
            teamDiv.appendChild(node);

            // var img = new Image();                                          //Create Image
            //img.src = "/img/brackets/line.png";
            // img.classList.add(`teamLine`);

            var input;
            var trophy;
            if (k != columns - 1) {
                input = document.createElement("input");                    //Input
                input.setAttribute("type", "text");
                input.setAttribute("oninput", "numberOnly(this.id);");
                input.setAttribute("maxlength", "3");
                input.setAttribute("class", `teamInput`);
                input.setAttribute("id", `team${i}/${k}`);
                input.setAttribute("name", "number");
                input.setAttribute("placeholder", "0");
            } else {
                trophy = new Image();                                          //Create Image
                trophy.src = "/img/brackets/trophy.png";
                trophy.classList.add(`trophy`);
            }

            matchDiv.appendChild(teamDiv);
            if (k != columns - 1) {
                matchDiv.appendChild(input);
            }

            //matchDiv.appendChild(img);

            if (k == columns - 1) {
                matchDiv.appendChild(trophy);
            }

            genDiv.appendChild(matchDiv);

            var currentDiv = document.getElementById("beforeRefDiv2");
            document.body.insertBefore(bracketDiv, currentDiv);
        }

        bracketDivision = bracketDivision * 2;
    }
}

function DeleteWholeBracket() {
    const element = document.getElementById("bracketSlots");
    element.remove();
}

function CreateGroupFase() {
    var groupsNumber = Math.ceil(groupSize / 4);

    var bracketDiv = document.createElement("div");
    //Create bracket Div
    bracketDiv.classList.add(`groupsFase`);
    bracketDiv.setAttribute('id', 'groupsFase');



    for (let k = 0; k < groupsNumber; k++) {

        var group = document.createElement("div");                          //Create general Div
        group.classList.add(`grupo`);
        group.setAttribute("id", `grupo${k}`);
        var para = document.createElement("p");
        var nameGroup = document.createTextNode(`Grupo${k + 1}`);
        para.appendChild(nameGroup);            //Create text

        group.appendChild(para);

        for (let i = 0; i < 4; i++) {
            var teamDiv = document.createElement("div");                        //Create team Div
            teamDiv.classList.add(`teamDiv`);
            teamDiv.setAttribute("id", `teamDiv${i}/${k}`);

            var node = document.createTextNode(`/`);                         //Create text

            var teamDiv = document.createElement("div");                    //Create team Div
            teamDiv.classList.add(`teamDiv`);
            teamDiv.setAttribute('draggable', true);
            teamDiv.setAttribute("id", `teamDiv${i}/${k}`);

            input = document.createElement("input");                    //Input checkbox
            input.setAttribute("type", "checkbox");
            input.setAttribute("class", `teamCheck`);
            input.setAttribute("id", `teamCheck${i}/${k}`);
            input.setAttribute("name", "number");

            textI = document.createElement("input");                    //Input text
            textI.setAttribute("type", "text");
            textI.setAttribute("oninput", "numberOnly(this.id);");
            textI.setAttribute("maxlength", "3");
            textI.setAttribute("class", `teamInput`);
            textI.setAttribute("id", `teamInput${i}/${k}`);
            textI.setAttribute("name", "number");
            textI.setAttribute("placeholder", "0");

            group.appendChild(input);
            teamDiv.appendChild(node);
            group.appendChild(teamDiv);
            group.appendChild(textI);
            bracketDiv.appendChild(group);

            var currentDiv = document.getElementById("beforeRefDiv2");
            document.body.insertBefore(bracketDiv, currentDiv);
        }
    }
}

dragAndDrop();

function changeData(first, second) {
    if (first == null || second == null)
        return;

    if (first.id.length < 3 || second.id.length < 3)
        return;

    var draged = first.id;
    var destination = second.id;

    var dragedID = draged.charAt(draged.length - 3) + draged.charAt(draged.length - 2) + draged.charAt(draged.length - 1);
    var eDragedInput = document.getElementById(`teamInput${dragedID}`);
    var eDragedCheck = document.getElementById(`teamCheck${dragedID}`);

    var destinationID = destination.charAt(destination.length - 3) + destination.charAt(destination.length - 2) + destination.charAt(destination.length - 1);
    var eDestinationInput = document.getElementById(`teamInput${destinationID}`);
    var eDestinationCheck = document.getElementById(`teamCheck${destinationID}`);

    var auxInput = eDestinationInput.value;
    var auxCheck = eDestinationCheck.checked;

    eDestinationInput.value = eDragedInput.value;
    eDestinationCheck.checked = eDragedCheck.checked;

    eDragedInput.value = auxInput;
    eDragedCheck.checked = auxCheck;
}

function OrganizeData(first, second) {
    if (first == null || second == null)
        return;

    if (first.id.length < 3 || second.id.length < 3)
        return;

    var firstID = first.id;
    var SecondID = second.id;

    var firstIdentification = firstID.charAt(firstID.length - 3) + firstID.charAt(firstID.length - 2) + firstID.charAt(firstID.length - 1);
    var firstInput = document.getElementById(`teamInput${firstIdentification}`);
    var firstCheck = document.getElementById(`teamCheck${firstIdentification}`);
    var firstTeam = document.getElementById(`teamDiv${firstIdentification}`);

    var secondIdentification = SecondID.charAt(SecondID.length - 3) + SecondID.charAt(SecondID.length - 2) + SecondID.charAt(SecondID.length - 1);
    var secondInput = document.getElementById(`teamInput${secondIdentification}`);
    var secondCheck = document.getElementById(`teamCheck${secondIdentification}`);
    var secondteam = document.getElementById(`teamDiv${secondIdentification}`);

    var auxFirstInput = firstInput.value;
    var auxSecondInput = secondInput.value;
    var auxCheck = secondCheck.checked;
    var auxTeam = secondteam.innerHTML;

    firstInput.value = firstInput.value == "" ? 0 : parseInt(firstInput.value);
    secondInput.value = secondInput.value == "" ? 0 : parseInt(secondInput.value);

    var auxFirstInput = parseInt(firstInput.value);
    var auxSecondInput = parseInt(secondInput.value);

    if (auxFirstInput < auxSecondInput) {
        secondInput.value = auxFirstInput;
        secondCheck.checked = firstCheck.checked;
        secondteam.innerHTML = firstTeam.innerHTML;

        firstInput.value = auxSecondInput;
        firstCheck.checked = auxCheck;
        firstTeam.innerHTML = auxTeam;
    }
}

/*Drag and Drop*/
function dragAndDrop() {
    document.addEventListener('DOMContentLoaded', (event) => {

        var dragSrcEl = null;

        function handleDragStart(e) {

            this.style.opacity = '0.4';

            dragSrcEl = this;

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            e.dataTransfer.dropEffect = 'move';

            return false;
        }

        function handleDragEnter(e) {
            this.classList.add('over');
        }

        function handleDragLeave(e) {
            this.classList.remove('over');
        }

        function handleDrop(e) {
            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }

            if (dragSrcEl != this) {
                dragSrcEl.innerHTML = this.innerHTML;

                DeleteDiv(dragSrcEl, e.dataTransfer.getData('text/html'), this);

                this.innerHTML = e.dataTransfer.getData('text/html');

                changeData(dragSrcEl, this);
            }

            updateValue();
            return false;
        }

        function handleDragEnd(e) {
            this.style.opacity = '1';

            items.forEach(function (item) {
                item.classList.remove('over');
            });
        }

        let items = document.querySelectorAll('.teamDiv');
        items.forEach(function (item) {
            item.addEventListener('dragstart', handleDragStart, false);
            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
            item.addEventListener('dragend', handleDragEnd, false);
        });
    });
}

function DeleteDiv(e, i, ref) {
    if (e.innerHTML == "" || e.innerHTML == "/") {
        if (e.innerHTML != i && e.closest('.toSelectSlots') != null) {
            e.remove();
        }
    }
}

function numberOnly(id) {
    var element = document.getElementById(id);
    element.value = element.value.replace(/[^0-9]/gi, "");
}

var elements = document.getElementsByClassName("teamInput");

for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('change', updateValue);
}

function updateValue() {
    var groupsNumber = Math.ceil(groupSize / 4);

    if (IsOnBrackets) { //brackets
        let bracDivi = 1;
        console.clear();

        for (let k = 0; k < columns - 1; k++) {
            for (let i = 0; i < groupSizeAdap / bracDivi / 2; i++) {

                const match = document.getElementById(`match${i}/${k}`);   //Match to compare
                var scoreTeam1 = document.getElementById(`team${i * 2}/${k}`).value;
                var scoreTeam2 = document.getElementById(`team${(i * 2) + 1}/${k}`).value;

                const team1 = document.getElementById(`teamDiv${i * 2}/${k}`);
                const team2 = document.getElementById(`teamDiv${(i * 2) + 1}/${k}`);

                var groupAuxSelect = 0;
                if (i % 2 == 1) {
                    groupAuxSelect = 1;
                }

                var name = `teamDiv${(i)}/${k + 1}`;
                const winnerSlot = document.getElementById(name);

                scoreTeam1 = scoreTeam1 == "" ? 0 : parseInt(scoreTeam1);
                scoreTeam2 = scoreTeam2 == "" ? 0 : parseInt(scoreTeam2);

                if (scoreTeam1 > scoreTeam2) {
                    team1.classList.add('winner');
                    team1.classList.remove('loser');

                    team2.classList.add('loser');
                    team2.classList.remove('winner');

                    if (k == columns - 2) {
                        winnerSlot.classList.add('bigwinner');
                    }

                    winnerSlot.innerHTML = team1.innerHTML;
                }

                else if (scoreTeam1 < scoreTeam2) {
                    team2.classList.add('winner');
                    team2.classList.remove('loser');

                    team1.classList.add('loser');
                    team1.classList.remove('winner');

                    if (k == columns - 2) {
                        winnerSlot.classList.add('bigwinner');
                    }

                    winnerSlot.innerHTML = team2.innerHTML;
                } else {
                    team1.classList.remove('loser');
                    team1.classList.remove('winner');

                    team2.classList.remove('loser');
                    team2.classList.remove('winner');

                    winnerSlot.innerHTML = "/";
                }
            }

            bracDivi = bracDivi * 2;
        }
    } else { //group fase mode
        for (let k = 0; k < groupsNumber; k++) {    //group
            for (let j = 0; j < 4; j++) {
                for (let i = 0; i < 4; i++) {           //teams inside each group
                    const scoreTeam1 = document.getElementById(`teamDiv${i}/${k}`);
                    var n = i + 1;
                    const scoreTeam2 = document.getElementById(`teamDiv${n}/${k}`);

                    if (i != 3)
                        OrganizeData(scoreTeam1, scoreTeam2);
                }
            }
        }
    }
}
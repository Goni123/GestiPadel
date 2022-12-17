var list;

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

CreateGroups();
CreateBracketsSlots();

//CreateGroups();
//CreateGroupFase();


//DeleteWholeBracket();

let brackets = document.querySelectorAll('.bracketSlots');

for (let toSelectSlots of brackets) {
    //bracketSlots.style.gridTemplateColumns = 'repeat(10, 1fr)';
    bracketSlots.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

function GetTeamList() {
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

            var img = new Image();                                          //Create Image
            img.src = "/img/brackets/line.png";
            img.classList.add(`teamLine`);

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

            matchDiv.appendChild(img);

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

    var bracketDiv = document.createElement("div");                     //Create bracket Div
    bracketDiv.classList.add(`groupFase`);
    bracketDiv.setAttribute('id', 'groupFase');

    var group = document.createElement("div");                          //Create general Div
    group.classList.add(`group1`);
    bracketDiv.appendChild(group);

    var teamDiv = document.createElement("div");                    //Create team Div

    teamDiv.setAttribute("id", `teamDiv${i}/${k}`);

    var node = document.createTextNode(`/`);                        //Create text

    teamDiv.appendChild(node);

    genDiv.appendChild(teamDiv);

    var currentDiv = document.getElementById("beforeRefDiv2");
    document.body.insertBefore(bracketDiv, currentDiv);
}

/*Drag and Drop*/

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
            DeleteDiv(dragSrcEl);
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';

        items.forEach(function (item) {
            item.classList.remove('over');
        });
    }

    let items = document.querySelectorAll('.genDiv .teamDiv');
    items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
});

function DeleteDiv(e) {
    console.log(e.innerHTML);

    if (e.innerHTML == "" || e.innerHTML == "/") {
        e.remove();
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

    let bracDivi = 1;
    console.clear();

    for (let k = 0; k < columns - 1; k++) {
        for (let i = 0; i < groupSizeAdap / bracDivi / 2; i++) {

            const match = document.getElementById(`match${i}/${k}`);   //Match to compare
            const scoreTeam1 = document.getElementById(`team${i * 2}/${k}`).value;
            const scoreTeam2 = document.getElementById(`team${(i * 2) + 1}/${k}`).value;

            const team1 = document.getElementById(`teamDiv${i * 2}/${k}`);
            const team2 = document.getElementById(`teamDiv${(i * 2) + 1}/${k}`);

            var groupAuxSelect = 0;
            if (i % 2 == 1) {
                groupAuxSelect = 1;
            }

            var name = `teamDiv${(i)}/${k + 1}`;
            const winnerSlot = document.getElementById(name);

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
}
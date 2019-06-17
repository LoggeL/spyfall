if (serviceWorker in navigator) {
    navigator.serviceWorker.register('service-worker.js', {
        scope: './'
    });

    navigator.serviceWorker.ready.then(
        function () {
            console.log("Service worker is ready!")
        }
    );
}

let deferredPrompt;
const addBtn = document.getElementById('add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {

    e.preventDefault();
    deferredPrompt = e;
    addBtn.style.display = 'block';

    addBtn.addEventListener('click', (e) => {
        addBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
});

var blacklist = [] // Vermeide Dupes

var daten = [
    { ort: "Bäckerei", rollen: ["Bäcker", "Lehrling", "Verkäufer", "Lieferant"] },
    { ort: "Werkstatt", rollen: ["Mechaniker", "Autofahrer", "Besitzer", "Inspektor"] },
    { ort: "Zug", rollen: ["Kontrolleur", "Lokführer", "Fahrgast", "Schaffner", "Pendler"] },
    { ort: "Raumschiff", rollen: ["Astronaut", "Pilot", "Alien", "Wissenschaftler"] },
    { ort: "Bus", rollen: ["Fahrer", "Mechaniker", "Schüler", "Kontrolleur", "Pendler"] },
    { ort: "U-Boot", rollen: ["Maschinist", "Kapitän", "Offizier", "Flugzeugpilot"] },
    { ort: "Farm", rollen: ["Bauer", "Schäfer", "Traktorfahrer", "Aushilfskraft"] },
    { ort: "Antarktis-Forschungsstation", rollen: ["Forscher", "Fischer", "Wilderer"] },
    { ort: "Burg", rollen: ["Ritter", "Bogenschütze", "König"] },
    { ort: "Bundestag", rollen: ["Reinigunsfachkraft", "Kanlzer", "Minister"] },
    { ort: "Fahrschule", rollen: ["Prüfer", "Schüler", "Lehrer"] },
    { ort: "Zoo", rollen: ["Wärter", "Besucher", "Direktor"] },
    { ort: "Kino", rollen: ["Besucher", "Techniker", "Besitzer"] },
    { ort: "Krankenhaus", rollen: ["Chirurg", "Patient", "Sanitäter"] },
    { ort: "Fabrik", rollen: ["Arbeiter", "Besitzer", "Mechaniker"] },
    { ort: "Polizei", rollen: ["Verbrecher", "Polizist", "Zivilist"] },
    { ort: "Gefängnis", rollen: ["Wärter", "Sträfling", "Koch"] },
    { ort: "Heißluftballon", rollen: ["Pilot", "Fahrgast", "Fotograf"] },
    { ort: "Gastwirtschaft", rollen: ["Koch", "Kellner", "Gast"] },
    { ort: "Gemeindeamt", rollen: ["Bürgermeister", "Abgeordneter", "Besorgter Bürger"] },
    { ort: "Fußballvereinshaus", rollen: ["Trainer", "Vorsitzender", "Stürmer", "Torwart"] },
    { ort: "Tankstelle", rollen: ["Tankwart", "Autofahrer", "Kassierer", "Räuber"] },
    { ort: "Pfarramt", rollen: ["Pfarrer", "Diakon", "Küster"] },
    { ort: "Büro", rollen: ["Chef", "Azubi", "Abteilungsleiter", "Putzfrau"] },
    { ort: "Autofähre", rollen: ["Kapitän", "Autofahrer", "Kassierer", "Matrose", "Maschinist"] },
    { ort: "Passagierflugzeug", rollen: ["Pilot", "Terrorist", "Stewardess", "Passagier", "Mechaniker"] },
    { ort: "Flugzeugträger", rollen: ["Pilot", "Soldat", "Kapitän", "Matrose", "Funker", "Waffenoffizier"] },
    { ort: "Kasino", rollen: ["Groupier", "Spieler", "Wachmann", "Lockvogel"] },
    { ort: "Schule", rollen: ["Lehrer", "Schüler", "Praktikant", "Direktor", "Schläger", "Streber"] },
    { ort: "Disko", rollen: ["DJ", "Barkeeper", "Stripper", "Wachmann", "Sanitäter", "Tänzer"] },
    { ort: "Museum", rollen: ["Nachtwächter", "Besucher", "Historiker", "Direktor", "Kassierer", "Kurator"] },
]

var status = document.getElementById('status')
var home = document.getElementById('home')
var warteSpieler = document.getElementById('warteSpieler')
var zeigeSpieler = document.getElementById('zeigeSpieler')
var zeigeSpy = document.getElementById('zeigeSpy')

var spySpielernummer = document.getElementById('spySpielernummer')
var zeigeSpielernummer = document.getElementById('zeigeSpielernummer')

var spieler, auswahl, spy, spielerzahl

var blacklistInput = document.getElementById('blacklist-input')
var farbenInput = document.getElementById('farben-input')
var mehrfachnennungInput = document.getElementById('mehrfachnennung-input')

farbenInput.onclick = function (e) {
    document.body.className = e.target.checked ? "" : "nocolor"
}

function start() {
    spielerzahl = document.getElementById('anzahl').value

    // rip old browsers
    var validDaten = daten.filter(d => (d.rollen.length + 1 >= spielerzahl || mehrfachnennungInput.checked) && (!blacklist.includes(d.ort) || !blacklistInput.checked))

    if (validDaten.length == 0) {
        return alert("Nicht genug Rollen für die Spieleranzahl! Deaktiviere Blacklist und/oder aktiviere Mehrfachnennung!")
    }

    spy = Math.floor(Math.random() * spielerzahl)
    auswahl = validDaten[Math.floor(Math.random() * validDaten.length)]

    blacklist.push(auswahl.ort)
    auswahl.rollen = shuffle(auswahl.rollen)
    spieler = 0
    home.className = ''
    warten()
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function warten() {
    zeigeSpieler.className = ''
    zeigeSpy.className = ''
    warteSpielernummer.innerText = spieler + 1
    warteSpieler.className = 'active'
    setTimeout(function () {
        warteSpieler.className = 'active fade'
    })
}

function zeigen() {
    warteSpieler.className = ''
    if (spieler == spy) {
        spySpielernummer.innerText = spieler + 1
        zeigeSpy.className = 'active'
        setTimeout(function () {
            zeigeSpy.className = 'active fade'
        })
    }
    else {
        zeigeSpielernummer.innerText = spieler + 1
        zeigeSpieler.className = 'active'
        setTimeout(function () {
            zeigeSpieler.className = 'active fade'
        })
        zeigeOrt.innerText = auswahl.ort
        zeigeRolle.innerText = auswahl.rollen.shift()
        if (mehrfachnennungInput) auswahl.rollen.push(zeigeRolle.innerText)
    }
    spieler += 1
}

function spielerAnzahl(number) {
    document.getElementById('anzahl').value = Number(document.getElementById('anzahl').value) + number
}

function weiter() {
    if (spieler == spielerzahl) {
        zeigeSpieler.className = ''
        zeigeSpy.className = ''
        home.className = 'active'
        setTimeout(function () {
            home.className = 'active fade'
        })
        spieler = 0
    }
    else {
        warten()
    }
}

var menu = document.getElementById('settings')
function tauscheMenu() {
    menu.className = menu.className == "" ? "active" : ""
}
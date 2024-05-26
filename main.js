if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', {
    scope: './',
  })

  navigator.serviceWorker.ready.then(function () {
    console.log('Service worker is ready!')
  })
}

/*
const updateChannel = new BroadcastChannel('precache-channel');
updateChannel.addEventListener('message', event => {
    console.log(event)
    if (confirm(`New content is available!. Click OK to refresh`)) {
        window.location.reload();
    }
});
*/

let deferredPrompt
const addBtn = document.getElementById('add-button')
addBtn.style.display = 'none'

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeInstallPrompt')

  e.preventDefault()
  deferredPrompt = e
  addBtn.style.display = 'block'

  addBtn.addEventListener('click', (e) => {
    addBtn.style.display = 'none'
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt')
      } else {
        console.log('User dismissed the A2HS prompt')
      }
      deferredPrompt = null
    })
  })
})

const blacklist = [] // Vermeide Dupes

const daten = [
  {
    ort: 'Bäckerei',
    rollen: ['Bäcker', 'Lehrling', 'Verkäufer', 'Lieferant', 'Müller'],
    difficulty: 'mittel',
  },
  {
    ort: 'Werkstatt',
    rollen: ['Mechaniker', 'Autofahrer', 'Besitzer', 'Inspektor', 'Sekretär'],
    difficulty: 'leicht',
  },
  {
    ort: 'Zug',
    rollen: [
      'Kontrolleur',
      'Lokführer',
      'Fahrgast',
      'Schaffner',
      'Pendler',
      'Fahrkartenverkäufer',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Raumschiff',
    rollen: ['Astronaut', 'Pilot', 'Alien', 'Wissenschaftler', 'Kosmonaut'],
    difficulty: 'schwer',
  },
  {
    ort: 'Bus',
    rollen: [
      'Fahrer',
      'Mechaniker',
      'Schüler',
      'Kontrolleur',
      'Pendler',
      'Student',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'U-Boot',
    rollen: ['Maschinist', 'Kapitän', 'Offizier', 'Funker', 'Kadett'],
    difficulty: 'schwer',
  },
  {
    ort: 'Farm',
    rollen: [
      'Bauer',
      'Schäfer',
      'Traktorfahrer',
      'Aushilfskraft',
      'Saisonarbeiter',
      'Verkäufer',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Antarktis-Forschungsstation',
    rollen: ['Forscher', 'Fischer', 'Wilderer', 'Eistaucher'],
    difficulty: 'schwer',
  },
  {
    ort: 'Burg',
    rollen: [
      'Ritter',
      'Bogenschütze',
      'König',
      'Hofnarr',
      'Prinzessin',
      'Schelm',
      'Jauchetransporter',
      'Henker',
      'Pestdoktor',
      'Prinzessin',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Bundestag',
    rollen: [
      'Parteivorsitzender',
      'Kanzler',
      'Minister',
      'Besucher',
      'Regierungssprecher',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Fahrschule',
    rollen: ['Prüfer', 'Schüler', 'Lehrer'],
    difficulty: 'mittel',
  },
  {
    ort: 'Zoo',
    rollen: ['Wärter', 'Besucher', 'Direktor', 'Pfleger', 'Verkäufer'],
    difficulty: 'leicht',
  },
  {
    ort: 'Kino',
    rollen: ['Besucher', 'Techniker', 'Besitzer', 'Verkäufer', 'Putzkraft'],
    difficulty: 'leicht',
  },
  {
    ort: 'Krankenhaus',
    rollen: [
      'Chirurg',
      'Patient',
      'Sanitäter',
      'Krankenpfleger',
      'Psychologe',
      'Helikopterpilot',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Fabrik',
    rollen: [
      'Arbeiter',
      'Besitzer',
      'Mechaniker',
      'Werksleiter',
      'Sekretär',
      'Verwalter',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Polizei',
    rollen: ['Verbrecher', 'Polizist', 'Zivilist', 'Zeuge', 'Kommissar'],
    difficulty: 'mittel',
  },
  {
    ort: 'Gefängnis',
    rollen: ['Wärter', 'Sträfling', 'Koch', 'Arzt', 'Psychologe', 'Dealer'],
    difficulty: 'mittel',
  },
  {
    ort: 'Heißluftballon',
    rollen: ['Pilot', 'Fahrgast', 'Fotograf'],
    difficulty: 'leicht',
  },
  {
    ort: 'Gastwirtschaft',
    rollen: ['Koch', 'Kellner', 'Gast', 'Rezeptionist'],
    difficulty: 'leicht',
  },
  {
    ort: 'Gemeindeamt',
    rollen: ['Bürgermeister', 'Abgeordneter', 'Besorgter Bürger', 'Bauplaner'],
    difficulty: 'mittel',
  },
  {
    ort: 'Fußballvereinshaus',
    rollen: [
      'Trainer',
      'Vorsitzender',
      'Stürmer',
      'Torwart',
      'Mittelfeldspieler',
      'Verteidiger',
      'Co-Trainer',
      'Präsident',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Tankstelle',
    rollen: ['Tankwart', 'Autofahrer', 'Kassierer', 'Räuber', 'LKW-Fahrer'],
    difficulty: 'leicht',
  },
  {
    ort: 'Pfarramt',
    rollen: ['Pfarrer', 'Diakon', 'Küster', 'Organist'],
    difficulty: 'mittel',
  },
  {
    ort: 'Büro',
    rollen: ['Chef', 'Azubi', 'Abteilungsleiter', 'Putzkraft', 'Sekretär'],
    difficulty: 'leicht',
  },
  {
    ort: 'Autofähre',
    rollen: [
      'Kapitän',
      'Autofahrer',
      'Kassierer',
      'Matrose',
      'Maschinist',
      'Lotse',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Passagierflugzeug',
    rollen: [
      'Pilot',
      'Terrorist',
      'Stewardess',
      'Passagier',
      'Mechaniker',
      'Co-Pilot',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Flugzeugträger',
    rollen: [
      'Pilot',
      'Soldat',
      'Kapitän',
      'Matrose',
      'Funker',
      'Waffenoffizier',
      'Koch',
      'Offizier',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Kasino',
    rollen: [
      'Groupier',
      'Spieler',
      'Wachmann',
      'Lockvogel',
      'Kellner',
      'Barkeeper',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Schule',
    rollen: [
      'Lehrer',
      'Schüler',
      'Praktikant',
      'Direktor',
      'Schläger',
      'Streber',
      'Austauschschüler',
      'Sekretär',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Disko',
    rollen: ['DJ', 'Barkeeper', 'Stripper', 'Wachmann', 'Sanitäter', 'Tänzer'],
    difficulty: 'mittel',
  },
  {
    ort: 'Museum',
    rollen: [
      'Nachtwächter',
      'Besucher',
      'Historiker',
      'Direktor',
      'Kassierer',
      'Kurator',
      'Kartenverkäufer',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Kirche',
    rollen: [
      'Pfarrer',
      'Kirchgänger',
      'Messdiener',
      'alte Oma',
      'Chorsänger',
      'Organist',
      'Sakristan',
      'Bischof',
      'Papst',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Pyramide',
    rollen: ['Sklaven', 'Pharaoh', 'Sklaventreiber', 'Mumie', 'Steinmetz'],
    difficulty: 'schwer',
  },
  {
    ort: 'Schwimmbad',
    rollen: [
      'Bademeister',
      'Kassierer',
      'Kioskverkäufer',
      'Nichtschwimmer',
      'Sportschwimmer',
      'Spanner',
      'Schwimmlehrer',
      'Planschbeckenpinkler',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Bordell',
    rollen: ['Zuhälter', 'Prostituierte', 'Freier', 'Putzfrau', 'Security'],
    difficulty: 'mittel',
  },
  {
    ort: 'Sauna',
    rollen: [
      'Saunameister',
      'Gast',
      'Rettungssanitäter',
      'Spanner',
      'Kassierer',
      'Masseur',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Campingplatz',
    rollen: [
      'Campleitung',
      'Reinigungsfachkraft',
      'Security',
      'Hobbycamper',
      'Dauercamper',
      'Partycamper',
      'Kinderfreizeitbetreuer',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Jahrmarkt',
    rollen: [
      'Besucher',
      'Schausteller',
      'Security',
      'Dieb',
      'Ansager',
      'Sanitäter',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Festival',
    rollen: [
      'Junkie',
      'Musiker',
      'Raver',
      'Groupie',
      'Sanitäter',
      'Dealer',
      'Security',
      'Besucher',
      'Ausschankhelfer',
      'Betrunkener',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Großküche',
    rollen: [
      'Koch',
      'Azubi',
      'Tellerwäscher',
      'Chef',
      'Kellner',
      'Lieferrant',
      'Kunde',
      'Putzfachkraft',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Filmset',
    rollen: [
      'Regisseur',
      'Filmstar',
      'Bühnenbildner',
      'Maskenbildner',
      'Stuntdouble',
      'Star',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Weißes Haus',
    rollen: [
      'President',
      'First Lady',
      'Personenschützer',
      'Attentäter',
      'Pressesprecher',
      'General',
      'Scharfschütze',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Zirkus',
    rollen: [
      'Clown',
      'Jongleur',
      'Domteur',
      'Besucher',
      'Direktor',
      'Akrobat',
      'Verkäufer',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Leichenhalle',
    rollen: ['Leiche', 'Fahrer', 'Besitzer', 'Ofenmeister', 'Bestatter'],
    difficulty: 'schwer',
  },
  {
    ort: 'Friedhof',
    rollen: [
      'Sargträger',
      'Trauergast',
      'Toter',
      'Zombie',
      'Pfarrer',
      'Florist',
      'Leichenschänder',
      'Satanist',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Bibliothek',
    rollen: ['Student', 'Kurator', 'Dieb', 'Rezeptionist'],
    difficulty: 'leicht',
  },
  {
    ort: 'Bergwerk',
    rollen: [
      'Aufzugführer',
      'Lohrenfahrer',
      'Bergarbeiter',
      'Schichtleiter',
      'Sprengmeister',
      'Baggerfahrer',
      'Besitzer',
      'Zwerg',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Wald',
    rollen: [
      'Förster',
      'Wildcamper',
      'Jäger',
      'Wanderer',
      'Spaziergänger',
      'Jogger',
      'MBT-Fahrer',
      'Künstler',
      'Wilderer',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Savanne',
    rollen: [
      'Tourguide',
      'Wilderer',
      'Tourist',
      'Fotograf',
      'Fahrer',
      'Tierschützer',
      'Ureinwohner',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Fußballstadion',
    rollen: [
      'Hooligan',
      'Trainer',
      'Spieler',
      'Maskottchen',
      'Bauchladenverkäufer',
      'Kommentator',
      'Security',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Brauerei',
    rollen: [
      'Lieferant',
      'Kunde',
      'Vorkoster',
      'Braumeister',
      'Kontrolleur',
      'Geschäftsführung',
      'Azubi',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Fitnessstudio',
    rollen: [
      'Trainer',
      'Flexer',
      'Fettbacke',
      'Influencer',
      'Rezeptionist',
      'Barkeeper',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Aquarium',
    rollen: [
      'Tierpfleger',
      'Besucher',
      'Meeresbiologe',
      'Fütterer',
      'Tourguide',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Verlagsbüro',
    rollen: ['Redakteur', 'Autor', 'Lektor', 'Grafiker', 'Verleger'],
    difficulty: 'leicht',
  },
  {
    ort: 'Kreuzfahrtschiff',
    rollen: [
      'Kapitän',
      'Animateur',
      'Gast',
      'Kellner',
      'Techniker',
      'Reiseleiter',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Reitstall',
    rollen: ['Reitlehrer', 'Pferdewirt', 'Tierarzt', 'Schüler', 'Stallbursche'],
    difficulty: 'leicht',
  },
  {
    ort: 'Rettungswache',
    rollen: [
      'Sanitäter',
      'Notarzt',
      'Leitstellendisponent',
      'Praktikant',
      'Rettungswagenfahrer',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Schießstand',
    rollen: [
      'Schütze',
      'Trainer',
      'Waffenhändler',
      'Waffenkontrolleur',
      'Wettkampfrichter',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Töpferwerkstatt',
    rollen: ['Töpfer', 'Lehrling', 'Verkäufer', 'Kunde', 'Designer'],
    difficulty: 'leicht',
  },
  {
    ort: 'Rathaus',
    rollen: ['Bürgermeister', 'Stadtrat', 'Bürger', 'Sekretär', 'Kämmerer'],
    difficulty: 'mittel',
  },
  {
    ort: 'Opernhaus',
    rollen: [
      'Sänger',
      'Dirigent',
      'Bühnenbildner',
      'Maskenbildner',
      'Zuschauer',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Kartbahn',
    rollen: [
      'Rennfahrer',
      'Mechaniker',
      'Streckenposten',
      'Zeitnehmer',
      'Zuschauer',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Rennstrecke',
    rollen: [
      'Fahrer',
      'Teamchef',
      'Mechaniker',
      'Sicherheitsbeauftragter',
      'Reporter',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Weingut',
    rollen: ['Winzer', 'Verkäufer', 'Sommelier', 'Kellermeister', 'Besucher'],
    difficulty: 'mittel',
  },
  {
    ort: 'Hochzeit',
    rollen: ['Braut', 'Bräutigam', 'Trauzeuge', 'Pfarrer', 'Hochzeitsplaner'],
    difficulty: 'leicht',
  },
  {
    ort: 'Filmfestival',
    rollen: ['Schauspieler', 'Regisseur', 'Kritiker', 'Moderator', 'Zuschauer'],
    difficulty: 'mittel',
  },
  {
    ort: 'Gefängnis',
    rollen: ['Insasse', 'Wärter', 'Arzt', 'Anwalt', 'Besucher'],
    difficulty: 'schwer',
  },
  {
    ort: 'Sternerestaurant',
    rollen: ['Chefkoch', 'Souschef', 'Sommelier', 'Gast', 'Küchenhilfe'],
    difficulty: 'schwer',
  },
  {
    ort: 'Vergnügungspark',
    rollen: [
      'Fahrgeschäftsbetreiber',
      'Besucher',
      'Security',
      'Schausteller',
      'Techniker',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Archäologische Ausgrabung',
    rollen: ['Archäologe', 'Student', 'Feldarbeiter', 'Tourist', 'Restaurator'],
    difficulty: 'mittel',
  },
  {
    ort: 'Rettungsstation am Strand',
    rollen: [
      'Rettungsschwimmer',
      'Sanitäter',
      'Tourist',
      'Kioskbetreiber',
      'Fischer',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Konzert',
    rollen: ['Musiker', 'Roadie', 'Fan', 'Sicherheitsdienst', 'Techniker'],
    difficulty: 'leicht',
  },
  {
    ort: 'Bibliothek',
    rollen: [
      'Bibliothekar',
      'Student',
      'Forscher',
      'Buchbinder',
      'Reinigungskraft',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Luxushotel',
    rollen: ['Rezeptionist', 'Gast', 'Koch', 'Pagenjunge', 'Hausmeister'],
    difficulty: 'mittel',
  },
  {
    ort: 'Architekturbüro',
    rollen: ['Architekt', 'Ingenieur', 'Sekretär', 'Bauzeichner', 'Kunde'],
    difficulty: 'mittel',
  },
  {
    ort: 'Botanischer Garten',
    rollen: ['Gärtner', 'Botaniker', 'Besucher', 'Führer', 'Forscher'],
    difficulty: 'leicht',
  },
  {
    ort: 'Geisterhaus',
    rollen: ['Geist', 'Besucher', 'Hausmeister', 'Medium', 'Forscher'],
    difficulty: 'schwer',
  },
  {
    ort: 'Rodelbahn',
    rollen: ['Rodler', 'Schiedsrichter', 'Trainer', 'Mechaniker', 'Zuschauer'],
    difficulty: 'leicht',
  },
  {
    ort: 'Kunstgalerie',
    rollen: [
      'Künstler',
      'Kurator',
      'Besucher',
      'Reinigungskraft',
      'Kunstkritiker',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Radiostation',
    rollen: ['Moderator', 'Techniker', 'Gast', 'Praktikant', 'Musikredakteur'],
    difficulty: 'mittel',
  },
  {
    ort: 'U-Bahn-Station',
    rollen: [
      'Fahrgast',
      'Kontrolleur',
      'Sicherheitsbeamter',
      'Straßenkünstler',
      'Reinigungskraft',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Freizeitpark',
    rollen: [
      'Fahrgeschäftsbetreiber',
      'Besucher',
      'Maskottchen',
      'Sicherheitsbeamter',
      'Sanitäter',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Münzprägeanstalt',
    rollen: [
      'Prägearbeiter',
      'Werttransportfahrer',
      'Sicherheitsbeamter',
      'Aufseher',
      'Ingenieur',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Tatort',
    rollen: ['Ermittler', 'Zeuge', 'Reporter', 'Opfer', 'Forensiker'],
    difficulty: 'schwer',
  },
  {
    ort: 'Wüstenexpedition',
    rollen: [
      'Expeditionsleiter',
      'Kamelreiter',
      'Archäologe',
      'Fotograf',
      'Einheimischer',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Märchenwald',
    rollen: ['Prinzessin', 'Hexe', 'Jäger', 'Zwerg', 'Besucher'],
    difficulty: 'mittel',
  },
  {
    ort: 'Fitnessstudio',
    rollen: [
      'Trainer',
      'Kunde',
      'Rezeptionist',
      'Reinigungsfachkraft',
      'Ernährungsberater',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Drehrestaurant',
    rollen: ['Koch', 'Kellner', 'Gast', 'Manager', 'Reinigungskraft'],
    difficulty: 'mittel',
  },
  {
    ort: 'Weihnachtsmarkt',
    rollen: ['Verkäufer', 'Besucher', 'Weihnachtsmann', 'Security', 'Musiker'],
    difficulty: 'leicht',
  },
  {
    ort: 'Tiefgarage',
    rollen: ['Wächter', 'Autofahrer', 'Dieb', 'Wagenwäscher', 'Techniker'],
    difficulty: 'leicht',
  },
  {
    ort: 'Weinberg',
    rollen: ['Winzer', 'Erntehelfer', 'Weinverkoster', 'Tourist', 'Gärtner'],
    difficulty: 'mittel',
  },
  {
    ort: 'Eishalle',
    rollen: [
      'Eiskunstläufer',
      'Trainer',
      'Eishockeyspieler',
      'Zuschauer',
      'Eisbereiter',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Kletterhalle',
    rollen: ['Kletterer', 'Trainer', 'Sicherer', 'Zuschauer', 'Rezeptionist'],
    difficulty: 'leicht',
  },
  {
    ort: 'Windpark',
    rollen: [
      'Techniker',
      'Wartungspersonal',
      'Ingenieur',
      'Investor',
      'Besucher',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Strandbar',
    rollen: ['Barkeeper', 'Gast', 'DJ', 'Lifeguard', 'Kellner'],
    difficulty: 'leicht',
  },
  {
    ort: 'Raumstation',
    rollen: [
      'Astronaut',
      'Wissenschaftler',
      'Techniker',
      'Funkkontakt',
      'Mediziner',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Flughafenterminal',
    rollen: [
      'Passagier',
      'Sicherheitskontrolleur',
      'Flugbegleiter',
      'Pilot',
      'Bodenpersonal',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Schiffswerft',
    rollen: [
      'Schiffbauer',
      'Ingenieur',
      'Schweißer',
      'Kranführer',
      'Qualitätsprüfer',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Kletterpark',
    rollen: [
      'Kletterer',
      'Trainer',
      'Sicherheitsbeauftragter',
      'Besucher',
      'Rezeptionist',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Hundeschule',
    rollen: [
      'Hundetrainer',
      'Hundebesitzer',
      'Tierarzt',
      'Pflegekraft',
      'Rezeptionist',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Geheimlabor',
    rollen: [
      'Wissenschaftler',
      'Laborassistent',
      'Wachmann',
      'Versuchsperson',
      'Techniker',
    ],
    difficulty: 'schwer',
  },
  {
    ort: 'Theater',
    rollen: [
      'Schauspieler',
      'Regisseur',
      'Bühnenbildner',
      'Kostümbildner',
      'Zuschauer',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Universität',
    rollen: [
      'Professor',
      'Student',
      'Dozent',
      'Bibliothekar',
      'Verwaltungsmitarbeiter',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Skigebiet',
    rollen: [
      'Skilehrer',
      'Skifahrer',
      'Liftbetreiber',
      'Rettungssanitäter',
      'Hotelier',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Tiefseeexpedition',
    rollen: ['Meeresbiologe', 'Taucher', 'Kapitän', 'Ingenieur', 'Forscher'],
    difficulty: 'schwer',
  },
  {
    ort: 'Münchener Oktoberfest',
    rollen: [
      'Bierzeltbedienung',
      'Besucher',
      'Sicherheitskraft',
      'Musiker',
      'Schausteller',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Modeatelier',
    rollen: [
      'Modedesigner',
      'Schneider',
      'Modell',
      'Einkäufer',
      'Stofflieferant',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Kunstschule',
    rollen: ['Kunstlehrer', 'Student', 'Modell', 'Hausmeister', 'Galerist'],
    difficulty: 'leicht',
  },
  {
    ort: 'Boxring',
    rollen: ['Boxer', 'Trainer', 'Ringrichter', 'Sanitäter', 'Zuschauer'],
    difficulty: 'leicht',
  },
  {
    ort: 'Rennpferdstall',
    rollen: ['Jockey', 'Trainer', 'Tierarzt', 'Stallbursche', 'Besitzer'],
    difficulty: 'mittel',
  },
  {
    ort: 'Feuerwehrstation',
    rollen: [
      'Feuerwehrmann',
      'Rettungssanitäter',
      'Techniker',
      'Leitstellenoperator',
      'Praktikant',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Spielwarenfabrik',
    rollen: [
      'Produktionsleiter',
      'Spielzeugdesigner',
      'Fließbandarbeiter',
      'Qualitätsprüfer',
      'Verpacker',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Süßwarenladen',
    rollen: ['Verkäufer', 'Konditor', 'Kunde', 'Lagerist', 'Filialleiter'],
    difficulty: 'leicht',
  },
  {
    ort: 'Autobahn',
    rollen: [
      'Autofahrer',
      'Trucker',
      'Polizist',
      'Raststättenbetreiber',
      'Sanitäter',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Freilichtbühne',
    rollen: [
      'Schauspieler',
      'Regisseur',
      'Techniker',
      'Bühnenarbeiter',
      'Zuschauer',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Windmühle',
    rollen: ['Müller', 'Bäcker', 'Techniker', 'Tourist', 'Landwirt'],
    difficulty: 'leicht',
  },
  {
    ort: 'Papierfabrik',
    rollen: [
      'Maschinenführer',
      'Chemiker',
      'Qualitätsprüfer',
      'Lagerist',
      'Verpackungsarbeiter',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Rummelplatz',
    rollen: [
      'Schausteller',
      'Besucher',
      'Fahrgeschäftbetreiber',
      'Imbissverkäufer',
      'Sicherheitskraft',
    ],
    difficulty: 'leicht',
  },
  {
    ort: 'Orchesterprobe',
    rollen: ['Dirigent', 'Violinist', 'Cellist', 'Pianist', 'Techniker'],
    difficulty: 'mittel',
  },
  {
    ort: 'Planetarium',
    rollen: ['Astronom', 'Techniker', 'Besucher', 'Schüler', 'Rezeptionist'],
    difficulty: 'mittel',
  },
  {
    ort: 'Rennstall',
    rollen: [
      'Fahrer',
      'Mechaniker',
      'Ingenieur',
      'Teamchef',
      'Sponsorenvertreter',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Segelschiff',
    rollen: ['Kapitän', 'Matrose', 'Navigator', 'Koch', 'Wachmann'],
    difficulty: 'schwer',
  },
  {
    ort: 'Straßenfest',
    rollen: ['Musiker', 'Besucher', 'Essensverkäufer', 'Künstler', 'Polizist'],
    difficulty: 'leicht',
  },
  {
    ort: 'Karneval',
    rollen: [
      'Karnevalist',
      'Musiker',
      'Sicherheitskraft',
      'Wagenbauer',
      'Kostümdesigner',
    ],
    difficulty: 'mittel',
  },
  {
    ort: 'Höhlenexpedition',
    rollen: ['Führer', 'Forscher', 'Geologe', 'Höhlenkletterer', 'Fotograf'],
    difficulty: 'schwer',
  },
  {
    ort: 'Surfcamp',
    rollen: [
      'Surflehrer',
      'Teilnehmer',
      'Rettungsschwimmer',
      'Koch',
      'Ladenbesitzer',
    ],
    difficulty: 'leicht',
  },
]

const status = document.getElementById('status')
const home = document.getElementById('home')
const warteSpieler = document.getElementById('warteSpieler')
const zeigeSpieler = document.getElementById('zeigeSpieler')
const zeigeSpy = document.getElementById('zeigeSpy')

const spySpielernummer = document.getElementById('spySpielernummer')
const zeigeSpielernummer = document.getElementById('zeigeSpielernummer')

// Global variables :S
let spieler, auswahl, spy, spielerzahl

const blacklistInput = document.getElementById('blacklist-input')
const farbenInput = document.getElementById('farben-input')
const mehrfachnennungInput = document.getElementById('mehrfachnennung-input')

farbenInput.onclick = function (e) {
  document.body.className = e.target.checked ? '' : 'nocolor'
}

function start() {
  spielerzahl = document.getElementById('anzahl').value

  const validDaten = daten.filter(
    (d) =>
      (d.rollen.length + 1 >= spielerzahl || mehrfachnennungInput.checked) &&
      (!blacklist.includes(d.ort) || !blacklistInput.checked)
  )

  if (validDaten.length == 0) {
    return alert(
      'Nicht genug Rollen für die Spieleranzahl! Deaktiviere Blacklist und/oder aktiviere Mehrfachnennung!'
    )
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
  return array.sort(() => Math.random() - 0.5)
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
  } else {
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

function spielerAnzahl(change) {
  const current = Number(document.getElementById('anzahl').value)
  if (current + change < 3) return
  const locationCount = document.getElementById('locationCount')
  //   Count locations which support the current player count
  const count = mehrfachnennungInput.checked
    ? daten.length
    : daten.filter((d) => d.rollen.length + 1 >= current + change).length
  if (count == 0) return
  locationCount.innerText = count
  document.getElementById('anzahl').value = current + change
}
spielerAnzahl(3)

function weiter() {
  if (spieler == spielerzahl) {
    zeigeSpieler.className = ''
    zeigeSpy.className = ''
    home.className = 'active'
    setTimeout(function () {
      home.className = 'active fade'
    })
    spieler = 0
  } else {
    warten()
  }
}

const menu = document.getElementById('settings')
function tauscheMenu() {
  menu.className = menu.className == '' ? 'active' : ''
}

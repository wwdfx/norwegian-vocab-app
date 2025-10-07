// Lesson 1: From Oslo by train
import lesson1Vocabulary from './lesson1_vocabulary.js';

export const lesson1 = {
  id: "lesson1",
  title: "1. Going to Trondheim",
  subtitle: "introducing oneself, making simple statements and questions, making simple negative statements, numbers",
  level: 1,
  xp_reward: 100,
  audio: `${process.env.PUBLIC_URL}/media/lesson1/1ken.mp3`,
  duration: "0:42",
  
  // Media assets
  media: {
    portrait: `${process.env.PUBLIC_URL}/media/lesson1/pic1.jpg`,
    landscape: `${process.env.PUBLIC_URL}/media/lesson1/pic2.jpg`
  },

  // Introduction text
  introduction: {
    norwegian: "Ken Robbins kommer fra England. Han bor i London. Ken er 23 år gammel. Han reiser med tog fra Oslo til Trondheim. Ken snakker med ei dame. Hun kommer fra Norge.",
    english: "Ken Robbins comes from England. He lives in London. Ken is 23 years old. He is travelling by train from Oslo to Trondheim. Ken is talking to a lady. She comes from Norway.",
    ukrainian: "Кен Роббінс з Англії. Він живе в Лондоні. Кену 23 роки. Він подорожує поїздом з Осло до Тронгейма. Кен розмовляє з жінкою. Вона з Норвегії."
  },

  // Dialogues
  dialogues: {
    ken_monika: {
      id: "ken_monika",
      title: "Ken & Monika",
      audio: `${process.env.PUBLIC_URL}/media/lesson1/1ken.mp3`,
      duration: "0:42",
      introduction: {
        norwegian: "Ken Robbins kommer fra England. Han bor i London. Ken er 23 år gammel. Han reiser med tog fra Oslo til Trondheim. Ken snakker med ei dame. Hun kommer fra Norge.",
        english: "Ken Robbins comes from England. He lives in London. Ken is 23 years old. He is travelling by train from Oslo to Trondheim. Ken is talking to a lady. She comes from Norway.",
        ukrainian: "Кен Роббінс з Англії. Він живе в Лондоні. Кену 23 роки. Він подорожує поїздом з Осло до Тронгейма. Кен розмовляє з жінкою. Вона з Норвегії."
      },
      dialogue: [
        {
          speaker: "Monika",
          norwegian: "Jeg heter Monika. Hva heter du?",
          english: "My name is Monika. What is your name?",
          ukrainian: "Мене звати Моніка. Як тебе звати?"
        },
        {
          speaker: "Ken", 
          norwegian: "Jeg heter Ken.",
          english: "My name is Ken.",
          ukrainian: "Мене звати Кен."
        },
        {
          speaker: "Monika",
          norwegian: "Hvor kommer du fra?",
          english: "Where do you come from?",
          ukrainian: "Звідки ти?"
        },
        {
          speaker: "Ken",
          norwegian: "Jeg kommer fra England. Og du?",
          english: "I come from England. And you?",
          ukrainian: "Я з Англії. А ти?"
        },
        {
          speaker: "Monika",
          norwegian: "Jeg kommer fra Oslo, men jeg bor i Trondheim.",
          english: "I come from Oslo, but I live in Trondheim.",
          ukrainian: "Я з Осло, але живу в Тронгеймі."
        },
        {
          speaker: "Ken",
          norwegian: "Har du familie i Trondheim?",
          english: "Do you have family in Trondheim?",
          ukrainian: "У тебе є сім'я в Тронгеймі?"
        },
        {
          speaker: "Monika",
          norwegian: "Ja, jeg er gift, og jeg har ei jente.",
          english: "Yes, I am married, and I have a girl.",
          ukrainian: "Так, я одружена, і у мене є дочка."
        },
        {
          speaker: "Ken",
          norwegian: "Hva heter hun?",
          english: "What is her name?",
          ukrainian: "Як її звати?"
        },
        {
          speaker: "Monika",
          norwegian: "Hun heter Emma. Hun er seks år.",
          english: "Her name is Emma. She is six years old.",
          ukrainian: "Її звати Емма. Їй шість років."
        }
      ]
    },
    anna_lars: {
      id: "anna_lars",
      title: "Anna & Lars",
      audio: `${process.env.PUBLIC_URL}/media/lesson1/1anna.mp3`,
      duration: "0:45",
      introduction: {
        norwegian: "Anna Valente kommer fra Italia. Hun bor i Roma. Anna er 22 år gammel. Hun reiser med fly fra Roma til Trondheim. Lars er norsk. Han reiser også med fly fra Roma.",
        english: "Anna Valente comes from Italy. She lives in Rome. Anna is 22 years old. She is travelling by plane from Rome to Trondheim. Lars is Norwegian. He is also travelling by plane from Rome.",
        ukrainian: "Анна Валенте з Італії. Вона живе в Римі. Анні 22 роки. Вона подорожує літаком з Рима до Тронгейма. Ларс норвежець. Він також подорожує літаком з Рима."
      },
      dialogue: [
        {
          speaker: "Lars",
          norwegian: "Hvor kommer du fra?",
          english: "Where do you come from?",
          ukrainian: "Звідки ти?"
        },
        {
          speaker: "Anna",
          norwegian: "Jeg kommer fra Italia. Er du norsk?",
          english: "I come from Italy. Are you Norwegian?",
          ukrainian: "Я з Італії. Ти норвежець?"
        },
        {
          speaker: "Lars",
          norwegian: "Ja, jeg kommer fra Trondheim. Hva gjør du i Norge?",
          english: "Yes, I come from Trondheim. What do you do in Norway?",
          ukrainian: "Так, я з Тронгейма. Що ти робиш в Норвегії?"
        },
        {
          speaker: "Anna",
          norwegian: "Jeg er student. Jeg studerer på NTNU. Og du?",
          english: "I am a student. I study at NTNU. And you?",
          ukrainian: "Я студентка. Я навчаюся в НТНУ. А ти?"
        },
        {
          speaker: "Lars",
          norwegian: "Jeg jobber på NTNU.",
          english: "I work at NTNU.",
          ukrainian: "Я працюю в НТНУ."
        },
        {
          speaker: "Anna",
          norwegian: "Hva jobber du med?",
          english: "What do you do?",
          ukrainian: "Ким ти працюєш?"
        },
        {
          speaker: "Lars",
          norwegian: "Jeg er professor i antropologi. Hva studerer du?",
          english: "I am a professor of anthropology. What are you studying?",
          ukrainian: "Я професор антропології. Що ти вивчаєш?"
        },
        {
          speaker: "Anna",
          norwegian: "Jeg studerer arkitektur.",
          english: "I study architecture.",
          ukrainian: "Я вивчаю архітектуру."
        },
        {
          speaker: "Lars",
          norwegian: "Du er flink i norsk! Jeg snakker ikke italiensk, men jeg snakker litt spansk. Jeg snakker også engelsk. Snakker du engelsk?",
          english: "Your Norwegian is very good! I do not speak Italian, but I speak a little Spanish. I also speak English. Do you speak English?",
          ukrainian: "Ти добре володієш норвезькою! Я не розмовляю італійською, але розмовляю трохи іспанською. Я також розмовляю англійською. Ти розмовляєш англійською?"
        },
        {
          speaker: "Anna",
          norwegian: "Ja, jeg snakker italiensk, engelsk og litt norsk.",
          english: "Yes, I speak Italian, English and some Norwegian.",
          ukrainian: "Так, я розмовляю італійською, англійською та трохи норвезькою."
        }
      ]
    },
    maria_lisa: {
      id: "maria_lisa",
      title: "Maria & Lisa",
      audio: `${process.env.PUBLIC_URL}/media/lesson1/1maria.mp3`,
      duration: "0:50",
      introduction: {
        norwegian: "Maria Gomez kommer fra Spania. Hun bor i Barcelona. Maria er 19 år gammel. Hun reiser med båt fra Bergen til Trondheim. Den heter Polarlys. Lisa er også på Polarlys. Hun er turist.",
        english: "Maria Gomez comes from Spain. She lives in Barcelona. Maria is 19 years old. She travels by boat from Bergen to Trondheim. It is called the Polarlys. Lisa is also on board the Polarlys. She is a tourist.",
        ukrainian: "Марія Гомес з Іспанії. Вона живе в Барселоні. Марії 19 років. Вона подорожує кораблем з Бергена до Тронгейма. Він називається Полярлюс. Ліза також на Полярлюс. Вона туристка."
      },
      dialogue: [
        {
          speaker: "Maria",
          norwegian: "Unnskyld, snakker du norsk?",
          english: "Excuse me, do you speak Norwegian?",
          ukrainian: "Вибачте, ви розмовляєте норвезькою?"
        },
        {
          speaker: "Lisa",
          norwegian: "Ja, litt.",
          english: "Yes, a little.",
          ukrainian: "Так, трохи."
        },
        {
          speaker: "Maria",
          norwegian: "Er det ledig her?",
          english: "Is this seat vacant?",
          ukrainian: "Тут вільно?"
        },
        {
          speaker: "Lisa",
          norwegian: "Ja, vær så god!",
          english: "Yes, do sit down.",
          ukrainian: "Так, будь ласка!"
        },
        {
          speaker: "Maria",
          norwegian: "Hvor er vi nå?",
          english: "Where are we now?",
          ukrainian: "Де ми зараз?"
        },
        {
          speaker: "Lisa",
          norwegian: "Vi kommer snart til Ålesund.",
          english: "We will be coming to Ålesund soon.",
          ukrainian: "Ми скоро прибудемо до Олесунна."
        },
        {
          speaker: "Maria",
          norwegian: "Hvor kommer du fra?",
          english: "Where are you from?",
          ukrainian: "Звідки ти?"
        },
        {
          speaker: "Lisa",
          norwegian: "Fra Minneapolis i USA. Jeg har familie i Norge. Er du fra Norge?",
          english: "From Minneapolis in the U.S. I have family in Norway. Are you from Norway?",
          ukrainian: "З Міннеаполіса в США. У мене є сім'я в Норвегії. Ти з Норвегії?"
        },
        {
          speaker: "Maria",
          norwegian: "Nei, jeg er ikke norsk, jeg er spansk. Jeg studerer norsk. Jeg heter Maria.",
          english: "No, I'm not Norwegian, I am Spanish. I study Norwegian. My name is Maria.",
          ukrainian: "Ні, я не норвежка, я іспанка. Я вивчаю норвезьку. Мене звати Марія."
        },
        {
          speaker: "Lisa",
          norwegian: "Jeg heter Lisa. Hyggelig å hilse på deg!",
          english: "My name is Lisa. Nice to meet you!",
          ukrainian: "Мене звати Ліза. Приємно познайомитися!"
        },
        {
          speaker: "Narrator",
          norwegian: "Maria møter Lisa neste dag",
          english: "Maria meets Lisa the next day.",
          ukrainian: "Марія зустрічає Лізу наступного дня."
        },
        {
          speaker: "Maria",
          norwegian: "God morgen!",
          english: "Good morning!",
          ukrainian: "Доброго ранку!"
        },
        {
          speaker: "Lisa",
          norwegian: "Hallo! Hvordan går det?",
          english: "Hello! How are you?",
          ukrainian: "Привіт! Як справи?"
        },
        {
          speaker: "Maria",
          norwegian: "Det går bra! Er vi snart i Trondheim?",
          english: "I am fine! Will we soon be in Trondheim?",
          ukrainian: "Все добре! Ми скоро в Тронгеймі?"
        },
        {
          speaker: "Lisa",
          norwegian: "Ja, Trondheim er neste by.",
          english: "Yes, Trondheim will be the next city.",
          ukrainian: "Так, Тронгейм наступне місто."
        },
        {
          speaker: "Lisa",
          norwegian: "OK! Vi ses kanskje seinere? Ha det!",
          english: "OK! Perhaps we will meet later? Bye!",
          ukrainian: "Добре! Можливо побачимось пізніше? Бувай!"
        },
        {
          speaker: "Maria",
          norwegian: "Ha det bra!",
          english: "Goodbye!",
          ukrainian: "Бувай!"
        }
      ]
    },
    peter_frank: {
      id: "peter_frank",
      title: "Peter & Frank",
      audio: `${process.env.PUBLIC_URL}/media/lesson1/1peter.mp3`,
      duration: "1:00",
      introduction: {
        norwegian: "Peter Maier kommer fra Tyskland. Han bor i Hamburg og er 25 år. Han reiser til Trondheim med bil. Peter reiser sammen med Frank. Frank er også tysk. De stopper på en bensinstasjon.",
        english: "Peter Maier comes from Germany. He lives in Hamburg and is 25 years old. He travels to Trondheim by car. Peter is travelling with Frank. Frank is also German. They stop at a gas station.",
        ukrainian: "Петер Майєр з Німеччини. Він живе в Гамбурзі, йому 25 років. Він подорожує до Тронгейма на машині. Петер подорожує разом з Франком. Франк теж німець. Вони зупиняються на заправці."
      },
      dialogue: [
        {
          speaker: "Peter",
          norwegian: "Unnskyld, hvor langt er det til Trondheim?",
          english: "Excuse me, how far is it to Trondheim?",
          ukrainian: "Вибачте, як далеко до Тронгейма?"
        },
        {
          speaker: "Ekspeditør",
          norwegian: "Det er 300 kilometer. Hvor kommer dere fra?",
          english: "It is 300 kilometres. Where are you from?",
          ukrainian: "300 кілометрів. Звідки ви?"
        },
        {
          speaker: "Peter",
          norwegian: "Vi kommer fra Tyskland.",
          english: "We come from Germany.",
          ukrainian: "Ми з Німеччини."
        },
        {
          speaker: "Ekspeditør",
          norwegian: "Er dere turister?",
          english: "Are you tourists?",
          ukrainian: "Ви туристи?"
        },
        {
          speaker: "Peter",
          norwegian: "Nei, vi er studenter.",
          english: "No, we are students.",
          ukrainian: "Ні, ми студенти."
        },
        {
          speaker: "Ekspeditør",
          norwegian: "Velkommen til Norge!",
          english: "Welcome to Norway!",
          ukrainian: "Ласкаво просимо до Норвегії!"
        },
        {
          speaker: "Peter",
          norwegian: "Takk! Har du et kart over Norge?",
          english: "Thanks! Do you have a map of Norway?",
          ukrainian: "Дякую! У вас є карта Норвегії?"
        },
        {
          speaker: "Ekspeditør",
          norwegian: "Ja, der borte.",
          english: "Yes, over there.",
          ukrainian: "Так, он там."
        },
        {
          speaker: "Peter",
          norwegian: "Hva koster det?",
          english: "What does it cost?",
          ukrainian: "Скільки коштує?"
        },
        {
          speaker: "Ekspeditør",
          norwegian: "Det koster 69 kroner.",
          english: "It costs 69 kroner.",
          ukrainian: "69 крон."
        },
        {
          speaker: "Peter",
          norwegian: "Jeg tar også en brus og ei avis.",
          english: "I will have a soda and a newspaper, too.",
          ukrainian: "Я також візьму газовану воду та газету."
        },
        {
          speaker: "Ekspeditør",
          norwegian: "Det blir 99 kroner.",
          english: "That will be 99 kroner.",
          ukrainian: "Буде 99 крон."
        },
        {
          speaker: "Peter",
          norwegian: "Her er 100.",
          english: "Here is a hundred.",
          ukrainian: "Ось 100."
        },
        {
          speaker: "Ekspeditør",
          norwegian: "Vær så god, her er ei krone tilbake.",
          english: "Here you go, here is a krone back.",
          ukrainian: "Будь ласка, ось крона решти."
        },
        {
          speaker: "Peter",
          norwegian: "Tusen takk.",
          english: "Thank you.",
          ukrainian: "Велике дякую."
        },
        {
          speaker: "Ekspeditør",
          norwegian: "God tur til Trondheim!",
          english: "Have a good trip to Trondheim!",
          ukrainian: "Гарної поїздки до Тронгейма!"
        }
      ]
    }
  },

  // Vocabulary (imported from separate file)
  vocabulary: lesson1Vocabulary,

  // Numerals
  numerals: [
    { number: 0, norwegian: "null" },
    { number: 1, norwegian: "én (/ei/ett)" },
    { number: 2, norwegian: "to" },
    { number: 3, norwegian: "tre" },
    { number: 4, norwegian: "fire" },
    { number: 5, norwegian: "fem" },
    { number: 6, norwegian: "seks" },
    { number: 7, norwegian: "sju (syv)" },
    { number: 8, norwegian: "åtte" },
    { number: 9, norwegian: "ni" },
    { number: 10, norwegian: "ti" },
    { number: 11, norwegian: "elleve" },
    { number: 12, norwegian: "tolv" },
    { number: 13, norwegian: "tretten" },
    { number: 14, norwegian: "fjorten" },
    { number: 15, norwegian: "femten" },
    { number: 16, norwegian: "seksten" },
    { number: 17, norwegian: "sytten" },
    { number: 18, norwegian: "atten" },
    { number: 19, norwegian: "nitten" },
    { number: 20, norwegian: "tjue (tyve)" },
    { number: 21, norwegian: "tjueén" },
    { number: 22, norwegian: "tjueto" },
    { number: 23, norwegian: "tjuetre" },
    { number: 24, norwegian: "tjuefire" },
    { number: 25, norwegian: "tjuefem" },
    { number: 26, norwegian: "tjueseks" },
    { number: 27, norwegian: "tjuesju" },
    { number: 28, norwegian: "tjueåtte" },
    { number: 29, norwegian: "tjueni" },
    { number: 30, norwegian: "tretti (tredve)" },
    { number: 40, norwegian: "førti" },
    { number: 50, norwegian: "femti" },
    { number: 60, norwegian: "seksti" },
    { number: 70, norwegian: "sytti" },
    { number: 80, norwegian: "åtti" },
    { number: 90, norwegian: "nitti" },
    { number: 100, norwegian: "(ett) hundre" },
    { number: 101, norwegian: "(ett) hundre og én" },
    { number: 200, norwegian: "to hundre" },
    { number: 400, norwegian: "fire hundre" },
    { number: 500, norwegian: "fem hundre" },
    { number: 600, norwegian: "seks hundre" },
    { number: 700, norwegian: "sju hundre" },
    { number: 800, norwegian: "åtte hundre" },
    { number: 900, norwegian: "ni hundre" },
    { number: 1000, norwegian: "(ett) tusen" },
    { number: 10000, norwegian: "ti tusen" },
    { number: 100000, norwegian: "hundre tusen" },
    { number: 1000000, norwegian: "en million" },
    { number: 1000000000, norwegian: "en milliard" }
  ],

  // Extras content
  extras_content: {
    numerals_basic: {
      title: "1.1 Numerals",
      numbers: [
        { number: "0", norwegian: "null" },
        { number: "1", norwegian: "én (/ei/ett)" },
        { number: "2", norwegian: "to" },
        { number: "3", norwegian: "tre" },
        { number: "4", norwegian: "fire" },
        { number: "5", norwegian: "fem" },
        { number: "6", norwegian: "seks" },
        { number: "7", norwegian: "sju (syv)" },
        { number: "8", norwegian: "åtte" },
        { number: "9", norwegian: "ni" },
        { number: "10", norwegian: "ti" },
        { number: "11", norwegian: "elleve" },
        { number: "12", norwegian: "tolv" },
        { number: "13", norwegian: "tretten" },
        { number: "14", norwegian: "fjorten" },
        { number: "15", norwegian: "femten" },
        { number: "16", norwegian: "seksten" },
        { number: "17", norwegian: "sytten" },
        { number: "18", norwegian: "atten" },
        { number: "19", norwegian: "nitten" },
        { number: "20", norwegian: "tjue (tyve)" },
        { number: "21", norwegian: "tjueén" },
        { number: "22", norwegian: "tjueto" },
        { number: "23", norwegian: "tjuetre" },
        { number: "24", norwegian: "tjuefire" },
        { number: "25", norwegian: "tjuefem" },
        { number: "26", norwegian: "tjueseks" },
        { number: "27", norwegian: "tjuesju" },
        { number: "28", norwegian: "tjueåtte" },
        { number: "29", norwegian: "tjueni" },
        { number: "30", norwegian: "tretti (tredve)" }
      ]
    },
    numerals_40plus: {
      title: "1.2 Numerals 40+",
      numbers: [
        { number: "40", norwegian: "førti" },
        { number: "50", norwegian: "femti" },
        { number: "60", norwegian: "seksti" },
        { number: "70", norwegian: "sytti" },
        { number: "80", norwegian: "åtti" },
        { number: "90", norwegian: "nitti" },
        { number: "100", norwegian: "(ett) hundre" },
        { number: "101", norwegian: "(ett) hundre og én" },
        { number: "200", norwegian: "to hundre" },
        { number: "400", norwegian: "fire hundre" },
        { number: "500", norwegian: "fem hundre" },
        { number: "600", norwegian: "seks hundre" },
        { number: "700", norwegian: "sju hundre" },
        { number: "800", norwegian: "åtte hundre" },
        { number: "900", norwegian: "ni hundre" },
        { number: "1 000", norwegian: "(ett) tusen" },
        { number: "10 000", norwegian: "ti tusen" },
        { number: "100 000", norwegian: "hundre tusen" },
        { number: "1 000 000", norwegian: "en million" },
        { number: "1 000 000 000", norwegian: "en milliard" }
      ]
    },
    articles: {
      title: "1.3 A/an",
      subtitle: "En (masculine), ei (feminine), et (neuter)",
      examples: [
        { norwegian: "en brus", english: "a soda", type: "indefinite" },
        { norwegian: "én brus", english: "one soda", type: "numeral" },
        { norwegian: "ei jente", english: "a girl", type: "indefinite" },
        { norwegian: "ei jente", english: "one girl", type: "numeral" },
        { norwegian: "et kart", english: "a map", type: "indefinite" },
        { norwegian: "ett kart", english: "one map", type: "numeral" }
      ]
    },
    nationalities_basic: {
      title: "1.4 Nationalities",
      countries: [
        { country: "Norge", nationality: "norsk" },
        { country: "Italia", nationality: "italiensk" },
        { country: "England", nationality: "engelsk" },
        { country: "Spania", nationality: "spansk" },
        { country: "Tyskland", nationality: "tysk" }
      ]
    },
    nationalities_extended: {
      title: "1.5 Nationalities – extended list",
      countries: [
        { country: "Afghanistan", person: "afghaner", adjective: "afghansk" },
        { country: "Albania", person: "albaner", adjective: "albansk" },
        { country: "Algerie", person: "algerier", adjective: "algerisk" },
        { country: "Argentina", person: "argentiner", adjective: "argentinsk" },
        { country: "Bangladesh", person: "bangladesher", adjective: "bangladeshisk" },
        { country: "Belgia", person: "belgier", adjective: "belgisk" },
        { country: "Brasil", person: "brasilianer", adjective: "brasiliansk/brasilsk" },
        { country: "Canada", person: "kanadier", adjective: "kanadisk" },
        { country: "Chile", person: "chilener", adjective: "chilensk" },
        { country: "Danmark", person: "danske", adjective: "dansk" },
        { country: "England", person: "engelskmann", adjective: "engelsk" },
        { country: "Egypt", person: "egypter", adjective: "egyptisk" },
        { country: "Etiopia", person: "etiopier", adjective: "etiopisk" },
        { country: "Frankrike (France)", person: "franskmann", adjective: "fransk" },
        { country: "Ghana", person: "ghaneser/ghananer", adjective: "ghanesisk/ghanansk" },
        { country: "Hellas (Greece)", person: "greker", adjective: "gresk" },
        { country: "India", person: "inder", adjective: "indisk" },
        { country: "Indonesia", person: "indonesier", adjective: "indonesisk" },
        { country: "Irak", person: "iraker", adjective: "irakisk" },
        { country: "Iran", person: "iraner", adjective: "iransk" },
        { country: "Italia", person: "italiener", adjective: "italiensk" },
        { country: "Japan", person: "japaner", adjective: "japansk" },
        { country: "Kenya", person: "kenyaner", adjective: "kenyansk" },
        { country: "Kina", person: "kineser", adjective: "kinesisk" },
        { country: "Latvia", person: "latvier", adjective: "latvisk" },
        { country: "Litauen", person: "litauer", adjective: "litauisk" },
        { country: "Mexico", person: "meksikaner", adjective: "meksikansk" },
        { country: "Nederland", person: "nederlender", adjective: "nederlandsk" },
        { country: "Nigeria", person: "nigerianer", adjective: "nigeriansk" },
        { country: "Norge", person: "nordmann", adjective: "norsk" },
        { country: "Pakistan", person: "pakistaner", adjective: "pakistansk" },
        { country: "Peru", person: "peruaner", adjective: "peruansk" },
        { country: "Russland", person: "russer", adjective: "russisk" },
        { country: "Sverige", person: "svenske", adjective: "svensk" },
        { country: "Spania", person: "spanjol/spanier", adjective: "spansk" },
        { country: "Thailand", person: "thailender", adjective: "thailandsk" },
        { country: "Tyskland", person: "tysker", adjective: "tysk" },
        { country: "USA", person: "amerikaner", adjective: "amerikansk" },
        { country: "Vietnam", person: "vietnameser", adjective: "vietnamesisk" },
        { country: "Østerrike (Austria)", person: "østerriker", adjective: "østerriksk" }
      ],
      continents: [
        { continent: "Afrika", person: "afrikaner", adjective: "afrikansk" },
        { continent: "Amerika", person: "amerikaner", adjective: "amerikansk" },
        { continent: "Asia", person: "asiat", adjective: "asiatisk" },
        { continent: "Australia", person: "australier", adjective: "australsk" },
        { continent: "Europa", person: "europeer", adjective: "europeisk" }
      ]
    }
  },

  // Lesson sections (these will contain the existing exercises and new content)
  sections: {
    ken_monika: {
      id: "ken_monika",
      title: "Ken & Monika",
      type: "dialogue",
      content: "ken_monika" // References the ken_monika dialogue
    },
    anna_lars: {
      id: "anna_lars", 
      title: "Anna & Lars",
      type: "dialogue",
      content: "anna_lars" // References the anna_lars dialogue
    },
    maria_lisa: {
      id: "maria_lisa",
      title: "Maria & Lisa", 
      type: "dialogue",
      content: "maria_lisa" // References the maria_lisa dialogue
    },
    peter_frank: {
      id: "peter_frank",
      title: "Peter & Frank",
      type: "dialogue",
      content: "peter_frank" // References the peter_frank dialogue
    },
    grammar: {
      id: "grammar",
      title: "Grammar",
      type: "content", 
      content: "grammar_content" // References the comprehensive grammar content
    },
    pronunciation: {
      id: "pronunciation",
      title: "Pronunciation",
      type: "content",
      content: "pronunciation_content" // References the comprehensive pronunciation content
    },
    listening: {
      id: "listening",
      title: "Listening exercises",
      type: "content",
      content: "listening_content" // References the comprehensive listening exercises
    },
    exercises: {
      id: "exercises",
      title: "Exercises",
      type: "exercises",
      exerciseIds: ["pronoun_exercise", "verb_exercise", "verb_exercise_3", "numbers_exercise", "nationalities_exercise", "question_words_exercise", "drag_drop_exercise", "word_order_exercise"] // References all eight exercises
    },
    vocabulary: {
      id: "vocabulary", 
      title: "Vocabulary",
      type: "content",
      content: "vocabulary" // References the vocabulary array above
    },
    extras: {
      id: "extras",
      title: "Extras",
      type: "content",
      content: "extras_content" // References the extras content above
    }
  },

  // Pronunciation content
  pronunciation_content: {
    alphabet: {
      title: "The Norwegian alphabet",
      description: "The Norwegian alphabet contains 29 letters, 9 vowels and 20 consonants:",
      letters: {
        basic: [
          { upper: "A", lower: "a", ipa: "/ɑː/" },
          { upper: "B", lower: "b", ipa: "/beː/" },
          { upper: "C", lower: "c", ipa: "/seː/" },
          { upper: "D", lower: "d", ipa: "/deː/" },
          { upper: "E", lower: "e", ipa: "/eː/" },
          { upper: "F", lower: "f", ipa: "/ef/" },
          { upper: "G", lower: "g", ipa: "/geː/" },
          { upper: "H", lower: "h", ipa: "/hoː/" },
          { upper: "I", lower: "i", ipa: "/iː/" },
          { upper: "J", lower: "j", ipa: "/jeː/" },
          { upper: "K", lower: "k", ipa: "/koː/" },
          { upper: "L", lower: "l", ipa: "/el/" },
          { upper: "M", lower: "m", ipa: "/em/" },
          { upper: "N", lower: "n", ipa: "/en/" },
          { upper: "O", lower: "o", ipa: "/uː/" },
          { upper: "P", lower: "p", ipa: "/peː/" },
          { upper: "Q", lower: "q", ipa: "/kʉː/" },
          { upper: "R", lower: "r", ipa: "/ær/" },
          { upper: "S", lower: "s", ipa: "/es/" },
          { upper: "T", lower: "t", ipa: "/teː/" },
          { upper: "U", lower: "u", ipa: "/ʉː/" },
          { upper: "V", lower: "v", ipa: "/veː/" },
          { upper: "W", lower: "w", ipa: "/2dobeltˌveː/" },
          { upper: "X", lower: "x", ipa: "/eks/" },
          { upper: "Y", lower: "y", ipa: "/yː/" },
          { upper: "Z", lower: "z", ipa: "/set/" }
        ],
        special: [
          { upper: "Æ", lower: "æ", ipa: "/æː/" },
          { upper: "Ø", lower: "ø", ipa: "/øː/" },
          { upper: "Å", lower: "å", ipa: "/oː/" }
        ]
      },
      explanation: "Below you will find each letter in upper and lower case as well as the pronunciation of the Norwegian «name» of the letter. The pronunciation is given with reference to The International Phonetic Alphabet, IPA. A colon after a vowel indicates a long speech sound. Absence of colon after the vowel indicates a short speech sound, cf. the long vowel /e:/ used to name the letter, and the short vowel /e/ in /ef/, to name the letter.",
      symbols_note: "Below, brackets, < >, surround symbols that are to be regarded as letters, while slashes, / /, surround symbols that indicate speech sounds.",
      special_letters: {
        title: "Special Norwegian letters",
        description: "The three last letters, the vowels < æ, ø, å > are rare among languages that are using the Latin alphabet. If necessary, users of foreign keyboards can replace each of them with a combination of two vowel letters:",
        replacements: [
          { letter: "æ", replacement: "ae", example: "sær", example_replacement: "saer", translation: "weird" },
          { letter: "ø", replacement: "oe", example: "sør", example_replacement: "soer", translation: "south" },
          { letter: "å", replacement: "aa", example: "sår", example_replacement: "saar", translation: "wound, sore" }
        ],
        loanwords_note: "Of the remaining letters, < c, q, w, x, z > in general only occur in loanwords (camping, quiz, watt, xylofon, pizza)."
      }
    },
    comparison: {
      title: "The Norwegian and English letters compared",
      description: "Below is a short overview comparing the pronunciation of the Norwegian alphabet compared to English. The overlap between English and Norwegian speech sounds is smaller than what the list below seems to indicate as the list only refers to the letters. There are several consonant sounds that are expressed through consonant clusters (consequently they are not included in the alphabet, but they will be discussed in Chapter 5). The alphabet by itself does not express the difference between long and short vowels.",
      letters: [
        { letter: "a", pronunciation: "Like < a > in «hard»" },
        { letter: "b", pronunciation: "Like < b > in «buy»" },
        { letter: "c", pronunciation: "Before front vowels < i, e, y > cf. /s/ in «circus». Before back vowels < a, o, u > cf. /k/ in «camping»" },
        { letter: "d", pronunciation: "Like < d > in «dog»" },
        { letter: "e", pronunciation: "Like < e > in «bed»" },
        { letter: "f", pronunciation: "Like < f > in «fine»" },
        { letter: "g", pronunciation: "Like < g > in «girl»" },
        { letter: "h", pronunciation: "Like < h > in «hat»" },
        { letter: "i", pronunciation: "Like < ee > in «see»" },
        { letter: "j", pronunciation: "Like < y > in «yes»" },
        { letter: "k", pronunciation: "Like < k > in «kite»" },
        { letter: "l", pronunciation: "Like < l > in «live»" },
        { letter: "m", pronunciation: "Like < m > in «map»" },
        { letter: "n", pronunciation: "Like < n > in «now»" },
        { letter: "o", pronunciation: "No equivalent" },
        { letter: "p", pronunciation: "Like < p > in «pen»" },
        { letter: "q", pronunciation: "In Norwegian, < qu > is pronounced as /kv/, cf. «quiz» - /kvis/" },
        { letter: "r", pronunciation: "Like Scottish «r». The tip of the tongue taps the alveolar ridge." },
        { letter: "s", pronunciation: "Like < s > in «see»" },
        { letter: "t", pronunciation: "Like < t > in «tea»" },
        { letter: "u", pronunciation: "Approximately as the final vowel in «new»" },
        { letter: "v", pronunciation: "Like < v > in «violin»" },
        { letter: "w", pronunciation: "Like < v > in «violin»" },
        { letter: "x", pronunciation: "Like < x > - /ks/ in «tax»" },
        { letter: "y", pronunciation: "No equivalent" },
        { letter: "z", pronunciation: "Pronounced as /s/, cf. «zoom» - /su:m/" },
        { letter: "æ", pronunciation: "Like < a > in «bad»" },
        { letter: "ø", pronunciation: "No equivalent" },
        { letter: "å", pronunciation: "Like < aw > in «saw»" }
      ]
    }
  },

  // Listening exercises content
  listening_content: {
    exercises: [
      {
        id: "ken_listen_write",
        title: "Exercise 1: Ken - Listen and write",
        description: "Listen to the audio and fill in the missing words in the text about Ken Robbins.",
        type: "fill_blanks_listening",
        audio_path: `${process.env.PUBLIC_URL}/media/lesson1/1ken_ex.mp3`,
        text: "Ken Robbins __ fra England. __ __ i London. Ken __ 23 år gammel. __ __ med tog __ Oslo __ Trondheim. Ken __ __ ei dame. __ __ __ __.",
        answers: [
          { blank: 0, correct: "kommer", position: "Ken Robbins __ fra England." },
          { blank: 1, correct: "Han", position: "__ __ i London." },
          { blank: 2, correct: "bor", position: "Han __ i London." },
          { blank: 3, correct: "er", position: "Ken __ 23 år gammel." },
          { blank: 4, correct: "Han", position: "__ __ med tog __ Oslo __ Trondheim." },
          { blank: 5, correct: "reiser", position: "Han __ med tog __ Oslo __ Trondheim." },
          { blank: 6, correct: "til", position: "Han reiser med tog __ Oslo __ Trondheim." },
          { blank: 7, correct: "og", position: "Han reiser med tog til Oslo __ Trondheim." },
          { blank: 8, correct: "møter", position: "Ken __ __ ei dame." },
          { blank: 9, correct: "en", position: "Ken møter __ ei dame." },
          { blank: 10, correct: "Hyggelig", position: "__ __ __ __." },
          { blank: 11, correct: "å", position: "Hyggelig __ __ __." },
          { blank: 12, correct: "hilse", position: "Hyggelig å __ __." },
          { blank: 13, correct: "på", position: "Hyggelig å hilse __ deg." }
        ]
      },
      {
        id: "maria_listen_quiz",
        title: "Exercise 2: Maria - Listen quiz",
        description: "Listen to the text and choose the right answers.",
        type: "multiple_choice_listening",
        audio_path: `${process.env.PUBLIC_URL}/media/lesson1/1maria_ex.mp3`,
        questions: [
          {
            question: "Hvor kommer Maria fra?",
            options: [
              { text: "Hun kommer fra Spania.", correct: true },
              { text: "Hun kommer fra Italia.", correct: false }
            ]
          },
          {
            question: "Hvor gammel er hun?",
            options: [
              { text: "Hun er 17 år gammel.", correct: false },
              { text: "Hun er 19 år gammel.", correct: true }
            ]
          },
          {
            question: "Hva reiser Maria med?",
            options: [
              { text: "Hun reiser med bil.", correct: false },
              { text: "Hun reiser med båt.", correct: true }
            ]
          },
          {
            question: "Hvor kommer Lisa fra?",
            options: [
              { text: "Hun kommer fra Minneapolis, USA.", correct: true },
              { text: "Hun kommer fra Minnesota, USA.", correct: false }
            ]
          },
          {
            question: "Hva er Lisa?",
            options: [
              { text: "Hun er student.", correct: false },
              { text: "Hun er turist.", correct: true }
            ]
          },
          {
            question: "Har Lisa familie i Norge?",
            options: [
              { text: "Ja, hun har familie i Norge.", correct: true },
              { text: "Nei, hun har ikke familie i Norge.", correct: false }
            ]
          }
        ]
      },
      {
        id: "anna_listen_repeat",
        title: "Exercise 3: Anna - Listen and repeat",
        description: "Listen to each sentence and repeat it. Click the play button to hear each sentence.",
        type: "listen_repeat",
        sentences: [
          "Hvor kommer du fra?",
          "Jeg kommer fra Italia.",
          "Er du norsk?",
          "Ja, jeg kommer fra Trondheim.",
          "Hva gjør du i Norge?",
          "Jeg er student",
          "Jeg studerer på NTNU.",
          "Og du?",
          "Jeg jobber på NTNU."
        ]
      },
      {
        id: "peter_listen_repeat",
        title: "Exercise 4: Peter - Listen and repeat",
        description: "Listen to each sentence and repeat it. Click the play button to hear each sentence.",
        type: "listen_repeat",
        sentences: [
          "Unnskyld, hvor langt er det til Trondheim?",
          "Det er 300 kilometer.",
          "Hvor kommer dere fra?",
          "Vi kommer fra Tyskland.",
          "Er dere turister?",
          "Nei, vi er studenter.",
          "Velkommen til Norge!",
          "Takk! Har du et kart over Norge?",
          "Ja, der borte."
        ]
      }
    ]
  },

  // Exercise content
  exercise_content: {
    pronoun_exercise: {
      id: "pronoun_exercise",
      title: "1.1 Personal pronouns: jeg/du/han/hun",
      description: "Fill in jeg, du, han or hun in the gaps.",
      type: "fill_blanks_dialogue",
      example: "Example: Ken kommer fra England. Han er 23 år gammel.",
      dialogue: [
        {
          context: "Ken reiser med tog fra Oslo til Trondheim.",
          speaker: "Ken",
          line: "__ snakker med ei dame. Hun heter Monika.",
          correct_answer: "Han"
        },
        {
          speaker: "Monika",
          line: "Monika: __ heter Monika. Hva heter __?",
          correct_answer: ["Jeg", "du"]
        },
        {
          speaker: "Ken", 
          line: "Ken: __ heter Ken.",
          correct_answer: "Jeg"
        },
        {
          speaker: "Monika",
          line: "Monika: Hvor kommer __ fra?",
          correct_answer: "du"
        },
        {
          speaker: "Ken",
          line: "Ken: __ kommer fra England. Og __?",
          correct_answer: ["Jeg", "du"]
        },
        {
          speaker: "Monika",
          line: "Monika: __ kommer fra Oslo, men __ bor i Trondheim.",
          correct_answer: ["Jeg", "jeg"]
        },
        {
          speaker: "Ken",
          line: "Ken: Har __ familie i Trondheim?",
          correct_answer: "du"
        },
        {
          speaker: "Monika",
          line: "Monika: Ja, __ er gift, og __ har ei jente på seks år.",
          correct_answer: ["jeg", "jeg"]
        },
        {
          speaker: "Ken",
          line: "Ken: Hva heter __?",
          correct_answer: "hun"
        },
        {
          speaker: "Monika",
          line: "Monika: __ heter Emma.",
          correct_answer: "Hun"
        }
      ]
    },
    verb_exercise: {
      id: "verb_exercise",
      title: "1.2 Verbs: Present tense",
      description: "Fill in verbs in present tense.",
      type: "fill_blanks_sentences",
      example: "Example: Jeg bor i Norge.",
      sentences: [
        {
          text: "Jeg __ (å hete) Ken.",
          correct_answer: "heter"
        },
        {
          text: "Jeg __ (å komme) fra England.",
          correct_answer: "kommer"
        },
        {
          text: "Ken __ (å reise) med tog fra Oslo til Trondheim.",
          correct_answer: "reiser"
        },
        {
          text: "Ken __ (å snakke) med Monika.",
          correct_answer: "snakker"
        },
        {
          text: "Hun __ (å bo) i Trondheim.",
          correct_answer: "bor"
        }
      ]
    },
    verb_exercise_3: {
      id: "verb_exercise_3",
      title: "1.3 Verbs: Present tense",
      description: "Fill in verbs in present tense.",
      type: "fill_blanks_sentences",
      example: "Example: Jeg heter Ken.",
      sentences: [
        {
          text: "Ken __ (å være) 23 år gammel.",
          correct_answer: "er"
        },
        {
          text: "Monika __ (å være) gift.",
          correct_answer: "er"
        },
        {
          text: "Monika __ (å ha) ei jente. Hun heter Emma.",
          correct_answer: "har"
        },
        {
          text: "Anna __ (å studere) arkitektur på NTNU.",
          correct_answer: "studerer"
        },
        {
          text: "Lars __ (å jobbe) på NTNU.",
          correct_answer: "jobber"
        },
        {
          text: "Hva __ (å gjøre) du?",
          correct_answer: "gjør"
        }
      ]
    },
    numbers_exercise: {
      id: "numbers_exercise",
      title: "1.4 Numbers",
      description: "Fill in numbers.",
      type: "numbers_practice",
      sections: [
        {
          title: "Write using numbers.",
          description: "Write using numbers. Example: 2 = to",
          type: "numbers_to_digits",
          exercises: [
            {
              norwegian: "tre",
              correct_answer: "3"
            },
            {
              norwegian: "ni",
              correct_answer: "9"
            },
            {
              norwegian: "tolv",
              correct_answer: "12"
            },
            {
              norwegian: "én",
              correct_answer: "1"
            },
            {
              norwegian: "tjueto",
              correct_answer: "22"
            },
            {
              norwegian: "tretten",
              correct_answer: "13"
            }
          ]
        },
        {
          title: "Write in letters.",
          description: "Write in letters. Example: elleve = 11",
          type: "digits_to_numbers",
          exercises: [
            {
              digit: "4",
              correct_answer: "fire"
            },
            {
              digit: "7",
              correct_answer: "sju"
            },
            {
              digit: "20",
              correct_answer: "tjue"
            },
            {
              digit: "16",
              correct_answer: "seksten"
            },
            {
              digit: "8",
              correct_answer: "åtte"
            },
            {
              digit: "18",
              correct_answer: "atten"
            }
          ]
        }
      ]
    },
    nationalities_exercise: {
      id: "nationalities_exercise",
      title: "1.5 Nationalities and languages",
      description: "Fill in the gaps.",
      type: "fill_blanks_sentences",
      example: "Example: Lars kommer fra Norge. Han er norsk. Han snakker norsk.",
      sentences: [
        {
          text: "Ken kommer fra England. Han snakker __.",
          correct_answer: "engelsk"
        },
        {
          text: "Monika kommer fra Norge. Hun er __.",
          correct_answer: "norsk"
        },
        {
          text: "Anna kommer fra Italia. Hun er __. Hun snakker __.",
          correct_answer: ["italiensk", "italiensk"]
        },
        {
          text: "Lars kommer ikke fra Spania, men han snakker litt __.",
          correct_answer: "spansk"
        },
        {
          text: "Lars og Anna kommer ikke fra England, men de snakker __.",
          correct_answer: "engelsk"
        }
      ]
    },
    question_words_exercise: {
      id: "question_words_exercise",
      title: "1.6 Question words: hva/hvem/hvor/hvordan",
      description: "Fill in the gaps.",
      type: "fill_blanks_sentences",
      example: "Example: Hva heter du? Jeg heter Maria.",
      sentences: [
        {
          text: "__ kommer du fra? Jeg kommer fra Spania.",
          correct_answer: "Hvor"
        },
        {
          text: "__ bor du? Jeg bor i Barcelona.",
          correct_answer: "Hvor"
        },
        {
          text: "__ går det? Det går bra.",
          correct_answer: "Hvordan"
        },
        {
          text: "__ snakker du med? Jeg snakker med Lars.",
          correct_answer: "Hvem"
        },
        {
          text: "__ studerer du? Jeg studerer arkitektur.",
          correct_answer: "Hva"
        },
        {
          text: "__ jobber Lars? Han jobber på NTNU.",
          correct_answer: "Hvor"
        },
        {
          text: "__ heter hun? Hun heter Monika.",
          correct_answer: "Hva"
        }
      ]
    },
    drag_drop_exercise: {
      id: "drag_drop_exercise",
      title: "1.7 Words and expressions",
      description: "Drag phrases into the correct boxes.",
      type: "drag_drop",
      pairs: [
        {
          prompt: "Hei! Hva heter du?",
          prompt_translation: "Hello! What is your name?",
          correct_answer: "Jeg heter Lars.",
          correct_answer_translation: "My name is Lars."
        },
        {
          prompt: "Hvordan går det?",
          prompt_translation: "How are you?",
          correct_answer: "Det går bra.",
          correct_answer_translation: "It's going well."
        },
        {
          prompt: "Vær så god!",
          prompt_translation: "You're welcome / Here you go",
          correct_answer: "Tusen takk!",
          correct_answer_translation: "Thanks a lot!"
        },
        {
          prompt: "Unnskyld, snakker du norsk?",
          prompt_translation: "Excuse me, do you speak Norwegian?",
          correct_answer: "Ja, litt.",
          correct_answer_translation: "Yes, a little."
        },
        {
          prompt: "Hyggelig å hilse på deg!",
          prompt_translation: "Nice to meet you!",
          correct_answer: "Hyggelig å hilse på deg også!",
          correct_answer_translation: "Nice to meet you too!"
        },
        {
          prompt: "Ha det bra!",
          prompt_translation: "Goodbye / Have a good one!",
          correct_answer: "Ha det!",
          correct_answer_translation: "Bye!"
        }
      ]
    },
    word_order_exercise: {
      id: "word_order_exercise",
      title: "1.8 Word order exercises",
      description: "Drag parts to correct position.",
      type: "word_order",
      exercises: [
        {
          id: "a",
          correct_order: ["Maria", "kommer", "fra", "Spania"],
          available_words: ["Spania", "fra", "kommer", "Maria"],
          punctuation: "."
        },
        {
          id: "b",
          correct_order: ["Hun", "er", "19 år", "gammel"],
          available_words: ["Hun", "19 år", "er", "gammel"],
          punctuation: "."
        },
        {
          id: "c",
          correct_order: ["Unnskyld", ",", "snakker", "du", "norsk"],
          available_words: ["snakker", "norsk", ",", "du", "Unnskyld"],
          punctuation: "?"
        },
        {
          id: "d",
          correct_order: ["Hvor", "er", "vi", "nå"],
          available_words: ["er", "vi", "nå", "Hvor"],
          punctuation: "?"
        },
        {
          id: "e",
          correct_order: ["Jeg", "er", "ikke", "norsk"],
          available_words: ["ikke", "norsk", "er", "Jeg"],
          punctuation: "."
        },
        {
          id: "f",
          correct_order: ["Er", "vi", "i", "Trondheim", "snart"],
          available_words: ["vi", "Er", "Trondheim", "i", "snart"],
          punctuation: "?"
        }
      ]
    }
  },

  // Grammar content
  grammar_content: {
    pronouns: {
      title: "Pronouns",
      video_url: "https://youtu.be/EwWsNS2ga_s",
      subtitle: "Personal pronouns - subject form",
      table: [
        { norwegian: "jeg", english: "I" },
        { norwegian: "du", english: "you (singular)" },
        { norwegian: "han", english: "he" },
        { norwegian: "hun", english: "she" },
        { norwegian: "det/den", english: "it" },
        { norwegian: "vi", english: "we" },
        { norwegian: "dere", english: "you (plural)" },
        { norwegian: "de", english: "they" }
      ]
    },
    verbs: {
      title: "Verbs",
      subtitle: "Verbs in the present tense",
      rule: "You add –r to the infinitive to form the present tense:",
      examples: [
        { infinitive: "å komme", english: "to come", present: "kommer" },
        { infinitive: "å reise", english: "to travel", present: "reiser" }
      ],
      explanation: "It does not matter who is carrying out the verb. You add –r to the infinitive form of the verb after all pronouns: I, you, he, she, it, we, you and they:",
      sample_sentences: [
        { norwegian: "Jeg kommer fra England.", english: "I come from England" },
        { norwegian: "Anna kommer fra Italia.", english: "Anna comes from Italy" },
        { norwegian: "Vi kommer fra Norge.", english: "We come from Norway" }
      ],
      irregular: "Note that some verbs have irregular present tense forms:",
      irregular_verbs: [
        { infinitive: "å være", english: "to be", present: "er" },
        { infinitive: "å gjøre", english: "to do", present: "gjør" }
      ]
    },
    nouns: {
      title: "Nouns",
      subtitle: "Norwegian nouns have three genders",
      rule: "The indefinite articles are en (masculine), ei (feminine) and et (neuter). The corresponding indefinite articles in English are a/an.",
      examples: [
        { gender: "Masculine", norwegian: "en brus", english: "a soda" },
        { gender: "Feminine", norwegian: "ei jente", english: "a girl" },
        { gender: "Neuter", norwegian: "et kart", english: "a map" }
      ],
      note: "Note:",
      feminine_note: "Feminine nouns can have the article en instead of ei: ei/en jente.",
      omitting: "Leaving out en/ei/et",
      omitting_rule: "When stating certain situations you can leave out en/ei/et:",
      omitting_examples: [
        { norwegian: "Ken reiser med tog.", english: "Ken travels by train." },
        { norwegian: "Jeg er student.", english: "I am a student." }
      ]
    },
    conjunctions: {
      title: "Conjunctions",
      video_url: "https://youtu.be/5RAAY4zTmao",
      subtitle: "Basic Conjunctions",
      rule: "The conjunctions og (and) and men (but) connect sentences:",
      examples: [
        { norwegian: "Jeg heter Anna, og jeg kommer fra Italia.", english: "My name is Anna, and I come from Italy." },
        { norwegian: "Jeg snakker italiensk, men jeg snakker ikke tysk.", english: "I speak Italian, but I do not speak German." }
      ]
    },
    questions: {
      title: "Question Words",
      subtitle: "The most common question words:",
      words: [
        { norwegian: "hva", english: "what" },
        { norwegian: "hvem", english: "who" },
        { norwegian: "hvor", english: "where (how)" },
        { norwegian: "hvordan", english: "how" }
      ],
      examples: [
        { norwegian: "Hva heter du?", english: "What is your name?" },
        { norwegian: "Hvem er det?", english: "Who is it?" },
        { norwegian: "Hvor bor du?", english: "Where do you live?" },
        { norwegian: "Hvor gammel er du?", english: "How old are you?" },
        { norwegian: "Hvordan går det?", english: "How are you?" }
      ]
    },
    word_order: {
      title: "Word Order",
      main_clauses: "Main clauses (sentences)",
      verb_second: "In a main clause the verb is the second element:",
      main_example: { norwegian: "Jeg snakker norsk.", english: "I speak Norwegian." },
      negation: "Negation",
      negation_rule: "In a narrative clause the negation ikke (not), which is an adverb, usually comes after the verb:",
      negation_example: { norwegian: "Jeg snakker ikke spansk.", english: "I do not speak Spanish." },
      adverbs_note: "Other adverbs like også (also/too) come after the verb as well:",
      adverbs_example: { norwegian: "Jeg snakker også spansk.", english: "I also speak Spanish." },
      questions: "Questions",
      question_rules: "In questions with question words the verb is also the second element:",
      question_examples: [
        { norwegian: "Hva heter du?", english: "What is your name?" },
        { norwegian: "Hvor kommer du fra?", english: "Where do you come from?" }
      ],
      question_without_word: "In questions without a question word the sentence starts with the verb:",
      question_without_example: { norwegian: "Snakker du norsk?", english: "Do you speak Norwegian?" }
    },
    nationalities: {
      title: "Nationalities",
      subtitle: "Countries, Nationalities and Languages",
      table: [
        { country: "Norge", nationality: "norsk", language: "norsk" },
        { country: "England", nationality: "engelsk", language: "engelsk" },
        { country: "Italia", nationality: "italiensk", language: "italiensk" },
        { country: "Spania", nationality: "spansk", language: "spansk" },
        { country: "USA", nationality: "amerikansk", language: "(amerikansk) engelsk" },
        { country: "Tyskland", nationality: "tysk", language: "tysk" }
      ]
    }
  }
};

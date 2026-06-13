import type { GameMode } from "@/lib/rounds";

export type Language = "kk" | "en" | "ru";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "kk", label: "KAZ" },
  { code: "en", label: "ENG" },
  { code: "ru", label: "RUS" },
];

interface ModeText {
  title: string;
  tag: string;
  description: string;
}

export interface Translations {
  home: {
    eyebrow: string;
    tagline: string;
    description: string;
    start: string;
    daily: string;
    statsTitle: string;
    statsTag: string;
    statsDescription: string;
  };
  modes: Record<GameMode, ModeText>;
  play: {
    loading: string;
    round: string;
    streak: string;
    submit: string;
    placePin: string;
    expand: string;
    shrink: string;
    perfect: string;
    guessDistance: (distance: string) => string;
    speedBonus: (bonus: number) => string;
    streakMultiplier: (multiplier: string) => string;
    nextRound: string;
    seeResults: string;
    finish: string;
    dailyDoneTitle: string;
    dailyDoneNote: string;
    quickGame: string;
    home: string;
  };
  summary: {
    complete: string;
    line: (rounds: number, streak: number) => string;
    playAgain: string;
  };
  ranks: {
    tourist: string;
    traveler: string;
    explorer: string;
    pathfinder: string;
    legend: string;
  };
  stats: {
    title: string;
    note: string;
    noGames: string;
    bestScore: string;
    games: string;
    bestStreak: string;
    avgScore: string;
    recentGames: string;
    gameLine: (rounds: number, avgDistance: string) => string;
  };
  share: {
    copy: string;
    copied: string;
    catchphrase: string;
    share: string;
  };
  room: {
    title: string;
    subtitle: string;
    namePlaceholder: string;
    join: string;
    invite: string;
    copy: string;
    copied: string;
    players: string;
    you: string;
    finished: string;
    connecting: string;
    shareBeat: (names: string, points: string) => string;
    shareLost: (winner: string, points: string) => string;
  };
}

/* Kazakh (Cyrillic alphabet) — primary language. */
const kk: Translations = {
  home: {
    eyebrow: "Қазақстанды таны",
    tagline: "«Тоқта, мен бұл жерді білемін…»",
    description:
      "Қазақстанның бір жеріне тап боласың. Айналаңа қарап, картаға белгі қой — неғұрлым жақын болсаң, соғұрлым көп ұпай аласың.",
    start: "Бастау",
    daily: "Күнделікті сынақ",
    statsTitle: "Менің статистикам",
    statsTag: "сен",
    statsDescription: "Үздік ұпайлар, сериялар, соңғы ойындар",
  },
  modes: {
    quick: {
      title: "Жылдам ойын",
      tag: "5 раунд",
      description: "Бүкіл Қазақстан бойынша 5 кездейсоқ раунд",
    },
    daily: {
      title: "Күнделікті сынақ",
      tag: "бір мүмкіндік",
      description: "Барлығына бірдей 5 орын — күніне бір мүмкіндік",
    },
    infinite: {
      title: "Шексіз",
      tag: "∞",
      description: "Тоқтамай ойна, ең ұзын серияны жаса",
    },
    landmark: {
      title: "Танымал жерлер",
      tag: "жеңіл",
      description: "Тек танымал жерлер — жаңа бастағандарға",
    },
    expert: {
      title: "Сарапшы",
      tag: "қиын",
      description: "Шалғай қалалар, дала және табуы қиын жерлер",
    },
    room: {
      title: "Достармен",
      tag: "тікелей",
      description: "Барлығына бірдей 5 орын — достарыңмен жарыс",
    },
  },
  play: {
    loading: "Жүктелуде…",
    round: "Раунд",
    streak: "серия",
    submit: "Жауапты жіберу",
    placePin: "Картаға белгі қой",
    expand: "Үлкейту",
    shrink: "Кішірейту",
    perfect: "мүлтіксіз",
    guessDistance: (distance) => `болжамың ${distance} қашықтықта болды`,
    speedBonus: (bonus) => `жылдамдық бонусы +${bonus}`,
    streakMultiplier: (multiplier) => `серия ×${multiplier}`,
    nextRound: "Келесі раунд",
    seeResults: "Нәтижелерді көру",
    finish: "Аяқтау",
    dailyDoneTitle: "Күнделікті сынақ аяқталды",
    dailyDoneNote: "Жаңа сынақ түн ортасында келеді.",
    quickGame: "Жылдам ойын",
    home: "Басты бет",
  },
  summary: {
    complete: "аяқталды",
    line: (rounds, streak) => `${rounds} раунд · үздік серия ${streak}`,
    playAgain: "Тағы ойнау",
  },
  ranks: {
    tourist: "Турист",
    traveler: "Саяхатшы",
    explorer: "Зерттеуші",
    pathfinder: "Жол табушы",
    legend: "Дала аңызы",
  },
  stats: {
    title: "Менің статистикам",
    note: "Осы құрылғыда сақталады. Жаһандық рейтингтер кейін қосылады.",
    noGames: "Әзірге ойын жоқ — алғашқы раундыңды ойна.",
    bestScore: "Үздік ұпай",
    games: "Ойындар",
    bestStreak: "Үздік серия",
    avgScore: "Орташа ұпай",
    recentGames: "Соңғы ойындар",
    gameLine: (rounds, avgDistance) => `${rounds} раунд · орташа ${avgDistance}`,
  },
  share: {
    copy: "Нәтижені көшіру",
    copied: "Көшірілді!",
    catchphrase: "Менен асып озасың ба?",
    share: "Бөлісу",
  },
  room: {
    title: "Достармен ойна",
    subtitle: "Барлығына бірдей 5 орын — достарыңмен тікелей жарыс.",
    namePlaceholder: "Атың",
    join: "Кіру",
    invite: "Шақыру сілтемесі",
    copy: "Көшіру",
    copied: "Көшірілді!",
    players: "Ойыншылар",
    you: "сен",
    finished: "Дайын",
    connecting: "Қосылуда…",
    shareBeat: (names, points) =>
      `Qaida-да ${names} ойыншыларын ${points} ұпайға ұттым! 🇰🇿🏆`,
    shareLost: (winner, points) =>
      `${winner} мені ${points} ұпайға ұтып кетті 🇰🇿 — кек қайтарамын!`,
  },
};

const en: Translations = {
  home: {
    eyebrow: "Recognize Kazakhstan",
    tagline: "“Wait, I know this place…”",
    description:
      "Drop into a place somewhere in Kazakhstan. Look around, pin it on the map — the closer you are, the more you score.",
    start: "Start exploring",
    daily: "Daily Challenge",
    statsTitle: "My Stats",
    statsTag: "you",
    statsDescription: "Best scores, streaks, recent games",
  },
  modes: {
    quick: {
      title: "Quick Play",
      tag: "5 rounds",
      description: "Random places across all of Kazakhstan",
    },
    daily: {
      title: "Daily Challenge",
      tag: "one try",
      description: "Same 5 places for everyone, every day",
    },
    infinite: {
      title: "Infinite",
      tag: "∞",
      description: "Keep guessing, build the longest streak",
    },
    landmark: {
      title: "Landmarks",
      tag: "easy",
      description: "Only famous places — great for beginners",
    },
    expert: {
      title: "Expert",
      tag: "hard",
      description: "Remote cities, steppe and hard-to-place spots",
    },
    room: {
      title: "With Friends",
      tag: "live",
      description: "Same 5 places — race your friends",
    },
  },
  play: {
    loading: "Loading…",
    round: "Round",
    streak: "streak",
    submit: "Submit guess",
    placePin: "Place your pin on the map",
    expand: "Expand",
    shrink: "Shrink",
    perfect: "perfect",
    guessDistance: (distance) => `your guess was ${distance} away`,
    speedBonus: (bonus) => `speed bonus +${bonus}`,
    streakMultiplier: (multiplier) => `streak ×${multiplier}`,
    nextRound: "Next round",
    seeResults: "See results",
    finish: "Finish",
    dailyDoneTitle: "Daily Challenge complete",
    dailyDoneNote: "A new challenge arrives at midnight.",
    quickGame: "Quick Game",
    home: "Home",
  },
  summary: {
    complete: "complete",
    line: (rounds, streak) => `${rounds} rounds · best streak ${streak}`,
    playAgain: "Play again",
  },
  ranks: {
    tourist: "Tourist",
    traveler: "Traveler",
    explorer: "Explorer",
    pathfinder: "Pathfinder",
    legend: "Legend of the Steppe",
  },
  stats: {
    title: "My Stats",
    note: "Stored on this device. Global leaderboards arrive with accounts in a future update.",
    noGames: "No games yet — play your first round.",
    bestScore: "Best score",
    games: "Games",
    bestStreak: "Best streak",
    avgScore: "Avg score",
    recentGames: "Recent games",
    gameLine: (rounds, avgDistance) => `${rounds} rounds · avg ${avgDistance}`,
  },
  share: {
    copy: "Copy result",
    copied: "Copied!",
    catchphrase: "Can you beat me?",
    share: "Share",
  },
  room: {
    title: "Play with friends",
    subtitle: "Same 5 places — race your friends in real time.",
    namePlaceholder: "Your name",
    join: "Join game",
    invite: "Invite link",
    copy: "Copy",
    copied: "Copied!",
    players: "Players",
    you: "you",
    finished: "Done",
    connecting: "Connecting…",
    shareBeat: (names, points) =>
      `I beat ${names} by ${points} points in Qaida! 🇰🇿🏆`,
    shareLost: (winner, points) =>
      `${winner} beat me by ${points} in Qaida 🇰🇿 — rematch?`,
  },
};

const ru: Translations = {
  home: {
    eyebrow: "Узнай Казахстан",
    tagline: "«Подожди, я знаю это место…»",
    description:
      "Ты оказываешься где-то в Казахстане. Осмотрись и поставь метку на карте — чем ближе, тем больше очков.",
    start: "Начать",
    daily: "Ежедневный вызов",
    statsTitle: "Моя статистика",
    statsTag: "ты",
    statsDescription: "Лучшие результаты, серии, последние игры",
  },
  modes: {
    quick: {
      title: "Быстрая игра",
      tag: "5 раундов",
      description: "Случайные места по всему Казахстану",
    },
    daily: {
      title: "Ежедневный вызов",
      tag: "одна попытка",
      description: "Одни и те же 5 мест для всех — каждый день",
    },
    infinite: {
      title: "Бесконечный",
      tag: "∞",
      description: "Играй без остановки, собери самую длинную серию",
    },
    landmark: {
      title: "Достопримечательности",
      tag: "легко",
      description: "Только известные места — отлично для новичков",
    },
    expert: {
      title: "Эксперт",
      tag: "сложно",
      description: "Далёкие города, степь и сложные места",
    },
    room: {
      title: "С друзьями",
      tag: "вживую",
      description: "Одни и те же 5 мест — соревнуйся с друзьями",
    },
  },
  play: {
    loading: "Загрузка…",
    round: "Раунд",
    streak: "серия",
    submit: "Ответить",
    placePin: "Поставь метку на карте",
    expand: "Развернуть",
    shrink: "Свернуть",
    perfect: "идеально",
    guessDistance: (distance) => `твоя догадка была в ${distance}`,
    speedBonus: (bonus) => `бонус за скорость +${bonus}`,
    streakMultiplier: (multiplier) => `серия ×${multiplier}`,
    nextRound: "Следующий раунд",
    seeResults: "Результаты",
    finish: "Завершить",
    dailyDoneTitle: "Ежедневный вызов пройден",
    dailyDoneNote: "Новый вызов появится в полночь.",
    quickGame: "Быстрая игра",
    home: "Главная",
  },
  summary: {
    complete: "— итоги",
    line: (rounds, streak) => `${rounds} раундов · лучшая серия ${streak}`,
    playAgain: "Играть ещё",
  },
  ranks: {
    tourist: "Турист",
    traveler: "Путешественник",
    explorer: "Исследователь",
    pathfinder: "Следопыт",
    legend: "Легенда степи",
  },
  stats: {
    title: "Моя статистика",
    note: "Хранится на этом устройстве. Глобальные рейтинги появятся позже.",
    noGames: "Игр пока нет — сыграй первый раунд.",
    bestScore: "Лучший счёт",
    games: "Игры",
    bestStreak: "Лучшая серия",
    avgScore: "Средний счёт",
    recentGames: "Последние игры",
    gameLine: (rounds, avgDistance) => `${rounds} раундов · в среднем ${avgDistance}`,
  },
  share: {
    copy: "Скопировать результат",
    copied: "Скопировано!",
    catchphrase: "Сможешь набрать больше?",
    share: "Поделиться",
  },
  room: {
    title: "Игра с друзьями",
    subtitle: "Одни и те же 5 мест — соревнуйся с друзьями в реальном времени.",
    namePlaceholder: "Твоё имя",
    join: "Войти",
    invite: "Ссылка-приглашение",
    copy: "Копировать",
    copied: "Скопировано!",
    players: "Игроки",
    you: "ты",
    finished: "Готово",
    connecting: "Подключение…",
    shareBeat: (names, points) =>
      `Я обыграл ${names} на ${points} очков в Qaida! 🇰🇿🏆`,
    shareLost: (winner, points) =>
      `${winner} обыграл меня на ${points} очков в Qaida 🇰🇿 — реванш?`,
  },
};

export const TRANSLATIONS: Record<Language, Translations> = { kk, en, ru };

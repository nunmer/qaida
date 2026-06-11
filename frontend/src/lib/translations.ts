import type { GameMode } from "@/lib/rounds";

export type Language = "kk" | "en" | "ru";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "kk", label: "QAZ" },
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
}

/* Kazakh (2021 Latin alphabet) — primary language. */
const kk: Translations = {
  home: {
    eyebrow: "Qazaqstandy tany",
    tagline: "“Toqta, men būl jerdı bılemın…”",
    description:
      "Qazaqstannyñ bır jerıne tap bolasyñ. Ainalaña qarap, kartağa belgı qoi — neğūrlym jaqyn bolsañ, soğūrlym köp ūpai alasyñ.",
    start: "Bastau",
    daily: "Kündelıktı synaq",
    statsTitle: "Menıñ statistikam",
    statsTag: "sen",
    statsDescription: "Üzdık ūpailar, serialar, soñğy oiyndar",
  },
  modes: {
    quick: {
      title: "Jyldam oiyn",
      tag: "5 raund",
      description: "Bükıl Qazaqstan boiynşa 5 kezdeisoq raund",
    },
    daily: {
      title: "Kündelıktı synaq",
      tag: "bır mümkındık",
      description: "Barlyğyna bırdei 5 oryn — künıne bır mümkındık",
    },
    infinite: {
      title: "Şeksız",
      tag: "∞",
      description: "Toqtamai oina, eñ ūzyn serianı jasa",
    },
    landmark: {
      title: "Tanymal jerler",
      tag: "jeñıl",
      description: "Tek tanymal jerler — jaña bastağandarğa",
    },
    expert: {
      title: "Sarapşy",
      tag: "qiyn",
      description: "Şalğai qalalar, dala jäne tabuy qiyn jerler",
    },
  },
  play: {
    loading: "Jüktelude…",
    round: "Raund",
    streak: "seria",
    submit: "Jauapty jıberu",
    placePin: "Kartağa belgı qoi",
    expand: "Ülkeitu",
    shrink: "Kışıreitu",
    perfect: "mültıksız",
    guessDistance: (distance) => `boljamyñ ${distance} qaşyqtyqta boldy`,
    speedBonus: (bonus) => `jyldamdyq bonusy +${bonus}`,
    streakMultiplier: (multiplier) => `seria ×${multiplier}`,
    nextRound: "Kelesı raund",
    seeResults: "Nätijelerdı köru",
    finish: "Aiaqtau",
    dailyDoneTitle: "Kündelıktı synaq aiaqtaldy",
    dailyDoneNote: "Jaña synaq tün ortasynda keledı.",
    quickGame: "Jyldam oiyn",
    home: "Basty bet",
  },
  summary: {
    complete: "aiaqtaldy",
    line: (rounds, streak) => `${rounds} raund · üzdık seria ${streak}`,
    playAgain: "Tağy oinau",
  },
  ranks: {
    tourist: "Turist",
    traveler: "Saiahatşy",
    explorer: "Zertteuşı",
    pathfinder: "Jol tabuşy",
    legend: "Dala añyzy",
  },
  stats: {
    title: "Menıñ statistikam",
    note: "Osy qūrylğyda saqtalady. Jahandyq reitingter keiın qosylady.",
    noGames: "Äzırge oiyn joq — alğaşqy raundyñdy oina.",
    bestScore: "Üzdık ūpai",
    games: "Oiyndar",
    bestStreak: "Üzdık seria",
    avgScore: "Ortaşa ūpai",
    recentGames: "Soñğy oiyndar",
    gameLine: (rounds, avgDistance) => `${rounds} raund · ortaşa ${avgDistance}`,
  },
  share: {
    copy: "Nätijenı köşıru",
    copied: "Köşırıldı!",
    catchphrase: "Menen asyp ozasyn ba?",
    share: "Bölısu",
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
};

export const TRANSLATIONS: Record<Language, Translations> = { kk, en, ru };

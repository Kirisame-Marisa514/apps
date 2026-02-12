import { GameType } from '../types';

export const translations = {
  en: {
    appTitle: 'Rise & Shine',
    goodMorning: 'Good Morning!',
    wokeUpAt: 'You woke up at',
    goalMet: 'Goal Met!',
    todaysChallenge: "Today's Challenge",
    cancelWakeUp: "Cancel today's wake up",
    readyToStart: 'Ready to start the day?',
    readySubtitle: 'Complete a quick challenge to record your wake-up time.',
    imAwake: "I'm Awake!",
    totalDays: 'Total Days',
    streak: 'Streak',
    dailyGoal: 'Daily Goal',
    edit: 'Edit',
    wakeUpTrends: 'Wake Up Trends',
    time: 'Time',
    noHistory: 'No history recorded yet',
    
    // Game Controller
    stillDreaming: "You're still dreaming!",
    failedCheck: "You failed the wake-up check. Try again to record your time.",
    tryAgain: "Try Again",
    giveUp: "Give Up",

    // Game Labels
    [GameType.MATH]: 'Math Challenge',
    [GameType.MEMORY]: 'Memory Grid',
    [GameType.RIDDLE]: 'Morning Riddle (AI)',
    [GameType.COLOR_MATCH]: 'Color Chaos',
    [GameType.WORD_SCRAMBLE]: 'Word Scramble',

    // Math Game
    mathTitle: 'Math Awake!',
    chooseLevel: 'Choose your challenge level',
    solveToProve: 'Solve {n} problems to prove you\'re up.',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    submit: 'Submit',

    // Memory Game
    memoryTitle: 'Memory Grid',
    level: 'Level',
    watchCarefully: 'Watch carefully...',
    yourTurn: 'Your turn!',

    // Riddle Game
    riddleTitle: 'Morning Riddle',
    consultingOracle: 'Consulting the Oracle...',

    // Color Match
    colorTitle: 'Color Chaos',
    colorInstruction: 'Tap the button matching the INK COLOR, not the word!',
    score: 'Score',

    // Word Scramble
    scrambleTitle: 'Unscramble',
    scrambleInstruction: 'Unscramble the morning word.',
    word: 'Word',
    typeHere: 'TYPE HERE',
  },
  zh: {
    appTitle: '早安唤醒',
    goodMorning: '早上好！',
    wokeUpAt: '起床时间',
    goalMet: '达成目标！',
    todaysChallenge: "今日挑战",
    cancelWakeUp: "撤销今日起床记录",
    readyToStart: '准备好开始新的一天了吗？',
    readySubtitle: '完成一个小挑战来记录你的起床时间。',
    imAwake: "我醒了！",
    totalDays: '总天数',
    streak: '连续打卡',
    dailyGoal: '每日目标',
    edit: '编辑',
    wakeUpTrends: '起床趋势',
    time: '时间',
    noHistory: '暂无记录',

    // Game Controller
    stillDreaming: "你还在做梦呢！",
    failedCheck: "挑战失败，请重试以记录时间。",
    tryAgain: "重试",
    giveUp: "放弃",

    // Game Labels
    [GameType.MATH]: '数学挑战',
    [GameType.MEMORY]: '记忆方格',
    [GameType.RIDDLE]: '晨间谜题 (AI)',
    [GameType.COLOR_MATCH]: '颜色大乱斗',
    [GameType.WORD_SCRAMBLE]: '文字重组',

    // Math Game
    mathTitle: '数学唤醒',
    chooseLevel: '选择难度',
    solveToProve: '做对 {n} 道题证明你醒了。',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    submit: '提交',

    // Memory Game
    memoryTitle: '记忆方格',
    level: '关卡',
    watchCarefully: '仔细看...',
    yourTurn: '到你了！',

    // Riddle Game
    riddleTitle: '晨间谜题',
    consultingOracle: '正在咨询先知...',

    // Color Match
    colorTitle: '颜色大乱斗',
    colorInstruction: '点击与文字颜色（墨水颜色）相符的按钮，不要管文字内容！',
    score: '得分',

    // Word Scramble
    scrambleTitle: '文字重组',
    scrambleInstruction: '重组与早晨相关的词语。',
    word: '单词',
    typeHere: '输入答案',
  }
};
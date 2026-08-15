"use client";

import { useEffect, useMemo, useState } from "react";

type ModeId = "translation" | "trivia" | "speaker" | "order";
type VerseKey = keyof typeof verseLibrary;
type GameQuestion = {
  prompt: string;
  quote?: string;
  version?: string;
  reference?: string;
  options: string[];
  correct: number;
  explanation: string;
  verseKey?: VerseKey;
};

const versions = [
  { short: "KJV", name: "King James Version", language: "English" },
  { short: "WEB", name: "World English Bible", language: "English" },
  { short: "BM", name: "Bíbélì Mímọ́", language: "Yorùbá" },
];

const modes: { id: ModeId; number: string; icon: string; name: string; description: string }[] = [
  { id: "translation", number: "01", icon: "Aa", name: "Translation Match", description: "Match the same verse across English and Yorùbá translations." },
  { id: "trivia", number: "02", icon: "?", name: "Bible Trivia", description: "Test your knowledge of people, places, events, and teachings." },
  { id: "speaker", number: "03", icon: "“”", name: "Who Said It?", description: "Identify the speaker behind memorable words in Scripture." },
  { id: "order", number: "04", icon: "123", name: "Verse Order", description: "Choose the correct order for familiar verses from the Bible." },
];

const verseLibrary = {
  john316: {
    reference: "John 3:16",
    KJV: "For God so loved the world, that he gave his only begotten Son...",
    WEB: "For God so loved the world, that he gave his one and only Son...",
    BM: "Nítorí Ọlọ́run fẹ́ aráyé tó bẹ́ẹ̀ gẹ́, tí ó fi Ọmọ bíbí rẹ̀ kan ṣoṣo fúnni...",
  },
  psalm231: {
    reference: "Psalm 23:1",
    KJV: "The Lord is my shepherd; I shall not want.",
    WEB: "Yahweh is my shepherd: I shall lack nothing.",
    BM: "Olúwa ni olùṣọ́ àgùntàn mi; èmi kì yóò ṣe aláìní.",
  },
  genesis11: {
    reference: "Genesis 1:1",
    KJV: "In the beginning God created the heaven and the earth.",
    WEB: "In the beginning, God created the heavens and the earth.",
    BM: "Ní àtètèkọ́ṣe Ọlọ́run dá ọ̀run àti ayé.",
  },
  matthew514: {
    reference: "Matthew 5:14",
    KJV: "Ye are the light of the world.",
    WEB: "You are the light of the world.",
    BM: "Ẹ̀yin ni ìmọ́lẹ̀ ayé.",
  },
  psalm119105: {
    reference: "Psalm 119:105",
    KJV: "Thy word is a lamp unto my feet, and a light unto my path.",
    WEB: "Your word is a lamp to my feet, and a light for my path.",
    BM: "Ọ̀rọ̀ rẹ jẹ́ fìtílà fún ẹsẹ̀ mi, àti ìmọ́lẹ̀ fún ọ̀nà mi.",
  },
  phil413: {
    reference: "Philippians 4:13",
    KJV: "I can do all things through Christ which strengtheneth me.",
    WEB: "I can do all things through Christ, who strengthens me.",
    BM: "Mo lè ṣe ohun gbogbo nínú Kristi ẹni tí ń fún mi ní agbára.",
  },
  joshua19: {
    reference: "Joshua 1:9",
    KJV: "Be strong and of a good courage; be not afraid...",
    WEB: "Be strong and courageous. Do not be afraid...",
    BM: "Jẹ́ alágbára àti onígboyà; má ṣe bẹ̀rù...",
  },
  proverbs35: {
    reference: "Proverbs 3:5",
    KJV: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
    WEB: "Trust in Yahweh with all your heart, and do not lean on your own understanding.",
    BM: "Fi gbogbo ọkàn rẹ gbẹ́kẹ̀lé Olúwa; má sì ṣe tẹ̀lé òye ara rẹ.",
  },
  john1135: {
    reference: "John 11:35",
    KJV: "Jesus wept.",
    WEB: "Jesus wept.",
    BM: "Jésù sọkún.",
  },
  thess517: {
    reference: "1 Thessalonians 5:17",
    KJV: "Pray without ceasing.",
    WEB: "Pray without ceasing.",
    BM: "Ẹ máa gbàdúrà láìdabọ̀.",
  },
} as const;

const questionBank: Record<ModeId, GameQuestion[]> = {
  translation: [
    { prompt: "Which Yorùbá passage matches this KJV verse?", quote: verseLibrary.john316.KJV, version: "KJV", reference: "John 3:16", options: [verseLibrary.john316.BM, verseLibrary.psalm231.BM, verseLibrary.matthew514.BM, verseLibrary.genesis11.BM], correct: 0, explanation: "This is the opening of John 3:16, one of the clearest summaries of God's love and gift of salvation.", verseKey: "john316" },
    { prompt: "Which English verse matches this Yorùbá passage?", quote: verseLibrary.psalm231.BM, version: "Bíbélì Mímọ́", reference: "Sáàmù 23:1", options: [verseLibrary.phil413.KJV, verseLibrary.psalm231.KJV, verseLibrary.proverbs35.KJV, verseLibrary.joshua19.KJV], correct: 1, explanation: "Psalm 23 opens with David's confident picture of the Lord as a shepherd who provides.", verseKey: "psalm231" },
    { prompt: "Choose the Yorùbá translation of Genesis 1:1.", quote: verseLibrary.genesis11.WEB, version: "WEB", reference: "Genesis 1:1", options: [verseLibrary.matthew514.BM, verseLibrary.genesis11.BM, verseLibrary.john1135.BM, verseLibrary.thess517.BM], correct: 1, explanation: "Genesis begins with God as the creator of the heavens and the earth.", verseKey: "genesis11" },
    { prompt: "Which WEB wording matches this short Yorùbá verse?", quote: verseLibrary.matthew514.BM, version: "Bíbélì Mímọ́", reference: "Mátíù 5:14", options: [verseLibrary.john1135.WEB, verseLibrary.matthew514.WEB, verseLibrary.thess517.WEB, verseLibrary.psalm231.WEB], correct: 1, explanation: "Jesus calls his followers the light of the world in the Sermon on the Mount.", verseKey: "matthew514" },
    { prompt: "Which Yorùbá line carries the same meaning?", quote: verseLibrary.psalm119105.KJV, version: "KJV", reference: "Psalm 119:105", options: [verseLibrary.psalm119105.BM, verseLibrary.proverbs35.BM, verseLibrary.joshua19.BM, verseLibrary.phil413.BM], correct: 0, explanation: "The psalmist compares God's word to a lamp and a light that guide each step.", verseKey: "psalm119105" },
    { prompt: "Match this WEB verse to its Yorùbá translation.", quote: verseLibrary.phil413.WEB, version: "WEB", reference: "Philippians 4:13", options: [verseLibrary.thess517.BM, verseLibrary.phil413.BM, verseLibrary.john316.BM, verseLibrary.psalm231.BM], correct: 1, explanation: "Paul points to Christ as the source of strength for every circumstance.", verseKey: "phil413" },
    { prompt: "Which KJV excerpt matches this Yorùbá instruction?", quote: verseLibrary.joshua19.BM, version: "Bíbélì Mímọ́", reference: "Jóṣúà 1:9", options: [verseLibrary.proverbs35.KJV, verseLibrary.joshua19.KJV, verseLibrary.john316.KJV, verseLibrary.psalm119105.KJV], correct: 1, explanation: "God encourages Joshua to lead with strength and courage because divine presence goes with him.", verseKey: "joshua19" },
    { prompt: "Choose the Yorùbá translation with the same teaching.", quote: verseLibrary.proverbs35.KJV, version: "KJV", reference: "Proverbs 3:5", options: [verseLibrary.genesis11.BM, verseLibrary.proverbs35.BM, verseLibrary.phil413.BM, verseLibrary.matthew514.BM], correct: 1, explanation: "The proverb teaches wholehearted trust in God rather than dependence on personal understanding.", verseKey: "proverbs35" },
    { prompt: "Which Yorùbá sentence matches the shortest verse here?", quote: verseLibrary.john1135.WEB, version: "WEB", reference: "John 11:35", options: [verseLibrary.john1135.BM, verseLibrary.thess517.BM, verseLibrary.matthew514.BM, verseLibrary.psalm231.BM], correct: 0, explanation: "Jesus wept at Lazarus' tomb, revealing his compassion and shared grief.", verseKey: "john1135" },
    { prompt: "Match this instruction across the two languages.", quote: verseLibrary.thess517.KJV, version: "KJV", reference: "1 Thessalonians 5:17", options: [verseLibrary.psalm231.BM, verseLibrary.thess517.BM, verseLibrary.proverbs35.BM, verseLibrary.john1135.BM], correct: 1, explanation: "Paul calls believers to a continuing life of prayer.", verseKey: "thess517" },
  ],
  trivia: [
    { prompt: "Who led the Israelites through the Red Sea?", options: ["Joshua", "Moses", "Aaron", "Joseph"], correct: 1, explanation: "God used Moses to lead Israel out of Egypt and through the Red Sea. See Exodus 14." },
    { prompt: "Which young shepherd defeated Goliath?", options: ["Samuel", "Jonathan", "David", "Saul"], correct: 2, explanation: "David trusted God and defeated Goliath with a sling and a stone. See 1 Samuel 17." },
    { prompt: "What is the first book of the New Testament?", options: ["Mark", "Matthew", "Luke", "Acts"], correct: 1, explanation: "Matthew is the first book in the New Testament canon." },
    { prompt: "Which city's walls fell after Israel marched around them?", options: ["Jerusalem", "Bethlehem", "Jericho", "Nineveh"], correct: 2, explanation: "The walls of Jericho fell after Israel followed God's instruction. See Joshua 6." },
    { prompt: "Who interpreted Pharaoh's dreams in Egypt?", options: ["Joseph", "Daniel", "Moses", "Nehemiah"], correct: 0, explanation: "Joseph explained Pharaoh's dreams and prepared Egypt for famine. See Genesis 41." },
    { prompt: "How many disciples did Jesus appoint as apostles?", options: ["7", "10", "12", "40"], correct: 2, explanation: "Jesus appointed twelve apostles. See Luke 6:13." },
    { prompt: "Who built the ark before the flood?", options: ["Abraham", "Noah", "Isaac", "Lot"], correct: 1, explanation: "Noah obeyed God and built the ark. See Genesis 6." },
    { prompt: "On which mountain did Moses receive the commandments?", options: ["Carmel", "Zion", "Sinai", "Olives"], correct: 2, explanation: "Moses received the commandments at Mount Sinai. See Exodus 19 and 20." },
    { prompt: "Which apostle was formerly known as Saul?", options: ["Peter", "John", "Paul", "James"], correct: 2, explanation: "Saul, the persecutor who met Jesus on the Damascus road, became known as Paul." },
    { prompt: "Who was swallowed by a great fish?", options: ["Jonah", "Elijah", "Amos", "Hosea"], correct: 0, explanation: "Jonah spent three days and nights in the great fish. See Jonah 1:17." },
  ],
  speaker: [
    { prompt: "Who said these words?", quote: "Here am I; send me.", version: "KJV", reference: "Isaiah 6:8", options: ["Jeremiah", "Isaiah", "Ezekiel", "Samuel"], correct: 1, explanation: "Isaiah responded willingly after his vision of the Lord and cleansing." },
    { prompt: "Who asked this question?", quote: "Am I my brother's keeper?", version: "KJV", reference: "Genesis 4:9", options: ["Cain", "Esau", "Lamech", "Joseph"], correct: 0, explanation: "Cain spoke these words after God asked about Abel." },
    { prompt: "Which disciple made this confession?", quote: "Thou art the Christ, the Son of the living God.", version: "KJV", reference: "Matthew 16:16", options: ["Thomas", "John", "Peter", "Andrew"], correct: 2, explanation: "Peter confessed Jesus as the Christ at Caesarea Philippi." },
    { prompt: "Who said this after seeing the risen Jesus?", quote: "My Lord and my God.", version: "KJV", reference: "John 20:28", options: ["Thomas", "Philip", "Peter", "Nathanael"], correct: 0, explanation: "Thomas responded with faith when Jesus appeared to him." },
    { prompt: "Who declared this in suffering?", quote: "Though he slay me, yet will I trust in him.", version: "KJV", reference: "Job 13:15", options: ["David", "Job", "Jeremiah", "Daniel"], correct: 1, explanation: "Job expressed determined trust in God amid deep suffering." },
    { prompt: "Who said this to Pharaoh?", quote: "Let my people go.", version: "KJV", reference: "Exodus 5:1", options: ["Aaron only", "Moses and Aaron", "Joshua", "Caleb"], correct: 1, explanation: "Moses and Aaron delivered God's command to Pharaoh." },
    { prompt: "Who made this commitment?", quote: "Thy people shall be my people, and thy God my God.", version: "KJV", reference: "Ruth 1:16", options: ["Naomi", "Esther", "Ruth", "Hannah"], correct: 2, explanation: "Ruth spoke these faithful words to Naomi." },
    { prompt: "Who said this after a night of fishing?", quote: "At thy word I will let down the net.", version: "KJV", reference: "Luke 5:5", options: ["Peter", "James", "John", "Andrew"], correct: 0, explanation: "Simon Peter obeyed Jesus and witnessed a miraculous catch." },
    { prompt: "Who said this prayer?", quote: "Speak; for thy servant heareth.", version: "KJV", reference: "1 Samuel 3:10", options: ["David", "Samuel", "Solomon", "Eli"], correct: 1, explanation: "The boy Samuel answered when God called him during the night." },
    { prompt: "Who asked Jesus this question?", quote: "What is truth?", version: "KJV", reference: "John 18:38", options: ["Herod", "Caiaphas", "Pilate", "Nicodemus"], correct: 2, explanation: "Pontius Pilate asked Jesus this question during his trial." },
  ],
  order: [
    { prompt: "Which option gives John 1:1 in the correct order?", options: ["The Word was God, in the beginning, and with God.", "In the beginning was the Word, and the Word was with God, and the Word was God.", "With God was the Word, and God was in the beginning.", "God was the Word, and the beginning was with him."], correct: 1, explanation: "John opens his Gospel by declaring the eternal identity and divinity of the Word." },
    { prompt: "Choose the correct order for Psalm 23:1.", options: ["I shall not want; the Lord is my shepherd.", "My shepherd is the Lord; want shall not I.", "The Lord is my shepherd; I shall not want.", "I want not, for my shepherd is Lord."], correct: 2, explanation: "The verse begins with the Lord's relationship to the psalmist, then states the result." },
    { prompt: "Which line correctly orders Matthew 5:14?", options: ["The world is your light.", "Ye are the world of light.", "Ye are the light of the world.", "Light of the world are they."], correct: 2, explanation: "Jesus tells his disciples, 'Ye are the light of the world.'" },
    { prompt: "Choose the correct order for Genesis 1:1.", options: ["God created the earth and heaven in the beginning.", "In the beginning God created the heaven and the earth.", "The heaven in the beginning created God and earth.", "The earth and heaven created God in beginning."], correct: 1, explanation: "Genesis starts with God, creation, the heavens, and the earth in a clear sequence." },
    { prompt: "Which line correctly orders John 11:35?", options: ["Wept Jesus.", "Jesus wept.", "Jesus had wept.", "Then wept Jesus."], correct: 1, explanation: "The shortest verse in many English translations is simply, 'Jesus wept.'" },
    { prompt: "Choose the correct order for 1 Thessalonians 5:17.", options: ["Without ceasing pray.", "Pray without ceasing.", "Ceasing without prayer.", "Without prayer, cease."], correct: 1, explanation: "The brief command is, 'Pray without ceasing.'" },
    { prompt: "Which option correctly orders Philippians 4:13?", options: ["Through Christ all things I can do which strengtheneth me.", "I can do all things through Christ which strengtheneth me.", "All things strengthen me through Christ I do.", "Christ can do all things which I strengthen."], correct: 1, explanation: "The verse moves from Paul's ability, to every circumstance, to Christ as the source of strength." },
    { prompt: "Choose the correct order for Proverbs 3:5.", options: ["With all thine heart trust in the Lord; understanding is not thine.", "Lean on understanding and trust with thy heart.", "Trust in the Lord with all thine heart; and lean not unto thine own understanding.", "In the Lord understand with all thy heart and lean."], correct: 2, explanation: "The proverb first commands trust, then warns against relying on one's own understanding." },
    { prompt: "Which line correctly orders Psalm 119:105?", options: ["A lamp is my path, thy word and light to my feet.", "Thy word is a lamp unto my feet, and a light unto my path.", "My feet are a lamp, and thy path is light.", "A light is thy word and my lamp is the path."], correct: 1, explanation: "God's word is pictured first as a lamp for the feet, then as light for the path." },
    { prompt: "Choose the correct order for Romans 12:2.", options: ["Be transformed by renewing your mind, and not conformed to this world.", "Be not conformed to this world: but be ye transformed by the renewing of your mind.", "Renew this world and transform not your mind.", "Your mind is conformed, but the world is transformed."], correct: 1, explanation: "Paul contrasts conformity to the world with transformation through a renewed mind." },
  ],
};

type Stats = { games: number; bestScore: number; totalCorrect: number; streak: number; lastPlayed: string };
const emptyStats: Stats = { games: 0, bestScore: 0, totalCorrect: 0, streak: 0, lastPlayed: "" };

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [screen, setScreen] = useState<"home" | "game" | "result">("home");
  const [selectedMode, setSelectedMode] = useState<ModeId>("translation");
  const [difficulty, setDifficulty] = useState("Easy");
  const [rounds, setRounds] = useState(10);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [activeVersion, setActiveVersion] = useState<"KJV" | "WEB" | "BM">("KJV");
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("bibleQuestStats");
    if (saved) {
      try { setStats(JSON.parse(saved)); } catch { setStats(emptyStats); }
    }
  }, []);

  const currentQuestion = questions[questionIndex];
  const currentMode = useMemo(() => modes.find((mode) => mode.id === selectedMode) ?? modes[0], [selectedMode]);
  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;

  function startGame() {
    const pool = shuffled(questionBank[selectedMode]);
    const chosen = Array.from({ length: rounds }, (_, index) => pool[index % pool.length]);
    setQuestions(chosen);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setScreen("game");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkAnswer(index: number) {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    if (index === currentQuestion.correct) setScore((value) => value + 1);
  }

  function finishGame(finalScore: number) {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newPercentage = Math.round((finalScore / questions.length) * 100);
    const nextStats: Stats = {
      games: stats.games + 1,
      bestScore: Math.max(stats.bestScore, newPercentage),
      totalCorrect: stats.totalCorrect + finalScore,
      streak: stats.lastPlayed === today ? stats.streak : stats.lastPlayed === yesterday ? stats.streak + 1 : 1,
      lastPlayed: today,
    };
    setStats(nextStats);
    window.localStorage.setItem("bibleQuestStats", JSON.stringify(nextStats));
    setScreen("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      finishGame(score);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  }

  function goHome() {
    setScreen("home");
    setSelectedAnswer(null);
    setAnswered(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (screen === "game" && currentQuestion) {
    const progress = ((questionIndex + 1) / questions.length) * 100;
    return (
      <main className="gamePage">
        <header className="gameHeader">
          <button className="brand brandButton" onClick={goHome} aria-label="Return home">
            <span className="brandMark">BQ</span>
            <span><strong>Bible Quest</strong></span>
          </button>
          <div className="gameModeName"><span>{currentMode.icon}</span>{currentMode.name}</div>
          <div className="scoreBox"><small>Score</small><strong>{score * 100}</strong></div>
        </header>
        <div className="progressTrack"><span style={{ width: `${progress}%` }} /></div>
        <section className="questionShell">
          <div className="questionTopline">
            <span>Question {questionIndex + 1} of {questions.length}</span>
            <span>{difficulty} level</span>
          </div>
          {currentQuestion.version && <span className="translationPill">{currentQuestion.version}</span>}
          <h1>{currentQuestion.prompt}</h1>
          {currentQuestion.quote && (
            <blockquote>
              <span>“</span>{currentQuestion.quote}
              {currentQuestion.reference && <cite>{currentQuestion.reference}</cite>}
            </blockquote>
          )}
          <div className="answerGrid" role="group" aria-label="Answer choices">
            {currentQuestion.options.map((option, index) => {
              const classNames = ["answerButton"];
              if (answered && index === currentQuestion.correct) classNames.push("correctAnswer");
              if (answered && index === selectedAnswer && index !== currentQuestion.correct) classNames.push("wrongAnswer");
              return (
                <button key={`${questionIndex}-${index}`} className={classNames.join(" ")} onClick={() => checkAnswer(index)} disabled={answered}>
                  <span>{String.fromCharCode(65 + index)}</span><b>{option}</b>
                </button>
              );
            })}
          </div>
          {answered && (
            <div className={`feedback ${selectedAnswer === currentQuestion.correct ? "feedbackCorrect" : "feedbackWrong"}`}>
              <div>
                <strong>{selectedAnswer === currentQuestion.correct ? "Correct. Well done!" : "Not quite. Keep learning."}</strong>
                <p>{currentQuestion.explanation}</p>
              </div>
              <button onClick={nextQuestion}>{questionIndex === questions.length - 1 ? "See results" : "Next question"}<span>→</span></button>
            </div>
          )}
          {answered && currentQuestion.verseKey && (
            <div className="answerComparison">
              <span>Compare all three versions</span>
              <div>
                {(["KJV", "WEB", "BM"] as const).map((key) => (
                  <p key={key}><b>{key}</b>{verseLibrary[currentQuestion.verseKey!][key]}</p>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (screen === "result") {
    return (
      <main className="resultPage">
        <div className="resultCard">
          <button className="resultClose" onClick={goHome} aria-label="Return home">×</button>
          <p className="eyebrow">Quest complete</p>
          <div className="resultRing" style={{ "--score": `${percentage * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{percentage}%</strong><span>{score} of {questions.length} correct</span></div>
          </div>
          <h1>{percentage >= 80 ? "Excellent knowledge!" : percentage >= 60 ? "A strong beginning." : "Every round helps you grow."}</h1>
          <p>{percentage >= 80 ? "You know these passages well. Try a harder level for your next quest." : "Review the explanations, return to the Word, and try the round again."}</p>
          <div className="resultStats">
            <div><strong>{score * 100}</strong><span>Points earned</span></div>
            <div><strong>{stats.bestScore}%</strong><span>Personal best</span></div>
            <div><strong>{stats.streak}</strong><span>Day streak</span></div>
          </div>
          <div className="resultActions">
            <button className="secondaryButton" onClick={goHome}>Change mode</button>
            <button className="primaryButton" onClick={startGame}>Play again <span>→</span></button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Bible Quest home">
          <span className="brandMark" aria-hidden="true">BQ</span>
          <span><strong>Bible Quest</strong></span>
        </a>
        <nav aria-label="Main navigation">
          <a className="navActive" href="#versions">Versions</a>
          <a href="#play">Play</a>
          <a href="#progress">Progress</a>
        </nav>
        <button className="soundButton" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? "Turn sound off" : "Turn sound on"}>{soundOn ? "♪" : "×"}</button>
      </header>

      <section className="versions" id="versions">
        <div><p className="eyebrow">Study across translations</p><h2>Three voices. One truth.</h2><p className="versionIntro">Select a version to see the featured verse change below. Every Translation Match round uses all three.</p></div>
        <div className="versionList">
          {versions.map((version) => (
            <button className={`versionItem ${activeVersion === version.short ? "activeVersion" : ""}`} key={version.short} onClick={() => setActiveVersion(version.short as "KJV" | "WEB" | "BM")}>
              <strong>{version.short}</strong><span><b>{version.name}</b><small>{version.language}</small></span><i>{activeVersion === version.short ? "✓" : "→"}</i>
            </button>
          ))}
        </div>
      </section>

      <section className="hero" id="top">
        <div className="heroCopy">
          <p className="eyebrow">Learn. Play. Grow.</p>
          <h1>How well do you know <em>The Word?</em></h1>
          <p className="heroLead">Explore Scripture across English and Yorùbá, sharpen your memory, and build a daily Bible study rhythm through play.</p>
          <div className="heroStats" aria-label="Game highlights">
            <div><strong>3</strong><span>Bible versions</span></div>
            <div><strong>4</strong><span>Game modes</span></div>
            <div><strong>40</strong><span>Study questions</span></div>
          </div>
        </div>
        <div className="verseCard" aria-label="Featured verse">
          <span className="quoteMark">“</span>
          <p>{verseLibrary.psalm119105[activeVersion]}</p>
          <div className="verseMeta"><span>{verseLibrary.psalm119105.reference}</span><span>{activeVersion === "BM" ? "Bíbélì Mímọ́" : activeVersion}</span></div>
        </div>
      </section>

      <section className="playArea" id="play">
        <div className="sectionHeading">
          <div><p className="eyebrow">Your next round</p><h2>Choose your challenge</h2></div>
          <p>Start simple, then raise the difficulty as your confidence grows.</p>
        </div>
        <div className="setupGrid">
          {modes.map((mode) => (
            <button key={mode.id} className={`modeCard ${selectedMode === mode.id ? "featuredMode" : ""}`} onClick={() => setSelectedMode(mode.id)} aria-pressed={selectedMode === mode.id}>
              <span className="modeNumber">{mode.number}</span>
              <span className="modeIcon">{mode.icon}</span>
              <h3>{mode.name}</h3>
              <p>{mode.description}</p>
              {selectedMode === mode.id && <span className="modeTag">Selected</span>}
            </button>
          ))}
        </div>
        <div className="quickSetup">
          <div>
            <span className="setupLabel">Difficulty</span>
            <div className="segmented" role="group" aria-label="Choose difficulty">
              {["Easy", "Medium", "Hard"].map((level) => <button key={level} className={difficulty === level ? "selected" : ""} onClick={() => setDifficulty(level)}>{level}</button>)}
            </div>
          </div>
          <div>
            <span className="setupLabel">Questions</span>
            <div className="segmented" role="group" aria-label="Choose number of questions">
              {[5, 10, 15].map((count) => <button key={count} className={rounds === count ? "selected" : ""} onClick={() => setRounds(count)}>{count}</button>)}
            </div>
          </div>
          <button className="primaryButton" onClick={startGame}>Begin quest <span>→</span></button>
        </div>
      </section>

      <section className="progressSection" id="progress">
        <div><p className="eyebrow">Your study journey</p><h2>Small steps. Lasting truth.</h2></div>
        <div className="progressCards">
          <article><span>Quests completed</span><strong>{stats.games}</strong><small>Keep showing up</small></article>
          <article><span>Personal best</span><strong>{stats.bestScore}%</strong><small>Your highest round</small></article>
          <article><span>Correct answers</span><strong>{stats.totalCorrect}</strong><small>Knowledge gathered</small></article>
          <article><span>Study streak</span><strong>{stats.streak}</strong><small>Days in a row</small></article>
        </div>
      </section>

      <footer>
        <div className="brand footerBrand"><span className="brandMark">BQ</span><span><strong>Bible Quest</strong></span></div>
        <p>Study the Word. Treasure it in your heart.</p>
        <span>KJV, WEB, and Bíbélì Mímọ́ study excerpts</span>
      </footer>
    </main>
  );
}

export interface Topic {
  text: string;
  category: string;
}

// A deliberately wide-ranging bank of speaking prompts. Categories span
// classic debate topics through to niche-but-not-obscure territory:
// mythology, one-word prompts, internet culture, ethics, and more.
const raw: [string, string][] = [
  // ---- Science ----
  ['Why does time seem to speed up as we get older?', 'Science'],
  ['Explain why the sky is blue to someone who has never seen it.', 'Science'],
  ['Is it possible we are living in a simulation?', 'Science'],
  ['Why do we dream, and do dreams mean anything?', 'Science'],
  ['Could humans ever colonize another planet? What would go wrong first?', 'Science'],
  ['Why does music give some people chills?', 'Science'],
  ['Explain black holes as if to a curious ten-year-old.', 'Science'],
  ['Is there a meaningful difference between "alive" and "not alive"?', 'Science'],
  ['Why do humans yawn, and why is it contagious?', 'Science'],
  ['What would happen if gravity briefly stopped working?', 'Science'],
  ['Why does deja vu feel the way it does?', 'Science'],
  ['Is there a limit to how intelligent a species can become?', 'Science'],
  ['Why do we age at different rates even with the same lifestyle?', 'Science'],
  ['Explain why the placebo effect actually works.', 'Science'],

  // ---- Technology / CSE / AI ----
  ['Why do some technologies become obsolete while others endure?', 'Technology'],
  ['Should social media platforms be regulated like utilities?', 'Technology'],
  ['Will physical books disappear within your lifetime?', 'Technology'],
  ['What is the most overrated piece of modern technology?', 'Technology'],
  ['Is convenience technology making us less capable?', 'Technology'],
  ['Should there be a legal right to be forgotten online?', 'Technology'],
  ['What job do you think will be the last one automated?', 'Technology'],
  ['Explain why passwords are a broken idea.', 'Technology'],
  ['Is it ethical to create art with artificial intelligence?', 'Technology'],
  ['Would society be better or worse without smartphones?', 'Technology'],
  ['Why do so many good ideas in tech come from side projects?', 'Technology'],
  ['Should programmers be personally liable for bugs that cause harm?', 'Technology'],
  ['Is open-source software the future or a niche ideal?', 'Technology'],
  ['What makes an algorithm "fair"?', 'Technology'],
  ['Should AI-generated art be copyrightable?', 'Technology'],
  ['Is it ethical for AI models to be trained on the public internet without consent?', 'Technology'],
  ['Why do so many software projects run over deadline?', 'Technology'],
  ['Should coding be taught as a core subject in school, like math?', 'Technology'],
  ['Is a "10x engineer" a myth or a reality?', 'Technology'],
  ['What is lost when we let autocomplete finish our sentences?', 'Technology'],
  ['Should social media algorithms be required to be transparent?', 'Technology'],
  ['Is quantum computing overhyped for the near future?', 'Technology'],
  ['Why do the best engineers often make the worst project managers?', 'Technology'],
  ['Should there be a global regulatory body for AI, similar to nuclear oversight?', 'Technology'],
  ['Is it possible for an AI to be truly creative, or only recombinant?', 'Technology'],
  ['What is the ethical line between personalization and manipulation in apps?', 'Technology'],
  ['Should facial recognition be banned in public spaces?', 'Technology'],
  ['Is "move fast and break things" still good advice for startups?', 'Technology'],
  ['Why do so many brilliant technical ideas fail to become good products?', 'Technology'],
  ['Should everyone learn to code, even outside tech careers?', 'Technology'],
  ['Is technical debt underestimated by most companies?', 'Technology'],
  ['What happens to truth when AI can generate convincing fake video?', 'Technology'],
  ['Should AI chatbots be required to disclose that they are not human?', 'Technology'],
  ['Is the pace of AI progress something to be excited about or worried about?', 'Technology'],
  ['What is a technology you think is fundamentally misunderstood by the public?', 'Technology'],

  // ---- Mathematics ----
  ['Why is math often called the universal language?', 'Mathematics'],
  ['Is math discovered or invented?', 'Mathematics'],
  ['Why do so many people develop "math anxiety" early in life?', 'Mathematics'],
  ['What makes a mathematical proof beautiful, not just correct?', 'Mathematics'],
  ['Why does infinity break so many of our intuitions?', 'Mathematics'],
  ['Is statistics more useful in daily life than algebra?', 'Mathematics'],
  ['Why do prime numbers still fascinate mathematicians after centuries?', 'Mathematics'],
  ['What is a mathematical idea that changed how you see the world?', 'Mathematics'],
  ['Why does probability so often defy common sense?', 'Mathematics'],
  ['Is mathematical talent innate, or built through practice?', 'Mathematics'],

  // ---- History ----
  ['If you could remove one invention from history, what would it be?', 'History'],
  ['Explain why cities develop around rivers.', 'History'],
  ['What historical event do you think is most misunderstood today?', 'History'],
  ['Why do empires eventually collapse?', 'History'],
  ['If you could witness one historical moment firsthand, which would it be?', 'History'],
  ['Why do some cultures romanticize their past more than others?', 'History'],
  ['What everyday object has the most surprising history?', 'History'],
  ['Why did handwriting used to be considered a mark of intelligence?', 'History'],
  ['Explain why the printing press changed the world so drastically.', 'History'],

  // ---- Mythology ----
  ['Why did every ancient culture invent flood myths independently?', 'Mythology'],
  ['What made Greek gods so relatable despite being immortal?', 'Mythology'],
  ['Explain why trickster figures like Loki or Anansi appear in mythologies worldwide.', 'Mythology'],
  ['Why do so many creation myths start with darkness or chaos?', 'Mythology'],
  ['What is the modern equivalent of a mythological hero\u2019s journey?', 'Mythology'],
  ['Why did the Egyptians associate the afterlife so heavily with judgment?', 'Mythology'],
  ['Explain why dragons appear in nearly every culture\u2019s mythology.', 'Mythology'],
  ['Is Prometheus stealing fire a myth about progress or about punishment?', 'Mythology'],
  ['Why do underworld myths always involve a bargain or a trick?', 'Mythology'],
  ['What does Icarus flying too close to the sun actually warn us about?', 'Mythology'],
  ['Why did Norse mythology embrace the idea that even gods will die?', 'Mythology'],
  ['Explain why the phoenix became a symbol used far outside its original myth.', 'Mythology'],
  ['Is Pandora\u2019s box really about curiosity, or about blame?', 'Mythology'],
  ['Why do so many cultures have a myth explaining why we die?', 'Mythology'],
  ['What can Sisyphus\u2019s punishment teach us about modern work?', 'Mythology'],
  ['Why did ancient people personify natural disasters as angry gods?', 'Mythology'],
  ['Explain the appeal of the "chosen one" archetype across mythologies.', 'Mythology'],
  ['Why does nearly every mythology have a trickster who outsmarts the gods?', 'Mythology'],
  ['What made oracles and prophecies such a common mythological device?', 'Mythology'],
  ['Why do modern superhero stories borrow so heavily from ancient myth?', 'Mythology'],

  // ---- Philosophy ----
  ['Is boredom actually useful?', 'Philosophy'],
  ['Can a person be truly selfless?', 'Philosophy'],
  ['Does free will exist, or is it an illusion?', 'Philosophy'],
  ['Is it better to know the truth or to be happy?', 'Philosophy'],
  ['What makes a life "well lived"?', 'Philosophy'],
  ['Is suffering necessary for personal growth?', 'Philosophy'],
  ['Can something be beautiful and meaningless at the same time?', 'Philosophy'],
  ['Is it more important to be understood or to be liked?', 'Philosophy'],
  ['Would immortality be a gift or a curse?', 'Philosophy'],
  ['Is it possible to think without language?', 'Philosophy'],

  // ---- Psychology ----
  ['Why do humans enjoy horror movies?', 'Psychology'],
  ['Why do we remember embarrassing moments more vividly than happy ones?', 'Psychology'],
  ['What causes procrastination, and why is it so hard to fix?', 'Psychology'],
  ['Why do people believe things that are clearly false?', 'Psychology'],
  ['Is nostalgia a healthy emotion?', 'Psychology'],
  ['Why do first impressions matter so much?', 'Psychology'],
  ['What makes a habit so difficult to break?', 'Psychology'],
  ['Why do we compare ourselves to others so instinctively?', 'Psychology'],
  ['Is willpower a limited resource or a skill you can build?', 'Psychology'],

  // ---- Economics ----
  ['Why do luxury goods get more desirable as they get more expensive?', 'Economics'],
  ['Should there be a maximum limit on personal wealth?', 'Economics'],
  ['Why do people work even after they no longer need the money?', 'Economics'],
  ['Is a four-day work week actually more productive?', 'Economics'],
  ['Why does inflation feel unfair even when wages rise too?', 'Economics'],
  ['Explain why "free" products are rarely actually free.', 'Economics'],
  ['Should college education be free for everyone?', 'Economics'],

  // ---- Culture ----
  ['Why do trends from decades ago keep coming back into fashion?', 'Culture'],
  ['Is it possible for a culture to have "bad taste"?', 'Culture'],
  ['Why do humans create rituals around food?', 'Culture'],
  ['What makes a joke funny in one culture and offensive in another?', 'Culture'],
  ['Why does every generation think the next one has it easier?', 'Culture'],
  ['Is tourism helping or harming the places we visit?', 'Culture'],

  // ---- Movies ----
  ['Why are villains often more memorable than heroes?', 'Movies'],
  ['What makes a movie ending satisfying versus disappointing?', 'Movies'],
  ['Should movie remakes ever be allowed to change the ending?', 'Movies'],
  ['Why do people cry at fictional stories they know aren\u2019t real?', 'Movies'],
  ['Why do we root for antiheroes even when they do terrible things?', 'Movies'],
  ['Should a movie ever be judged separately from its director\u2019s personal life?', 'Movies'],
  ['Why does a good plot twist feel earned while a bad one feels cheap?', 'Movies'],
  ['Is a sequel ever better than the original, and why does it happen so rarely?', 'Movies'],
  ['Why do some films get better on rewatch while others get worse?', 'Movies'],
  ['What makes a movie soundtrack unforgettable versus forgettable?', 'Movies'],
  ['Should subtitles or dubbing be the default for foreign films?', 'Movies'],
  ['Why do slow-burn movies frustrate some viewers and captivate others?', 'Movies'],
  ['Is it fair to say a movie is "ahead of its time"?', 'Movies'],
  ['Why do certain movie lines become part of everyday language?', 'Movies'],

  // ---- Games ----
  ['Are video games a legitimate art form?', 'Games'],
  ['Why are open-world games so addictive?', 'Games'],
  ['Should esports be treated the same as traditional sports?', 'Games'],

  // ---- Sports ----
  ['Why do underdog victories feel more meaningful than expected wins?', 'Sports'],
  ['Should athletes be paid more than teachers or doctors?', 'Sports'],
  ['Is it fair for genetics to play such a large role in sports success?', 'Sports'],
  ['Why do rivalries make sports more exciting to watch?', 'Sports'],

  // ---- Everyday life ----
  ['Why does a cluttered room affect how you feel?', 'Everyday Life'],
  ['What is one small daily habit that quietly shapes a person\u2019s life?', 'Everyday Life'],
  ['Why do mornings feel harder for some people than others?', 'Everyday Life'],
  ['Is it better to plan a trip in detail or leave it to chance?', 'Everyday Life'],
  ['Why does waiting in line feel worse than the time it actually takes?', 'Everyday Life'],
  ['What is a small kindness that made a lasting impression on you?', 'Everyday Life'],

  // ---- Weird facts ----
  ['Explain why honey never spoils.', 'Weird Facts'],
  ['Why do we get goosebumps from cold and from emotion?', 'Weird Facts'],
  ['Why can\u2019t you tickle yourself?', 'Weird Facts'],
  ['Why do bananas ripen faster next to other fruit?', 'Weird Facts'],
  ['Why does time feel like it goes slower when you\u2019re bored?', 'Weird Facts'],

  // ---- Hypothetical ----
  ['If you had to give up one sense, which would you choose and why?', 'Hypothetical'],
  ['If money didn\u2019t exist, how would society organize work?', 'Hypothetical'],
  ['If you could relive one year of your life, which would it be?', 'Hypothetical'],
  ['If everyone could read minds, how would relationships change?', 'Hypothetical'],
  ['If you could send one message to humanity 100 years from now, what would it say?', 'Hypothetical'],
  ['If a machine could predict your future perfectly, would you want to know it?', 'Hypothetical'],

  // ---- Abstract ----
  ['What does it truly mean to "waste time"?', 'Abstract'],
  ['Is silence a form of communication?', 'Abstract'],
  ['What separates a "collection" from a pile of clutter?', 'Abstract'],
  ['Can you own an idea?', 'Abstract'],
  ['What is the difference between confidence and arrogance?', 'Abstract'],
  ['Is a promise still meaningful if no one is watching?', 'Abstract'],

  // ---- Niche ----
  ['Why do lighthouse keepers hold such a romantic place in our imagination?', 'Niche'],
  ['Explain why calligraphy remains valued in a digital age.', 'Niche'],
  ['Why do people collect things that have no practical use?', 'Niche'],
  ['What makes a map beautiful versus merely functional?', 'Niche'],
  ['Why do certain smells trigger such strong memories?', 'Niche'],

  // ---- General knowledge ----
  ['Explain how a refrigerator keeps things cold.', 'General Knowledge'],
  ['Why do we have leap years?', 'General Knowledge'],
  ['Explain why the ocean is salty.', 'General Knowledge'],
  ['Why do we see lightning before we hear thunder?', 'General Knowledge'],
  ['Explain why airplanes are able to fly.', 'General Knowledge'],

  // ---- Debatable ----
  ['Should handwriting still be taught in schools?', 'Debatable'],
  ['Is competition healthier than collaboration?', 'Debatable'],
  ['Should there be an age limit for using social media?', 'Debatable'],
  ['Is it ethical to eat meat in the modern world?', 'Debatable'],
  ['Should students be allowed to grade their own teachers?', 'Debatable'],
  ['Is privacy a right people are too willing to give up?', 'Debatable'],

  // ---- Creative ----
  ['Describe a color to someone who has never been able to see.', 'Creative'],
  ['Invent a new holiday and explain how people would celebrate it.', 'Creative'],
  ['Design a city from scratch \u2014 what would you prioritize?', 'Creative'],
  ['If your life were a book, what would the current chapter be called?', 'Creative'],
  ['Describe your ideal Sunday from morning to night.', 'Creative'],

  // ---- Opinions & Controversial Opinions ----
  ['Is it okay to lie to protect someone\u2019s feelings?', 'Opinions'],
  ['Should tipping be replaced with fair wages instead?', 'Opinions'],
  ['Is remote work actually better for productivity, or just more comfortable?', 'Opinions'],
  ['Are influencers doing real work?', 'Opinions'],
  ['Should there be a minimum age to use dating apps?', 'Opinions'],
  ['Is cancel culture a form of accountability or a form of mob justice?', 'Opinions'],
  ['Should students be allowed to use AI to help write essays?', 'Opinions'],
  ['Is it wrong to enjoy a celebrity\u2019s work if you dislike them personally?', 'Opinions'],
  ['Should voting be mandatory?', 'Opinions'],
  ['Is "hustle culture" actually harmful?', 'Opinions'],
  ['Are participation trophies a good idea?', 'Opinions'],
  ['Should there be a legal drinking age at all?', 'Opinions'],
  ['Is nuclear energy the most underrated climate solution?', 'Opinions'],
  ['Should billionaires be allowed to exist?', 'Opinions'],
  ['Is it ethical to date a coworker?', 'Opinions'],
  ['Are New Year\u2019s resolutions actually useful?', 'Opinions'],
  ['Should homework be abolished in schools?', 'Opinions'],
  ['Is it wrong to ghost someone instead of rejecting them directly?', 'Opinions'],
  ['Should zoos be phased out entirely?', 'Opinions'],
  ['Is capitalism compatible with genuine environmental sustainability?', 'Opinions'],
  ['Should social media have a minimum age requirement?', 'Opinions'],
  ['Is it okay to skip a friend\u2019s wedding for a work opportunity?', 'Opinions'],
  ['Should AI-generated content be held to the same plagiarism standards as human work?', 'Opinions'],
  ['Is competitive parenting harming kids more than helping them?', 'Opinions'],
  ['Should companies be required to disclose salary ranges upfront?', 'Opinions'],

  // ---- One word ----
  ['Freedom', 'One Word'],
  ['Nostalgia', 'One Word'],
  ['Ambition', 'One Word'],
  ['Silence', 'One Word'],
  ['Home', 'One Word'],
  ['Trust', 'One Word'],
  ['Chaos', 'One Word'],
  ['Legacy', 'One Word'],
  ['Curiosity', 'One Word'],
  ['Belonging', 'One Word'],
  ['Ego', 'One Word'],
  ['Patience', 'One Word'],
  ['Identity', 'One Word'],
  ['Risk', 'One Word'],
  ['Growth', 'One Word'],
  ['Loneliness', 'One Word'],
  ['Courage', 'One Word'],
  ['Change', 'One Word'],
  ['Balance', 'One Word'],
  ['Authenticity', 'One Word'],

  // ---- One-liners ----
  ['Describe your perfect Tuesday.', 'One-Liner'],
  ['What\u2019s a rule you secretly break?', 'One-Liner'],
  ['Name a skill everyone should learn.', 'One-Liner'],
  ['What\u2019s overrated? What\u2019s underrated?', 'One-Liner'],
  ['Explain your job to a five-year-old.', 'One-Liner'],
  ['What\u2019s a lie you were told as a kid?', 'One-Liner'],
  ['Describe the internet in one sentence.', 'One-Liner'],
  ['What\u2019s something everyone gets wrong about you?', 'One-Liner'],
  ['Pitch a movie in fifteen seconds.', 'One-Liner'],
  ['Defend pineapple on pizza \u2014 or against it.', 'One-Liner'],
  ['What\u2019s a trend you don\u2019t understand?', 'One-Liner'],
  ['Convince me to try your favorite hobby.', 'One-Liner'],
  ['What\u2019s the most useless fact you know?', 'One-Liner'],
  ['Describe your hometown to a stranger.', 'One-Liner'],
  ['What would your autobiography be titled?', 'One-Liner'],

  // ---- Internet culture ----
  ['Why do internet arguments escalate faster than in-person ones?', 'Internet Culture'],
  ['Is "main character energy" a healthy mindset or just narcissism rebranded?', 'Internet Culture'],
  ['Why do memes spread faster than news?', 'Internet Culture'],
  ['Is anonymity online making people kinder or crueler?', 'Internet Culture'],
  ['Why does everything on the internet eventually become a debate?', 'Internet Culture'],
  ['Are algorithms making our opinions more extreme?', 'Internet Culture'],
  ['Is going viral more luck or more strategy?', 'Internet Culture'],
  ['Why do internet trends die out so quickly?', 'Internet Culture'],
  ['Should influencers disclose every sponsorship, no exceptions?', 'Internet Culture'],
  ['Is "doomscrolling" a real problem or an exaggerated one?', 'Internet Culture'],
  ['Why do people perform happiness online more than they feel it?', 'Internet Culture'],
  ['Is online outrage usually about the issue, or about being seen caring?', 'Internet Culture'],
  ['Why did short-form video change how we tell stories?', 'Internet Culture'],
  ['Should there be an internet-free day each week?', 'Internet Culture'],
  ['Is a large online following the same thing as real influence?', 'Internet Culture'],

  // ---- Ethics ----
  ['Is it ethical to eat lab-grown meat versus farmed meat?', 'Ethics'],
  ['Should self-driving cars be programmed to choose who to save in a crash?', 'Ethics'],
  ['Is it wrong to profit from someone else\u2019s misfortune, even legally?', 'Ethics'],
  ['Should parents be allowed to choose their child\u2019s traits genetically?', 'Ethics'],
  ['Is it ethical to test products on animals if it saves human lives?', 'Ethics'],
  ['Should companies be allowed to use AI to replace jobs without retraining workers?', 'Ethics'],
  ['Is it wrong to keep a secret that isn\u2019t yours to share?', 'Ethics'],
  ['Should criminals lose the right to vote?', 'Ethics'],
  ['Is it ethical to profit from a war, even indirectly?', 'Ethics'],
  ['Should there be a limit on how much wealth one person can inherit?', 'Ethics'],
  ['Is it wrong to use a white lie to get a job?', 'Ethics'],
  ['Should whistleblowers always be protected, no matter the cost?', 'Ethics'],
  ['Is it ethical to bring a child into an uncertain future?', 'Ethics'],
  ['Should people be allowed to sell their organs?', 'Ethics'],
  ['Is silence in the face of wrongdoing itself a kind of wrongdoing?', 'Ethics'],

  // ---- Life ----
  ['What does it mean to "grow up," really?', 'Life'],
  ['Is it better to have many acquaintances or a few close friends?', 'Life'],
  ['What\u2019s the difference between being alone and being lonely?', 'Life'],
  ['How do you know when it\u2019s time to quit something?', 'Life'],
  ['What does a meaningful apology actually require?', 'Life'],
  ['Is it possible to fully forgive without forgetting?', 'Life'],
  ['What\u2019s the difference between confidence and certainty?', 'Life'],
  ['How much of who you are is chosen versus inherited?', 'Life'],
  ['What makes a house feel like a home?', 'Life'],
  ['Is it healthier to expect the best or prepare for the worst?', 'Life'],
  ['What do you owe the people who raised you?', 'Life'],
  ['How do you rebuild trust once it\u2019s broken?', 'Life'],
  ['What\u2019s the line between persistence and stubbornness?', 'Life'],
  ['Is it better to regret trying or regret not trying?', 'Life'],
  ['What does "enough" mean to you?', 'Life'],

  // ---- Fashion & Style ----
  ['Why does fashion move in cycles instead of straight lines?', 'Fashion & Style'],
  ['Is fast fashion\u2019s convenience worth its environmental cost?', 'Fashion & Style'],
  ['What makes an outfit "timeless" instead of just old?', 'Fashion & Style'],
  ['Should workplaces still enforce formal dress codes?', 'Fashion & Style'],
  ['Why do people dress differently online than in person?', 'Fashion & Style'],
  ['Is personal style something you\u2019re born with or something you build?', 'Fashion & Style'],
  ['Why do uniforms both restrict and simplify identity?', 'Fashion & Style'],
  ['Should comfort always win over style?', 'Fashion & Style'],
  ['What does your wardrobe say about you that you didn\u2019t intend?', 'Fashion & Style'],
  ['Why do certain colors go in and out of fashion?', 'Fashion & Style'],

  // ---- Career ----
  ['Is job-hopping actually bad for your career anymore?', 'Career'],
  ['Should passion or stability guide a career choice?', 'Career'],
  ['Is a college degree still worth the cost for every career?', 'Career'],
  ['What makes a mentor genuinely valuable versus just well-connected?', 'Career'],
  ['Should companies allow employees to work four-day weeks?', 'Career'],
  ['Is networking a skill or a personality trait?', 'Career'],
  ['Should salary always be the deciding factor in a job offer?', 'Career'],
  ['What\u2019s the difference between a good boss and a good leader?', 'Career'],
  ['Is it better to be a generalist or a specialist in today\u2019s job market?', 'Career'],
  ['Should career breaks be viewed more positively by employers?', 'Career'],
  ['Is burnout a personal failure or a systemic one?', 'Career'],
  ['What does "work-life balance" actually look like in practice?', 'Career'],
  ['Should internships always be paid?', 'Career'],
  ['Is climbing the corporate ladder still the default definition of success?', 'Career'],
  ['What\u2019s one skill that matters more than people realize?', 'Career'],
];

export const TOPICS: Topic[] = raw.map(([text, category]) => ({ text, category }));

export const TOPIC_CATEGORIES: string[] = Array.from(new Set(TOPICS.map((t) => t.category))).sort();

// ---------------------------------------------------------------------------
// "Don't repeat until exhausted" shuffle bag.
//
// Rather than pure Math.random() (which can repeat the same topic within a
// handful of draws), we shuffle the full topic list into a queue and hand
// topics out in that order. Once the queue is exhausted, it's reshuffled —
// so every topic is guaranteed to appear once before any repeats.
// ---------------------------------------------------------------------------

const QUEUE_KEY = 'articulate-topic-queue-v1';

interface TopicQueueState {
  order: number[]; // indices into TOPICS
  pointer: number;
  topicCount: number; // to detect when TOPICS has changed (e.g. app update)
}

function shuffledIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadQueue(): TopicQueueState {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TopicQueueState;
      if (parsed.topicCount === TOPICS.length && Array.isArray(parsed.order)) {
        return parsed;
      }
    }
  } catch {
    // fall through to fresh queue
  }
  return { order: shuffledIndices(TOPICS.length), pointer: 0, topicCount: TOPICS.length };
}

function saveQueue(state: TopicQueueState) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable — silently skip persistence
  }
}

/**
 * Draw the next topic from the shuffle bag. Cycles through every topic once
 * before any repeat; reshuffles automatically when exhausted, taking care
 * not to immediately repeat the very last topic shown.
 */
export function nextTopic(): Topic {
  const state = loadQueue();
  if (state.pointer >= state.order.length) {
    const lastIndex = state.order[state.order.length - 1];
    let reshuffled = shuffledIndices(TOPICS.length);
    if (reshuffled[0] === lastIndex && reshuffled.length > 1) {
      [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
    }
    state.order = reshuffled;
    state.pointer = 0;
  }
  const index = state.order[state.pointer];
  state.pointer += 1;
  saveQueue(state);
  return TOPICS[index];
}

/** Retained for any call sites that want a pure random pick (e.g. tests). */
export function pickRandomTopic(excludeText?: string): Topic {
  if (TOPICS.length <= 1) return TOPICS[0];
  let topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  let guard = 0;
  while (topic.text === excludeText && guard < 10) {
    topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    guard++;
  }
  return topic;
}

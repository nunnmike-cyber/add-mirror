export const COLORS = {
  cream: "#F9F5EE", paper: "#F2EBD9", warm: "#E8DCC8", ink: "#1A1410",
  inkLight: "#3D2E22", accent: "#C4581A", accentLight: "#E8885A",
  accentPale: "#F5DDD0", teal: "#2A6B6B", tealLight: "#5AABAB",
  tealPale: "#D0ECEC", muted: "#8A7A68", mutedLight: "#B5A48E",
};

export const PART_A_QUESTIONS = ["a1", "a4", "a5", "a6", "a7", "e1", "e5"];
export const PART_A_HIT_THRESHOLD = 3;
export const PART_A_POSITIVE_SCREEN = 4;

export const CORE_SIGNAL_WEIGHTS = {
  inattentive: 0.40, executive: 0.20, hyperactive_impulsive: 0.20,
  emotional: 0.10, hyperfocus: 0.10,
};

export const CORE_SIGNAL_QUESTIONS = {
  inattentive: ["c1", "c4", "c5", "a1", "a2", "a3", "a4", "a5", "a6", "a7"],
  executive: ["em4", "em5"],
  hyperactive_impulsive: ["c2", "c3", "e1", "e2", "e3", "e4", "e5", "e6"],
  emotional: ["em1", "em2"],
  hyperfocus: ["c6", "em3"],
};

export const MASKING_QUESTIONS = ["m1", "m2", "m3", "m4", "m5"];
export const IMPAIRMENT_QUESTIONS = ["imp1", "imp2", "imp3", "imp4", "imp5"];

export const DIFFERENTIAL_ITEMS = {
  anxiety: { questions: ["d1"], label: "Anxiety", desc: "Anxiety can cause restlessness, poor concentration, and difficulty finishing tasks — all of which overlap heavily with ADHD. They also frequently co-occur." },
  depression: { questions: ["d2"], label: "Depression", desc: "Low mood, low motivation, and 'brain fog' from depression can look very similar to inattentive ADHD. Depression is also one of the most common conditions that co-exists with ADHD." },
  sleep: { questions: ["d3"], label: "Sleep difficulties", desc: "Poor sleep alone can produce most ADHD-like symptoms — difficulty concentrating, impulsivity, emotional reactivity, and memory problems. Many people with ADHD also have sleep disorders." },
  burnout: { questions: ["d4"], label: "Burnout / exhaustion", desc: "Chronic exhaustion impairs executive function, working memory, and emotional regulation in ways that closely mimic ADHD — and burnout is also very common in people who have undiagnosed ADHD." },
  onset: { questions: ["d5"], label: "Stress-linked onset", desc: "If your focus problems started or worsened after a stressful period, it's worth considering whether trauma, grief, or chronic stress could be a factor — either instead of, or in addition to, ADHD." },
};

export const FREQUENCY_OPTIONS = [
  { value: 0, label: "Never" }, { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" }, { value: 3, label: "Often" }, { value: 4, label: "Always" },
];

export const GENDER_OPTIONS = ["Man", "Woman", "Non-binary / other", "Prefer not to say"];
export const AGE_OPTIONS = ["Under 18", "18–25", "26–35", "36–45", "46–55", "56+"];

export const SECTIONS = [
  { id: "intro", type: "intro" },
  { id: "context", type: "context" },
  {
    id: "childhood", type: "questions", label: "PART ONE", title: "Growing Up",
    subtitle: "Think back to before you were 12. Try to remember how things felt then, not how you think they \"should\" have been.",
    questions: [
      { id: "c1", text: "As a child, I was often described as 'spacey', 'in my own world', or daydreaming", cluster: "inattentive" },
      { id: "c2", text: "I struggled to sit still, often fidgeting, tapping, or feeling restless", cluster: "hyperactive" },
      { id: "c3", text: "I would blurt things out, act before thinking, or have trouble waiting my turn", cluster: "impulsive" },
      { id: "c4", text: "I had difficulty finishing homework, chores, or tasks — even when I really wanted to", cluster: "inattentive" },
      { id: "c5", text: "I lost things constantly (toys, school supplies, belongings) or forgot them", cluster: "inattentive" },
      { id: "c6", text: "When something excited me, I could focus on it for hours — but 'boring' things felt impossible", cluster: "hyperfocus" },
    ],
  },
  {
    id: "present_attention", type: "questions", label: "PART TWO", title: "Focus & Attention",
    subtitle: "Think about the past 6 months. How often do these things happen to you?",
    questions: [
      { id: "a1", text: "I start tasks but struggle to see them through to the end", cluster: "inattentive" },
      { id: "a2", text: "I miss details or make careless mistakes, even in things I care about", cluster: "inattentive" },
      { id: "a3", text: "My mind wanders during conversations, meetings, or while reading", cluster: "inattentive" },
      { id: "a4", text: "I struggle to organise tasks, projects, or belongings", cluster: "inattentive" },
      { id: "a5", text: "I lose things I need regularly (keys, phone, wallet, documents)", cluster: "inattentive" },
      { id: "a6", text: "I avoid tasks that require sustained mental effort, even when they matter to me", cluster: "inattentive" },
      { id: "a7", text: "I forget appointments, commitments, or things I've promised to do — even important ones", cluster: "inattentive" },
    ],
  },
  { id: "encourage1", type: "encourage", stage: "early" },
  {
    id: "present_energy", type: "questions", label: "PART THREE", title: "Energy & Impulse",
    subtitle: "Still thinking about the past 6 months...",
    questions: [
      { id: "e1", text: "I feel restless or 'driven by a motor' — an internal hum that's hard to switch off", cluster: "hyperactive" },
      { id: "e2", text: "I talk more than others, interrupt, or finish people's sentences", cluster: "impulsive" },
      { id: "e3", text: "I act on impulse — buying things, saying things, making decisions before fully thinking", cluster: "impulsive" },
      { id: "e4", text: "I find it hard to wait — in queues, in conversations, for anything", cluster: "impulsive" },
      { id: "e5", text: "Even when sitting still, my mind races or I fidget internally", cluster: "hyperactive" },
      { id: "e6", text: "I do risky or exciting things just to feel something, or to escape boredom", cluster: "impulsive" },
    ],
  },
  {
    id: "masking", type: "questions", label: "PART FOUR", title: "Coping & Masking",
    subtitle: "This section matters a lot — especially for people who've learned to 'pass' as neurotypical. Be honest with yourself.",
    questions: [
      { id: "m1", text: "I work much harder than others seem to, just to achieve the same results", cluster: "masking" },
      { id: "m2", text: "By the end of the day, I feel exhausted from the effort of appearing 'normal' or 'on top of things'", cluster: "masking" },
      { id: "m3", text: "I've developed elaborate systems (lists, alarms, rituals) to manage what others seem to do effortlessly", cluster: "masking" },
      { id: "m4", text: "I feel like I'm hiding something — that if people knew how chaotic my inner world was, they'd be surprised", cluster: "masking" },
      { id: "m5", text: "I've been told I'm 'so organised' or 'so capable' — when underneath, I'm barely holding it together", cluster: "masking" },
    ],
  },
  {
    id: "emotional", type: "questions", label: "PART FIVE", title: "Emotions & Relationships",
    subtitle: "ADHD affects far more than just attention. These experiences are often overlooked.",
    questions: [
      { id: "em1", text: "I feel emotions more intensely than other people seem to — highs and lows hit hard", cluster: "emotional" },
      { id: "em2", text: "Criticism — even mild — can feel devastating and stay with me for hours or days", cluster: "emotional" },
      { id: "em3", text: "I get deeply absorbed in things I love (hyperfocus) and lose all track of time", cluster: "hyperfocus" },
      { id: "em4", text: "I struggle with time — always running late, misjudging how long things take", cluster: "executive" },
      { id: "em5", text: "I procrastinate — not out of laziness, but from something that feels like paralysis", cluster: "executive" },
      { id: "em6", text: "I have a strong sense of justice and feel deeply bothered by unfairness", cluster: "emotional" },
    ],
  },
  {
    id: "impact", type: "questions", label: "PART SIX", title: "How Much Does It Affect You?",
    subtitle: "ADHD isn't just about symptoms — it's about how much they get in the way of your life. Think about the past 6 months.",
    questions: [
      { id: "imp1", text: "These difficulties have affected my performance at work or school", cluster: "impairment" },
      { id: "imp2", text: "These difficulties have caused problems in my close relationships (partner, family, friends)", cluster: "impairment" },
      { id: "imp3", text: "These difficulties have affected my ability to manage money, paperwork, or household responsibilities", cluster: "impairment" },
      { id: "imp4", text: "These difficulties make me feel bad about myself — frustrated, ashamed, or like I'm underperforming", cluster: "impairment" },
      { id: "imp5", text: "I feel like I'm not living up to my potential because of these difficulties", cluster: "impairment" },
    ],
  },
  { id: "encourage2", type: "encourage", stage: "late" },
  {
    id: "differential", type: "questions", label: "PART SEVEN", title: "The Bigger Picture",
    subtitle: "These questions help us check whether something else — or something additional — might be going on.",
    questions: [
      { id: "d1", text: "I frequently feel anxious, worried, or on edge — even when there's no obvious reason", cluster: "diff_anxiety" },
      { id: "d2", text: "I've felt persistently low, flat, or hopeless for weeks at a time", cluster: "diff_depression" },
      { id: "d3", text: "I regularly struggle to fall asleep, stay asleep, or wake up feeling rested", cluster: "diff_sleep" },
      { id: "d4", text: "I feel emotionally or physically exhausted most of the time — like I'm running on empty", cluster: "diff_burnout" },
      { id: "d5", text: "My focus and concentration problems started or got significantly worse after a stressful or traumatic period", cluster: "diff_onset" },
    ],
  },
  { id: "results", type: "results" },
];

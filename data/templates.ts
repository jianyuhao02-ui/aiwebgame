export type Template = {
  id: string;
  title: string;
  description: string;
  content: string;
}

export const templates: Template[] = [
  {
    id: 'joke-1',
    title: '幽默短笑话',
    description: '快速生成一则两段笑话，轻松有趣',
    content: '请用亲切幽默的口吻写一个两段笑话，主题是猫和咖啡。每段不超过两句话。'
  },
  {
    id: 'poem-1',
    title: '温暖小诗',
    description: '写一首两行的小诗，适合发朋友圈',
    content: '请写一首两行的小诗，风格温暖、简洁，适合配上日常照片。'
  },
  {
    id: 'advice-1',
    title: '简短鼓励',
    description: '给出一句鼓励与一条小建议',
    content: '请用温暖鼓励的口吻，给出一句安慰并提供一条可行的小建议，长度控制在一到两句话。'
  },
  {
    id: 'story-1',
    title: '微型故事',
    description: '生成一个 3-4 句的微型故事，带有反转',
    content: '请写一个 3 到 4 句的微型故事，包含一个小小反转，适合朗读。'
  }
]

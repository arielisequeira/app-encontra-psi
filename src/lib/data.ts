import { TherapyInfo, QuizQuestion, Psychologist } from './types';

export const therapyApproaches: Record<string, TherapyInfo> = {
  psicanalise: {
    id: 'psicanalise',
    name: 'Psicanálise',
    description: 'Explora o inconsciente e a história de vida para compreender traumas e padrões profundos.',
    detailedDescription: `A Psicanálise é uma abordagem terapêutica criada por Sigmund Freud que investiga o inconsciente humano. Esta técnica busca compreender como experiências passadas, especialmente da infância, influenciam nossos comportamentos, pensamentos e emoções atuais.

**Como funciona:**
O processo psicanalítico utiliza técnicas como a livre associação, onde o paciente é encorajado a falar livremente sobre seus pensamentos, sonhos e memórias. O terapeuta atua como um facilitador, ajudando a interpretar e compreender os conteúdos inconscientes que emergem durante as sessões.

**Para quem é indicada:**
- Pessoas que desejam compreender profundamente suas motivações e padrões de comportamento
- Quem busca trabalhar traumas e experiências do passado
- Indivíduos interessados em autoconhecimento profundo
- Pessoas com questões relacionadas a ansiedade, depressão e conflitos internos

**Benefícios:**
- Autoconhecimento profundo
- Compreensão de padrões repetitivos
- Resolução de conflitos internos
- Elaboração de traumas
- Desenvolvimento da capacidade de reflexão`,
    color: 'from-purple-500 to-indigo-600',
    icon: '🧠'
  },
  sistemica: {
    id: 'sistemica',
    name: 'Terapia Sistêmica',
    description: 'Foca nas relações e padrões familiares, entendendo o indivíduo dentro de seus sistemas.',
    detailedDescription: `A Terapia Sistêmica compreende o indivíduo como parte de sistemas relacionais (família, trabalho, amigos). Esta abordagem analisa como os padrões de comunicação e interação afetam o bem-estar individual e coletivo.

**Como funciona:**
O terapeuta sistêmico observa as dinâmicas relacionais e os padrões de comunicação dentro dos sistemas dos quais o paciente faz parte. O foco está em identificar e modificar padrões disfuncionais que perpetuam problemas.

**Para quem é indicada:**
- Casais com dificuldades de relacionamento
- Famílias em conflito
- Pessoas com problemas de comunicação
- Quem deseja melhorar suas relações interpessoais
- Indivíduos que enfrentam dificuldades em contextos relacionais

**Benefícios:**
- Melhoria na comunicação
- Resolução de conflitos familiares
- Compreensão de padrões relacionais
- Fortalecimento de vínculos
- Desenvolvimento de habilidades interpessoais`,
    color: 'from-blue-500 to-cyan-600',
    icon: '👥'
  },
  gestalt: {
    id: 'gestalt',
    name: 'Gestalt-Terapia',
    description: 'Trabalha o aqui e agora, focando na consciência presente e na experiência imediata.',
    detailedDescription: `A Gestalt-Terapia é uma abordagem humanista que enfatiza a consciência do momento presente. Desenvolvida por Fritz Perls, esta técnica valoriza a experiência direta e a responsabilidade pessoal.

**Como funciona:**
O terapeuta gestáltico utiliza técnicas experienciais e criativas para aumentar a consciência do paciente sobre seus sentimentos, pensamentos e comportamentos no momento presente. O foco está no "aqui e agora", não apenas em falar sobre problemas, mas em vivenciá-los na sessão.

**Para quem é indicada:**
- Pessoas que desejam viver de forma mais consciente e presente
- Quem busca desenvolver autenticidade e responsabilidade pessoal
- Indivíduos interessados em técnicas práticas e experienciais
- Pessoas que querem trabalhar questões emocionais de forma direta
- Quem busca integração entre pensamento, sentimento e ação

**Benefícios:**
- Maior consciência de si mesmo
- Desenvolvimento de autenticidade
- Melhoria na expressão emocional
- Responsabilização pelas próprias escolhas
- Integração de aspectos fragmentados da personalidade`,
    color: 'from-green-500 to-emerald-600',
    icon: '🎯'
  },
  humanista: {
    id: 'humanista',
    name: 'Abordagem Humanista',
    description: 'Oferece acolhimento profundo e valoriza a experiência pessoal única de cada indivíduo.',
    detailedDescription: `A Abordagem Humanista, desenvolvida por Carl Rogers, centra-se na pessoa e em seu potencial de crescimento. Esta perspectiva acredita na capacidade inata do ser humano de se desenvolver de forma saudável quando em um ambiente acolhedor e empático.

**Como funciona:**
O terapeuta humanista oferece um ambiente de aceitação incondicional, empatia e autenticidade. O foco está em criar um espaço seguro onde o paciente possa explorar seus sentimentos e experiências sem julgamento, facilitando o autoconhecimento e o crescimento pessoal.

**Para quem é indicada:**
- Pessoas que buscam acolhimento e compreensão profunda
- Quem deseja desenvolver autoestima e autoconfiança
- Indivíduos em busca de autoconhecimento e crescimento pessoal
- Pessoas que valorizam uma relação terapêutica empática e genuína
- Quem enfrenta questões existenciais e de sentido de vida

**Benefícios:**
- Desenvolvimento da autoestima
- Maior autoconhecimento
- Aceitação de si mesmo
- Crescimento pessoal
- Desenvolvimento do potencial humano`,
    color: 'from-pink-500 to-rose-600',
    icon: '💝'
  },
  tcc: {
    id: 'tcc',
    name: 'TCC',
    description: 'Terapia Cognitivo-Comportamental: trabalha com metas, pensamentos e mudança de comportamentos.',
    detailedDescription: `A Terapia Cognitivo-Comportamental (TCC) é uma abordagem estruturada e focada em objetivos que trabalha a relação entre pensamentos, emoções e comportamentos. Desenvolvida por Aaron Beck, é uma das abordagens mais pesquisadas e com eficácia comprovada cientificamente.

**Como funciona:**
O terapeuta e o paciente trabalham em colaboração para identificar pensamentos disfuncionais e padrões de comportamento problemáticos. Através de técnicas práticas e exercícios, busca-se modificar esses padrões, desenvolvendo formas mais adaptativas de pensar e agir.

**Para quem é indicada:**
- Pessoas com transtornos de ansiedade, depressão, TOC e fobias
- Quem busca resultados práticos e mensuráveis
- Indivíduos que preferem uma abordagem estruturada e diretiva
- Pessoas interessadas em técnicas e exercícios práticos
- Quem deseja trabalhar com metas específicas e prazos definidos

**Benefícios:**
- Redução de sintomas de ansiedade e depressão
- Desenvolvimento de habilidades de enfrentamento
- Mudança de padrões de pensamento negativos
- Resultados em curto/médio prazo
- Técnicas práticas para uso no dia a dia`,
    color: 'from-orange-500 to-amber-600',
    icon: '📊'
  },
  grupo: {
    id: 'grupo',
    name: 'Terapia em Grupo',
    description: 'Promove trocas e reflexão coletiva, aprendendo através das experiências compartilhadas.',
    detailedDescription: `A Terapia em Grupo é uma modalidade terapêutica onde um grupo de pessoas se reúne regularmente com um ou mais terapeutas para trabalhar questões pessoais e interpessoais. O grupo torna-se um espaço de apoio mútuo e aprendizado coletivo.

**Como funciona:**
Os participantes compartilham suas experiências, sentimentos e desafios em um ambiente seguro e confidencial. O terapeuta facilita as interações, promovendo reflexões e insights. O grupo oferece diferentes perspectivas e apoio mútuo, criando um senso de pertencimento e compreensão.

**Para quem é indicada:**
- Pessoas que se beneficiam de apoio social e compartilhamento de experiências
- Quem deseja desenvolver habilidades sociais e de comunicação
- Indivíduos que enfrentam questões comuns (luto, dependência, ansiedade social)
- Pessoas que buscam uma alternativa mais acessível financeiramente
- Quem valoriza aprender com as experiências de outros

**Benefícios:**
- Senso de pertencimento e redução do isolamento
- Aprendizado através das experiências de outros
- Desenvolvimento de habilidades sociais
- Apoio mútuo e validação
- Custo mais acessível que terapia individual`,
    color: 'from-teal-500 to-cyan-600',
    icon: '🤝'
  }
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Quando você pensa em fazer terapia, o que mais te atrai?',
    options: [
      { id: 'a', text: 'Entender de onde vêm meus sentimentos e comportamentos.', approach: 'psicanalise' },
      { id: 'b', text: 'Melhorar minha comunicação e convivência.', approach: 'sistemica' },
      { id: 'c', text: 'Me conhecer melhor no momento presente.', approach: 'gestalt' },
      { id: 'd', text: 'Ser ouvido e acolhido.', approach: 'humanista' },
      { id: 'e', text: 'Mudar padrões de pensamento e comportamento.', approach: 'tcc' },
      { id: 'f', text: 'Compartilhar vivências e aprender com outras pessoas.', approach: 'grupo' }
    ]
  },
  {
    id: 2,
    question: 'Quando você enfrenta um problema, o que costuma te ajudar mais?',
    options: [
      { id: 'a', text: 'Refletir sobre o passado.', approach: 'psicanalise' },
      { id: 'b', text: 'Ajustar minhas relações.', approach: 'sistemica' },
      { id: 'c', text: 'Observar como me sinto no agora.', approach: 'gestalt' },
      { id: 'd', text: 'Ser acolhido emocionalmente.', approach: 'humanista' },
      { id: 'e', text: 'Buscar soluções práticas.', approach: 'tcc' },
      { id: 'f', text: 'Conversar com pessoas com experiências parecidas.', approach: 'grupo' }
    ]
  },
  {
    id: 3,
    question: 'Como você gosta que o terapeuta conduza as sessões?',
    options: [
      { id: 'a', text: 'Explorando minha história e emoções profundas.', approach: 'psicanalise' },
      { id: 'b', text: 'Entendendo como minhas relações influenciam minha vida.', approach: 'sistemica' },
      { id: 'c', text: 'Usando técnicas práticas no presente.', approach: 'gestalt' },
      { id: 'd', text: 'Oferecendo acolhimento e empatia.', approach: 'humanista' },
      { id: 'e', text: 'Sendo direto, com metas e exercícios.', approach: 'tcc' },
      { id: 'f', text: 'Facilitando conversas com outras pessoas.', approach: 'grupo' }
    ]
  },
  {
    id: 4,
    question: 'Como você reage a situações emocionais intensas?',
    options: [
      { id: 'a', text: 'Procuro entender o que isso revela sobre mim.', approach: 'psicanalise' },
      { id: 'b', text: 'Tento entender o impacto nas minhas relações.', approach: 'sistemica' },
      { id: 'c', text: 'Observo como estou me sentindo naquele instante.', approach: 'gestalt' },
      { id: 'd', text: 'Acolho minhas emoções.', approach: 'humanista' },
      { id: 'e', text: 'Procuro soluções práticas.', approach: 'tcc' },
      { id: 'f', text: 'Gosto de trocar experiências com outras pessoas.', approach: 'grupo' }
    ]
  },
  {
    id: 5,
    question: 'O que você espera alcançar com a terapia?',
    options: [
      { id: 'a', text: 'Entender traumas e padrões.', approach: 'psicanalise' },
      { id: 'b', text: 'Melhorar convívio familiar/relacional.', approach: 'sistemica' },
      { id: 'c', text: 'Viver mais presente e consciente.', approach: 'gestalt' },
      { id: 'd', text: 'Me compreender e ter bem-estar.', approach: 'humanista' },
      { id: 'e', text: 'Controlar pensamentos e mudar atitudes.', approach: 'tcc' },
      { id: 'f', text: 'Crescer junto de um grupo.', approach: 'grupo' }
    ]
  },
  {
    id: 6,
    question: 'Que tipo de ambiente te faz sentir melhor?',
    options: [
      { id: 'a', text: 'Reservado e reflexivo.', approach: 'psicanalise' },
      { id: 'b', text: 'Dinâmico, envolvendo interações.', approach: 'sistemica' },
      { id: 'c', text: 'Prático e experimental.', approach: 'gestalt' },
      { id: 'd', text: 'Acolhedor e leve.', approach: 'humanista' },
      { id: 'e', text: 'Focado e estruturado.', approach: 'tcc' },
      { id: 'f', text: 'Grupo conversando e trocando vivências.', approach: 'grupo' }
    ]
  },
  {
    id: 7,
    question: 'Você se identifica mais com qual frase?',
    options: [
      { id: 'a', text: 'Quero entender a mim mesmo em profundidade.', approach: 'psicanalise' },
      { id: 'b', text: 'Quero melhorar relações.', approach: 'sistemica' },
      { id: 'c', text: 'Quero viver o presente.', approach: 'gestalt' },
      { id: 'd', text: 'Quero me aceitar.', approach: 'humanista' },
      { id: 'e', text: 'Quero mudar pensamentos e atitudes.', approach: 'tcc' },
      { id: 'f', text: 'Quero aprender com o grupo.', approach: 'grupo' }
    ]
  }
];

export const mockPsychologists: Psychologist[] = [
  {
    id: '1',
    name: 'Dra. Ana Paula Silva',
    crp: 'CRP 06/123456',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    approaches: ['psicanalise', 'humanista'],
    specialties: ['Ansiedade', 'Depressão', 'Traumas'],
    bio: 'Psicóloga clínica com 15 anos de experiência em psicanálise. Especialista em atendimento de adultos e adolescentes.',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Pinheiros',
    modality: ['online', 'presencial'],
    priceRange: 'R$ 150 - R$ 200',
    rating: 4.9,
    reviewCount: 127,
    availability: ['Seg', 'Qua', 'Sex'],
    subscriptionStatus: 'active',
    subscriptionPlan: 'monthly',
    subscriptionExpiry: '2024-12-31',
    documentsValidated: true
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendes',
    crp: 'CRP 01/234567',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    approaches: ['tcc'],
    specialties: ['TOC', 'Fobias', 'Ansiedade'],
    bio: 'Especialista em Terapia Cognitivo-Comportamental com foco em transtornos de ansiedade e comportamentos compulsivos.',
    city: 'Rio de Janeiro',
    state: 'RJ',
    neighborhood: 'Copacabana',
    modality: ['online', 'presencial'],
    priceRange: 'R$ 180 - R$ 250',
    rating: 4.8,
    reviewCount: 89,
    availability: ['Ter', 'Qui', 'Sáb'],
    subscriptionStatus: 'active',
    subscriptionPlan: 'monthly',
    subscriptionExpiry: '2024-12-31',
    documentsValidated: true
  },
  {
    id: '3',
    name: 'Dra. Mariana Costa',
    crp: 'CRP 03/345678',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    approaches: ['sistemica', 'grupo'],
    specialties: ['Terapia Familiar', 'Relacionamentos', 'Conflitos'],
    bio: 'Terapeuta sistêmica e facilitadora de grupos terapêuticos. Trabalho com famílias e casais há 10 anos.',
    city: 'Belo Horizonte',
    state: 'MG',
    neighborhood: 'Savassi',
    modality: ['online', 'presencial'],
    priceRange: 'R$ 140 - R$ 180',
    rating: 4.9,
    reviewCount: 156,
    availability: ['Seg', 'Ter', 'Qui', 'Sex'],
    subscriptionStatus: 'active',
    subscriptionPlan: 'monthly',
    subscriptionExpiry: '2024-12-31',
    documentsValidated: true
  },
  {
    id: '4',
    name: 'Dr. Rafael Oliveira',
    crp: 'CRP 08/456789',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    approaches: ['gestalt'],
    specialties: ['Autoconhecimento', 'Mindfulness', 'Estresse'],
    bio: 'Gestalt-terapeuta focado em técnicas de presença e consciência corporal. Integro práticas de mindfulness.',
    city: 'Curitiba',
    state: 'PR',
    neighborhood: 'Batel',
    modality: ['online'],
    priceRange: 'R$ 120 - R$ 160',
    rating: 4.7,
    reviewCount: 73,
    availability: ['Qua', 'Qui', 'Sex', 'Sáb'],
    subscriptionStatus: 'active',
    subscriptionPlan: 'monthly',
    subscriptionExpiry: '2024-12-31',
    documentsValidated: true
  },
  {
    id: '5',
    name: 'Dra. Juliana Ferreira',
    crp: 'CRP 02/567890',
    photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop',
    approaches: ['humanista', 'gestalt'],
    specialties: ['Autoestima', 'Luto', 'Transições de Vida'],
    bio: 'Abordagem centrada na pessoa com foco em acolhimento e desenvolvimento do potencial humano.',
    city: 'Porto Alegre',
    state: 'RS',
    neighborhood: 'Moinhos de Vento',
    modality: ['online', 'presencial'],
    priceRange: 'R$ 130 - R$ 170',
    rating: 5.0,
    reviewCount: 94,
    availability: ['Seg', 'Qua', 'Sex'],
    subscriptionStatus: 'active',
    subscriptionPlan: 'monthly',
    subscriptionExpiry: '2024-12-31',
    documentsValidated: true
  },
  {
    id: '6',
    name: 'Dr. Pedro Santos',
    crp: 'CRP 04/678901',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    approaches: ['grupo', 'tcc'],
    specialties: ['Dependência Química', 'Grupos Terapêuticos', 'Habilidades Sociais'],
    bio: 'Coordeno grupos terapêuticos e trabalho com técnicas cognitivo-comportamentais em contexto grupal.',
    city: 'Brasília',
    state: 'DF',
    neighborhood: 'Asa Sul',
    modality: ['presencial'],
    priceRange: 'R$ 100 - R$ 140',
    rating: 4.8,
    reviewCount: 112,
    availability: ['Ter', 'Qui', 'Sáb'],
    subscriptionStatus: 'active',
    subscriptionPlan: 'monthly',
    subscriptionExpiry: '2024-12-31',
    documentsValidated: true
  }
];

export const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

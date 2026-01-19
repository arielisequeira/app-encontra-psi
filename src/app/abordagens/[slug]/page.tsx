'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Users } from 'lucide-react';
import { therapyApproaches } from '@/lib/data';
import { TherapyApproach } from '@/lib/types';

export default function AbordagemPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as TherapyApproach;
  
  const therapy = therapyApproaches[slug];

  if (!therapy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Abordagem não encontrada</h2>
          <p className="text-gray-600 mb-6">A abordagem que você está procurando não existe.</p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  // Conteúdo específico para cada abordagem
  const approachContent: Record<TherapyApproach, {
    subtitle: string;
    whatIs: string[];
    forWho: string[];
    howWorks: {
      sessions: string;
      style: string;
      frequency: string;
      approach: string;
    };
    benefits: string[];
  }> = {
    psicanalise: {
      subtitle: "Entenda como essa terapia funciona",
      whatIs: [
        "A Psicanálise é uma abordagem terapêutica criada por Sigmund Freud que investiga o inconsciente humano, buscando compreender como experiências passadas, especialmente da infância, influenciam nossos comportamentos, pensamentos e emoções atuais.",
        "O processo terapêutico acontece por meio da fala livre, onde o paciente é encorajado a expressar seus pensamentos, sonhos e memórias sem censura. O terapeuta atua como um facilitador, ajudando a interpretar e compreender os conteúdos inconscientes que emergem durante as sessões.",
        "Esta abordagem explora traumas, padrões repetitivos e conflitos internos, promovendo um autoconhecimento profundo através da reflexão sobre a própria história de vida."
      ],
      forWho: [
        "Pessoas que querem entender padrões emocionais e comportamentais",
        "Quem sente que repete comportamentos sem saber por quê",
        "Quem busca autoconhecimento profundo",
        "Pessoas interessadas em trabalhar traumas e experiências do passado",
        "Indivíduos com questões relacionadas a ansiedade, depressão e conflitos internos"
      ],
      howWorks: {
        sessions: "As sessões são conduzidas de forma livre, onde o paciente fala sobre o que vier à mente",
        style: "Reflexiva e interpretativa, com foco na compreensão profunda",
        frequency: "Geralmente 1 a 3 vezes por semana, com duração de 45-50 minutos",
        approach: "O terapeuta mantém uma postura neutra, facilitando a livre associação e interpretação"
      },
      benefits: [
        "Maior compreensão emocional e autoconhecimento profundo",
        "Identificação e mudança de padrões repetitivos",
        "Resolução de conflitos internos e elaboração de traumas",
        "Melhora nos relacionamentos interpessoais",
        "Desenvolvimento da capacidade de reflexão e insight"
      ]
    },
    sistemica: {
      subtitle: "Descubra como melhorar suas relações",
      whatIs: [
        "A Terapia Sistêmica compreende o indivíduo como parte de sistemas relacionais (família, trabalho, amigos). Esta abordagem analisa como os padrões de comunicação e interação afetam o bem-estar individual e coletivo.",
        "O foco está em identificar e modificar padrões disfuncionais que perpetuam problemas nas relações. O terapeuta observa as dinâmicas relacionais e ajuda a criar novas formas de comunicação mais saudáveis.",
        "Esta terapia é especialmente eficaz para questões familiares e de relacionamento, pois trabalha com a compreensão de que mudanças em um membro do sistema afetam todo o conjunto."
      ],
      forWho: [
        "Casais com dificuldades de relacionamento",
        "Famílias em conflito",
        "Pessoas com problemas de comunicação",
        "Quem deseja melhorar suas relações interpessoais",
        "Indivíduos que enfrentam dificuldades em contextos relacionais"
      ],
      howWorks: {
        sessions: "As sessões podem ser individuais, em casal ou em família",
        style: "Dinâmica e interativa, focada em padrões relacionais",
        frequency: "Geralmente 1 vez por semana, com duração de 50-60 minutos",
        approach: "O terapeuta atua como facilitador das interações, promovendo reflexões sobre os padrões"
      },
      benefits: [
        "Melhoria significativa na comunicação",
        "Resolução de conflitos familiares e relacionais",
        "Compreensão de padrões relacionais disfuncionais",
        "Fortalecimento de vínculos afetivos",
        "Desenvolvimento de habilidades interpessoais"
      ]
    },
    gestalt: {
      subtitle: "Viva o presente com mais consciência",
      whatIs: [
        "A Gestalt-Terapia é uma abordagem humanista que enfatiza a consciência do momento presente. Desenvolvida por Fritz Perls, esta técnica valoriza a experiência direta e a responsabilidade pessoal.",
        "O foco está no 'aqui e agora', não apenas em falar sobre problemas, mas em vivenciá-los na sessão através de técnicas experienciais e criativas que aumentam a consciência sobre sentimentos, pensamentos e comportamentos.",
        "Esta abordagem trabalha com a integração de aspectos fragmentados da personalidade, promovendo autenticidade e responsabilização pelas próprias escolhas."
      ],
      forWho: [
        "Pessoas que desejam viver de forma mais consciente e presente",
        "Quem busca desenvolver autenticidade e responsabilidade pessoal",
        "Indivíduos interessados em técnicas práticas e experienciais",
        "Pessoas que querem trabalhar questões emocionais de forma direta",
        "Quem busca integração entre pensamento, sentimento e ação"
      ],
      howWorks: {
        sessions: "As sessões utilizam técnicas práticas e exercícios experienciais",
        style: "Prática e vivencial, com foco no momento presente",
        frequency: "Geralmente 1 vez por semana, com duração de 50 minutos",
        approach: "O terapeuta é ativo e propõe experimentos para aumentar a consciência"
      },
      benefits: [
        "Maior consciência de si mesmo e do momento presente",
        "Desenvolvimento de autenticidade e espontaneidade",
        "Melhoria na expressão emocional",
        "Responsabilização pelas próprias escolhas",
        "Integração de aspectos fragmentados da personalidade"
      ]
    },
    humanista: {
      subtitle: "Encontre acolhimento e crescimento pessoal",
      whatIs: [
        "A Abordagem Humanista, desenvolvida por Carl Rogers, centra-se na pessoa e em seu potencial de crescimento. Esta perspectiva acredita na capacidade inata do ser humano de se desenvolver de forma saudável quando em um ambiente acolhedor e empático.",
        "O terapeuta oferece um ambiente de aceitação incondicional, empatia e autenticidade. O foco está em criar um espaço seguro onde o paciente possa explorar seus sentimentos e experiências sem julgamento.",
        "Esta abordagem facilita o autoconhecimento e o crescimento pessoal através de uma relação terapêutica genuína e empática, valorizando a experiência única de cada indivíduo."
      ],
      forWho: [
        "Pessoas que buscam acolhimento e compreensão profunda",
        "Quem deseja desenvolver autoestima e autoconfiança",
        "Indivíduos em busca de autoconhecimento e crescimento pessoal",
        "Pessoas que valorizam uma relação terapêutica empática e genuína",
        "Quem enfrenta questões existenciais e de sentido de vida"
      ],
      howWorks: {
        sessions: "As sessões são centradas no cliente, seguindo seu ritmo e necessidades",
        style: "Acolhedora e empática, sem julgamentos",
        frequency: "Geralmente 1 vez por semana, com duração de 50 minutos",
        approach: "O terapeuta oferece aceitação incondicional, empatia e autenticidade"
      },
      benefits: [
        "Desenvolvimento da autoestima e autoconfiança",
        "Maior autoconhecimento e aceitação de si mesmo",
        "Crescimento pessoal e realização do potencial",
        "Melhoria no bem-estar emocional",
        "Desenvolvimento de relações mais autênticas"
      ]
    },
    tcc: {
      subtitle: "Alcance resultados práticos e mensuráveis",
      whatIs: [
        "A Terapia Cognitivo-Comportamental (TCC) é uma abordagem estruturada e focada em objetivos que trabalha a relação entre pensamentos, emoções e comportamentos. Desenvolvida por Aaron Beck, é uma das abordagens mais pesquisadas e com eficácia comprovada cientificamente.",
        "O terapeuta e o paciente trabalham em colaboração para identificar pensamentos disfuncionais e padrões de comportamento problemáticos. Através de técnicas práticas e exercícios, busca-se modificar esses padrões.",
        "Esta abordagem desenvolve formas mais adaptativas de pensar e agir, com foco em resultados práticos e mensuráveis em curto e médio prazo."
      ],
      forWho: [
        "Pessoas com transtornos de ansiedade, depressão, TOC e fobias",
        "Quem busca resultados práticos e mensuráveis",
        "Indivíduos que preferem uma abordagem estruturada e diretiva",
        "Pessoas interessadas em técnicas e exercícios práticos",
        "Quem deseja trabalhar com metas específicas e prazos definidos"
      ],
      howWorks: {
        sessions: "As sessões são estruturadas com agenda definida e tarefas de casa",
        style: "Prática e diretiva, focada em metas e resultados",
        frequency: "Geralmente 1 vez por semana, com duração de 50 minutos",
        approach: "O terapeuta é colaborativo, ensinando técnicas e propondo exercícios práticos"
      },
      benefits: [
        "Redução significativa de sintomas de ansiedade e depressão",
        "Desenvolvimento de habilidades de enfrentamento",
        "Mudança de padrões de pensamento negativos",
        "Resultados visíveis em curto/médio prazo",
        "Técnicas práticas para uso no dia a dia"
      ]
    },
    grupo: {
      subtitle: "Cresça através do compartilhamento",
      whatIs: [
        "A Terapia em Grupo é uma modalidade terapêutica onde um grupo de pessoas se reúne regularmente com um ou mais terapeutas para trabalhar questões pessoais e interpessoais. O grupo torna-se um espaço de apoio mútuo e aprendizado coletivo.",
        "Os participantes compartilham suas experiências, sentimentos e desafios em um ambiente seguro e confidencial. O terapeuta facilita as interações, promovendo reflexões e insights.",
        "O grupo oferece diferentes perspectivas e apoio mútuo, criando um senso de pertencimento e compreensão. É uma oportunidade de aprender com as experiências de outros e desenvolver habilidades sociais."
      ],
      forWho: [
        "Pessoas que se beneficiam de apoio social e compartilhamento de experiências",
        "Quem deseja desenvolver habilidades sociais e de comunicação",
        "Indivíduos que enfrentam questões comuns (luto, dependência, ansiedade social)",
        "Pessoas que buscam uma alternativa mais acessível financeiramente",
        "Quem valoriza aprender com as experiências de outros"
      ],
      howWorks: {
        sessions: "As sessões são realizadas com 6-12 participantes em média",
        style: "Interativa e colaborativa, com compartilhamento de experiências",
        frequency: "Geralmente 1 vez por semana, com duração de 90-120 minutos",
        approach: "O terapeuta facilita as interações e promove reflexões coletivas"
      },
      benefits: [
        "Senso de pertencimento e redução do isolamento",
        "Aprendizado através das experiências de outros",
        "Desenvolvimento de habilidades sociais",
        "Apoio mútuo e validação emocional",
        "Custo mais acessível que terapia individual"
      ]
    }
  };

  const content = approachContent[slug];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="mb-6 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Button>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 sm:p-12 bg-white/90 backdrop-blur-sm shadow-xl mb-8">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 bg-gradient-to-br ${therapy.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg`}>
                {therapy.icon}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
                {therapy.name}
              </h1>
              <p className="text-lg text-gray-600">
                {content.subtitle}
              </p>
            </div>

            {/* O que é essa abordagem */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${therapy.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                  1
                </div>
                O que é {therapy.name}?
              </h2>
              <div className="space-y-4">
                {content.whatIs.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Para quem é indicada */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${therapy.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                  2
                </div>
                Para quem essa terapia é indicada
              </h2>
              <div className="space-y-3">
                {content.forWho.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Como funciona na prática */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${therapy.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                  3
                </div>
                Como funciona na prática
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2">📋 Como são as sessões</h3>
                  <p className="text-sm text-gray-700">{content.howWorks.sessions}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Estilo do terapeuta</h3>
                  <p className="text-sm text-gray-700">{content.howWorks.style}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-gray-800 mb-2">📅 Frequência comum</h3>
                  <p className="text-sm text-gray-700">{content.howWorks.frequency}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-gray-800 mb-2">💬 Abordagem</h3>
                  <p className="text-sm text-gray-700">{content.howWorks.approach}</p>
                </div>
              </div>
            </section>

            {/* Benefícios */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${therapy.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                  4
                </div>
                Benefícios
              </h2>
              <div className="space-y-3">
                {content.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="mt-12 p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Pronto para começar?
              </h3>
              <p className="text-gray-700 mb-6">
                Encontre psicólogos especializados em {therapy.name} na sua região
              </p>
              <Button
                onClick={() => router.push('/find-psychologists')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5 mr-2" />
                Encontrar psicólogos dessa abordagem
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

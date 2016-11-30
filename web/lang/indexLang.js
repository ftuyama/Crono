/*
 * Tradução do Index
 */
indexApp.config(['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en-US', {
        'label.crono': 'Crono',
        'label.service': 'Calendar',
        'label.subtitle': 'Remembering <span class="font-semibold">yourself</span> won\'t be a problem anymore.',

        'label.icon.calendar': 'Calendar',
        'label.icon.chat': 'Chat',
        'label.icon.about': 'About Us',

        'label.section.core-services': 'Core Services',
        'label.section.core-services.description': 'The key is not to prioritize what\'s on your schedule, but to schedule your priorities. With the very best tool.',
        'label.section.google': 'Google App Integration',
        'label.section.google.description': 'Our service is directly connected with Google Services. Have the calendar always updated on Cloud.',
        'label.section.html': 'HTML5 Modern Technology',
        'label.section.html.description': 'We make use of the best web development tools available in the world: AngularJS, NodeJS, HTML5.',
        'label.section.github': 'GitHub Service',
        'label.section.github.description': 'Have your project files always in the cloud and control version with us, we use GitHub Services.',

        'label.item.calendar': 'Calendar Service',
        'label.item.calendar.description': 'We have an unique calendar service system in the web, with improved features. Enjoy it.',

        'label.item.agency': '<span>We</span> are <span>Crono</span> Unlimited Creative Web Agency',
        'label.item.agency.description': 'There is so considerable a body of knowledge bearing upon the similarities and dissimilarities of these two entities that it will be well to compare them. After such comparison one will be better able to judge of the propriety of assuming them to be subject to identical laws',
        'label.item.agency.learnmore': 'Learn More',

        'label.item.expertise': '<span>Our</span> areas of expertise',

        'label.item.why': '<span>Why</span> Use Our Service',
        'label.item.why.description': 'Crono has an unique calendar event system, capable of integrating <b>Google Calendar</b>, <b>Facebook Events</b> and its own system to provide you the best planning tool ever created.',
        'label.item.why.description2': 'We also have a chat system so that members can discuss planning meetings and events ideas. You have freely store your files, audios and pictures with us, easilly planning your life. <br><br> We have also compatibility with mobile devices and tablets, with a friendly user responsive design. I\'m glad to meet you, my dear user!',

        'label.item.version': 'A brand new Crono Version Is Cooming Soon!',
        'label.item.version.description': 'To get new Crono version subscribe now. Crono service is absolutely free for your business or personal use.',

        'label.item.contact': '<span>Contact</span> With Us',
        'label.item.contact.message': 'Send Message',
        'label.item.contact.visit': 'Visit Us',

        'label.widget.updates': 'Recent Updates',
        'label.widget.developers': 'Developers',
        'label.widget.tags': 'Tag Clouds',
        'label.widget.subscribe': 'Subscribe Us',
        'label.widget.navigate': 'Navigate',

    });

    $translateProvider.translations('pt-BR', {
        'label.crono': 'Crono',
        'label.service': 'Calendário',
        'label.subtitle': 'Se lembrar das <span class="font-semibold">tarefas</span> não é mais problema.',

        'label.icon.calendar': 'Calendário',
        'label.icon.chat': 'Chat',
        'label.icon.about': 'Sobre',

        'label.section.core-services': 'Serviços Online',
        'label.section.core-services.description': 'A chave não é priorizar seus planos, mas planejar suas prioridades. Com as ferramentas certas.',
        'label.section.google': 'Integração com Google',
        'label.section.google.description': 'Nosso serviço está diretamente conectado aos Serviços do Google. Tenha um calendário sempre atualizado nas nuvens.',
        'label.section.html': 'Tecnologias HTML5',
        'label.section.html.description': 'Nós utilizamos as melhores ferramentas web disponíveis no mercado, como AngularJS, NodeJS, HTML5',
        'label.section.github': 'Serviço GitHub',
        'label.section.github.description': 'Tenha seus arquivos de projeto sempre na nuvem com controle de versão, com serviços github.',

        'label.item.calendar': 'Serviço de Calendário',
        'label.item.calendar.description': 'Nós temos um sistema de calendário único na web, com funcionalidades aperfeiçoadas. Aproveite.',

        'label.item.agency': '<span>Nós</span> somos <span>Crono</span>, agência de criatividade na web',
        'label.item.agency.description': 'Há sempre um ponto de conhecimento apoiado nas similaridades e diferenças de duas entidades utilizando a mesma lei; Crono integra os melhores serviços de calendário em um único ponto, com funcionalidades adicionais únicas.',
        'label.item.agency.learnmore': 'Descubra',

        'label.item.expertise': '<span>Nossas</span> áreas de especialidade',

        'label.item.why': '<span>Porquê</span> usar nosso serviço',
        'label.item.why.description': 'Crono possui um sistema de calendário de eventos único, capaz de integrar o <b>Calendário Google</b>, <b>Eventos do Facebook</b> e <b>Tarefas do Athena</b> com seu sistema próprio de kanban, oferecendo a você a melhor ferramenta de planejamento disponível no mercado atual. Gratuitamente.',
        'label.item.why.description2': 'Nós possuímos ainda um sistema de chat para que membros possam discutir o seu planejamento de reuniões ou ideias de eventos. Aqui você pode armazenar os seus arquivos, fotos e áudios, facilmente, planejando sua vida com facilidade. <br><br> Nós temos ainda compatibilidade com dispositivos mobile e tablets, com um design responsivo e amigável. É um prazer conhecê-lo, meu caro usuário!',

        'label.item.version': 'Uma nova versão do Crono está chegando!',
        'label.item.version.description': 'Para ficar por dentro das novidades, inscreva-se! O serviço do Crono é absolutamente gratuito para usos pessoais ou negócios.',

        'label.item.contact': 'Entre em <span>Contato</span>',
        'label.item.contact.message': 'Enviar Mensagem',
        'label.item.contact.visit': 'Visitar',

        'label.widget.updates': 'Atualizações recentes',
        'label.widget.developers': 'Desenvolvedores',
        'label.widget.tags': 'Tags Nuvem',
        'label.widget.subscribe': 'Inscreva-se',
        'label.widget.navigate': 'Navegação',
    });

    $translateProvider.preferredLanguage('en');
}]);
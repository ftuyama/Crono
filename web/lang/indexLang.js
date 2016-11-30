/*
 * Tradução do Index
 */
indexApp.config(['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en-US', {
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

        'label.item.agency.description': 'There is so considerable a body of knowledge bearing upon the similarities and dissimilarities of these two entities that it will be well to compare them. After such comparison one will be better able to judge of the propriety of assuming them to be subject to identical laws',
        'label.item.agency.learnmore': 'Learn More',

        'label.widget.updates': 'Recent Updates',
        'label.widget.developers': 'Developers',
        'label.widget.tags': 'Tag Clouds',
        'label.widget.subscribe': 'Subscribe Us',
        'label.widget.navigate': 'Navigate',

    });

    $translateProvider.translations('pt-BR', {
        'label.service': 'Calendário',
        'label.subtitle': 'Lembrar-se não será mais um problema.',

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

        'label.item.agency.description': 'Há também um conteúdo de conhecimento apoiado nas similaridades e diferenças de duas entidades utilizando a mesma lei',
        'label.item.agency.learnmore': 'Descubra',

        'label.widget.updates': 'Atualizações recentes',
        'label.widget.developers': 'Desenvolvedores',
        'label.widget.tags': 'Tags Nuvem',
        'label.widget.subscribe': 'Inscreva-se',
        'label.widget.navigate': 'Navegação',
    });

    $translateProvider.preferredLanguage('en');
}]);
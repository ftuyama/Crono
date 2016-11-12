/*
 * Tradução do Index
 */
indexApp.config(['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en-US', {
        'label.service': 'Calendar',
    });

    $translateProvider.translations('pt-BR', {
        'label.service': 'Calendário'
    });

    $translateProvider.preferredLanguage('en');
}]);
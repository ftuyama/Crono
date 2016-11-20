/*
 * Tradução do Calendar
 */
calendarApp.config(['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en-US', {
        'label.group.list': 'Group List:',

        'label.button.list': 'List events',
        'label.button.google': 'Google',
        'label.button.facebook': 'Facebook',
        'label.button.month': 'Change month',
        'label.button.fullscreen': 'Fullscreen',

        'label.snackbar.event.create': 'Creating event...',
        'label.snackbar.event.create.done': 'Event created with success!',
        'label.snackbar.event.edit.doing': 'Editing the event...',
        'label.snackbar.event.edit.done': 'Event edited with success!',
        'label.snackbar.event.delete.doing': 'Deleting the event...',
        'label.snackbar.event.delete.done': 'Event deleted with success!',
        'label.snackbar.event.move.doing': 'Moving the event...',
        'label.snackbar.event.move.done': 'Event moved with success!',
        'label.snackbar.facebook.login': 'First login on Facebook',

        'label.option.filter': 'Filter: ',
        'label.option.all': 'All',
        'label.option.month': 'Month',
        'label.option.week': 'Week',
        'label.input.week': 'Week: ',
        'label.button.hide.past': 'Hide past',
        'label.option.complete': 'Complete',

        'label.modal.title.create': 'Create Event',
        'label.modal.title.edit': 'Edit Event',
        'label.modal.title.facebook': 'Facebook Event',
        'label.modal.name': 'Name:',
        'label.modal.description': 'Description:',
        'label.modal.start': 'Start:',
        'label.modal.at': 'at:',
        'label.modal.end': 'End:',
        'label.modal.group': 'Group:',

        'label.modal.button.create': 'Create Event',
        'label.modal.button.save': 'Save Event',
        'label.modal.button.delete': 'Delete',
        'label.modal.button.cancel': 'Cancel',

        'label.firebase.fullscreen': 'Fullscreen:',
        'label.firebase.title': 'Firebase Event',
        'label.firebase.group': 'Group',
        'label.firebase.image': 'Image: ',
        'label.firebase.personal': 'Personal',

        'label.firebase.address.title': 'Location: ',
        'label.firebase.address': 'Address',
        'label.firebase.address.fill': 'Please, fill the address',
        'label.firebase.address.place': 'Event address',

        'label.firebase.link.title': 'Link: ',
        'label.firebase.link': 'Link',
        'label.firebase.link.fill': 'Please, fill the event link',
        'label.firebase.link.place': 'Event link',

        'label.firebase.people.title': 'People: ',
        'label.firebase.people': 'People',
        'label.firebase.people.fill': 'People that are going',

        'label.firebase.words.title': 'Words: ',
        'label.firebase.words': 'Personal comment',
        'label.firebase.words.fill': 'Comment something',
        'label.firebase.words.place': 'Comment',

        'label.firebase.priority.title': 'Priority: ',

        'label.firebase.status.title': 'Status: ',
        'label.firebase.status': 'Status',
        'label.firebase.status.fill': 'Please, update the status',
        'label.firebase.status.place': 'Status',

        'label.firebase.going.title': 'Going to: ',
        'label.firebase.going': 'Your presence',

        'label.firebase.button.save': 'Save',
        'label.firebase.button.delete': 'Delete',
        'label.firebase.button.cancel': 'Cancel'
    });

    $translateProvider.translations('pt-BR', {
        'label.group.list': 'Lista de Grupos:',

        'label.button.list': 'Listar Eventos',
        'label.button.google': 'Google',
        'label.button.facebook': 'Facebook',
        'label.button.month': 'Mudar mês',
        'label.button.fullscreen': 'Tela cheia',

        'label.snackbar.event.create.doing': 'Criando novo evento...',
        'label.snackbar.event.create.done': 'Evento criado com sucesso!',
        'label.snackbar.event.edit.doing': 'Editando o evento...',
        'label.snackbar.event.edit.done': 'Evento editado com sucesso!',
        'label.snackbar.event.delete.doing': 'Deletando o evento...',
        'label.snackbar.event.delete.done': 'Evento deletado com sucesso!',
        'label.snackbar.event.move.doing': 'Movendo o evento...',
        'label.snackbar.event.move.done': 'Evento movido com sucesso!',
        'label.snackbar.facebook.login': 'Primeiro entre no Facebook',

        'label.option.filter': 'Filtrar: ',
        'label.option.all': 'Tudo',
        'label.option.month': 'Mês',
        'label.option.week': 'Semana',
        'label.input.week': 'Semana: ',
        'label.button.hide.past': 'Esconder passado',
        'label.option.complete': 'Completo',

        'label.modal.title.create': 'Criar Evento',
        'label.modal.title.edit': 'Editar Evento',
        'label.modal.title.facebook': 'Evento Facebook',
        'label.modal.name': 'Nome:',
        'label.modal.description': 'Descrição:',
        'label.modal.start': 'Começo:',
        'label.modal.at': 'às:',
        'label.modal.end': 'Fim:',
        'label.modal.group': 'Grupo:',
        'label.modal.button.create': 'Criar Evento',
        'label.modal.button.save': 'Salvar Evento',
        'label.modal.button.delete': 'Deletar',
        'label.modal.button.cancel': 'Cancelar',

        'label.firebase.fullscreen': 'Tela cheia:',
        'label.firebase.title': 'Evento Firebase',
        'label.firebase.group': 'Grupo',
        'label.firebase.image': 'Imagem: ',
        'label.firebase.personal': 'Pessoal',

        'label.firebase.address.title': 'Local: ',
        'label.firebase.address': 'Endereço',
        'label.firebase.address.fill': 'Por favor, preencha o endereço',
        'label.firebase.address.place': 'Endereço do evento',

        'label.firebase.link.title': 'Link: ',
        'label.firebase.link': 'Link',
        'label.firebase.link.fill': 'Por favor, preencha o link',
        'label.firebase.link.place': 'Link do Evento',

        'label.firebase.people.title': 'Pessoas: ',
        'label.firebase.people': 'Pessoas',
        'label.firebase.people.fill': 'Pessoas que vão',

        'label.firebase.words.title': 'Anotação: ',
        'label.firebase.words': 'Anotação',
        'label.firebase.words.fill': 'Anotação pessoal',
        'label.firebase.words.place': 'Escreva algo',

        'label.firebase.priority.title': 'Prioridade: ',

        'label.firebase.status.title': 'Status: ',
        'label.firebase.status': 'Status',
        'label.firebase.status.fill': 'Atualizar os status',
        'label.firebase.status.place': 'Status',

        'label.firebase.going.title': 'Presença: ',
        'label.firebase.going': 'Você vai',

        'label.firebase.button.save': 'Salvar',
        'label.firebase.button.delete': 'Deletar',
        'label.firebase.button.cancel': 'Cancelar'
    });

    $translateProvider.preferredLanguage('en');
}]);
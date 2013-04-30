Ext.define('jsMidiParser.store.NoteStore', {
	extend: 'Ext.data.Store',
	requires: ['Ext.data.proxy.LocalStorage'],
	
	config: {
		autoSync: true,
		model: 'jsMidiParser.model.NoteModel',
		proxy: {
			type: 'localstorage',
			reader: {
				type: 'json',
				rootProperty: 'd'
			}
		}
	}
});
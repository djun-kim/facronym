function AcroCntrl($scope) {

  // The dictionary model. The entries are here only to provide 
  // an example - actual data is loaded from a data source.
  $scope.dictionary = {
    entries: [
      {acronym: "GCA", 
       expansion: "Global Cloud Alliance", 
       id: 1, 
       editorEnabled: false},
      {acronym: "FAQ", 
       expansion: "Frequently Asked Questions", 
       id: 2, 
       editorEnabled: false}
    ],
  }

  $scope.loadEntries = function() {
  };

  $scope.createEntry = function() {
      var dict = $scope.dictionary;
      dict.newentry.editorEnabled = false;
      dict.entries.push(dict.newentry);
      delete dict.newentry;
  };

  $scope.deleteEntry = function(entry) {
    var dict = $scope.dictionary;
    for (var i = 0, ii = dict.entries.length; i < ii; i++) {
      if (entry === dict.entries[i].id) {
        dict.entries.splice(i, 1);
      }
    }
  };

  $scope.saveEntry = function(entry) {
    var entries = $scope.dictionary.entries;

    i = 0;
    while ( (i < entries.length) && (entries[i].id !== entry)) { i++; };
    if (entries[i].id === entry) {
      entries[i].acronym = entries[i].newentry.acronym;
      entries[i].expansion = entries[i].newentry.expansion;
    }
    $scope.disableEditor(entry);
  };
 
  /**
   * Enables the editing for the entry given by the parameter "entry".
   * @param {Integer} entry The id of the entry to able edit on.
   */
  $scope.enableEditor = function(entry) {
    var entries = $scope.dictionary.entries;

    i = 0;
    while ( (i < entries.length) && (entries[i].id !== entry)) { i++; };
    if (entries[i].id === entry) {
      entries[i].editorEnabled = true;
      entries[i].newentry = {};
      entries[i].newentry.acronym = entries[i].acronym;
      entries[i].newentry.expansion = entries[i].expansion;
    }
  };

  /**
   * Disables the editing for the entry given by the parameter "entry".
   * @param {Integer} entry The id of the entry to disable edit on.
   */
  $scope.disableEditor = function(entry) {
    var entries = $scope.dictionary.entries;

    i = 0;
    while ( (i < entries.length) && (entries[i].id !== entry)) { i++; };
      if (entries[i].id === entry) {
        entries[i].editorEnabled = false;
	delete entries[i].newentry;
      }
  };

  $scope.debugEnabled = false;
  $scope.toggleDebug = function() {
    $scope.debugEnabled = !$scope.debugEnabled;
  }

}


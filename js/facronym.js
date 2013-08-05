function AcroCntrl($scope) {
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

  $scope.editorEnabled = false;

  $scope.createEntry = function() {
      var dict = $scope.dictionary;
      dict.newentry.editorEnabled = false;
      dict.entries.push(dict.newentry);
      delete dict.newentry;
  };

  $scope.deleteEntry = function(entry) {
    // alert("deleteEntry("+entry+")");
    var dict = $scope.dictionary;
    for (var i = 0, ii = dict.entries.length; i < ii; i++) {
      if (entry === dict.entries[i].id) {
        dict.entries.splice(i, 1);
      }
    }
  };

  $scope.editEntry = function(entry) {
      // alert("editEntry("+entry+")");
      var dict = $scope.dictionary;
      $scope.enableEditor(entry);
  };
 

    $scope.enableEditor = function(entry) {
	// alert("enableEditor(" + entry + ")");
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

    $scope.disableEditor = function(entry) {
	// alert("enableEditor(" + entry + ")");
	var entries = $scope.dictionary.entries;

	i = 0;
	while ( (i < entries.length) && (entries[i].id !== entry)) { i++; };
	if (entries[i].id === entry) {
	    entries[i].editorEnabled = false;
	    delete entries[i].newentry;
	}
    };

    $scope.save = function(entry) {
	var entries = $scope.dictionary.entries;

	i = 0;
	while ( (i < entries.length) && (entries[i].id !== entry)) { i++; };
	if (entries[i].id === entry) {
	    entries[i].acronym = entries[i].newentry.acronym;
	    entries[i].expansion = entries[i].newentry.expansion;
	}


	$scope.disableEditor(entry);
    };
}


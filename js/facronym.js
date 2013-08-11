var myApp = angular.module('facronym', ['CouchDB']).
  config(function($routeProvider) {
    $routeProvider.
      when('/',               {controller:ListCntrl, templateUrl:'list.html'}).
      when('/edit/:acroId',   {controller:EditCntrl, templateUrl:'list.html'}).
      when('/delete/:acroId', {controller:DeleteCntrl, templateUrl:'list.html'}).
      when('/new',            {controller:CreateCntrl, templateUrl:'list.html'}).
      otherwise({redirectTo:'/'});
  });

function ListCntrl($scope, FacronymCouch) {
  FacronymCouch.dictionary = $scope.dictionary;
}

function EditCntrl($scope, $location, $routeParams, FacronymCouch) {

  $scope.dictionary = FacronymCouch.dictionary;

  $scope.name = 'EditCntrl';

  /**
   * Enables the editing for the entry given by the parameter 'entry'.
   * @param {Integer} entry The id of the entry to able edit on.
   */
  $scope.enableEditor = function(entry) {
    var entries = $scope.dictionary.rows;

    i = 0;
    while ((i < entries.length) && (entries[i].id !== entry)) { i++; }
    if (entries[i].id === entry) {
      entries[i].doc.editorEnabled = true;
      entries[i].newentry = {};
      entries[i].newentry.acronym = entries[i].acronym;
      entries[i].newentry.expansion = entries[i].expansion;
    }
  };

  /**
   * Disables the editing for the entry given by the parameter 'entry'.
   * @param {Integer} entry The id of the entry to disable edit on.
   */
  $scope.disableEditor = function(entry) {
    var entries = $scope.dictionary.rows;

    i = 0;
    while ((i < entries.length) && (entries[i].id !== entry)) { i++; }
    if (entries[i].id === entry) {
      entries[i].doc.editorEnabled = false;
      delete entries[i].newentry;
    }
  };

}

function DeleteCntrl($scope,  $location, $routeParams, FacronymCouch) {

  $scope.dictionary = FacronymCouch.dictionary;

  $scope.name = 'DeleteCntrl';

  $scope.name = "DeleteCntrl";
  $scope.params = $routeParams;

  $scope.deleteEntry = function() {

    var dict = $scope.dictionary;
    var id = $scope.params.acroId;
    var rev = $scope.params.rev;

    // remove entry from database
    FacronymCouch.delete({q: $scope.params.acroId, rev: $scope.params.rev});

    alert("Removed entry");

    for (var i = 0, ii = dict.rows.length; i < ii; i++) {
      alert("i = "+ i +  
            ";\ndict.rows[i].id = " + dict.rows[i].id +
            ";\nid = " + id +
            ";\ndict.rows[i].doc._rev = " + dict.rows[i].doc._rev +
            ";\nrev = " + rev
           );
      if ((id === dict.rows[i].id) && (rev === dict.rows[i].doc._rev)) {
        dict.rows.splice(i, 1);
      }
    }
  };
}

function CreateCntrl($scope,  $location, $routeParams, FacronymCouch) {

  $scope.dictionary = FacronymCouch.dictionary;
  $scope.name = 'CreateCntrl';

  $scope.inputEnabled = true;

  $scope.createEntry = function() {
    var dict = $scope.dictionary;

//    dict.newentry.editorEnabled = false;
//    dict.rows.push(dict.newentry);
  
    FacronymCouch.save(dict.newentry, function(entry) {
      $location.path('/edit/' + entry.id);
    });
    
    delete dict.newentry;
  };
  
  $scope.saveEntry = function(entry) {
    var entries = $scope.dictionary.rows;
    
    i = 0;
    while ((i < entries.length) && (entries[i].id !== entry)) { i++; }
    if (entries[i].id === entry) {
      entries[i].doc.acronym = entries[i].newentry.acronym;
      entries[i].doc.expansion = entries[i].newentry.expansion;
    }
    $scope.disableEditor(entry);
  };
  
}

function AcroCntrl($scope, $location, $routeParams, FacronymCouch) {

  $scope.name = 'AcroCntrl';
  
  $scope.inputEnabled = false;



  $scope.dictionary = FacronymCouch.loadEntries();
  FacronymCouch.dictionary = $scope.dictionary;

  $scope.debugEnabled = false;
  $scope.toggleDebug = function() {
    $scope.debugEnabled = !$scope.debugEnabled;
  };
}

/** 
 * Service FacronymCouch - provides the dictionary from a CouchDB resource 
 */
angular.module('CouchDB', ['ngResource']).
  factory('FacronymCouch', function($resource) {
    var FacronymCouch = $resource(':protocol//:server/:db/:q/:r/:s/:t',
                                  {protocol: 'http:',
                                   server: 'localhost:5984',
                                   db: 'facronym'},
                                  {update: {method: 'PUT'}
                                  }
                                 );
    FacronymCouch.prototype.update = function(cb) {
      return FacronymCouch.update({q: this._id}, this, cb);
    };

//    FacronymCouch.prototype.destroy = function(cb) {
//      return FacronymCouch.remove({q: this._id, rev: this._rev}, cb);
//    };

    FacronymCouch.loadEntries = function() {
      return FacronymCouch.get({q: '_all_docs', include_docs: 'true', limit: 10});
    };

    FacronymCouch.saveEntries = function() {
      return FacronymCouch.$save({q: '_all_docs', include_docs: 'true', limit: 10});
    };

    // The dictionary model. Actual data loaded from at runtime.
    dictionary = {entries: [] };

    return FacronymCouch;
  });

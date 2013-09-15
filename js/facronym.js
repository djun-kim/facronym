var myApp = angular.module('facronym', ['CouchDB']).
  config(function($routeProvider) {
    $routeProvider.
      when('/',               {controller:ListCntrl, templateUrl:'list.html'}).
      when('/update/:acroId', {controller:UpdateCntrl, templateUrl:'list.html'}).
      when('/delete/:acroId', {controller:DeleteCntrl, templateUrl:'list.html'}).
      when('/new',            {controller:CreateCntrl, templateUrl:'list.html'}).
      otherwise({redirectTo:'/'});
  });


/**
 * Controller ListCntrl
 */
function ListCntrl($scope, FacronymCouch) {
  FacronymCouch.acrolist = $scope.acrolist;
}

/**
 * Controller UpdateCntrl
 */
function UpdateCntrl($scope, $location, FacronymCouch) {
  $scope.name = 'UpdateCntrl';

  $scope.editAction = 'edit';
  $scope.acrolist = FacronymCouch.acrolist;

  $scope.entry = {};
  $scope.entry.acronym = $scope.$parent.def.doc.acronym;
  $scope.entry.expansion = $scope.$parent.def.doc.expansion;
  

  /**
   * Enables the editing for the entry given by the parameter 'entry'.
   * @param {Integer} entry The id of the entry to enable edit on.
   */
  $scope.enableEditor = function(entry) {
    var entries = $scope.acrolist.rows;

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
    var entries = $scope.acrolist.rows;

    i = 0;
    while ((i < entries.length) && (entries[i].id !== entry)) { i++; }
    if (entries[i].id === entry) {
      entries[i].doc.editorEnabled = false;
      delete entries[i].newentry;
    }
  };

}

/**
 * Controller DeleteCntrl
 *    Handles deletion of an entry of the acronym list.
 */
function DeleteCntrl($scope,  $location, $routeParams, FacronymCouch) {

  $scope.acrolist = FacronymCouch.acrolist;
  $scope.name = "DeleteCntrl";
  $scope.editAction = 'delete';
  $scope.params = $routeParams;

  $scope.deleteEntry = function() {
    var dict = $scope.acrolist;
    var id = $scope.params.acroId;
    var rev = $scope.params.rev;

    // remove entry from database
    FacronymCouch.delete({q: $scope.params.acroId, rev: $scope.params.rev});

    for (var i = 0; i < dict.rows.length; i++) {
      if ((id === dict.rows[i].id) && (rev === dict.rows[i].doc._rev)) {
        dict.rows.splice(i, 1);
      }
    }
  };
}

/**
 * Controller CreateCntrl
 *    Handles creation of a new entry.
 *  @todo - update model, don't just update the datastore.
 */
function CreateCntrl($scope,  $location, $routeParams, FacronymCouch) {

  $scope.acrolist = FacronymCouch.acrolist;
  $scope.name = 'CreateCntrl';

  $scope.inputEnabled = true;

  $scope.createEntry = function() {
    var dict = $scope.acrolist;

    dict.newentry.editorEnabled = false;
    dict.rows.push(dict.newentry);
  
    FacronymCouch.save(dict.newentry, function(entry) {
      $location.path('/edit/' + entry.id);
    });
    
    delete dict.newentry;
  };
  
  // Handles the "save" button event
  $scope.saveEntry = function(entry) {
    var entries = $scope.acrolist.rows;
    alert('saveEntry');
    i = 0;
    while ((i < entries.length) && (entries[i].id !== entry)) { i++; }
    if (entries[i].id === entry) {
      entries[i].doc.acronym = entries[i].newentry.acronym;
      entries[i].doc.expansion = entries[i].newentry.expansion;
    }
    $scope.disableEditor(entry);
  };
}

/**
 * Controller AcroCntrl.
 */
function AcroCntrl($scope, $location, $routeParams, FacronymCouch) {
  $scope.name = 'AcroCntrl';
  $scope.inputEnabled = false;
  $scope.acrolist = FacronymCouch.loadEntries();
  FacronymCouch.acrolist = $scope.acrolist;

  $scope.debugEnabled = false;
  $scope.toggleDebug = function() {
    $scope.debugEnabled = !$scope.debugEnabled;
  };
}

/** 
 * Service FacronymCouch - provides the acrolist from a CouchDB resource 
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

    // The acrolist model. Actual data loaded from at runtime.
    acrolist = {entries: [] };
    return FacronymCouch;
  });

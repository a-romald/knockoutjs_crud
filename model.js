$(function() {
    
    var Tag = function(id, title) {
        this.tagId = id;
        this.tagTitle = ko.observable(title);
    }
    
    var viewModel = function(){
        var self = this;
        //Data
        self.availableTags = ko.observableArray([]);
        self.tagToAdd = ko.observable('');
        //Pagination
        self.currentPage = ko.observable(0); 
		self.pageSize = ko.observable(5);
        //Search
        self.filterTerm = ko.observable(''); 
        self.query = ko.observable(''); 
        //Letters
        self.letterTerm = ko.observable('');
        self.filterLetter = ko.observable('');
        
        //Behaviors
        //Get all tags
        self.getTags = function() {
            $.ajax({
                type: 'GET',
                url: 'response.php?option=list',
                dataType: 'json',
                success: function receiveTags(data) {
                    $.each(data, function() {
                        self.availableTags.push( new Tag(this.id, this.title));
                    });
                }
            });
        }
        //Add tag
        self.addTag = function() {
            var request = self.tagToAdd();
            if (request == '' || request == null) {
                alert("Please enter tag"); 
                return;
            }
            var newTag = request;
            self.tagToAdd("");
            $.ajax({
                type: 'POST',
                url: 'response.php',
                data: {tag: newTag, option: 'add'},
                dataType: 'json',
                success: function insertTag(data) {
                    self.availableTags.push(new Tag(data.id, data.title));
                    $.notifyBar({
                        html: "Tag Added.",
                        cssClass: "success",
                        delay: 2000
                    });
                }
            });
        }
        //Delete tag
        self.deleteTag = function(tag) {
            var id = tag.tagId;
            $.ajax({
                type: 'GET',
                url: 'response.php',
                data: {tag_id: id, option: 'delete'},
                dataType: 'json',
                success: function deleteTag() {
                    self.availableTags.remove(tag);
                    $.notifyBar({
                        html: "Tag Deleted.",
                        cssClass: "success",
                        delay: 2000
                    });
                }
            });
        }
        //Edit tag
        self.editTag = function(tag) {
            var id = tag.tagId;
            var query = prompt('What would you like to change the tag?', tag.tagTitle());
            if (query == '' || query == null) {
                return;
            }
            else {title = query;}
            $.ajax({
                type: 'POST',
                url: 'response.php',
                data: {tag_id: id, tag_title: title, option: 'edit'},
                dataType: 'json',
                success: function editTag(data) {
                    tag.tagTitle(data.title);
                    $.notifyBar({
                        html: "Tag Updated.",
                        cssClass: "success",
                        delay: 2000
                    });
                }
            });
        }

////////////////////start Pagination
        self.navigate = function (e) {

		    var el = e.target;

		    if (el.id === "next") {
		        if (this.currentPage() < ko.utils.unwrapObservable(this.availableTags()) - 1)                {
		            this.currentPage(this.currentPage() + 1);
		        }
		    } else {
		        if (this.currentPage() > 0) {
		            this.currentPage(this.currentPage() - 1);
		        }
		    }
		}
        
        self.totalPages = ko.dependentObservable(function () {
            return Math.ceil(ko.utils.unwrapObservable(this.availableTags).length / this.pageSize());
        }, self);
    
    
        self.showCurrentPage = ko.dependentObservable(function () {
            if (this.currentPage() > Math.ceil(ko.utils.unwrapObservable(this.availableTags).length / this.pageSize())) {
                this.currentPage(ko.utils.unwrapObservable(this.totalPages()) - 1);
            }
            var startIndex = this.pageSize() * this.currentPage();
                return this.availableTags.slice(startIndex, startIndex + this.pageSize());
        }, self);


        self.numericPageSize = ko.dependentObservable(function () {
            if (typeof (this.pageSize()) !== "number") {
                this.pageSize(parseInt(this.pageSize()));
            }
        }, self);

//////////////////////////// end Pagination

/////////////////////////// start Search
        self.clearTerm = function () {
            self.filterTerm("");
            $("#term").val("");
            self.availableTags([]); //to clear viewModel
            self.getTags();
        }
        
        self.search = function(value) {
            // remove all the current availableTags, which removes them from the view
            var localTags = ko.utils.unwrapObservable(self.availableTags());
            var auxTags = []
            for(var x in localTags) {
               auxTags.push({tagId: localTags[x].tagId, tagTitle: localTags[x].tagTitle()});
            }
            
            self.availableTags.removeAll();
            
            for(var x in auxTags) {
               if(auxTags[x].tagTitle.toLowerCase().indexOf(value.toLowerCase()) > -1) { 
                 self.availableTags.push( new Tag(auxTags[x].tagId, auxTags[x].tagTitle));
               }
            }
            self.filterTerm(1);//To appear button to clear field
       }
///////////////////////////// end Search

///////////////// start Letters Filter
        self.clearLetter = function () {
            self.filterLetter("");
            self.availableTags.removeAll();
            self.getTags();
        }
        
        
        self.getTagsByLetter = function(val) {
            var letter = val;
            var localTags = ko.utils.unwrapObservable(self.availableTags());
            var auxTags = []
            for(var x in localTags) {
               auxTags.push({tagId: localTags[x].tagId, tagTitle: localTags[x].tagTitle()});
            }
            
            self.availableTags.removeAll();
            
            for(var x in auxTags) {
               if(auxTags[x].tagTitle.charAt(0).toUpperCase() == val) {
                 self.availableTags.push( new Tag(auxTags[x].tagId, auxTags[x].tagTitle));
               }
            }
        }
        
        
        self.filteredItemsByTerm = ko.dependentObservable(function () {
            var term = self.letterTerm().toLowerCase();
    
            if (!term) {
                return self.availableTags();
            }
    
            return ko.utils.arrayFilter(self.availableTags(), function (item) {
                var found = false;
    
                for (var prop in item) {
                    if (typeof (item[prop]) === "string") {
                        if (item[prop].toLowerCase().search(term) !== -1) {
                            found = true;
                            break;
                        }
                    }
                }
    
                return found;
            });
    
        }, self);
    
    
        self.letters = ko.dependentObservable(function () {
            var result = [];
    
            ko.utils.arrayForEach(self.filteredItemsByTerm(), function (tag) {
                result.push(tag.tagTitle().charAt(0).toUpperCase());
            });
    
            return ko.utils.arrayGetDistinctValues(result.sort());
        }, self);
        
/////////////////// end Letters Filter

    } //end viewModel
    
       
   var myViewModel = new viewModel();
   ko.applyBindings(myViewModel);
   myViewModel.getTags();
   myViewModel.query.subscribe(myViewModel.search);
})

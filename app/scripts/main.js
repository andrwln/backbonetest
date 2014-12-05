/*global Test, $*/


// window.Test = {
//     Models: {},
//     Collections: {},
//     Views: {},
//     Routers: {},
//     init: function () {
//         'use strict';
//         console.log('Hello from Backbone!');
//     }
// };

// $(document).ready(function () {
//     'use strict';
//     Test.init();
// });

$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  options.url = 'http://backbonejs-beginner.herokuapp.com' + options.url;
});

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};

var Users = Backbone.Collection.extend({
	url: '/users'
});

var User = Backbone.Model.extend({
    urlRoot: '/users'
});

var UserList = Backbone.View.extend({
    el: '.page',
    render: function() {
        var that = this;
    	var users = new Users();
    	users.fetch({
    		success: function(users) {
                console.log(users);
                var template = _.template($('#user-list-template').html(), {users: users.models})
    			that.$el.html(template);
    		}
    	})
        
    }
});

// var NewList = Backbone.Model.extend({
//     el: '.page',
//     render: function() {
//         // var users = new Users();
//         setInterval(function() {
//             console.log('New List render method being called')
//         }, 5000)
//     }
// });

var EditUser = Backbone.View.extend({
    el: '.page',
    render: function() {
        var template = _.template($('#edit-user-template').html(), {});
        this.$el.html(template);
    },
    events: {
        'submit .edit-user-form' : 'saveUser'
    },
    saveUser: function(ev) {
        var userDetails = $(ev.currentTarget).serializeObject();
        var user = new User();
        user.save(userDetails, {
            success: function(user) {
                router.navigate('', {trigger: true});
            }
        })
        return false;
    }
});

var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        'new': 'editUser',
        'newHome': 'newHome'
    }
});

var userList = new UserList();
var editUser = new EditUser();
// var newList = new NewList();


var router = new Router();
router.on('route:home', function() {
    userList.render();
});
router.on('route:editUser', function() {
    editUser.render();
});
// router.on('route:newHome', function() {
//     newList.render();
// });

Backbone.history.start();
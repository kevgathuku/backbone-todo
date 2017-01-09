window.TodoApp = new (Backbone.Router.extend({
  routes: {'': 'index'},

  index: function() {},
  start: function() {
    Backbone.history.start();
  }
}));

$(function() {
  TodoApp.start();
});

window.TodoItem = Backbone.Model.extend({});
window.TodoItems = Backbone.Collection.extend({
  model: TodoItem
});

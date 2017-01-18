window.TodoItem = Backbone.Model.extend({});
window.TodoItems = Backbone.Collection.extend({
  model: TodoItem
});

window.TodoView = Backbone.View.extend({
  className: 'input-group input-group-lg',
  template: _.template($('#todo-item-template').html()),
  render: function() {
    // return `this` at the end of render to enable chained calls.
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

window.TodosView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('add', this.addOne, this);
    this.collection.on('reset', this.addAll, this);
    this.collection.on('destroy', this.render, this);
  },
  addOne: function(todoItem) {
    var todoView = new TodoView({model: todoItem});
    this.$el.append(todoView.render().el);
  },
  addAll: function() {
    this.$el.empty();
    this.collection.forEach(this.addOne, this);
  },
  render: function() {
    this.addAll();
    return this;
  }
});

var TodoApp = new (Backbone.Router.extend({
  routes: {'': 'index'},
  initialize: function() {
    this.todoItems = new TodoItems();
    this.todosView = new TodosView({collection: this.todoItems});
    this.todosView.render();
  },

  index: function() {
    var fixtures = [
      {val: 'something', completed: true},
      {val: 'something', completed: true},
      {val: 'else', completed: false},
      {val: 'there', completed: true},
      {val: 'something', completed: true},
      {val: 'else', completed: false},
      {val: 'something', completed: true},
      {val: 'there', completed: true},
      {val: 'else', completed: false}
    ];
    $('#app').html(this.todosView.el);
    // replace a collection with a new list of models
    // Returns the newly-set models and triggers `reset` event on completion
    this.todoItems.reset(fixtures);
  },
  start: function() {
    Backbone.history.start();
  }
}));


$(function() {
  TodoApp.start();
});

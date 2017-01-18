window.TodoItem = Backbone.Model.extend({
  toggle: function() {
    this.set('completed', !this.get('completed'));
  },
  updateText: function(text) {
    this.set('val', text);
  }
});

window.TodoItems = Backbone.Collection.extend({
  model: TodoItem,
  initialize: function() {
    this.on('destroy', this.removeElement, this);
  },
  filterCompleted: function() {
    this.remove(this.filter(function(item) {
      //return items where completed is `true`
      return item.get('completed');
    }))
  },
  removeElement: function(model) {
    this.remove(model);
  }
});

window.TodoView = Backbone.View.extend({
  initialize: function() {
    // Previous way of achieving the same
    // this.model.on('change', this.render, this);
    // Listen to changes in model and re-render
    this.listenTo(this.model, 'change', this.render);
  },
  events: {
    'change input[type=checkbox]': 'toggle',
    'change .form-control': 'update',
    'click .btn-danger': 'remove'
  },
  toggle: function() {
    this.model.toggle();
  },
  update: function() {
    this.model.updateText(this.$('.form-control').val());
  },
  remove: function() {
    this.model.destroy();
  },

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
    var todoView = new TodoView({
      model: todoItem
    });
    this.$el.append(todoView.render().el);
  },
  addAll: function() {
    this.$el.empty();
    this.collection.forEach(this.addOne, this);
  },
  filterCompleted: function() {
    this.collection.filterCompleted();
    this.render();
  },
  render: function() {
    this.addAll();
    return this;
  }
});

var TodoApp = new(Backbone.Router.extend({
  routes: {
    '': 'index'
  },
  initialize: function() {
    this.todoItems = new TodoItems();
    this.todosView = new TodosView({
      collection: this.todoItems
    });
    this.todosView.render();

    // Global event listeners
    // Clear completed todos
    $('.btn-clear').click(function(e) {
      window.TodoApp.todosView.filterCompleted();
    });

    $('.btn-success').click(function(e) {
      window.TodoApp.todoItems.add({
        val: $('#newTodo').val(),
        completed: false
      });
      // Reset the todo input field
      $('#newTodo').val('');
    });

    $('#newTodo').on('keyup', function(e) {
      if (e.keyCode == 13) {
        // If the `Enter` button is pressed
        window.TodoApp.todoItems.add({
          val: e.target.value,
          completed: false
        });
        // Reset the todo input field
        $('#newTodo').val('');
      }
    });
  },

  index: function() {
    var fixtures = [{
        val: 'something',
        completed: true
      },
      {
        val: 'something',
        completed: true
      },
      {
        val: 'else',
        completed: false
      },
      {
        val: 'there',
        completed: true
      },
      {
        val: 'something',
        completed: true
      },
      {
        val: 'else',
        completed: false
      },
      {
        val: 'other thing',
        completed: true
      },
      {
        val: 'there',
        completed: true
      },
      {
        val: 'else',
        completed: false
      }
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

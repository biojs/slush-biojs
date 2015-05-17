/*
 * <%= appNameSlug %>
 * https://github.com/<%= userName %>/<%= appNameSlug %>
 *
 * Copyright (c) <%= year %> <%= authorName %>
 * Licensed under the <%= license %> license.
 */

/**
@class <%= appNameVar %>
 */

<% if (vis){ %>
var  <%= appNameVar %>;
module.exports = <%= appNameVar %> = function(opts){
  this.el = opts.el;
  this.el.textContent = <%= appNameVar %>.hello(opts.text);
};<% } %>

/**
 * Private Methods
 */

/*
 * Public Methods
 */

/**
 * Method responsible to say Hello
 *
 * @example
 *
 *     <%= appNameVar %>.hello('biojs');
 *
 * @method hello
 * @param {String} name Name of a person
 * @return {String} Returns hello name
 */

<% if (vis){ %>
<%= appNameVar %>.hello = function (name) {
<% }else{ %>
module.exports.hello = function (name) {
<% } %>
  return 'hello ' + name;
};


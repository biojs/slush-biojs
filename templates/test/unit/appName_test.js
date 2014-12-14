/*
 * <%= appNameSlug %>
 * https://github.com/<%= userName %>/<%= appNameSlug %>
 *
 * Copyright (c) 2014 <%= authorName %>
 * Licensed under the <%= license %> license.
 */

// chai is an assertion library
var chai = require('chai');

// @see http://chaijs.com/api/assert/
var assert = chai.assert;

// register alternative styles
// @see http://chaijs.com/api/bdd/
chai.expect();
chai.should();

// requires your main app (specified in index.js)<% if (phantomjs ){ %>
var <%= appNameVar %> = require('../..');
<% }else{ %>
var <%= appNameVar %> = require('../');<% } %>

describe('<%= appNameSlug %> module', function(){
  describe('#hello()', function(){
    it('should return a hello', function(){

      assert.equal(<%= appNameVar %>.hello('biojs'), ("hello biojs"));
      
      // alternative styles
      <%= appNameVar %>.hello('biojs').should.equal("hello biojs");
    });
  });
});

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
var <%= appNameShort %> = require('../..');
<% }else{ %>
var <%= appNameShort %> = require('../');<% } %>

describe('<%= appNameSlug %> module', function(){
  describe('#hello()', function(){
    it('should return a hello', function(){

      assert.equal(<%= appNameShort %>.hello('biojs'), ("hello biojs"));
      
      // alternative styles
      <%= appNameShort %>.hello('biojs').should.equal("hello biojs");
    });
  });
});

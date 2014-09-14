/*
 * <%= appNameSlug %>
 * https://github.com/<%= userName %>/<%= appNameSlug %>
 *
 * Copyright (c) 2014 <%= authorName %>
 * Licensed under the <%= license %> license.
 */

var chai = require('chai');
chai.expect();
chai.should();

var <%= appNameVar %> = require('../lib/<%= appNameVar %>.js');

describe('<%= appNameSlug %> module', function(){
  describe('#hello()', function(){
    it('should return a hello', function(){
      <%= appNameVar %>.hello('biojs').should.equal("hello biojs");
    });
  });
});

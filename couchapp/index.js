var couchapp = require('couchapp');

var ddoc = {
  _id: '_design/docscloudantcom',
  rewrites: require('./rewrites.json'),
  views: {
    format: {
      map: function(doc){
        if(doc.text && !doc.deleted && doc._id.indexOf('api/inc') === -1){
          var title_pattern = /^(?:# )?(.+)\n/
            , title = doc.text.match(title_pattern)
            , id = doc._id.replace('index.md', '').replace(/\.\w{2,3}$/, '');
          log(id);
          if(title){
            emit(id, {
              title: title[1],
              text: doc.text
            }); 
          }
        }
      }
    }
  },
  lists: {
    tree: function(head, req){
      var tree = {},
          row,
          parts,
          i,
          temp;
      while(row = getRow()){
        parts = row.id.split('/');
        temp = tree;
        for(i in parts.slice(0, -1)){
          temp[parts[i]] = temp[parts[i]] || {};
          temp = temp[parts[i]];
        }
        temp[parts[parts.length - 1]] = row;
      }
      send(JSON.stringify(tree));
    }
  },
  shows: {},
  indexes: {
    text: {
      index: function(doc){
        if(doc.text && !doc.deleted && doc._id.indexOf('api/inc') === -1){
          index("default", doc.text);
        }
      }
    }
  }
};

module.exports = ddoc;
var SandwichStream = require('sandwich-stream').SandwichStream;
var mimePartStream = require('mime-part-stream');
var mimeHeaders = require('mime-headers');
var NEWLINE = '\r\n';

function MimeMultipartStream(options) {
  this._multiPartCount = 0;
  options = options || {};

  if (!options.boundary) {
    throw new Error('MimeMultipartStream no boundary defined');
  }
  else {
    this._boundary = options.boundary;
  }

  if (!options.type) {
    throw new Error('MimeMultipartStream no type defined');
  }
  else {
    this._type = options.type;
  }

  options.head = this._initStreamHead();
  options.separator = this._initStreamSeparator();
  options.tail = this._initStreamFoot();
  SandwichStream.call(this, options);
}

MimeMultipartStream.prototype = Object.create(SandwichStream.prototype, {
  constructor: MimeMultipartStream
});

MimeMultipartStream.prototype._read = function () {
  if (this._multiPartCount === 0) {
    this.emit('error', new Error('MimeMultipartStream no parts added'));
    return;
  }

  if (this._multiPartCount === 1) {
    console.log('should emit');
    this.emit('error', new Error('MimeMultipartStream only one part added'));
    return;
  }

  return SandwichStream.prototype._read.apply(this, arguments);
};

MimeMultipartStream.prototype.add = function (mimePartOptions) {
  this._multiPartCount++;
  var stream = mimePartStream(mimePartOptions);
  SandwichStream.prototype.add.call(this, stream);
};

function mimeMultipartStream(options) {
  var stream = new MimeMultipartStream(options);

  return stream;
}

MimeMultipartStream.prototype._initStreamHead = function () {
  var headers = mimeHeaders();
  headers.push('Content-Type', 'multipart/' + this._type + '; boundary=MMS' + this._boundary);
  return headers.toString() + '--MMS' + this._boundary + NEWLINE;
};

MimeMultipartStream.prototype._initStreamSeparator = function () {
  return '--MMS' + this._boundary + NEWLINE;
};

MimeMultipartStream.prototype._initStreamFoot = function () {
  return '--MMS' + this._boundary + '--' + NEWLINE;
};

module.exports = mimeMultipartStream;

/*jslint stupid: true */
var test = require('tape');
var PassThrough = require('stream').PassThrough;
var mimeMultipartStream = require('../');
var fs = require('fs');
var stream;
var output;

test('Throw no boundary error', function (t) {
  try {
    stream = mimeMultipartStream();
    t.fail();
    t.end();
  }
  catch (e) {
    t.equal(e.message, 'MimeMultipartStream no boundary defined');
    t.end();
  }
});

test('Throw no type error', function (t) {
  t.plan(1);

  try {
    stream = mimeMultipartStream({
      boundary: '1234567890'
    });
  }
  catch (e) {
    t.equal(e.message, 'MimeMultipartStream no type defined');
  }
});

test('Emit no parts error', function (t) {
  t.plan(1);
  stream = mimeMultipartStream({
    boundary: '1234567890',
    type: 'mixed'
  });
  stream.on('error', function (err) {
    t.equal(err.message, 'MimeMultipartStream no parts added');
  });
  stream.read();
});

test('Emit only 1 part error', function (t) {
  t.plan(1);
  stream = mimeMultipartStream({
    boundary: '1234567890',
    type: 'mixed'
  });
  stream.on('error', function (err) {
    t.equal(err.message, 'MimeMultipartStream only one part added');
  });
  stream.add({
    type: 'text/plain',
    transferEncoding: 'quoted-printable',
    body: new PassThrough()
  });
  stream.read();
});

test('Pipe 2 part with headers', function (t) {
  var expected = fs.readFileSync(__dirname + '/emails/pipe-2-part-with-headers');
  var pt1 = new PassThrough();
  var pt2 = new PassThrough();

  output = [];
  stream = mimeMultipartStream({
    boundary: '1234567890',
    type: 'alternative'
  });
  stream.add({
    type: 'text/plain; charset=UTF-8',
    transferEncoding: 'quoted-printable',
    body: pt1
  });
  stream.add({
    type: 'text/html; charset=UTF-8',
    transferEncoding: 'quoted-printable',
    body: pt2
  });
  stream.on('data', output.push.bind(output));
  stream.on('end', function () {
    t.equal(Buffer.concat(output).toString(), expected.toString());
    t.end();
  });
  pt1.end('Plain text message here');
  pt2.end('<p>HTML message here</p>');
});

#MIME Multipart Stream

[![Travis CI Test Status](https://travis-ci.org/connrs/node-mime-multipart-stream.png)](https://travis-ci.org/connrs/node-mime-multipart-stream)

Creates a readable stream composed of multiple MIME parts to be injected into an overall email

    npm install mime-multipart-stream

To use:

    var stream = mimeMultipartStream({
      boundary: '1234567890',
      type: 'alternative'
    });
    stream.add({
      type: 'text/plain; charset=UTF-8',
      transferEncoding: 'quoted-printable',
      body: textPlainStream
    });
    stream.add({
      type: 'text/html; charset=UTF-8',
      transferEncoding: 'quoted-printable',
      body: textHtmlStream
    });

When initialising a new stream, there are 2 options available in the options object:

* type: This should be one of the valid multipart subtypes eg. mixed, alternative.
* boundary: This should be a an ASCII boundary string that is used to generate the MIME separators between each MIME part.

Once you have created your stream, use the `add` method to add multiple readable streams. Each stream is added using the initialisation options found in the [mime-part-stream](https://npmjs.org/package/mime-part-stream) ([GitHub](https://github.com/connrs/node-mime-part-stream)) module.

Once ready, use the standard readable streams API to consume the content.

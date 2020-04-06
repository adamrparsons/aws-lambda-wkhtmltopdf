var wkhtmltopdf = require('wkhtmltopdf');
var MemoryStream = require('memorystream');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context, callback) {
    var body = event;
	var memStream = new MemoryStream();
    var content;
	if (body.htmlBase64 != null) {
        content = Buffer.from(body.htmlBase64).toString('utf8');
    } else {
	    content = body.url;
    }
    wkhtmltopdf(
        content,
        body.options,
        function (_err, _stream) {
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    pdfBase64: memStream.read().toString('base64'),
                    options: body.options
                })
            };
            callback(null, response);
        }
    ).pipe(memStream)
};

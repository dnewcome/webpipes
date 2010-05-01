# About
Webpipes aims to bring the Unix tradition of combining tools using pipes to the web. REST gave us a widely understood api for interacting with single servers on the web, but coordinating requests across multiple servers requires that the caller cache or forward data between all participants.
With the web becoming more realtime in nature, and with datasets becoming larger, the current synchronous request-response model where servers commonly cache requests starts breaking down.
This reference implementation of Webpipes was implemented using the Node.js, which allows streaming for all operations that suport it.

# Motivation


# Synopsis
Suppose example.com is running a webpipes node that exposes two operations: grep and wc. These operations were chosen for the sake of simplicity in the example. Endpoints may be configured to call javascript modules or invoke native commands.
We are using a file available on the example.com http server as standard input. Http POST may be used instead, but since we want to use a typical web browser to run the example it is simpler to use a file as standard input.

Given the file http://example.com/greptest.txt containing the following
	one
	two
	onetwo

The following unix shell expression
	$ grep 'one' greptest.txt | grep 'two' | wc -l

Can be run across Webpipes nodes as follows
	http://example.com/grep?args=['one']&stdin=http://example.com/greptest.txt&|=http://example.com/grep?args=['two']|http://example.com/wc?args=['-l']

We try to keep the unix pipe '|' operator in the expression as much as possible. The first pipe necessarily is a url query string key, expressed as
	&|=

# Further work
Possible alternate command syntax
better command routing configuration

# Open Issues
Security
Urlencoding

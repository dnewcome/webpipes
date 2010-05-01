# correct output 
#
#[ { id: 'ep', added: '2003-06-10' }
#, { id: 'tse', added: '2003-06-20' }
#, { id: 'lh', added: '2004-11-01' }
#, { id: 'co', added: '2004-11-15' }
#]

echo input data fixture must be placed on local webserver
echo '[ "//label", { id: "@id", added: "@added" } ]' | ./wp http://localhost:9980/jath?src=http://localhost/labels.xml

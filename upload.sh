cat <<EOM
HTTP/1.0 200 OK
Content-Type: text/plain

EOM

cat  > /opt/share/www/walks/${QUERY_STRING##*=}

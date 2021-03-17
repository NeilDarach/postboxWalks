cat <<EOM
HTTP/1.0 200 OK
Content-Type: text/plain

EOM

TYPE=${QUERY_STRING%%.json}
TYPE=${TYPE##*.}
cat  > /opt/share/www/walks/tracks/${TYPE}/${QUERY_STRING##*=}

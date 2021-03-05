for x in *.gpx ; do
  if [[ ! -f ${x}.json ]] ; then
    echo "[" > ${x}.tmp
    cat ${x} | grep "<trkpt" | sed -e 's/.*trkpt lat="\(.*\)" lon="\(.*\)">/{ "lat": \1, "lng": \2 },/' | sed '$ s/.$//' >> ${x}.tmp
    echo "]" >> ${x}.tmp
    cat ${x}.tmp | ./simplify.py > ${x}.json
    rm ${x}.tmp
  fi
done
cat <<EOM
HTTP/1.0 200 OK
Content-Type: application/json

EOM
echo "["
comma=""
for x in *.gpx.json ; do 
  echo "${comma}\"${x}\""
  comma=","
done
echo "]"

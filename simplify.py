#!/opt/bin/python3

import math;
import json;
import sys;

class Point:
  def __init__(self,lat,lng):
    self.lat = lat
    self.lng = lng

  def __str__(self):
    return "({},{})".format(self.lat, self.lng)

class Line:
  def __init__(self,p1,p2):
    self.p1 = p1
    self.p2 = p2

  def distanceToPoint(self,point):
    # slope 
    if (self.p2.lat == self.p1.lat):
      m = 9999
    else:
      m = (self.p2.lng - self.p1.lng) / (self.p2.lat - self.p1.lat)
    # y offset 
    b = self.p1.lng - (m*self.p1.lat)
    d = []
    d.append(abs(point.lng - (m*point.lat) - b) / math.sqrt(pow(m,2)+1))
    d.append(math.sqrt(pow((point.lat - self.p1.lat),2) + pow((point.lng - self.p1.lng),2)))
    d.append(math.sqrt(pow((point.lat - self.p2.lat),2) + pow((point.lng - self.p2.lng),2)))
    d.sort(key=lambda a: abs(a))
    #print("{}, {}, {}, {}, {}, {}, {}".format(self.p1, self.p2, point, m, b, d,abs(d[0])))
    return abs(d[0])

def douglasPeucker(points, tolerance,text):
  #print("Checking {} {} {}, {}".format(text,len(points),points[0],points[-1]))
  if (len(points) <= 2):
    return points[0:1]

  # make a line from start to end
  line = Line(points[0],points[-1])
  # find the largest distence from intermediate points to this line
  maxDistance = 0
  maxDistanceIndex = 0
  for i in range(len(points)):
    distance = line.distanceToPoint(points[i])
    if (distance > maxDistance):
      maxDistance = distance
      maxDistanceIndex = i

  #print("{} at {} for {}".format(maxDistance,maxDistanceIndex,points[maxDistanceIndex]))
  if (maxDistance > tolerance):
    p = points[maxDistanceIndex]
    part1 = points[0:maxDistanceIndex+1]
    part2 = points[maxDistanceIndex:]
    #print("{},{},{} - {},{},{}".format(part1[0], part1[-1], len(part1),part2[0], part2[-1], len(part2)))
    return douglasPeucker(part1,tolerance,"even") + douglasPeucker(part2,tolerance,"odd")
  else:
    # nothing to keep
    #print("Nothing to keep {}".format(maxDistance))
    #print("Returning {}, {}".format(points[0], points[-1]))
    return [points[0],points[-1]]

json = json.load(sys.stdin)
points = [Point(x["lat"],x["lng"]) for x in json]
simplified = douglasPeucker(points,0.00005,"whole")
simplified.append(points[-1])
print("[ ")
comma = ""
for point in simplified:
  print("{}{{ \"lat\": {}, \"lng\": {} }}".format(comma,point.lat, point.lng))
  comma = ", "
print( "]")

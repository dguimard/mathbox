window.MathBox.Shaders = {"axis.position": "uniform vec4 axisStep;\nuniform vec4 axisPosition;\n\nvec4 getAxisPosition(vec2 uv) {\n  return axisStep * uv.x + axisPosition;\n}\n",
"cartesian.position": "uniform mat4 cartesianMatrix;\n\nvec4 getCartesianPosition(vec4 position) {\n  return cartesianMatrix * vec4(position.xyz, 1.0);\n}\n",
"grid.position": "uniform vec4 gridPosition;\nuniform vec4 gridStep;\nuniform vec4 gridAxis;\n\nvec4 sampleData(vec2 xy);\n\nvec4 getGridPosition(vec2 uv) {\n  vec4 onAxis  = gridAxis * sampleData(vec2(uv.y, 0.0)).x;\n  vec4 offAxis = gridStep * uv.x + gridPosition;\n  return onAxis + offAxis;\n}\n",
"line.color": "uniform vec3 lineColor;\nuniform float lineOpacity;\n\nvoid setLineColor() {\n\tgl_FragColor = vec4(lineColor, lineOpacity);\n}\n",
"line.position": "uniform float lineWidth;\nattribute vec2 line;\n\n// External\nvec3 getPosition(vec2 xy);\n\nvoid getLineGeometry(vec2 xy, float edge, inout vec3 left, inout vec3 center, inout vec3 right) {\n  vec2 delta = vec2(1.0, 0.0);\n\n  center =                 getPosition(xy);\n  left   = (edge > -0.5) ? getPosition(xy - delta) : center;\n  right  = (edge < 0.5)  ? getPosition(xy + delta) : center;\n}\n\nvec3 getLineJoin(float edge, vec3 left, vec3 center, vec3 right) {\n  vec2 join = vec2(1.0, 0.0);\n\n  if (center.z < 0.0) {\n    vec4 a = vec4(left.xy, right.xy);\n    vec4 b = a / vec4(left.zz, right.zz);\n\n    vec2 l = b.xy;\n    vec2 r = b.zw;\n    vec2 c = center.xy / center.z;\n\n    vec4 d = vec4(c, l) - vec4(r, c);\n    float l1 = dot(d.xy, d.xy);\n    float l2 = dot(d.zw, d.zw);\n\n    if (l1 + l2 > 0.0) {\n      \n      if (edge > 0.5 || l1 == 0.0) {\n        vec2 nl = normalize(l - c);\n        vec2 tl = vec2(nl.y, -nl.x);\n\n        join = tl;\n      }\n      else if (edge < -0.5 || l2 == 0.0) {\n        vec2 nr = normalize(c - r);\n        vec2 tr = vec2(nr.y, -nr.x);\n\n        join = tr;\n      }\n      else {\n        vec2 nl = normalize(d.xy);\n        vec2 nr = normalize(d.zw);\n\n        vec2 tl = vec2(nl.y, -nl.x);\n        vec2 tr = vec2(nr.y, -nr.x);\n\n        vec2 tc = normalize(tl + tr);\n      \n        float cosA = dot(nl, tc);\n        float sinA = max(0.1, abs(dot(tl, tc)));\n        float factor = cosA / sinA;\n        float scale = sqrt(1.0 + factor * factor);\n\n        join = tc * scale;\n      }\n    }\n    else {\n      return vec3(0.0);\n    }\n  }\n    \n  return vec3(join, 0.0);\n}\n\nvec3 getLinePosition() {\n  vec3 left, center, right, join;\n\n  float edge = line.x;\n  float offset = line.y;\n\n  getLineGeometry(position.xy, edge, left, center, right);\n  join = getLineJoin(edge, left, center, right);\n  return center + join * offset * lineWidth;\n}\n",
"project.position": "void setPosition(vec3 position) {\n  gl_Position = projectionMatrix * vec4(position, 1.0);\n}\n",
"sample.2d.1": "uniform sampler2D dataTexture;\nuniform vec2 dataResolution;\nuniform vec2 dataPointer;\n\nvec4 sampleData(vec2 xy) {\n  vec2 uv = fract((xy + dataPointer) * dataResolution);\n  return vec4(texture2D(dataTexture, uv).x, 0.0, 0.0, 0.0);\n}\n",
"sample.2d.2": "uniform sampler2D dataTexture;\nuniform vec2 dataResolution;\nuniform vec2 dataPointer;\n\nvec4 sampleData(vec2 xy) {\n  vec2 uv = fract((xy + dataPointer) * dataResolution);\n  return vec4(texture2D(dataTexture, uv).xw, 0.0, 0.0);\n}\n",
"sample.2d.3": "uniform sampler2D dataTexture;\nuniform vec2 dataResolution;\nuniform vec2 dataPointer;\n\nvec4 sampleData(vec2 xy) {\n  vec2 uv = fract((xy + dataPointer) * dataResolution);\n  return vec4(texture2D(dataTexture, uv).xyz, 0.0);\n}\n",
"sample.2d.4": "uniform sampler2D dataTexture;\nuniform vec2 dataResolution;\nuniform vec2 dataPointer;\n\nvec4 sampleData(vec2 xy) {\n  vec2 uv = fract((xy + dataPointer) * dataResolution);\n  return texture2D(dataTexture, uv);\n}\n",
"ticks.position": "uniform float tickSize;\nuniform vec4  tickAxis;\nuniform vec4  tickNormal;\n\nvec4 sampleData(vec2 xy);\n\nvec3 transformPosition(vec4 value);\n\nvec3 getTickPosition(vec2 xy) {\n\n  const float epsilon = 0.0001;\n  float line = xy.x * 2.0 - 1.0;\n\n  vec4 center = tickAxis * sampleData(vec2(xy.y, 0.0));\n  vec4 edge   = tickNormal * epsilon;\n\n  vec4 a = center;\n  vec4 b = center + edge;\n\n  vec3 c = transformPosition(a);\n  vec3 d = transformPosition(b);\n  \n  vec3 mid  = c;\n  vec3 side = normalize(d - c);\n\n  return mid + side * line * tickSize;\n}\n",
"view.position": "vec3 getViewPosition(vec4 position) {\n  return (modelViewMatrix * vec4(position.xyz, 1.0)).xyz;\n}"};
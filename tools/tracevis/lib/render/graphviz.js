/*
 * Copyright 2012 LinkedIn, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var dot = require('graphlib-dot'),
    dotify = require('../trace/dotify'),
    sha1 = require('sha1');

module.exports = render;

function render(root, graph) {
  root.classed('graphvizview', true);

  var graph = dotify(graph);
  var dotFormat = dot.write(graph);
  var hash = sha1(dotFormat);
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      root.select('#graphviz-info').remove();
      root.select('#graphviz-img').remove();
      root.append('div')
        .attr('class', 'alert alert-info')
        .attr('id', 'graphviz-info')
        .text('You can use zooming and panning on a diagram below.');
      root.append('object')
        .attr('id', 'graphviz-img')
        .attr('type', 'image/svg+xml')
        .style('width', '100%')
        .style('height', '600px')
        .attr('data', 'cache/' + hash + '.svg');
      setTimeout(function() { root.select('#graphviz-info').remove(); }, 5000);
    } else {
      var textarea = root.append('textarea')
        .style('width', '100%')
        .style('height', '600px');
      textarea.text(dot.write(graph));
      alert('Contacting TracevisServer failed, status: ' + xhr.status + '\n' + xhr.responseText);
    }
  }
  }
  xhr.open("POST", "dot?hash=" + hash , true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.send(dotFormat);
}

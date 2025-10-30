(async function() {
  'use strict';
  'use strict';
  var Async_jetstream, FS, GUY, Jetstream, PATH, SFMODULES, Xsqk_differ, alert, debug, demo, diff_cmd, diff_cwd, echo, freeze, help, html_start_tags, html_start_tags_path, info, inspect, lets, log, plain, praise, reverse, rpr, sfmodules_path, sfmodules_resources_path, type_of, urge, walk_lines, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('xsqk'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  // WGUY                      = require '../../../apps/webguy'
  // { f }                     = require '../../../apps/effstring'
  //-----------------------------------------------------------------------------------------------------------
  ({freeze, lets} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  SFMODULES = require('bricabrac-sfmodules');

  ({type_of} = SFMODULES.unstable.require_type_of());

  ({Jetstream, Async_jetstream} = SFMODULES.require_jetstream());

  ({
    walk_lines_with_positions: walk_lines
  } = SFMODULES.unstable.require_fast_linereader());

  //-----------------------------------------------------------------------------------------------------------
  PATH = require('node:path');

  FS = require('node:fs');

  //-----------------------------------------------------------------------------------------------------------
  sfmodules_path = PATH.dirname(require.resolve('bricabrac-sfmodules/package.json'));

  sfmodules_resources_path = PATH.join(sfmodules_path, 'resources');

  html_start_tags_path = PATH.join(sfmodules_resources_path, 'dont-forget-these-html-tags.html');

  html_start_tags = FS.readFileSync(html_start_tags_path, {
    encoding: 'utf-8'
  });

  //-----------------------------------------------------------------------------------------------------------
  diff_cmd = `git diff --no-index --word-diff=plain --word-diff-regex=. filtered.old.md filtered.new.md > diff.txt`;

  diff_cwd = PATH.resolve(__dirname, '../comparison/result');

  //===========================================================================================================
  Xsqk_differ = class Xsqk_differ {
    // #---------------------------------------------------------------------------------------------------------
    // constructor: ->
    //   ;undefined

      //---------------------------------------------------------------------------------------------------------
    async write_report() {
      var add_divs, append_eof, clear_file, diff_path, eof, erase_blocks, filter_diff_start, first, jet, last, line, lnr, prepend_css, prepend_html, record_swaps, report_path, translate_changes, translate_headings, write_output, x;
      first = Symbol('first');
      last = Symbol('last');
      //.......................................................................................................
      // old_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.old.md'
      // new_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.new.md'
      diff_path = PATH.resolve(__dirname, '../comparison/result/diff.txt');
      report_path = PATH.resolve(__dirname, '../comparison/result/report.html');
      //.......................................................................................................
      jet = new Async_jetstream();
      // jet.push ( d ) -> debug 'Ωxsqk___1', d
      //.......................................................................................................
      jet.push(erase_blocks = function*(d) {
        if (d.type !== 'raw') {
          return (yield d);
        }
        yield lets(d, function(d) {
          return d.line = d.line.replace(/█/gv, '');
        });
        return null;
      });
      //.......................................................................................................
      jet.push(filter_diff_start = function*(d) {
        if (d.line === '') {
          // debug 'Ωxsqk___2', ( rpr d )[ .. 100 ]
          return null;
        }
        if (d.line.startsWith('diff --git')) {
          return null;
        }
        if (d.line.startsWith('index ')) {
          return null;
        }
        if (d.line.startsWith('--- ')) {
          return null;
        }
        if (d.line.startsWith('+++ ')) {
          return null;
        }
        if (d.line.startsWith('@@ ')) {
          return null;
        }
        d = lets(d, function(d) {
          return d.type = 'markdown';
        });
        yield d;
        return null;
      });
      //.......................................................................................................
      jet.push('#last,data', record_swaps = (function() {
        var swaps;
        swaps = new Set();
        //.....................................................................................................
        return function*(d) {
          var del, ins, match, matches, swap;
          if (d === last) {
            for (swap of swaps) {
              yield freeze({
                type: 'html',
                line: `<div>${swap}</div>\n`
              });
            }
            return null;
          }
          if (d.type !== 'markdown') {
            //...................................................................................................
            return (yield d);
          }
          //...................................................................................................
          matches = d.line.matchAll(/\[-(?<del>.)-\]\{\+(?<ins>.)\+\}/gv);
          matches = [...matches];
          if (matches.length > 0) {
            for (match of matches) {
              ({del, ins} = match.groups);
              debug('Ωxsqk___3', {del, ins});
              swaps.add(`${del}->${ins}`);
            }
          }
          return (yield d);
        };
      })());
      //.......................................................................................................
      jet.push(translate_changes = function*(d) {
        yield lets(d, function(d) {
          // d.type = 'html'
          d.line = d.line.replace(/\[-/gv, '<del>');
          d.line = d.line.replace(/-\]/gv, '</del>');
          d.line = d.line.replace(/\{\+/gv, '<ins>');
          return d.line = d.line.replace(/\+\}/gv, '</ins>');
        });
        // d.line = "\n<div>#{d.line}</div>\n\n"
        return null;
      });
      //.......................................................................................................
      jet.push(translate_headings = function*(d) {
        var hashes, heading, match, tag_name;
        if (d.type !== 'markdown') {
          return (yield d);
        }
        if ((match = d.line.match(/^(?<hashes>#{1,6})\s(?<heading>.*)$/)) == null) {
          return (yield d);
        }
        ({hashes, heading} = match.groups);
        tag_name = `h${hashes.length}`;
        // heading       = heading.replace /№\s*/gv, ''
        yield lets(d, function(d) {
          d.type = 'html';
          return d.line = `\n\n<${tag_name}>${heading}</${tag_name}>\n`;
        });
        return null;
      });
      //.......................................................................................................
      jet.push(add_divs = function*(d) {
        if (d.type !== 'markdown') {
          return (yield d);
        }
        yield lets(d, function(d) {
          d.type = 'html';
          return d.line = `\n<div>${d.line}</div>\n`;
        });
        return null;
      });
      //.......................................................................................................
      jet.push('#first', clear_file = function(d) {
        return FS.writeFileSync(report_path, '');
      });
      jet.push('#first', prepend_css = function*(d) {
        yield d;
        yield freeze({
          type: 'html',
          line: "<link rel=stylesheet href='./diff.css'>"
        });
        return null;
      });
      jet.push('#first', prepend_html = function*(d) {
        yield d;
        yield freeze({
          type: 'html',
          line: html_start_tags
        });
        return null;
      });
      jet.push('#last', append_eof = function*(d) {
        yield ({
          line: '<!-- eof -->'
        });
        yield d;
        return null;
      });
      jet.push('*', function(d) {
        return whisper('Ωxsqk___4', (rpr(d)).slice(0, 101));
      });
      //.......................................................................................................
      jet.push(write_output = function*(d) {
        if (d.type !== 'html') {
          return (yield d);
        }
        FS.appendFileSync(report_path, d.line);
        yield d;
        return null;
      });
      //.......................................................................................................
      // for { line, } from walk_lines_with_positions old_path
      //   jet.send { version: 'old', line, }
      jet.send(first);
      for (x of walk_lines(diff_path)) {
        ({lnr, line, eof} = x);
        jet.send(freeze({
          type: 'raw',
          lnr,
          line
        }));
      }
      jet.send(last);
      await jet.run();
      //.......................................................................................................
      return null;
    }

  };

  //===========================================================================================================
  demo = function() {
    new Xsqk_differ().write_report();
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      return (await demo());
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUE7RUFHQTtBQUhBLE1BQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsZUFBQSxFQUFBLG9CQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxjQUFBLEVBQUEsd0JBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUE7O0VBS0EsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQixNQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsT0FIRixFQUlFLEdBSkYsQ0FBQSxHQUk0QixHQUFHLENBQUMsR0FKaEMsRUFmQTs7Ozs7RUF1QkEsQ0FBQSxDQUFFLE1BQUYsRUFDRSxJQURGLENBQUEsR0FDNEIsT0FBQSxDQUFRLGdCQUFSLENBRDVCLEVBdkJBOzs7RUEwQkEsU0FBQSxHQUE0QixPQUFBLENBQVEscUJBQVI7O0VBQzVCLENBQUEsQ0FBRSxPQUFGLENBQUEsR0FBNEIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFuQixDQUFBLENBQTVCOztFQUNBLENB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UyxDQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUE7YUFDdEMsQ0FBQSxNQUFNLElBQUEsQ0FBQSxDQUFOO0lBRHNDLENBQUEsSUFBeEM7O0FBaEtBIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbid1c2Ugc3RyaWN0J1xuXG5cbid1c2Ugc3RyaWN0J1xuXG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ3hzcWsnXG57IHJwclxuICBpbnNwZWN0XG4gIGVjaG9cbiAgcmV2ZXJzZVxuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMgV0dVWSAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvd2ViZ3V5J1xuIyB7IGYgfSAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9lZmZzdHJpbmcnXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnsgZnJlZXplLFxuICBsZXRzLCAgICAgICAgICAgICAgICAgfSA9IHJlcXVpcmUgJ2xldHNmcmVlemV0aGF0J1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5TRk1PRFVMRVMgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcydcbnsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMudW5zdGFibGUucmVxdWlyZV90eXBlX29mKClcbnsgSmV0c3RyZWFtLFxuICBBc3luY19qZXRzdHJlYW0sICAgICAgfSA9IFNGTU9EVUxFUy5yZXF1aXJlX2pldHN0cmVhbSgpXG57IHdhbGtfbGluZXNfd2l0aF9wb3NpdGlvbnM6IFxcXG4gICAgd2Fsa19saW5lcywgICAgICAgICB9ID0gU0ZNT0RVTEVTLnVuc3RhYmxlLnJlcXVpcmVfZmFzdF9saW5lcmVhZGVyKClcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUEFUSCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbkZTICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zZm1vZHVsZXNfcGF0aCAgICAgICAgICAgID0gUEFUSC5kaXJuYW1lIHJlcXVpcmUucmVzb2x2ZSAnYnJpY2FicmFjLXNmbW9kdWxlcy9wYWNrYWdlLmpzb24nXG5zZm1vZHVsZXNfcmVzb3VyY2VzX3BhdGggID0gUEFUSC5qb2luIHNmbW9kdWxlc19wYXRoLCAncmVzb3VyY2VzJ1xuaHRtbF9zdGFydF90YWdzX3BhdGggICAgICA9IFBBVEguam9pbiBzZm1vZHVsZXNfcmVzb3VyY2VzX3BhdGgsICdkb250LWZvcmdldC10aGVzZS1odG1sLXRhZ3MuaHRtbCdcbmh0bWxfc3RhcnRfdGFncyAgICAgICAgICAgPSBGUy5yZWFkRmlsZVN5bmMgaHRtbF9zdGFydF90YWdzX3BhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIH1cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZGlmZl9jbWQgICAgICAgICAgICAgICAgICA9IFwiXCJcImdpdCBkaWZmIC0tbm8taW5kZXggLS13b3JkLWRpZmY9cGxhaW4gLS13b3JkLWRpZmYtcmVnZXg9LiBmaWx0ZXJlZC5vbGQubWQgZmlsdGVyZWQubmV3Lm1kID4gZGlmZi50eHRcIlwiXCJcbmRpZmZfY3dkICAgICAgICAgICAgICAgICAgPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4vY29tcGFyaXNvbi9yZXN1bHQnXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBYc3FrX2RpZmZlclxuXG4gICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIGNvbnN0cnVjdG9yOiAtPlxuICAjICAgO3VuZGVmaW5lZFxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgd3JpdGVfcmVwb3J0OiAtPlxuICAgIGZpcnN0ID0gU3ltYm9sICdmaXJzdCdcbiAgICBsYXN0ICA9IFN5bWJvbCAnbGFzdCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgb2xkX3BhdGggPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4nLCAnY29tcGFyaXNvbi9yZXN1bHQvZmlsdGVyZWQub2xkLm1kJ1xuICAgICMgbmV3X3BhdGggPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4nLCAnY29tcGFyaXNvbi9yZXN1bHQvZmlsdGVyZWQubmV3Lm1kJ1xuICAgIGRpZmZfcGF0aCAgID0gUEFUSC5yZXNvbHZlIF9fZGlybmFtZSwgJy4uL2NvbXBhcmlzb24vcmVzdWx0L2RpZmYudHh0J1xuICAgIHJlcG9ydF9wYXRoID0gUEFUSC5yZXNvbHZlIF9fZGlybmFtZSwgJy4uL2NvbXBhcmlzb24vcmVzdWx0L3JlcG9ydC5odG1sJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgamV0ID0gbmV3IEFzeW5jX2pldHN0cmVhbSgpXG4gICAgIyBqZXQucHVzaCAoIGQgKSAtPiBkZWJ1ZyAnzql4c3FrX19fMScsIGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGpldC5wdXNoIGVyYXNlX2Jsb2NrcyA9ICggZCApIC0+XG4gICAgICByZXR1cm4geWllbGQgZCB1bmxlc3MgZC50eXBlIGlzICdyYXcnXG4gICAgICB5aWVsZCBsZXRzIGQsICggZCApIC0+IGQubGluZSA9IGQubGluZS5yZXBsYWNlIC/ilogvZ3YsICcnXG4gICAgICA7bnVsbFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgamV0LnB1c2ggZmlsdGVyX2RpZmZfc3RhcnQgPSAoIGQgKSAtPlxuICAgICAgIyBkZWJ1ZyAnzql4c3FrX19fMicsICggcnByIGQgKVsgLi4gMTAwIF1cbiAgICAgIHJldHVybiBudWxsIGlmIGQubGluZSBpcyAnJ1xuICAgICAgcmV0dXJuIG51bGwgaWYgZC5saW5lLnN0YXJ0c1dpdGggJ2RpZmYgLS1naXQnXG4gICAgICByZXR1cm4gbnVsbCBpZiBkLmxpbmUuc3RhcnRzV2l0aCAnaW5kZXggJ1xuICAgICAgcmV0dXJuIG51bGwgaWYgZC5saW5lLnN0YXJ0c1dpdGggJy0tLSAnXG4gICAgICByZXR1cm4gbnVsbCBpZiBkLmxpbmUuc3RhcnRzV2l0aCAnKysrICdcbiAgICAgIHJldHVybiBudWxsIGlmIGQubGluZS5zdGFydHNXaXRoICdAQCAnXG4gICAgICBkID0gbGV0cyBkLCAoIGQgKSAtPiBkLnR5cGUgPSAnbWFya2Rvd24nXG4gICAgICB5aWVsZCBkXG4gICAgICA7bnVsbFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgamV0LnB1c2ggJyNsYXN0LGRhdGEnLCByZWNvcmRfc3dhcHMgPSBkbyAtPlxuICAgICAgc3dhcHMgPSBuZXcgU2V0KClcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgcmV0dXJuICggZCApIC0+XG4gICAgICAgIGlmIGQgaXMgbGFzdFxuICAgICAgICAgIGZvciBzd2FwIGZyb20gc3dhcHNcbiAgICAgICAgICAgIHlpZWxkIGZyZWV6ZSB7IHR5cGU6ICdodG1sJywgbGluZTogXCI8ZGl2PiN7c3dhcH08L2Rpdj5cXG5cIiwgfVxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIHlpZWxkIGQgdW5sZXNzIGQudHlwZSBpcyAnbWFya2Rvd24nXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbWF0Y2hlcyA9IGQubGluZS5tYXRjaEFsbCAvXFxbLSg/PGRlbD4uKS1cXF1cXHtcXCsoPzxpbnM+LilcXCtcXH0vZ3ZcbiAgICAgICAgbWF0Y2hlcyA9IFsgbWF0Y2hlcy4uLiwgXVxuICAgICAgICBpZiBtYXRjaGVzLmxlbmd0aCA+IDBcbiAgICAgICAgICBmb3IgbWF0Y2ggZnJvbSBtYXRjaGVzXG4gICAgICAgICAgICB7IGRlbCxcbiAgICAgICAgICAgICAgaW5zLCB9ID0gbWF0Y2guZ3JvdXBzXG4gICAgICAgICAgICBkZWJ1ZyAnzql4c3FrX19fMycsIHsgZGVsLCBpbnMsIH1cbiAgICAgICAgICAgIHN3YXBzLmFkZCBcIiN7ZGVsfS0+I3tpbnN9XCJcbiAgICAgICAgeWllbGQgZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgamV0LnB1c2ggdHJhbnNsYXRlX2NoYW5nZXMgPSAoIGQgKSAtPlxuICAgICAgeWllbGQgbGV0cyBkLCAoIGQgKSAtPlxuICAgICAgICAjIGQudHlwZSA9ICdodG1sJ1xuICAgICAgICBkLmxpbmUgPSBkLmxpbmUucmVwbGFjZSAvXFxbLS9ndiwgICAnPGRlbD4nXG4gICAgICAgIGQubGluZSA9IGQubGluZS5yZXBsYWNlIC8tXFxdL2d2LCAgICc8L2RlbD4nXG4gICAgICAgIGQubGluZSA9IGQubGluZS5yZXBsYWNlIC9cXHtcXCsvZ3YsICAnPGlucz4nXG4gICAgICAgIGQubGluZSA9IGQubGluZS5yZXBsYWNlIC9cXCtcXH0vZ3YsICAnPC9pbnM+J1xuICAgICAgICAjIGQubGluZSA9IFwiXFxuPGRpdj4je2QubGluZX08L2Rpdj5cXG5cXG5cIlxuICAgICAgO251bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGpldC5wdXNoIHRyYW5zbGF0ZV9oZWFkaW5ncyA9ICggZCApIC0+XG4gICAgICByZXR1cm4geWllbGQgZCB1bmxlc3MgZC50eXBlIGlzICdtYXJrZG93bidcbiAgICAgIHJldHVybiB5aWVsZCBkIHVubGVzcyAoIG1hdGNoID0gZC5saW5lLm1hdGNoIC9eKD88aGFzaGVzPiN7MSw2fSlcXHMoPzxoZWFkaW5nPi4qKSQvICk/XG4gICAgICB7IGhhc2hlcyxcbiAgICAgICAgaGVhZGluZywgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIHRhZ19uYW1lICAgICAgPSBcImgje2hhc2hlcy5sZW5ndGh9XCJcbiAgICAgICMgaGVhZGluZyAgICAgICA9IGhlYWRpbmcucmVwbGFjZSAv4oSWXFxzKi9ndiwgJydcbiAgICAgIHlpZWxkIGxldHMgZCwgKCBkICkgLT5cbiAgICAgICAgZC50eXBlID0gJ2h0bWwnXG4gICAgICAgIGQubGluZSA9IFwiXFxuXFxuPCN7dGFnX25hbWV9PiN7aGVhZGluZ308LyN7dGFnX25hbWV9PlxcblwiXG4gICAgICA7bnVsbFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgamV0LnB1c2ggYWRkX2RpdnMgPSAoIGQgKSAtPlxuICAgICAgcmV0dXJuIHlpZWxkIGQgdW5sZXNzIGQudHlwZSBpcyAnbWFya2Rvd24nXG4gICAgICB5aWVsZCBsZXRzIGQsICggZCApIC0+XG4gICAgICAgIGQudHlwZSA9ICdodG1sJ1xuICAgICAgICBkLmxpbmUgPSBcIlxcbjxkaXY+I3tkLmxpbmV9PC9kaXY+XFxuXCJcbiAgICAgIDtudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBqZXQucHVzaCAnI2ZpcnN0JywgY2xlYXJfZmlsZSAgID0gKCBkICkgLT4gRlMud3JpdGVGaWxlU3luYyByZXBvcnRfcGF0aCwgJydcbiAgICBqZXQucHVzaCAnI2ZpcnN0JywgcHJlcGVuZF9jc3MgID0gKCBkICkgLT4geWllbGQgZDsgeWllbGQgZnJlZXplIHsgdHlwZTogJ2h0bWwnLCBsaW5lOiBcIjxsaW5rIHJlbD1zdHlsZXNoZWV0IGhyZWY9Jy4vZGlmZi5jc3MnPlwiLCB9IDtudWxsXG4gICAgamV0LnB1c2ggJyNmaXJzdCcsIHByZXBlbmRfaHRtbCA9ICggZCApIC0+IHlpZWxkIGQ7IHlpZWxkIGZyZWV6ZSB7IHR5cGU6ICdodG1sJywgbGluZTogaHRtbF9zdGFydF90YWdzLCB9IDtudWxsXG4gICAgamV0LnB1c2ggJyNsYXN0JywgIGFwcGVuZF9lb2YgICA9ICggZCApIC0+IHlpZWxkIHsgbGluZTogJzwhLS0gZW9mIC0tPicsIH07IHlpZWxkIGQgO251bGxcbiAgICBqZXQucHVzaCAnKicsICggZCApIC0+IHdoaXNwZXIgJ86peHNxa19fXzQnLCAoIHJwciBkIClbIC4uIDEwMCBdXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBqZXQucHVzaCB3cml0ZV9vdXRwdXQgPSAoIGQgKSAtPlxuICAgICAgcmV0dXJuIHlpZWxkIGQgdW5sZXNzIGQudHlwZSBpcyAnaHRtbCdcbiAgICAgIEZTLmFwcGVuZEZpbGVTeW5jIHJlcG9ydF9wYXRoLCBkLmxpbmVcbiAgICAgIHlpZWxkIGRcbiAgICAgIDtudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIGZvciB7IGxpbmUsIH0gZnJvbSB3YWxrX2xpbmVzX3dpdGhfcG9zaXRpb25zIG9sZF9wYXRoXG4gICAgIyAgIGpldC5zZW5kIHsgdmVyc2lvbjogJ29sZCcsIGxpbmUsIH1cbiAgICBqZXQuc2VuZCBmaXJzdFxuICAgIGZvciB7IGxuciwgbGluZSwgZW9mLCB9IGZyb20gd2Fsa19saW5lcyBkaWZmX3BhdGhcbiAgICAgIGpldC5zZW5kIGZyZWV6ZSB7IHR5cGU6ICdyYXcnLCBsbnIsIGxpbmUsIH1cbiAgICBqZXQuc2VuZCBsYXN0XG4gICAgYXdhaXQgamV0LnJ1bigpXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICA7bnVsbFxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlbW8gPSAtPlxuICAoIG5ldyBYc3FrX2RpZmZlcigpLndyaXRlX3JlcG9ydCgpIClcbiAgO251bGxcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gYXdhaXQgZG8gPT5cbiAgYXdhaXQgZGVtbygpXG5cbiJdfQ==

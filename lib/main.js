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
      var add_divs, add_title, append_eof, clear_file, diff_path, eof, erase_blocks, filter_diff_start, first, jet, last, line, lnr, prepend_css, prepend_html, record_swaps, report_path, translate_changes, translate_headings, write_output, x;
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
        yield d;
        return null;
      });
      //.......................................................................................................
      jet.push(erase_blocks = function*(d) {
        if (d.type !== 'raw') {
          return (yield d);
        }
        yield lets(d, function(d) {
          // d.line = d.line.replace /█/gv, ''
          return d.type = 'markdown';
        });
        return null;
      });
      //.......................................................................................................
      jet.push('#last,data', (record_swaps = function() {
        var swaps;
        swaps = new Set();
        //.....................................................................................................
        return function*(d) {
          var del, ins, match, matches, swap;
          if (d === last) {
            yield freeze({
              type: 'html',
              line: "<swaps>\n"
            });
            for (swap of swaps) {
              yield freeze({
                type: 'html',
                line: `<div>${swap}</div>\n`
              });
            }
            yield freeze({
              type: 'html',
              line: "</swaps>\n"
            });
            return null;
          }
          if (d.type !== 'markdown') {
            //...................................................................................................
            return (yield d);
          }
          //...................................................................................................
          matches = d.line.matchAll(/\[-(?<del>[^\]\}]+)-\]\{\+(?<ins>[^\]\}]+)\+\}/gv);
          matches = [...matches];
          if (matches.length > 0) {
            for (match of matches) {
              ({del, ins} = match.groups);
              debug('Ωxsqk___3', {del, ins});
              swaps.add(`${del}▶${ins}`);
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
        if ((match = d.line.match(/^(?<hashes>#{1,6})\s(?<heading>.*)$/v)) == null) {
          return (yield d);
        }
        ({hashes, heading} = match.groups);
        tag_name = `h${hashes.length}`;
        // heading       = heading.replace /№\s*/gv, ''
        yield lets(d, function(d) {
          d.type = 'html';
          return d.line = `\n\n<article><${tag_name}>${heading}</${tag_name}>\n`;
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
          return d.line = `\n<div>${d.line}</div></article>\n`;
        });
        return null;
      });
      //.......................................................................................................
      jet.push('#first', add_title = function*(d) {
        yield d;
        yield ({
          type: 'html',
          line: "\n<h1>《谿山琴况》</h1>\n"
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUE7RUFHQTtBQUhBLE1BQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsZUFBQSxFQUFBLG9CQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxjQUFBLEVBQUEsd0JBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUE7O0VBS0EsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQixNQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsT0FIRixFQUlFLEdBSkYsQ0FBQSxHQUk0QixHQUFHLENBQUMsR0FKaEMsRUFmQTs7Ozs7RUF1QkEsQ0FBQSxDQUFFLE1BQUYsRUFDRSxJQURGLENBQUEsR0FDNEIsT0FBQSxDQUFRLGdCQUFSLENBRDVCLEVBdkJBOzs7RUEwQkEsU0FBQSxHQUE0QixPQUFBLENBQVEscUJBQVI7O0VBQzVCLENBQUEsQ0FBRSxPQUFGLENBQUEsR0FBNEIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFuQixDQUFBLENBQTVCOztFQUNBLENB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Q0FBQSxFQXhHVjs7YUEwR0s7SUEzR1c7O0VBUGhCLEVBOUNBOzs7RUFtS0EsSUFBQSxHQUFPLFFBQUEsQ0FBQSxDQUFBO0lBQ0gsSUFBSSxXQUFKLENBQUEsQ0FBaUIsQ0FBQyxZQUFsQixDQUFBO1dBQ0Q7RUFGSSxFQW5LUDs7O0VBd0tBLElBQUcsTUFBQSxLQUFVLE9BQU8sQ0FBQyxJQUFyQjtJQUErQixNQUFTLENBQUEsS0FBQSxDQUFBLENBQUEsR0FBQTthQUN0QyxDQUFBLE1BQU0sSUFBQSxDQUFBLENBQU47SUFEc0MsQ0FBQSxJQUF4Qzs7QUF4S0EiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuJ3VzZSBzdHJpY3QnXG5cblxuJ3VzZSBzdHJpY3QnXG5cbkdVWSAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdndXknXG57IGFsZXJ0XG4gIGRlYnVnXG4gIGhlbHBcbiAgaW5mb1xuICBwbGFpblxuICBwcmFpc2VcbiAgdXJnZVxuICB3YXJuXG4gIHdoaXNwZXIgfSAgICAgICAgICAgICAgID0gR1VZLnRybS5nZXRfbG9nZ2VycyAneHNxaydcbnsgcnByXG4gIGluc3BlY3RcbiAgZWNob1xuICByZXZlcnNlXG4gIGxvZyAgICAgfSAgICAgICAgICAgICAgID0gR1VZLnRybVxuIyBXR1VZICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy93ZWJndXknXG4jIHsgZiB9ICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2VmZnN0cmluZydcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxueyBmcmVlemUsXG4gIGxldHMsICAgICAgICAgICAgICAgICB9ID0gcmVxdWlyZSAnbGV0c2ZyZWV6ZXRoYXQnXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblNGTU9EVUxFUyAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdicmljYWJyYWMtc2Ztb2R1bGVzJ1xueyB0eXBlX29mLCAgICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy51bnN0YWJsZS5yZXF1aXJlX3R5cGVfb2YoKVxueyBKZXRzdHJlYW0sXG4gIEFzeW5jX2pldHN0cmVhbSwgICAgICB9ID0gU0ZNT0RVTEVTLnJlcXVpcmVfamV0c3RyZWFtKClcbnsgd2Fsa19saW5lc193aXRoX3Bvc2l0aW9uczogXFxcbiAgICB3YWxrX2xpbmVzLCAgICAgICAgIH0gPSBTRk1PRFVMRVMudW5zdGFibGUucmVxdWlyZV9mYXN0X2xpbmVyZWFkZXIoKVxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QQVRIICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpwYXRoJ1xuRlMgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnNmbW9kdWxlc19wYXRoICAgICAgICAgICAgPSBQQVRILmRpcm5hbWUgcmVxdWlyZS5yZXNvbHZlICdicmljYWJyYWMtc2Ztb2R1bGVzL3BhY2thZ2UuanNvbidcbnNmbW9kdWxlc19yZXNvdXJjZXNfcGF0aCAgPSBQQVRILmpvaW4gc2Ztb2R1bGVzX3BhdGgsICdyZXNvdXJjZXMnXG5odG1sX3N0YXJ0X3RhZ3NfcGF0aCAgICAgID0gUEFUSC5qb2luIHNmbW9kdWxlc19yZXNvdXJjZXNfcGF0aCwgJ2RvbnQtZm9yZ2V0LXRoZXNlLWh0bWwtdGFncy5odG1sJ1xuaHRtbF9zdGFydF90YWdzICAgICAgICAgICA9IEZTLnJlYWRGaWxlU3luYyBodG1sX3N0YXJ0X3RhZ3NfcGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JywgfVxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5kaWZmX2NtZCAgICAgICAgICAgICAgICAgID0gXCJcIlwiZ2l0IGRpZmYgLS1uby1pbmRleCAtLXdvcmQtZGlmZj1wbGFpbiAtLXdvcmQtZGlmZi1yZWdleD0uIGZpbHRlcmVkLm9sZC5tZCBmaWx0ZXJlZC5uZXcubWQgPiBkaWZmLnR4dFwiXCJcIlxuZGlmZl9jd2QgICAgICAgICAgICAgICAgICA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLi9jb21wYXJpc29uL3Jlc3VsdCdcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFhzcWtfZGlmZmVyXG5cbiAgIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgY29uc3RydWN0b3I6IC0+XG4gICMgICA7dW5kZWZpbmVkXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB3cml0ZV9yZXBvcnQ6IC0+XG4gICAgZmlyc3QgPSBTeW1ib2wgJ2ZpcnN0J1xuICAgIGxhc3QgID0gU3ltYm9sICdsYXN0J1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBvbGRfcGF0aCA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLicsICdjb21wYXJpc29uL3Jlc3VsdC9maWx0ZXJlZC5vbGQubWQnXG4gICAgIyBuZXdfcGF0aCA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLicsICdjb21wYXJpc29uL3Jlc3VsdC9maWx0ZXJlZC5uZXcubWQnXG4gICAgZGlmZl9wYXRoICAgPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4vY29tcGFyaXNvbi9yZXN1bHQvZGlmZi50eHQnXG4gICAgcmVwb3J0X3BhdGggPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4vY29tcGFyaXNvbi9yZXN1bHQvcmVwb3J0Lmh0bWwnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBqZXQgPSBuZXcgQXN5bmNfamV0c3RyZWFtKClcbiAgICAjIGpldC5wdXNoICggZCApIC0+IGRlYnVnICfOqXhzcWtfX18xJywgZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgamV0LnB1c2ggZmlsdGVyX2RpZmZfc3RhcnQgPSAoIGQgKSAtPlxuICAgICAgIyBkZWJ1ZyAnzql4c3FrX19fMicsICggcnByIGQgKVsgLi4gMTAwIF1cbiAgICAgIHJldHVybiBudWxsIGlmIGQubGluZSBpcyAnJ1xuICAgICAgcmV0dXJuIG51bGwgaWYgZC5saW5lLnN0YXJ0c1dpdGggJ2RpZmYgLS1naXQnXG4gICAgICByZXR1cm4gbnVsbCBpZiBkLmxpbmUuc3RhcnRzV2l0aCAnaW5kZXggJ1xuICAgICAgcmV0dXJuIG51bGwgaWYgZC5saW5lLnN0YXJ0c1dpdGggJy0tLSAnXG4gICAgICByZXR1cm4gbnVsbCBpZiBkLmxpbmUuc3RhcnRzV2l0aCAnKysrICdcbiAgICAgIHJldHVybiBudWxsIGlmIGQubGluZS5zdGFydHNXaXRoICdAQCAnXG4gICAgICB5aWVsZCBkXG4gICAgICA7bnVsbFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgamV0LnB1c2ggZXJhc2VfYmxvY2tzID0gKCBkICkgLT5cbiAgICAgIHJldHVybiB5aWVsZCBkIHVubGVzcyBkLnR5cGUgaXMgJ3JhdydcbiAgICAgIHlpZWxkIGxldHMgZCwgKCBkICkgLT5cbiAgICAgICAgIyBkLmxpbmUgPSBkLmxpbmUucmVwbGFjZSAv4paIL2d2LCAnJ1xuICAgICAgICBkLnR5cGUgPSAnbWFya2Rvd24nXG4gICAgICA7bnVsbFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgamV0LnB1c2ggJyNsYXN0LGRhdGEnLCBkbyByZWNvcmRfc3dhcHMgPSAtPlxuICAgICAgc3dhcHMgPSBuZXcgU2V0KClcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgcmV0dXJuICggZCApIC0+XG4gICAgICAgIGlmIGQgaXMgbGFzdFxuICAgICAgICAgIHlpZWxkIGZyZWV6ZSB7IHR5cGU6ICdodG1sJywgbGluZTogXCI8c3dhcHM+XFxuXCIsIH1cbiAgICAgICAgICBmb3Igc3dhcCBmcm9tIHN3YXBzXG4gICAgICAgICAgICB5aWVsZCBmcmVlemUgeyB0eXBlOiAnaHRtbCcsIGxpbmU6IFwiPGRpdj4je3N3YXB9PC9kaXY+XFxuXCIsIH1cbiAgICAgICAgICB5aWVsZCBmcmVlemUgeyB0eXBlOiAnaHRtbCcsIGxpbmU6IFwiPC9zd2Fwcz5cXG5cIiwgfVxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIHlpZWxkIGQgdW5sZXNzIGQudHlwZSBpcyAnbWFya2Rvd24nXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbWF0Y2hlcyA9IGQubGluZS5tYXRjaEFsbCAvXFxbLSg/PGRlbD5bXlxcXVxcfV0rKS1cXF1cXHtcXCsoPzxpbnM+W15cXF1cXH1dKylcXCtcXH0vZ3ZcbiAgICAgICAgbWF0Y2hlcyA9IFsgbWF0Y2hlcy4uLiwgXVxuICAgICAgICBpZiBtYXRjaGVzLmxlbmd0aCA+IDBcbiAgICAgICAgICBmb3IgbWF0Y2ggZnJvbSBtYXRjaGVzXG4gICAgICAgICAgICB7IGRlbCxcbiAgICAgICAgICAgICAgaW5zLCB9ID0gbWF0Y2guZ3JvdXBzXG4gICAgICAgICAgICBkZWJ1ZyAnzql4c3FrX19fMycsIHsgZGVsLCBpbnMsIH1cbiAgICAgICAgICAgIHN3YXBzLmFkZCBcIiN7ZGVsfeKWtiN7aW5zfVwiXG4gICAgICAgIHlpZWxkIGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGpldC5wdXNoIHRyYW5zbGF0ZV9jaGFuZ2VzID0gKCBkICkgLT5cbiAgICAgIHlpZWxkIGxldHMgZCwgKCBkICkgLT5cbiAgICAgICAgIyBkLnR5cGUgPSAnaHRtbCdcbiAgICAgICAgZC5saW5lID0gZC5saW5lLnJlcGxhY2UgL1xcWy0vZ3YsICAgJzxkZWw+J1xuICAgICAgICBkLmxpbmUgPSBkLmxpbmUucmVwbGFjZSAvLVxcXS9ndiwgICAnPC9kZWw+J1xuICAgICAgICBkLmxpbmUgPSBkLmxpbmUucmVwbGFjZSAvXFx7XFwrL2d2LCAgJzxpbnM+J1xuICAgICAgICBkLmxpbmUgPSBkLmxpbmUucmVwbGFjZSAvXFwrXFx9L2d2LCAgJzwvaW5zPidcbiAgICAgICAgIyBkLmxpbmUgPSBcIlxcbjxkaXY+I3tkLmxpbmV9PC9kaXY+XFxuXFxuXCJcbiAgICAgIDtudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBqZXQucHVzaCB0cmFuc2xhdGVfaGVhZGluZ3MgPSAoIGQgKSAtPlxuICAgICAgcmV0dXJuIHlpZWxkIGQgdW5sZXNzIGQudHlwZSBpcyAnbWFya2Rvd24nXG4gICAgICByZXR1cm4geWllbGQgZCB1bmxlc3MgKCBtYXRjaCA9IGQubGluZS5tYXRjaCAvXig/PGhhc2hlcz4jezEsNn0pXFxzKD88aGVhZGluZz4uKikkL3YgKT9cbiAgICAgIHsgaGFzaGVzLFxuICAgICAgICBoZWFkaW5nLCAgfSA9IG1hdGNoLmdyb3Vwc1xuICAgICAgdGFnX25hbWUgICAgICA9IFwiaCN7aGFzaGVzLmxlbmd0aH1cIlxuICAgICAgIyBoZWFkaW5nICAgICAgID0gaGVhZGluZy5yZXBsYWNlIC/ihJZcXHMqL2d2LCAnJ1xuICAgICAgeWllbGQgbGV0cyBkLCAoIGQgKSAtPlxuICAgICAgICBkLnR5cGUgPSAnaHRtbCdcbiAgICAgICAgZC5saW5lID0gXCJcXG5cXG48YXJ0aWNsZT48I3t0YWdfbmFtZX0+I3toZWFkaW5nfTwvI3t0YWdfbmFtZX0+XFxuXCJcbiAgICAgIDtudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBqZXQucHVzaCBhZGRfZGl2cyA9ICggZCApIC0+XG4gICAgICByZXR1cm4geWllbGQgZCB1bmxlc3MgZC50eXBlIGlzICdtYXJrZG93bidcbiAgICAgIHlpZWxkIGxldHMgZCwgKCBkICkgLT5cbiAgICAgICAgZC50eXBlID0gJ2h0bWwnXG4gICAgICAgIGQubGluZSA9IFwiXFxuPGRpdj4je2QubGluZX08L2Rpdj48L2FydGljbGU+XFxuXCJcbiAgICAgIDtudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBqZXQucHVzaCAnI2ZpcnN0JywgYWRkX3RpdGxlID0gKCBkICkgLT5cbiAgICAgIHlpZWxkIGRcbiAgICAgIHlpZWxkIHsgdHlwZTogJ2h0bWwnLCBsaW5lOiBcIlxcbjxoMT7jgIrosL/lsbHnkLTlhrXjgIs8L2gxPlxcblwifVxuICAgICAgO251bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGpldC5wdXNoICcjZmlyc3QnLCBjbGVhcl9maWxlICAgPSAoIGQgKSAtPiBGUy53cml0ZUZpbGVTeW5jIHJlcG9ydF9wYXRoLCAnJ1xuICAgIGpldC5wdXNoICcjZmlyc3QnLCBwcmVwZW5kX2NzcyAgPSAoIGQgKSAtPiB5aWVsZCBkOyB5aWVsZCBmcmVlemUgeyB0eXBlOiAnaHRtbCcsIGxpbmU6IFwiPGxpbmsgcmVsPXN0eWxlc2hlZXQgaHJlZj0nLi9kaWZmLmNzcyc+XCIsIH0gO251bGxcbiAgICBqZXQucHVzaCAnI2ZpcnN0JywgcHJlcGVuZF9odG1sID0gKCBkICkgLT4geWllbGQgZDsgeWllbGQgZnJlZXplIHsgdHlwZTogJ2h0bWwnLCBsaW5lOiBodG1sX3N0YXJ0X3RhZ3MsIH0gO251bGxcbiAgICBqZXQucHVzaCAnI2xhc3QnLCAgYXBwZW5kX2VvZiAgID0gKCBkICkgLT4geWllbGQgeyBsaW5lOiAnPCEtLSBlb2YgLS0+JywgfTsgeWllbGQgZCA7bnVsbFxuICAgIGpldC5wdXNoICcqJywgKCBkICkgLT4gd2hpc3BlciAnzql4c3FrX19fNCcsICggcnByIGQgKVsgLi4gMTAwIF1cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGpldC5wdXNoIHdyaXRlX291dHB1dCA9ICggZCApIC0+XG4gICAgICByZXR1cm4geWllbGQgZCB1bmxlc3MgZC50eXBlIGlzICdodG1sJ1xuICAgICAgRlMuYXBwZW5kRmlsZVN5bmMgcmVwb3J0X3BhdGgsIGQubGluZVxuICAgICAgeWllbGQgZFxuICAgICAgO251bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgZm9yIHsgbGluZSwgfSBmcm9tIHdhbGtfbGluZXNfd2l0aF9wb3NpdGlvbnMgb2xkX3BhdGhcbiAgICAjICAgamV0LnNlbmQgeyB2ZXJzaW9uOiAnb2xkJywgbGluZSwgfVxuICAgIGpldC5zZW5kIGZpcnN0XG4gICAgZm9yIHsgbG5yLCBsaW5lLCBlb2YsIH0gZnJvbSB3YWxrX2xpbmVzIGRpZmZfcGF0aFxuICAgICAgamV0LnNlbmQgZnJlZXplIHsgdHlwZTogJ3JhdycsIGxuciwgbGluZSwgfVxuICAgIGpldC5zZW5kIGxhc3RcbiAgICBhd2FpdCBqZXQucnVuKClcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIDtudWxsXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVtbyA9IC0+XG4gICggbmV3IFhzcWtfZGlmZmVyKCkud3JpdGVfcmVwb3J0KCkgKVxuICA7bnVsbFxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBhd2FpdCBkbyA9PlxuICBhd2FpdCBkZW1vKClcblxuIl19

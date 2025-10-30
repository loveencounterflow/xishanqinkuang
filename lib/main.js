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
      var add_divs, append_eof, clear_file, diff_path, eof, erase_blocks, filter_diff_start, line, lnr, prepend_css, prepend_html, report_path, stream, translate_changes, translate_headings, write_output, x;
      //.........................................................................................................
      // old_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.old.md'
      // new_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.new.md'
      diff_path = PATH.resolve(__dirname, '../comparison/result/diff.txt');
      report_path = PATH.resolve(__dirname, '../comparison/result/report.html');
      //.........................................................................................................
      stream = new Async_jetstream();
      // stream.push ( d ) -> debug 'Ωxsqk___4', d
      //.........................................................................................................
      stream.push(erase_blocks = function*(d) {
        if (d.type !== 'raw') {
          return (yield d);
        }
        yield lets(d, function(d) {
          return d.line = d.line.replace(/█/g, '');
        });
        return null;
      });
      //.........................................................................................................
      stream.push(filter_diff_start = function*(d) {
        if (d.line === '') {
          // debug 'Ωxsqk___1', ( rpr d )[ .. 100 ]
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
      //.........................................................................................................
      stream.push(translate_changes = function*(d) {
        yield lets(d, function(d) {
          // d.type = 'html'
          d.line = d.line.replace(/\[-/g, '<del>');
          d.line = d.line.replace(/-\]/g, '</del>');
          d.line = d.line.replace(/\{\+/g, '<ins>');
          return d.line = d.line.replace(/\+\}/g, '</ins>');
        });
        // d.line = "\n<div>#{d.line}</div>\n\n"
        return null;
      });
      //.........................................................................................................
      stream.push(translate_headings = function*(d) {
        var hashes, heading, match, tag_name;
        if (d.type !== 'markdown') {
          return (yield d);
        }
        if ((match = d.line.match(/^(?<hashes>#{1,6})\s(?<heading>.*)$/)) == null) {
          return (yield d);
        }
        ({hashes, heading} = match.groups);
        tag_name = `h${hashes.length}`;
        // heading       = heading.replace /№\s*/g, ''
        yield lets(d, function(d) {
          d.type = 'html';
          return d.line = `\n\n<${tag_name}>${heading}</${tag_name}>\n`;
        });
        return null;
      });
      //.........................................................................................................
      stream.push(add_divs = function*(d) {
        if (d.type !== 'markdown') {
          return (yield d);
        }
        yield lets(d, function(d) {
          d.type = 'html';
          return d.line = `\n<div>${d.line}</div>\n`;
        });
        return null;
      });
      //.........................................................................................................
      stream.push('#first', clear_file = function(d) {
        return FS.writeFileSync(report_path, '');
      });
      stream.push('#first', prepend_css = function*(d) {
        yield d;
        yield freeze({
          type: 'html',
          line: "<link rel=stylesheet href='./diff.css'>"
        });
        return null;
      });
      stream.push('#first', prepend_html = function*(d) {
        yield d;
        yield freeze({
          type: 'html',
          line: html_start_tags
        });
        return null;
      });
      stream.push('#last', append_eof = function*(d) {
        yield ({
          line: '<!-- eof -->'
        });
        yield d;
        return null;
      });
      stream.push('*', function(d) {
        return whisper('Ωxsqk___1', (rpr(d)).slice(0, 101));
      });
      //.........................................................................................................
      stream.push(write_output = function*(d) {
        if (d.type !== 'html') {
          return (yield d);
        }
        FS.appendFileSync(report_path, d.line);
        yield d;
        return null;
      });
      //.........................................................................................................
      // for { line, } from walk_lines_with_positions old_path
      //   stream.send { version: 'old', line, }
      stream.cue('first');
      for (x of walk_lines(diff_path)) {
        ({lnr, line, eof} = x);
        stream.send(freeze({
          type: 'raw',
          lnr,
          line
        }));
      }
      stream.cue('last');
      await stream.run();
      //.........................................................................................................
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUE7RUFHQTtBQUhBLE1BQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsZUFBQSxFQUFBLG9CQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxjQUFBLEVBQUEsd0JBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUE7O0VBS0EsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQixNQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsT0FIRixFQUlFLEdBSkYsQ0FBQSxHQUk0QixHQUFHLENBQUMsR0FKaEMsRUFmQTs7Ozs7RUF1QkEsQ0FBQSxDQUFFLE1BQUYsRUFDRSxJQURGLENBQUEsR0FDNEIsT0FBQSxDQUFRLGdCQUFSLENBRDVCLEVBdkJBOzs7RUEwQkEsU0FBQSxHQUE0QixPQUFBLENBQVEscUJBQVI7O0VBQzVCLENBQUEsQ0FBRSxPQUFGLENBQUEsR0FBNEIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFuQixDQUFBLENBQTVCOztFQUNBLENB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Q0FBQSxDQUFBLEdBQUE7YUFDdEMsQ0FBQSxNQUFNLElBQUEsQ0FBQSxDQUFOO0lBRHNDLENBQUEsSUFBeEM7O0FBeklBIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbid1c2Ugc3RyaWN0J1xuXG5cbid1c2Ugc3RyaWN0J1xuXG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ3hzcWsnXG57IHJwclxuICBpbnNwZWN0XG4gIGVjaG9cbiAgcmV2ZXJzZVxuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMgV0dVWSAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvd2ViZ3V5J1xuIyB7IGYgfSAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9lZmZzdHJpbmcnXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnsgZnJlZXplLFxuICBsZXRzLCAgICAgICAgICAgICAgICAgfSA9IHJlcXVpcmUgJ2xldHNmcmVlemV0aGF0J1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5TRk1PRFVMRVMgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcydcbnsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMudW5zdGFibGUucmVxdWlyZV90eXBlX29mKClcbnsgSmV0c3RyZWFtLFxuICBBc3luY19qZXRzdHJlYW0sICAgICAgfSA9IFNGTU9EVUxFUy5yZXF1aXJlX2pldHN0cmVhbSgpXG57IHdhbGtfbGluZXNfd2l0aF9wb3NpdGlvbnM6IFxcXG4gICAgd2Fsa19saW5lcywgICAgICAgICB9ID0gU0ZNT0RVTEVTLnVuc3RhYmxlLnJlcXVpcmVfZmFzdF9saW5lcmVhZGVyKClcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUEFUSCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbkZTICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zZm1vZHVsZXNfcGF0aCAgICAgICAgICAgID0gUEFUSC5kaXJuYW1lIHJlcXVpcmUucmVzb2x2ZSAnYnJpY2FicmFjLXNmbW9kdWxlcy9wYWNrYWdlLmpzb24nXG5zZm1vZHVsZXNfcmVzb3VyY2VzX3BhdGggID0gUEFUSC5qb2luIHNmbW9kdWxlc19wYXRoLCAncmVzb3VyY2VzJ1xuaHRtbF9zdGFydF90YWdzX3BhdGggICAgICA9IFBBVEguam9pbiBzZm1vZHVsZXNfcmVzb3VyY2VzX3BhdGgsICdkb250LWZvcmdldC10aGVzZS1odG1sLXRhZ3MuaHRtbCdcbmh0bWxfc3RhcnRfdGFncyAgICAgICAgICAgPSBGUy5yZWFkRmlsZVN5bmMgaHRtbF9zdGFydF90YWdzX3BhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIH1cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZGlmZl9jbWQgICAgICAgICAgICAgICAgICA9IFwiXCJcImdpdCBkaWZmIC0tbm8taW5kZXggLS13b3JkLWRpZmY9cGxhaW4gLS13b3JkLWRpZmYtcmVnZXg9LiBmaWx0ZXJlZC5vbGQubWQgZmlsdGVyZWQubmV3Lm1kID4gZGlmZi50eHRcIlwiXCJcbmRpZmZfY3dkICAgICAgICAgICAgICAgICAgPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4vY29tcGFyaXNvbi9yZXN1bHQnXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBYc3FrX2RpZmZlclxuXG4gICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIGNvbnN0cnVjdG9yOiAtPlxuICAjICAgO3VuZGVmaW5lZFxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgd3JpdGVfcmVwb3J0OiAtPlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIG9sZF9wYXRoID0gUEFUSC5yZXNvbHZlIF9fZGlybmFtZSwgJy4uJywgJ2NvbXBhcmlzb24vcmVzdWx0L2ZpbHRlcmVkLm9sZC5tZCdcbiAgICAjIG5ld19wYXRoID0gUEFUSC5yZXNvbHZlIF9fZGlybmFtZSwgJy4uJywgJ2NvbXBhcmlzb24vcmVzdWx0L2ZpbHRlcmVkLm5ldy5tZCdcbiAgICBkaWZmX3BhdGggICA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLi9jb21wYXJpc29uL3Jlc3VsdC9kaWZmLnR4dCdcbiAgICByZXBvcnRfcGF0aCA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLi9jb21wYXJpc29uL3Jlc3VsdC9yZXBvcnQuaHRtbCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3RyZWFtID0gbmV3IEFzeW5jX2pldHN0cmVhbSgpXG4gICAgIyBzdHJlYW0ucHVzaCAoIGQgKSAtPiBkZWJ1ZyAnzql4c3FrX19fNCcsIGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3RyZWFtLnB1c2ggZXJhc2VfYmxvY2tzID0gKCBkICkgLT5cbiAgICAgIHJldHVybiB5aWVsZCBkIHVubGVzcyBkLnR5cGUgaXMgJ3JhdydcbiAgICAgIHlpZWxkIGxldHMgZCwgKCBkICkgLT4gZC5saW5lID0gZC5saW5lLnJlcGxhY2UgL+KWiC9nLCAnJ1xuICAgICAgO251bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3RyZWFtLnB1c2ggZmlsdGVyX2RpZmZfc3RhcnQgPSAoIGQgKSAtPlxuICAgICAgIyBkZWJ1ZyAnzql4c3FrX19fMScsICggcnByIGQgKVsgLi4gMTAwIF1cbiAgICAgIHJldHVybiBudWxsIGlmIGQubGluZSBpcyAnJ1xuICAgICAgcmV0dXJuIG51bGwgaWYgZC5saW5lLnN0YXJ0c1dpdGggJ2RpZmYgLS1naXQnXG4gICAgICByZXR1cm4gbnVsbCBpZiBkLmxpbmUuc3RhcnRzV2l0aCAnaW5kZXggJ1xuICAgICAgcmV0dXJuIG51bGwgaWYgZC5saW5lLnN0YXJ0c1dpdGggJy0tLSAnXG4gICAgICByZXR1cm4gbnVsbCBpZiBkLmxpbmUuc3RhcnRzV2l0aCAnKysrICdcbiAgICAgIHJldHVybiBudWxsIGlmIGQubGluZS5zdGFydHNXaXRoICdAQCAnXG4gICAgICBkID0gbGV0cyBkLCAoIGQgKSAtPiBkLnR5cGUgPSAnbWFya2Rvd24nXG4gICAgICB5aWVsZCBkXG4gICAgICA7bnVsbFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBzdHJlYW0ucHVzaCB0cmFuc2xhdGVfY2hhbmdlcyA9ICggZCApIC0+XG4gICAgICB5aWVsZCBsZXRzIGQsICggZCApIC0+XG4gICAgICAgICMgZC50eXBlID0gJ2h0bWwnXG4gICAgICAgIGQubGluZSA9IGQubGluZS5yZXBsYWNlIC9cXFstL2csICAgJzxkZWw+J1xuICAgICAgICBkLmxpbmUgPSBkLmxpbmUucmVwbGFjZSAvLVxcXS9nLCAgICc8L2RlbD4nXG4gICAgICAgIGQubGluZSA9IGQubGluZS5yZXBsYWNlIC9cXHtcXCsvZywgICc8aW5zPidcbiAgICAgICAgZC5saW5lID0gZC5saW5lLnJlcGxhY2UgL1xcK1xcfS9nLCAgJzwvaW5zPidcbiAgICAgICAgIyBkLmxpbmUgPSBcIlxcbjxkaXY+I3tkLmxpbmV9PC9kaXY+XFxuXFxuXCJcbiAgICAgIDtudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHN0cmVhbS5wdXNoIHRyYW5zbGF0ZV9oZWFkaW5ncyA9ICggZCApIC0+XG4gICAgICByZXR1cm4geWllbGQgZCB1bmxlc3MgZC50eXBlIGlzICdtYXJrZG93bidcbiAgICAgIHJldHVybiB5aWVsZCBkIHVubGVzcyAoIG1hdGNoID0gZC5saW5lLm1hdGNoIC9eKD88aGFzaGVzPiN7MSw2fSlcXHMoPzxoZWFkaW5nPi4qKSQvICk/XG4gICAgICB7IGhhc2hlcyxcbiAgICAgICAgaGVhZGluZywgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIHRhZ19uYW1lICAgICAgPSBcImgje2hhc2hlcy5sZW5ndGh9XCJcbiAgICAgICMgaGVhZGluZyAgICAgICA9IGhlYWRpbmcucmVwbGFjZSAv4oSWXFxzKi9nLCAnJ1xuICAgICAgeWllbGQgbGV0cyBkLCAoIGQgKSAtPlxuICAgICAgICBkLnR5cGUgPSAnaHRtbCdcbiAgICAgICAgZC5saW5lID0gXCJcXG5cXG48I3t0YWdfbmFtZX0+I3toZWFkaW5nfTwvI3t0YWdfbmFtZX0+XFxuXCJcbiAgICAgIDtudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHN0cmVhbS5wdXNoIGFkZF9kaXZzID0gKCBkICkgLT5cbiAgICAgIHJldHVybiB5aWVsZCBkIHVubGVzcyBkLnR5cGUgaXMgJ21hcmtkb3duJ1xuICAgICAgeWllbGQgbGV0cyBkLCAoIGQgKSAtPlxuICAgICAgICBkLnR5cGUgPSAnaHRtbCdcbiAgICAgICAgZC5saW5lID0gXCJcXG48ZGl2PiN7ZC5saW5lfTwvZGl2PlxcblwiXG4gICAgICA7bnVsbFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBzdHJlYW0ucHVzaCAnI2ZpcnN0JywgY2xlYXJfZmlsZSAgID0gKCBkICkgLT4gRlMud3JpdGVGaWxlU3luYyByZXBvcnRfcGF0aCwgJydcbiAgICBzdHJlYW0ucHVzaCAnI2ZpcnN0JywgcHJlcGVuZF9jc3MgID0gKCBkICkgLT4geWllbGQgZDsgeWllbGQgZnJlZXplIHsgdHlwZTogJ2h0bWwnLCBsaW5lOiBcIjxsaW5rIHJlbD1zdHlsZXNoZWV0IGhyZWY9Jy4vZGlmZi5jc3MnPlwiLCB9IDtudWxsXG4gICAgc3RyZWFtLnB1c2ggJyNmaXJzdCcsIHByZXBlbmRfaHRtbCA9ICggZCApIC0+IHlpZWxkIGQ7IHlpZWxkIGZyZWV6ZSB7IHR5cGU6ICdodG1sJywgbGluZTogaHRtbF9zdGFydF90YWdzLCB9IDtudWxsXG4gICAgc3RyZWFtLnB1c2ggJyNsYXN0JywgIGFwcGVuZF9lb2YgICA9ICggZCApIC0+IHlpZWxkIHsgbGluZTogJzwhLS0gZW9mIC0tPicsIH07IHlpZWxkIGQgO251bGxcbiAgICBzdHJlYW0ucHVzaCAnKicsICggZCApIC0+IHdoaXNwZXIgJ86peHNxa19fXzEnLCAoIHJwciBkIClbIC4uIDEwMCBdXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHN0cmVhbS5wdXNoIHdyaXRlX291dHB1dCA9ICggZCApIC0+XG4gICAgICByZXR1cm4geWllbGQgZCB1bmxlc3MgZC50eXBlIGlzICdodG1sJ1xuICAgICAgRlMuYXBwZW5kRmlsZVN5bmMgcmVwb3J0X3BhdGgsIGQubGluZVxuICAgICAgeWllbGQgZFxuICAgICAgO251bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBmb3IgeyBsaW5lLCB9IGZyb20gd2Fsa19saW5lc193aXRoX3Bvc2l0aW9ucyBvbGRfcGF0aFxuICAgICMgICBzdHJlYW0uc2VuZCB7IHZlcnNpb246ICdvbGQnLCBsaW5lLCB9XG4gICAgc3RyZWFtLmN1ZSAnZmlyc3QnXG4gICAgZm9yIHsgbG5yLCBsaW5lLCBlb2YsIH0gZnJvbSB3YWxrX2xpbmVzIGRpZmZfcGF0aFxuICAgICAgc3RyZWFtLnNlbmQgZnJlZXplIHsgdHlwZTogJ3JhdycsIGxuciwgbGluZSwgfVxuICAgIHN0cmVhbS5jdWUgJ2xhc3QnXG4gICAgYXdhaXQgc3RyZWFtLnJ1bigpXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIDtudWxsXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVtbyA9IC0+XG4gICggbmV3IFhzcWtfZGlmZmVyKCkud3JpdGVfcmVwb3J0KCkgKVxuICA7bnVsbFxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBhd2FpdCBkbyA9PlxuICBhd2FpdCBkZW1vKClcblxuIl19

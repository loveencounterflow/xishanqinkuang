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
      var add_divs, append_eof, clear_file, diff_path, eof, filter_diff_start, line, lnr, prepend_css, prepend_html, report_path, stream, translate_changes, translate_headings, write_output, x;
      //.........................................................................................................
      // old_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.old.md'
      // new_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.new.md'
      diff_path = PATH.resolve(__dirname, '../comparison/result/diff.txt');
      report_path = PATH.resolve(__dirname, '../comparison/result/report.html');
      //.........................................................................................................
      stream = new Async_jetstream();
      // stream.push ( d ) -> debug 'Ωxsqk___4', d
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
        return (yield d);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUE7RUFHQTtBQUhBLE1BQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsZUFBQSxFQUFBLG9CQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxjQUFBLEVBQUEsd0JBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUE7O0VBS0EsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQixNQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsT0FIRixFQUlFLEdBSkYsQ0FBQSxHQUk0QixHQUFHLENBQUMsR0FKaEMsRUFmQTs7Ozs7RUF1QkEsQ0FBQSxDQUFFLE1BQUYsRUFDRSxJQURGLENBQUEsR0FDNEIsT0FBQSxDQUFRLGdCQUFSLENBRDVCLEVBdkJBOzs7RUEwQkEsU0FBQSxHQUE0QixPQUFBLENBQVEscUJBQVI7O0VBQzVCLENBQUEsQ0FBRSxPQUFGLENBQUEsR0FBNEIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFuQixDQUFBLENBQTVCOztFQUNBLENBQUEsQ0FBRSxTQUFGLEVBQ0UsZUFERixDQUFBLEdBQzRCLFNBQVMsQ0FBQyxpQkFBVixDQUFBLENBRDVCOztFQUVBLENBQUE7SUFBRSx5QkFBQSxFQUNFO0VBREosQ0FBQSxHQUM0QixTQUFTLENBQUMsUUFBUSxDQUFDLHVCQUFuQixDQUFBLENBRDVCLEVBOUJBOzs7RUFpQ0EsSUFBQSxHQUE0QixPQUFBLENBQVEsV0FBUjs7RUFDNUIsRUFBQSxHQUE0QixPQUFBLENBQVEsU0FBUixFQWxDNUI7OztFQW9DQSxjQUFBLEdBQTRCLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0NBQWhCLENBQWI7O0VBQzVCLHdCQUFBLEdBQTRCLElBQUksQ0FBQyxJQUFMLENBQVUsY0FBVixFQUEwQixXQUExQjs7RUFDNUIsb0JBQUEsR0FBNEIsSUFBSSxDQUFDLElBQUwsQ0FBVSx3QkFBVixFQUFvQyxrQ0FBcEM7O0VBQzVCLGVBQUEsR0FBNEIsRUFBRSxDQUFDLFlBQUgsQ0FBZ0Isb0JBQWhCLEVBQXNDO0lBQUUsUUFBQSxFQUFVO0VBQVosQ0FBdEMsRUF2QzVCOzs7RUF5Q0EsUUFBQSxHQUE0QixDQUFBLG9HQUFBOztFQUM1QixRQUFBLEdBQTRCLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixzQkFBeEIsRUExQzVCOzs7RUE4Q00sY0FBTixNQUFBLFlBQUEsQ0FBQTs7Ozs7O0lBT2dCLE1BQWQsWUFBYyxDQUFBLENBQUE7QUFDaEIsVUFBQSxRQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUEsR0FBQSxFQUFBLGlCQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxXQUFBLEVBQUEsWUFBQSxFQUFBLFdBQUEsRUFBQSxNQUFBLEVBQUEsaUJBQUEsRUFBQSxrQkFBQSxFQUFBLFlBQUEsRUFBQSxDQUFBOzs7O01BR0ksU0FBQSxHQUFjLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QiwrQkFBeEI7TUFDZCxXQUFBLEdBQWMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLGtDQUF4QixFQUpsQjs7TUFNSSxNQUFBLEdBQVMsSUFBSSxlQUFKLENBQUEsRUFOYjs7O01BU0ksTUFBTSxDQUFDLElBQVAsQ0FBWSxpQkFBQSxHQUFvQixTQUFBLENBQUUsQ0FBRixDQUFBO1FBRTlCLElBQWUsQ0FBQyxDQUFDLElBQUYsS0FBVSxFQUF6Qjs7QUFBQSxpQkFBTyxLQUFQOztRQUNBLElBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBQWY7QUFBQSxpQkFBTyxLQUFQOztRQUNBLElBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFQLENBQWtCLFFBQWxCLENBQWY7QUFBQSxpQkFBTyxLQUFQOztRQUNBLElBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFQLENBQWtCLE1BQWxCLENBQWY7QUFBQSxpQkFBTyxLQUFQOztRQUNBLElBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFQLENBQWtCLE1BQWxCLENBQWY7QUFBQSxpQkFBTyxLQUFQOztRQUNBLElBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQWY7QUFBQSxpQkFBTyxLQUFQOztRQUNBLENBQUEsR0FBSSxJQUFBLENBQUssQ0FBTCxFQUFRLFFBQUEsQ0FBRSxDQUFGLENBQUE7aUJBQVMsQ0FBQyxDQUFDLElBQUYsR0FBUztRQUFsQixDQUFSO2VBQ0osQ0FBQSxNQUFNLENBQU47TUFUOEIsQ0FBaEMsRUFUSjs7TUFvQkksTUFBTSxDQUFDLElBQVAsQ0FBWSxpQkFBQSxHQUFvQixTQUFBLENBQUUsQ0FBRixDQUFBO1FBQzlCLE1BQU0sSUFBQSxDQUFLLENBQUwsRUFBUSxRQUFBLENBQUUsQ0FBRixDQUFBLEVBQUE7O1VBRVosQ0FBQyxDQUFDLElBQUYsR0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQVAsQ0FBZSxNQUFmLEVBQXlCLE9BQXpCO1VBQ1QsQ0FBQyxDQUFDLElBQUYsR0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQVAsQ0FBZSxNQUFmLEVBQXlCLFFBQXpCO1VBQ1QsQ0FBQyxDQUFDLElBQUYsR0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQVAsQ0FBZSxPQUFmLEVBQXlCLE9BQXpCO2lCQUNULENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsT0FBZixFQUF5QixRQUF6QjtRQUxHLENBQVIsRUFBWjs7ZUFPTztNQVI2QixDQUFoQyxFQXBCSjs7TUE4QkksTUFBTSxDQUFDLElBQVAsQ0FBWSxrQkFBQSxHQUFxQixTQUFBLENBQUUsQ0FBRixDQUFBO0FBQ3JDLFlBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUE7UUFBTSxJQUFzQixDQUFDLENBQUMsSUFBRixLQUFVLFVBQWhDO0FBQUEsaUJBQU8sQ0FBQSxNQUFNLENBQU4sRUFBUDs7UUFDQSxJQUFzQixxRUFBdEI7QUFBQSxpQkFBTyxDQUFBLE1BQU0sQ0FBTixFQUFQOztRQUNBLENBQUEsQ0FBRSxNQUFGLEVBQ0UsT0FERixDQUFBLEdBQ2dCLEtBQUssQ0FBQyxNQUR0QjtRQUVBLFFBQUEsR0FBZ0IsQ0FBQSxDQUFBLENBQUEsQ0FBSSxNQUFNLENBQUMsTUFBWCxDQUFBLEVBSnRCOztRQU1NLE1BQU0sSUFBQSxDQUFLLENBQUwsRUFBUSxRQUFBLENBQUUsQ0FBRixDQUFBO1VBQ1osQ0FBQyxDQUFDLElBQUYsR0FBUztpQkFDVCxDQUFDLENBQUMsSUFBRixHQUFTLENBQUEsS0FBQSxDQUFBLENBQVEsUUFBUixDQUFBLENBQUEsQ0FBQSxDQUFvQixPQUFwQixDQUFBLEVBQUEsQ0FBQSxDQUFnQyxRQUFoQyxDQUFBLEdBQUE7UUFGRyxDQUFSO2VBR0w7TUFWOEIsQ0FBakMsRUE5Qko7O01BMENJLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBQSxHQUFXLFNBQUEsQ0FBRSxDQUFGLENBQUE7UUFDckIsSUFBc0IsQ0FBQyxDQUFDLElBQUYsS0FBVSxVQUFoQztBQUFBLGlCQUFPLENBQUEsTUFBTSxDQUFOLEVBQVA7O1FBQ0EsTUFBTSxJQUFBLENBQUssQ0FBTCxFQUFRLFFBQUEsQ0FBRSxDQUFGLENBQUE7VUFDWixDQUFDLENBQUMsSUFBRixHQUFTO2lCQUNULENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQSxPQUFBLENBQUEsQ0FBVSxDQUFDLENBQUMsSUFBWixDQUFBLFFBQUE7UUFGRyxDQUFSO2VBR0w7TUFMb0IsQ0FBdkIsRUExQ0o7O01BaURJLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixVQUFBLEdBQWUsUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLEVBQUUsQ0FBQyxhQUFILENBQWlCLFdBQWpCLEVBQThCLEVBQTlCO01BQVQsQ0FBckM7TUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLFFBQVosRUFBc0IsV0FBQSxHQUFlLFNBQUEsQ0FBRSxDQUFGLENBQUE7UUFBUyxNQUFNO1FBQUcsTUFBTSxNQUFBLENBQU87VUFBRSxJQUFBLEVBQU0sTUFBUjtVQUFnQixJQUFBLEVBQU07UUFBdEIsQ0FBUDtlQUEyRTtNQUFuRyxDQUFyQztNQUNBLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixZQUFBLEdBQWUsU0FBQSxDQUFFLENBQUYsQ0FBQTtRQUFTLE1BQU07UUFBRyxNQUFNLE1BQUEsQ0FBTztVQUFFLElBQUEsRUFBTSxNQUFSO1VBQWdCLElBQUEsRUFBTTtRQUF0QixDQUFQO2VBQWlEO01BQXpFLENBQXJDO01BQ0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLEVBQXNCLFVBQUEsR0FBZSxTQUFBLENBQUUsQ0FBRixDQUFBO1FBQVMsTUFBTSxDQUFBO1VBQUUsSUFBQSxFQUFNO1FBQVIsQ0FBQTtRQUEyQixNQUFNO2VBQUc7TUFBbkQsQ0FBckM7TUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVosRUFBaUIsUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLE9BQUEsQ0FBUSxXQUFSLEVBQXFCLENBQUUsR0FBQSxDQUFJLENBQUosQ0FBRixDQUFTLGNBQTlCO01BQVQsQ0FBakIsRUFyREo7O01BdURJLE1BQU0sQ0FBQyxJQUFQLENBQVksWUFBQSxHQUFlLFNBQUEsQ0FBRSxDQUFGLENBQUE7UUFDekIsSUFBc0IsQ0FBQyxDQUFDLElBQUYsS0FBVSxNQUFoQztBQUFBLGlCQUFPLENBQUEsTUFBTSxDQUFOLEVBQVA7O1FBQ0EsRUFBRSxDQUFDLGNBQUgsQ0FBa0IsV0FBbEIsRUFBK0IsQ0FBQyxDQUFDLElBQWpDO2VBQ0M7TUFId0IsQ0FBM0IsRUF2REo7Ozs7TUE4REksTUFBTSxDQUFDLEdBQVAsQ0FBVyxPQUFYO01BQ0EsS0FBQSwwQkFBQTtTQUFJLENBQUUsR0FBRixFQUFPLElBQVAsRUFBYSxHQUFiO1FBQ0YsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFBLENBQU87VUFBRSxJQUFBLEVBQU0sS0FBUjtVQUFlLEdBQWY7VUFBb0I7UUFBcEIsQ0FBUCxDQUFaO01BREY7TUFFQSxNQUFNLENBQUMsR0FBUCxDQUFXLE1BQVg7TUFDQSxNQUFNLE1BQU0sQ0FBQyxHQUFQLENBQUEsRUFsRVY7O2FBb0VLO0lBckVXOztFQVBoQixFQTlDQTs7O0VBNkhBLElBQUEsR0FBTyxRQUFBLENBQUEsQ0FBQTtJQUNILElBQUksV0FBSixDQUFBLENBQWlCLENBQUMsWUFBbEIsQ0FBQTtXQUNEO0VBRkksRUE3SFA7OztFQWtJQSxJQUFHLE1BQUEsS0FBVSxPQUFPLENBQUMsSUFBckI7SUFBK0IsTUFBUyxDQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUE7YUFDdEMsQ0FBQSxNQUFNLElBQUEsQ0FBQSxDQUFOO0lBRHNDLENBQUEsSUFBeEM7O0FBbElBIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbid1c2Ugc3RyaWN0J1xuXG5cbid1c2Ugc3RyaWN0J1xuXG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ3hzcWsnXG57IHJwclxuICBpbnNwZWN0XG4gIGVjaG9cbiAgcmV2ZXJzZVxuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMgV0dVWSAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvd2ViZ3V5J1xuIyB7IGYgfSAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9lZmZzdHJpbmcnXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnsgZnJlZXplLFxuICBsZXRzLCAgICAgICAgICAgICAgICAgfSA9IHJlcXVpcmUgJ2xldHNmcmVlemV0aGF0J1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5TRk1PRFVMRVMgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcydcbnsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMudW5zdGFibGUucmVxdWlyZV90eXBlX29mKClcbnsgSmV0c3RyZWFtLFxuICBBc3luY19qZXRzdHJlYW0sICAgICAgfSA9IFNGTU9EVUxFUy5yZXF1aXJlX2pldHN0cmVhbSgpXG57IHdhbGtfbGluZXNfd2l0aF9wb3NpdGlvbnM6IFxcXG4gICAgd2Fsa19saW5lcywgICAgICAgICB9ID0gU0ZNT0RVTEVTLnVuc3RhYmxlLnJlcXVpcmVfZmFzdF9saW5lcmVhZGVyKClcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUEFUSCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbkZTICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zZm1vZHVsZXNfcGF0aCAgICAgICAgICAgID0gUEFUSC5kaXJuYW1lIHJlcXVpcmUucmVzb2x2ZSAnYnJpY2FicmFjLXNmbW9kdWxlcy9wYWNrYWdlLmpzb24nXG5zZm1vZHVsZXNfcmVzb3VyY2VzX3BhdGggID0gUEFUSC5qb2luIHNmbW9kdWxlc19wYXRoLCAncmVzb3VyY2VzJ1xuaHRtbF9zdGFydF90YWdzX3BhdGggICAgICA9IFBBVEguam9pbiBzZm1vZHVsZXNfcmVzb3VyY2VzX3BhdGgsICdkb250LWZvcmdldC10aGVzZS1odG1sLXRhZ3MuaHRtbCdcbmh0bWxfc3RhcnRfdGFncyAgICAgICAgICAgPSBGUy5yZWFkRmlsZVN5bmMgaHRtbF9zdGFydF90YWdzX3BhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIH1cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZGlmZl9jbWQgICAgICAgICAgICAgICAgICA9IFwiXCJcImdpdCBkaWZmIC0tbm8taW5kZXggLS13b3JkLWRpZmY9cGxhaW4gLS13b3JkLWRpZmYtcmVnZXg9LiBmaWx0ZXJlZC5vbGQubWQgZmlsdGVyZWQubmV3Lm1kID4gZGlmZi50eHRcIlwiXCJcbmRpZmZfY3dkICAgICAgICAgICAgICAgICAgPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4vY29tcGFyaXNvbi9yZXN1bHQnXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBYc3FrX2RpZmZlclxuXG4gICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIGNvbnN0cnVjdG9yOiAtPlxuICAjICAgO3VuZGVmaW5lZFxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgd3JpdGVfcmVwb3J0OiAtPlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIG9sZF9wYXRoID0gUEFUSC5yZXNvbHZlIF9fZGlybmFtZSwgJy4uJywgJ2NvbXBhcmlzb24vcmVzdWx0L2ZpbHRlcmVkLm9sZC5tZCdcbiAgICAjIG5ld19wYXRoID0gUEFUSC5yZXNvbHZlIF9fZGlybmFtZSwgJy4uJywgJ2NvbXBhcmlzb24vcmVzdWx0L2ZpbHRlcmVkLm5ldy5tZCdcbiAgICBkaWZmX3BhdGggICA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLi9jb21wYXJpc29uL3Jlc3VsdC9kaWZmLnR4dCdcbiAgICByZXBvcnRfcGF0aCA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLi9jb21wYXJpc29uL3Jlc3VsdC9yZXBvcnQuaHRtbCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3RyZWFtID0gbmV3IEFzeW5jX2pldHN0cmVhbSgpXG4gICAgIyBzdHJlYW0ucHVzaCAoIGQgKSAtPiBkZWJ1ZyAnzql4c3FrX19fNCcsIGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3RyZWFtLnB1c2ggZmlsdGVyX2RpZmZfc3RhcnQgPSAoIGQgKSAtPlxuICAgICAgIyBkZWJ1ZyAnzql4c3FrX19fMScsICggcnByIGQgKVsgLi4gMTAwIF1cbiAgICAgIHJldHVybiBudWxsIGlmIGQubGluZSBpcyAnJ1xuICAgICAgcmV0dXJuIG51bGwgaWYgZC5saW5lLnN0YXJ0c1dpdGggJ2RpZmYgLS1naXQnXG4gICAgICByZXR1cm4gbnVsbCBpZiBkLmxpbmUuc3RhcnRzV2l0aCAnaW5kZXggJ1xuICAgICAgcmV0dXJuIG51bGwgaWYgZC5saW5lLnN0YXJ0c1dpdGggJy0tLSAnXG4gICAgICByZXR1cm4gbnVsbCBpZiBkLmxpbmUuc3RhcnRzV2l0aCAnKysrICdcbiAgICAgIHJldHVybiBudWxsIGlmIGQubGluZS5zdGFydHNXaXRoICdAQCAnXG4gICAgICBkID0gbGV0cyBkLCAoIGQgKSAtPiBkLnR5cGUgPSAnbWFya2Rvd24nXG4gICAgICB5aWVsZCBkXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHN0cmVhbS5wdXNoIHRyYW5zbGF0ZV9jaGFuZ2VzID0gKCBkICkgLT5cbiAgICAgIHlpZWxkIGxldHMgZCwgKCBkICkgLT5cbiAgICAgICAgIyBkLnR5cGUgPSAnaHRtbCdcbiAgICAgICAgZC5saW5lID0gZC5saW5lLnJlcGxhY2UgL1xcWy0vZywgICAnPGRlbD4nXG4gICAgICAgIGQubGluZSA9IGQubGluZS5yZXBsYWNlIC8tXFxdL2csICAgJzwvZGVsPidcbiAgICAgICAgZC5saW5lID0gZC5saW5lLnJlcGxhY2UgL1xce1xcKy9nLCAgJzxpbnM+J1xuICAgICAgICBkLmxpbmUgPSBkLmxpbmUucmVwbGFjZSAvXFwrXFx9L2csICAnPC9pbnM+J1xuICAgICAgICAjIGQubGluZSA9IFwiXFxuPGRpdj4je2QubGluZX08L2Rpdj5cXG5cXG5cIlxuICAgICAgO251bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3RyZWFtLnB1c2ggdHJhbnNsYXRlX2hlYWRpbmdzID0gKCBkICkgLT5cbiAgICAgIHJldHVybiB5aWVsZCBkIHVubGVzcyBkLnR5cGUgaXMgJ21hcmtkb3duJ1xuICAgICAgcmV0dXJuIHlpZWxkIGQgdW5sZXNzICggbWF0Y2ggPSBkLmxpbmUubWF0Y2ggL14oPzxoYXNoZXM+I3sxLDZ9KVxccyg/PGhlYWRpbmc+LiopJC8gKT9cbiAgICAgIHsgaGFzaGVzLFxuICAgICAgICBoZWFkaW5nLCAgfSA9IG1hdGNoLmdyb3Vwc1xuICAgICAgdGFnX25hbWUgICAgICA9IFwiaCN7aGFzaGVzLmxlbmd0aH1cIlxuICAgICAgIyBoZWFkaW5nICAgICAgID0gaGVhZGluZy5yZXBsYWNlIC/ihJZcXHMqL2csICcnXG4gICAgICB5aWVsZCBsZXRzIGQsICggZCApIC0+XG4gICAgICAgIGQudHlwZSA9ICdodG1sJ1xuICAgICAgICBkLmxpbmUgPSBcIlxcblxcbjwje3RhZ19uYW1lfT4je2hlYWRpbmd9PC8je3RhZ19uYW1lfT5cXG5cIlxuICAgICAgO251bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3RyZWFtLnB1c2ggYWRkX2RpdnMgPSAoIGQgKSAtPlxuICAgICAgcmV0dXJuIHlpZWxkIGQgdW5sZXNzIGQudHlwZSBpcyAnbWFya2Rvd24nXG4gICAgICB5aWVsZCBsZXRzIGQsICggZCApIC0+XG4gICAgICAgIGQudHlwZSA9ICdodG1sJ1xuICAgICAgICBkLmxpbmUgPSBcIlxcbjxkaXY+I3tkLmxpbmV9PC9kaXY+XFxuXCJcbiAgICAgIDtudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHN0cmVhbS5wdXNoICcjZmlyc3QnLCBjbGVhcl9maWxlICAgPSAoIGQgKSAtPiBGUy53cml0ZUZpbGVTeW5jIHJlcG9ydF9wYXRoLCAnJ1xuICAgIHN0cmVhbS5wdXNoICcjZmlyc3QnLCBwcmVwZW5kX2NzcyAgPSAoIGQgKSAtPiB5aWVsZCBkOyB5aWVsZCBmcmVlemUgeyB0eXBlOiAnaHRtbCcsIGxpbmU6IFwiPGxpbmsgcmVsPXN0eWxlc2hlZXQgaHJlZj0nLi9kaWZmLmNzcyc+XCIsIH0gO251bGxcbiAgICBzdHJlYW0ucHVzaCAnI2ZpcnN0JywgcHJlcGVuZF9odG1sID0gKCBkICkgLT4geWllbGQgZDsgeWllbGQgZnJlZXplIHsgdHlwZTogJ2h0bWwnLCBsaW5lOiBodG1sX3N0YXJ0X3RhZ3MsIH0gO251bGxcbiAgICBzdHJlYW0ucHVzaCAnI2xhc3QnLCAgYXBwZW5kX2VvZiAgID0gKCBkICkgLT4geWllbGQgeyBsaW5lOiAnPCEtLSBlb2YgLS0+JywgfTsgeWllbGQgZCA7bnVsbFxuICAgIHN0cmVhbS5wdXNoICcqJywgKCBkICkgLT4gd2hpc3BlciAnzql4c3FrX19fMScsICggcnByIGQgKVsgLi4gMTAwIF1cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3RyZWFtLnB1c2ggd3JpdGVfb3V0cHV0ID0gKCBkICkgLT5cbiAgICAgIHJldHVybiB5aWVsZCBkIHVubGVzcyBkLnR5cGUgaXMgJ2h0bWwnXG4gICAgICBGUy5hcHBlbmRGaWxlU3luYyByZXBvcnRfcGF0aCwgZC5saW5lXG4gICAgICA7bnVsbFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIGZvciB7IGxpbmUsIH0gZnJvbSB3YWxrX2xpbmVzX3dpdGhfcG9zaXRpb25zIG9sZF9wYXRoXG4gICAgIyAgIHN0cmVhbS5zZW5kIHsgdmVyc2lvbjogJ29sZCcsIGxpbmUsIH1cbiAgICBzdHJlYW0uY3VlICdmaXJzdCdcbiAgICBmb3IgeyBsbnIsIGxpbmUsIGVvZiwgfSBmcm9tIHdhbGtfbGluZXMgZGlmZl9wYXRoXG4gICAgICBzdHJlYW0uc2VuZCBmcmVlemUgeyB0eXBlOiAncmF3JywgbG5yLCBsaW5lLCB9XG4gICAgc3RyZWFtLmN1ZSAnbGFzdCdcbiAgICBhd2FpdCBzdHJlYW0ucnVuKClcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgO251bGxcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZW1vID0gLT5cbiAgKCBuZXcgWHNxa19kaWZmZXIoKS53cml0ZV9yZXBvcnQoKSApXG4gIDtudWxsXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaWYgbW9kdWxlIGlzIHJlcXVpcmUubWFpbiB0aGVuIGF3YWl0IGRvID0+XG4gIGF3YWl0IGRlbW8oKVxuXG5cbiJdfQ==

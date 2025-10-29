(async function() {
  'use strict';
  'use strict';
  var FS, GUY, PATH, SFMODULES, alert, debug, demo, echo, help, info, inspect, log, plain, praise, reverse, rpr, urge, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('xsqk'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  // WGUY                      = require '../../../apps/webguy'
  // { f }                     = require '../../../apps/effstring'
  //-----------------------------------------------------------------------------------------------------------
  SFMODULES = require('bricabrac-sfmodules');

  PATH = require('node:path');

  FS = require('node:fs');

  //===========================================================================================================
  demo = async function() {
    var Async_jetstream, Jetstream, diff_path, filter_diff_start, internals, lwp, report_path, stream, translate_changes, type_of, walk_lines_with_positions, write_output;
    ({type_of} = SFMODULES.unstable.require_type_of());
    ({Jetstream, Async_jetstream, internals} = SFMODULES.require_jetstream());
    ({walk_lines_with_positions} = SFMODULES.unstable.require_fast_linereader());
    //.........................................................................................................
    // old_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.old.md'
    // new_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.new.md'
    diff_path = PATH.resolve(__dirname, '../comparison/result/diff.txt');
    report_path = PATH.resolve(__dirname, '../comparison/result/report.html');
    //.........................................................................................................
    stream = new Async_jetstream();
    // stream.push ( d ) -> debug 'Ωxsqk___1', d
    //.........................................................................................................
    stream.push(filter_diff_start = function*(d) {
      if (d.lnr < 6) {
        return null;
      }
      return (yield d);
    });
    //.........................................................................................................
    stream.push(translate_changes = function*(d) {
      d.line = d.line.replace(/\[-/g, '<del>');
      d.line = d.line.replace(/-\]/g, '</del>');
      d.line = d.line.replace(/\{\+/g, '<ins>');
      d.line = d.line.replace(/\+\}/g, '</ins>');
      return (yield d);
    });
    //.........................................................................................................
    stream.push(write_output = function(d) {
      return FS.appendFileSync(report_path, d.line);
    });
//.........................................................................................................
// for { line, } from walk_lines_with_positions old_path
//   stream.send { version: 'old', line, }
    for (lwp of walk_lines_with_positions(diff_path)) {
      stream.send({
        version: 'diff',
        ...lwp
      });
    }
    help('Ωxsqk___2', (await stream.run()));
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      return (await demo());
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUE7RUFHQTtBQUhBLE1BQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUE7O0VBS0EsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQixNQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsT0FIRixFQUlFLEdBSkYsQ0FBQSxHQUk0QixHQUFHLENBQUMsR0FKaEMsRUFmQTs7Ozs7RUF1QkEsU0FBQSxHQUE0QixPQUFBLENBQVEscUJBQVI7O0VBQzVCLElBQUEsR0FBNEIsT0FBQSxDQUFRLFdBQVI7O0VBQzVCLEVBQUEsR0FBNEIsT0FBQSxDQUFRLFNBQVIsRUF6QjVCOzs7RUE2QkEsSUFBQSxHQUFPLE1BQUEsUUFBQSxDQUFBLENBQUE7QUFDUCxRQUFBLGVBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLGlCQUFBLEVBQUEsU0FBQSxFQUFBLEdBQUEsRUFBQSxXQUFBLEVBQUEsTUFBQSxFQUFBLGlCQUFBLEVBQUEsT0FBQSxFQUFBLHlCQUFBLEVBQUE7SUFBRSxDQUFBLENBQUUsT0FBRixDQUFBLEdBQWtDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBbkIsQ0FBQSxDQUFsQztJQUNBLENBQUEsQ0FBRSxTQUFGLEVBQ0UsZUFERixFQUVFLFNBRkYsQ0FBQSxHQUVrQyxTQUFTLENBQUMsaUJBQVYsQ0FBQSxDQUZsQztJQUdBLENBQUEsQ0FBRSx5QkFBRixDQUFBLEdBQWtDLFNBQVMsQ0FBQyxRQUFRLENBQUMsdUJBQW5CLENBQUEsQ0FBbEMsRUFKRjs7OztJQVFFLFNBQUEsR0FBYyxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsK0JBQXhCO0lBQ2QsV0FBQSxHQUFjLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixrQ0FBeEIsRUFUaEI7O0lBV0UsTUFBQSxHQUFTLElBQUksZUFBSixDQUFBLEVBWFg7OztJQWNFLE1BQU0sQ0FBQyxJQUFQLENBQVksaUJBQUEsR0FBb0IsU0FBQSxDQUFFLENBQUYsQ0FBQTtNQUM5QixJQUFlLENBQUMsQ0FBQyxHQUFGLEdBQVEsQ0FBdkI7QUFBQSxlQUFPLEtBQVA7O2FBQ0EsQ0FBQSxNQUFNLENBQU47SUFGOEIsQ0FBaEMsRUFkRjs7SUFrQkUsTUFBTSxDQUFDLElBQVAsQ0FBWSxpQkFBQSxHQUFvQixTQUFBLENBQUUsQ0FBRixDQUFBO01BQzlCLENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsTUFBZixFQUF5QixPQUF6QjtNQUNULENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsTUFBZixFQUF5QixRQUF6QjtNQUNULENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsT0FBZixFQUF5QixPQUF6QjtNQUNULENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsT0FBZixFQUF5QixRQUF6QjthQUNULENBQUEsTUFBTSxDQUFOO0lBTDhCLENBQWhDLEVBbEJGOztJQXlCRSxNQUFNLENBQUMsSUFBUCxDQUFZLFlBQUEsR0FBZSxRQUFBLENBQUUsQ0FBRixDQUFBO2FBQ3pCLEVBQUUsQ0FBQyxjQUFILENBQWtCLFdBQWxCLEVBQStCLENBQUMsQ0FBQyxJQUFqQztJQUR5QixDQUEzQixFQXpCRjs7OztJQThCRSxLQUFBLDJDQUFBO01BQ0UsTUFBTSxDQUFDLElBQVAsQ0FBWTtRQUFFLE9BQUEsRUFBUyxNQUFYO1FBQW1CLEdBQUE7TUFBbkIsQ0FBWjtJQURGO0lBRUEsSUFBQSxDQUFLLFdBQUwsRUFBa0IsQ0FBQSxNQUFNLE1BQU0sQ0FBQyxHQUFQLENBQUEsQ0FBTixDQUFsQixFQWhDRjs7V0FrQ0c7RUFuQ0ksRUE3QlA7OztFQW9FQSxJQUFHLE1BQUEsS0FBVSxPQUFPLENBQUMsSUFBckI7SUFBK0IsTUFBUyxDQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUE7YUFDdEMsQ0FBQSxNQUFNLElBQUEsQ0FBQSxDQUFOO0lBRHNDLENBQUEsSUFBeEM7O0FBcEVBIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbid1c2Ugc3RyaWN0J1xuXG5cbid1c2Ugc3RyaWN0J1xuXG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ3hzcWsnXG57IHJwclxuICBpbnNwZWN0XG4gIGVjaG9cbiAgcmV2ZXJzZVxuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMgV0dVWSAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvd2ViZ3V5J1xuIyB7IGYgfSAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9lZmZzdHJpbmcnXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblNGTU9EVUxFUyAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdicmljYWJyYWMtc2Ztb2R1bGVzJ1xuUEFUSCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbkZTICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVtbyA9IC0+XG4gIHsgdHlwZV9vZiwgICAgICAgICAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMudW5zdGFibGUucmVxdWlyZV90eXBlX29mKClcbiAgeyBKZXRzdHJlYW0sXG4gICAgQXN5bmNfamV0c3RyZWFtLFxuICAgIGludGVybmFscywgICAgICAgICAgICAgICAgICB9ID0gU0ZNT0RVTEVTLnJlcXVpcmVfamV0c3RyZWFtKClcbiAgeyB3YWxrX2xpbmVzX3dpdGhfcG9zaXRpb25zLCAgfSA9IFNGTU9EVUxFUy51bnN0YWJsZS5yZXF1aXJlX2Zhc3RfbGluZXJlYWRlcigpXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyBvbGRfcGF0aCA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLicsICdjb21wYXJpc29uL3Jlc3VsdC9maWx0ZXJlZC5vbGQubWQnXG4gICMgbmV3X3BhdGggPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4nLCAnY29tcGFyaXNvbi9yZXN1bHQvZmlsdGVyZWQubmV3Lm1kJ1xuICBkaWZmX3BhdGggICA9IFBBVEgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLi9jb21wYXJpc29uL3Jlc3VsdC9kaWZmLnR4dCdcbiAgcmVwb3J0X3BhdGggPSBQQVRILnJlc29sdmUgX19kaXJuYW1lLCAnLi4vY29tcGFyaXNvbi9yZXN1bHQvcmVwb3J0Lmh0bWwnXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgc3RyZWFtID0gbmV3IEFzeW5jX2pldHN0cmVhbSgpXG4gICMgc3RyZWFtLnB1c2ggKCBkICkgLT4gZGVidWcgJ86peHNxa19fXzEnLCBkXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgc3RyZWFtLnB1c2ggZmlsdGVyX2RpZmZfc3RhcnQgPSAoIGQgKSAtPlxuICAgIHJldHVybiBudWxsIGlmIGQubG5yIDwgNlxuICAgIHlpZWxkIGRcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBzdHJlYW0ucHVzaCB0cmFuc2xhdGVfY2hhbmdlcyA9ICggZCApIC0+XG4gICAgZC5saW5lID0gZC5saW5lLnJlcGxhY2UgL1xcWy0vZywgICAnPGRlbD4nXG4gICAgZC5saW5lID0gZC5saW5lLnJlcGxhY2UgLy1cXF0vZywgICAnPC9kZWw+J1xuICAgIGQubGluZSA9IGQubGluZS5yZXBsYWNlIC9cXHtcXCsvZywgICc8aW5zPidcbiAgICBkLmxpbmUgPSBkLmxpbmUucmVwbGFjZSAvXFwrXFx9L2csICAnPC9pbnM+J1xuICAgIHlpZWxkIGRcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBzdHJlYW0ucHVzaCB3cml0ZV9vdXRwdXQgPSAoIGQgKSAtPlxuICAgIEZTLmFwcGVuZEZpbGVTeW5jIHJlcG9ydF9wYXRoLCBkLmxpbmVcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAjIGZvciB7IGxpbmUsIH0gZnJvbSB3YWxrX2xpbmVzX3dpdGhfcG9zaXRpb25zIG9sZF9wYXRoXG4gICMgICBzdHJlYW0uc2VuZCB7IHZlcnNpb246ICdvbGQnLCBsaW5lLCB9XG4gIGZvciBsd3AgZnJvbSB3YWxrX2xpbmVzX3dpdGhfcG9zaXRpb25zIGRpZmZfcGF0aFxuICAgIHN0cmVhbS5zZW5kIHsgdmVyc2lvbjogJ2RpZmYnLCBsd3AuLi4sIH1cbiAgaGVscCAnzql4c3FrX19fMicsIGF3YWl0IHN0cmVhbS5ydW4oKVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIDtudWxsXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gYXdhaXQgZG8gPT5cbiAgYXdhaXQgZGVtbygpXG5cblxuIl19



'use strict'


'use strict'

GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'xsqk'
{ rpr
  inspect
  echo
  reverse
  log     }               = GUY.trm
# WGUY                      = require '../../../apps/webguy'
# { f }                     = require '../../../apps/effstring'
#-----------------------------------------------------------------------------------------------------------
SFMODULES                 = require 'bricabrac-sfmodules'
PATH                      = require 'node:path'
FS                        = require 'node:fs'


#===========================================================================================================
demo = ->
  { type_of,                    } = SFMODULES.unstable.require_type_of()
  { Jetstream,
    Async_jetstream,
    internals,                  } = SFMODULES.require_jetstream()
  { walk_lines_with_positions,  } = SFMODULES.unstable.require_fast_linereader()
  #.........................................................................................................
  # old_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.old.md'
  # new_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.new.md'
  diff_path   = PATH.resolve __dirname, '../comparison/result/diff.txt'
  report_path = PATH.resolve __dirname, '../comparison/result/report.html'
  #.........................................................................................................
  stream = new Async_jetstream()
  # stream.push ( d ) -> debug 'Ωxsqk___1', d
  #.........................................................................................................
  stream.push filter_diff_start = ( d ) ->
    return null if d.lnr < 6
    yield d
  #.........................................................................................................
  stream.push translate_changes = ( d ) ->
    d.line = d.line.replace /\[-/g,   '<del>'
    d.line = d.line.replace /-\]/g,   '</del>'
    d.line = d.line.replace /\{\+/g,  '<ins>'
    d.line = d.line.replace /\+\}/g,  '</ins>'
    yield d
  #.........................................................................................................
  stream.push write_output = ( d ) ->
    FS.appendFileSync report_path, d.line
  #.........................................................................................................
  # for { line, } from walk_lines_with_positions old_path
  #   stream.send { version: 'old', line, }
  for lwp from walk_lines_with_positions diff_path
    stream.send { version: 'diff', lwp..., }
  help 'Ωxsqk___2', await stream.run()
  #.........................................................................................................
  ;null


#===========================================================================================================
if module is require.main then await do =>
  await demo()


